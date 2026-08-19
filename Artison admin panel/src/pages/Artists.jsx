import React, { useState, useEffect } from 'react';
import { Users, Search, CheckCircle, XCircle, Eye, X, MapPin, Mail, Phone, Calendar, Link2 } from 'lucide-react';
import api from '../utils/api';
import Alert from '../utils/Alert';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    fetchArtists();
  }, [page]);

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/users/artists?page=${page}&limit=10`);
      if (data.success) {
        setArtists(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.pages);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.error('Error', 'Failed to fetch artists');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (artistId, currentStatus) => {
    try {
      const { data } = await api.put(`/users/artists/${artistId}/approve`);
      if (data.success) {
        Alert.success('Success', `Artist ${currentStatus ? 'unapproved' : 'approved'} successfully`);
        fetchArtists(); // Refresh list
      }
    } catch (error) {
      console.error(error);
      Alert.error('Error', 'Failed to update approval status');
    }
  };

  const handleViewArtist = (artist) => {
    setSelectedArtist(artist);
  };

  const handleCloseModal = () => {
    setSelectedArtist(null);
  };

  const filteredArtists = artists.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Artists</h1>
          <p className="text-gray-500 mt-1">Manage artists and their approval status</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#eae0d5] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#eae0d5] flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#eae0d5] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b2f2f] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f8f5f2] text-[#5a4d4d] font-semibold">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Artist</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 rounded-tr-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eae0d5]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center mb-2"><Users className="w-8 h-8 text-gray-300 animate-pulse" /></div>
                    Loading artists...
                  </td>
                </tr>
              ) : filteredArtists.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No artists found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredArtists.map((artist) => (
                  <tr 
                    key={artist._id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewArtist(artist)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#3b2f2f] text-white flex items-center justify-center font-bold text-lg">
                          {artist.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#3b2f2f]">{artist.name}</div>
                          <a href={artist.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Portfolio</a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">{artist.email}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{artist.phone || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">{artist.artCategory?.name || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4">
                      {artist.isApproved ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 flex items-center gap-1 w-max">
                          <CheckCircle className="w-3 h-3" /> Approved
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 flex items-center gap-1 w-max">
                          <XCircle className="w-3 h-3" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleApproval(artist._id, artist.isApproved);
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                            artist.isApproved 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' 
                              : 'bg-[#3b2f2f] text-white hover:bg-[#5a4d4d]'
                          }`}
                        >
                          {artist.isApproved ? 'Unapprove' : 'Approve'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewArtist(artist);
                          }}
                          className="p-2 text-gray-400 hover:text-[#3b2f2f] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#eae0d5] bg-gray-50">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-[#eae0d5] rounded-xl text-sm font-medium text-[#3b2f2f] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="text-sm text-[#5a4d4d] font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-[#eae0d5] rounded-xl text-sm font-medium text-[#3b2f2f] hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Artist Details Modal */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-[#eae0d5] p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-[#3b2f2f]">Artist Details</h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-[#eae0d5]">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 rounded-full bg-[#3b2f2f] text-white flex items-center justify-center font-bold text-4xl shadow-md shrink-0 overflow-hidden">
                    {selectedArtist.avatar ? (
                      <img src={selectedArtist.avatar} alt={selectedArtist.name} className="w-full h-full object-cover" />
                    ) : (
                      selectedArtist.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-[#3b2f2f]">{selectedArtist.name}</h3>
                        {selectedArtist.isApproved ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 flex items-center gap-1 w-max">
                            <CheckCircle className="w-3 h-3" /> Approved
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 flex items-center gap-1 w-max">
                            <XCircle className="w-3 h-3" /> Pending
                          </span>
                        )}
                      </div>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="w-4 h-4 text-[#3b2f2f]" />
                          <span>{selectedArtist.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="w-4 h-4 text-[#3b2f2f]" />
                          <span>{selectedArtist.phone || 'No phone provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Calendar className="w-4 h-4 text-[#3b2f2f]" />
                          <span>Joined {new Date(selectedArtist.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Artist Info</h4>
                      <div className="space-y-3">
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-900">Category:</span> {selectedArtist.artCategory?.name || 'N/A'}
                        </div>
                        {selectedArtist.artSubcategory?.name && (
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold text-gray-900">Subcategory:</span> {selectedArtist.artSubcategory.name}
                          </div>
                        )}
                        {selectedArtist.instagramHandle && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-bold text-[#3b2f2f] text-lg leading-none">@</span>
                            <span>{selectedArtist.instagramHandle}</span>
                          </div>
                        )}
                        {selectedArtist.portfolioUrl && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Link2 className="w-4 h-4" />
                            <a href={selectedArtist.portfolioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">Portfolio Link</a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedArtist.bio && (
                  <div className="mt-6 pt-6 border-t border-[#eae0d5]">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Biography</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedArtist.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
