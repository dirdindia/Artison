import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, CreditCard, Clock } from 'lucide-react';
import api from '../utils/api';

export default function Payouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const { data } = await api.get('/wallet/payouts');
      if (data.success) {
        setPayouts(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch payouts');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/wallet/payouts/${id}`, { status });
      if (data.success) {
        toast.success(`Payout marked as ${status}`);
        fetchPayouts();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading payouts...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Artist Payouts</h1>
          <p className="text-[#5a4d4d] mt-2">Manage withdrawal requests from artists.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#eae0d5] overflow-hidden">
        {payouts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No payout requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#fcfaf8] text-[#5a4d4d] font-semibold border-b border-[#eae0d5]">
                <tr>
                  <th className="px-6 py-4">Artist</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Bank Details</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eae0d5]">
                {payouts.map((payout) => (
                  <tr key={payout._id} className="hover:bg-[#fcfaf8]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#3b2f2f]">{payout.artist?.name}</div>
                      <div className="text-xs text-gray-500">{payout.artist?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#8b5a2b]">
                      ₹{payout.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-1">
                        <p><span className="font-medium">UPI:</span> {payout.artist?.bankDetails?.upiId || 'N/A'}</p>
                        <p><span className="font-medium">A/C Name:</span> {payout.artist?.bankDetails?.accountHolderName || 'N/A'}</p>
                        <p><span className="font-medium">A/C No:</span> {payout.artist?.bankDetails?.accountNumber || 'N/A'}</p>
                        <p><span className="font-medium">IFSC:</span> {payout.artist?.bankDetails?.ifscCode || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        payout.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        payout.status === 'Failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {payout.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                        {payout.status === 'Completed' && <CheckCircle className="w-3.5 h-3.5" />}
                        {payout.status === 'Failed' && <XCircle className="w-3.5 h-3.5" />}
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {payout.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateStatus(payout._id, 'Completed')}
                            className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition-colors"
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(payout._id, 'Failed')}
                            className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
