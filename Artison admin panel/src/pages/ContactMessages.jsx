import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Trash2, Search } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useConfirm } from '../context/ConfirmContext';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { confirm } = useConfirm();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get('/contacts');
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error('Expected array of messages but got:', data);
        setMessages([]);
      }
    } catch (error) {
      toast.error('Failed to load contact messages');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/contacts/${id}/read`);
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, isRead: true } : msg
      ));
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id) => {
    if (await confirm({
      title: 'Delete Message',
      message: 'Are you sure you want to delete this contact message?',
      confirmText: 'Delete',
      type: 'danger'
    })) {
      setDeletingId(id);
      try {
        await api.delete(`/contacts/${id}`);
        setMessages(messages.filter(msg => msg._id !== id));
        toast.success('Message deleted');
      } catch (error) {
        toast.error('Failed to delete message');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const filteredMessages = (Array.isArray(messages) ? messages : []).filter(msg => 
    msg?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Contact Messages</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#eae0d5] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#c39a5c] transition-colors"
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-2xl border border-[#eae0d5] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[#5a4d4d]">Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-[#5a4d4d]">
            <Mail className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No contact messages found.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#eae0d5]">
            {filteredMessages.map(msg => (
              <div 
                key={msg._id} 
                onClick={() => setExpandedId(expandedId === msg._id ? null : msg._id)}
                className={`p-6 transition-colors cursor-pointer ${msg.isRead ? 'bg-white hover:bg-gray-50' : 'bg-[#fdfbf7] hover:bg-[#f5ebd9]'}`}
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[#3b2f2f]">{msg.name}</h3>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 rounded-full bg-[#c39a5c]/10 text-[#c39a5c] text-xs font-medium">New</span>
                      )}
                    </div>
                    <div className="text-sm text-[#5a4d4d] mb-3 flex gap-4">
                      <span>{msg.email}</span>
                      <span>{msg.mobile}</span>
                      <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-[#3b2f2f] text-sm whitespace-pre-wrap ${expandedId === msg._id ? 'hidden' : 'line-clamp-2'}`}>
                      {msg.message}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
                    {!msg.isRead && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleMarkAsRead(msg._id); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                      disabled={deletingId === msg._id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete message"
                    >
                      {deletingId === msg._id ? (
                        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                
                {expandedId === msg._id && (
                  <div className="mt-4 pt-4 border-t border-[#eae0d5]">
                    <h4 className="font-semibold text-sm text-[#3b2f2f] mb-2">Message Details:</h4>
                    <div className="bg-white p-4 rounded-xl border border-[#eae0d5] text-sm text-[#5a4d4d] whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
