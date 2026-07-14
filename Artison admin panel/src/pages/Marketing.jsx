import React, { useState, useEffect } from 'react';
import { Mail, Users, Send, Loader2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import api from '../utils/api';
import Alert from '../utils/Alert';
import { useConfirm } from '../context/ConfirmContext';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('newsletter');
  
  // Subscriber State
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Newsletter Form State
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [specificEmails, setSpecificEmails] = useState('');
  const [image, setImage] = useState(null);
  const [sending, setSending] = useState(false);
  const { confirm } = useConfirm();

  const fetchSubscribers = async (currentPage = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/subscribers?page=${currentPage}&limit=10`);
      setSubscribers(response.data.subscribers || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.total || 0);
      setPage(response.data.page || 1);
    } catch (error) {
      console.error(error);
      Alert.error('Error', 'Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'subscribers') {
      fetchSubscribers(page);
    }
  }, [page, activeTab]);

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      Alert.error('Validation Error', 'Subject and body are required.');
      return;
    }
    if (target === 'specific' && !specificEmails.trim()) {
      Alert.error('Validation Error', 'Please provide at least one email address.');
      return;
    }

    const isConfirmed = await confirm({
      title: 'Send Newsletter',
      message: target === 'all' 
        ? 'Are you sure you want to send this email to all active subscribers?'
        : 'Are you sure you want to send this email to the specific subscribers?',
      confirmText: 'Send',
      type: 'primary'
    });

    if (isConfirmed) {
      setSending(true);
      try {
        let imageUrl = '';
        if (image) {
          const formData = new FormData();
          formData.append('file', image);
          const uploadRes = await api.post('/upload/single', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          imageUrl = uploadRes.data.data.url;
        }

        const emailsArray = target === 'specific' 
          ? specificEmails.split(',').map(e => e.trim()).filter(e => e) 
          : [];

        const payload = {
          subject,
          body,
          target,
          specificEmails: emailsArray,
          imageUrl
        };

        const response = await api.post('/subscribers/send', payload);
        Alert.success('Success', response.data.message || 'Newsletter sent successfully.');
        setSubject('');
        setBody('');
        setImage(null);
        setSpecificEmails('');
      } catch (error) {
        console.error(error);
        Alert.error('Error', error.response?.data?.message || 'Failed to send newsletter');
      } finally {
        setSending(false);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus === 'active' ? 'Deactivate' : 'Activate';
    const isConfirmed = await confirm({
      title: `${action} Subscriber`,
      message: `Are you sure you want to ${action.toLowerCase()} this subscriber?`,
      confirmText: 'Yes',
      type: currentStatus === 'active' ? 'danger' : 'primary'
    });

    if (isConfirmed) {
      setProcessingId(id + '_status');
      try {
        const response = await api.put(`/subscribers/${id}/status`);
        Alert.success('Success', response.data.message || 'Status updated');
        fetchSubscribers(page);
      } catch (error) {
        console.error(error);
        Alert.error('Error', 'Failed to update status');
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleDeleteSubscriber = async (id) => {
    const isConfirmed = await confirm({
      title: 'Delete Subscriber',
      message: 'Are you sure you want to delete this subscriber?',
      confirmText: 'Delete',
      type: 'danger'
    });

    if (isConfirmed) {
      setProcessingId(id + '_delete');
      try {
        await api.delete(`/subscribers/${id}`);
        Alert.success('Success', 'Subscriber deleted successfully');
        if (subscribers.length === 1 && page > 1) {
          setPage(page - 1);
        } else {
          fetchSubscribers(page);
        }
      } catch (error) {
        console.error(error);
        Alert.error('Error', 'Failed to delete subscriber');
      } finally {
        setProcessingId(null);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Marketing</h1>
        <p className="text-[#5a4d4d] mt-1">Manage newsletter subscriptions and email campaigns</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl max-w-sm">
        <button
          onClick={() => setActiveTab('newsletter')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'newsletter' ? 'bg-white text-[#3b2f2f] shadow-sm' : 'text-gray-500 hover:text-[#3b2f2f]'
          }`}
        >
          <Mail className="w-4 h-4" />
          Send Email
        </button>
        <button
          onClick={() => setActiveTab('subscribers')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'subscribers' ? 'bg-white text-[#3b2f2f] shadow-sm' : 'text-gray-500 hover:text-[#3b2f2f]'
          }`}
        >
          <Users className="w-4 h-4" />
          Subscribers
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-[#eae0d5] shadow-sm overflow-hidden min-h-[400px]">
        {activeTab === 'newsletter' && (
          <div className="p-6 md:p-8">
            <div className="max-w-3xl">
              <h2 className="text-xl font-semibold text-[#3b2f2f] mb-6">Compose Newsletter</h2>
              <form onSubmit={handleSendNewsletter} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#5a4d4d] mb-1">Target Audience</label>
                  <select 
                    value={target} 
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-4 py-2 border border-[#eae0d5] rounded-xl focus:ring-2 focus:ring-[#c39a5c] focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="all">All Active Subscribers</option>
                    <option value="specific">Specific Subscribers</option>
                  </select>
                </div>

                {target === 'specific' && (
                  <div>
                    <label className="block text-sm font-medium text-[#5a4d4d] mb-1">Specific Emails (comma-separated)</label>
                    <input
                      type="text"
                      value={specificEmails}
                      onChange={(e) => setSpecificEmails(e.target.value)}
                      className="w-full px-4 py-2 border border-[#eae0d5] rounded-xl focus:ring-2 focus:ring-[#c39a5c] focus:border-transparent outline-none transition-all"
                      placeholder="e.g., user1@example.com, user2@test.com"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#5a4d4d] mb-1">Subject Line</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-[#eae0d5] rounded-xl focus:ring-2 focus:ring-[#c39a5c] focus:border-transparent outline-none transition-all"
                    placeholder="E.g., Special Weekend Offer!"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5a4d4d] mb-1">Email Body (HTML supported)</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-[#eae0d5] rounded-xl focus:ring-2 focus:ring-[#c39a5c] focus:border-transparent outline-none transition-all resize-y"
                    placeholder="<h1>Hello Subscribers,</h1><p>We have a great offer for you today...</p>"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5a4d4d] mb-1">Attach Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full px-4 py-2 border border-[#eae0d5] rounded-xl focus:ring-2 focus:ring-[#c39a5c] focus:border-transparent outline-none transition-all bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#c39a5c] file:text-white hover:file:bg-[#b0894f] file:cursor-pointer"
                  />
                  {image && <p className="mt-2 text-sm text-gray-500">Selected: {image.name}</p>}
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c39a5c] text-white font-semibold hover:bg-[#b0894f] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {sending ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-5 h-5" /> Send to All Subscribers</>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    Note: Emails will be sent to all active subscribers using BCC to protect privacy.
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'subscribers' && (
          <div>
            <div className="p-4 border-b border-[#eae0d5] flex items-center justify-between bg-[#fdfbf7]/50">
              <h2 className="font-semibold text-[#3b2f2f]">Total Active Subscribers: {totalItems}</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fdfbf7] border-b border-[#eae0d5] text-sm text-[#5a4d4d] uppercase font-semibold">
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Subscribed At</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eae0d5]">
                  {loading ? (
                    <tr><td colSpan="3" className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#c39a5c]" /></td></tr>
                  ) : subscribers.length === 0 ? (
                    <tr><td colSpan="3" className="text-center py-8 text-gray-500">No subscribers found.</td></tr>
                  ) : (
                    subscribers.map((sub) => (
                      <tr key={sub._id} className="hover:bg-[#fdfbf7]/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-[#3b2f2f]">{sub.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#5a4d4d]">{formatDate(sub.createdAt)}</td>
                        <td className="px-6 py-4 space-x-2 flex items-center ">
                          <button 
                            onClick={() => handleToggleStatus(sub._id, sub.status)}
                            disabled={processingId === sub._id + '_status'}
                            className="p-1.5 rounded-md transition-colors text-gray-500 hover:bg-gray-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title={sub.status === 'active' ? 'Deactivate Subscriber' : 'Activate Subscriber'}
                          >
                            {processingId === sub._id + '_status' ? (
                              <Loader2 className="w-5 h-5 animate-spin text-[#c39a5c]" />
                            ) : sub.status === 'active' ? (
                              <XCircle className="w-5 h-5 hover:text-amber-600" />
                            ) : (
                              <CheckCircle className="w-5 h-5 hover:text-green-600" />
                            )}
                          </button>
                          <button 
                            onClick={() => handleDeleteSubscriber(sub._id)}
                            disabled={processingId === sub._id + '_delete'}
                            className="p-1.5 rounded-md transition-colors text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete Subscriber"
                          >
                            {processingId === sub._id + '_delete' ? (
                              <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-[#eae0d5] flex items-center justify-between bg-white">
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketing;
