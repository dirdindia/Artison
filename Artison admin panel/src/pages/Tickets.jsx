import React, { useState, useEffect } from 'react';
import { Search, MessageCircle, MoreVertical, X, Send, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/tickets');
      setTickets(data);
    } catch (error) {
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setSending(true);
    try {
      const { data } = await api.post(`/tickets/${selectedTicket._id}/reply`, {
        message: replyText
      });
      // Update the selected ticket with the new data
      setSelectedTicket(data);
      // Update the ticket in the list as well
      setTickets(tickets.map(t => t._id === data._id ? data : t));
      setReplyText('');
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    try {
      const { data } = await api.put(`/tickets/${selectedTicket._id}/status`, {
        status: 'closed'
      });
      setSelectedTicket(data);
      setTickets(tickets.map(t => t._id === data._id ? data : t));
      toast.success('Ticket closed');
    } catch (error) {
      toast.error('Failed to close ticket');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading tickets...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#3b2f2f] tracking-tight">Support Tickets</h1>
          <p className="text-[#5a4d4d] mt-1">Manage and respond to customer queries.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#eae0d5] shadow-sm flex flex-col md:flex-row h-[600px] overflow-hidden">
        
        {/* Ticket List */}
        <div className={`w-full md:w-96 border-r border-[#eae0d5] flex flex-col ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-[#eae0d5] bg-[#fdfbf7]/50 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tickets..." 
                className="w-full bg-white border border-[#eae0d5] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#c39a5c] transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-[#eae0d5]">
            {tickets.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No tickets found.</div>
            ) : (
              tickets.map(ticket => (
                <div 
                  key={ticket._id} 
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedTicket?._id === ticket._id 
                      ? 'bg-[#c39a5c]/5 border-l-4 border-l-[#c39a5c]' 
                      : 'hover:bg-[#fdfbf7] border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#3b2f2f] text-sm">#{ticket._id.substring(18)}</span>
                    </div>
                    <span className="text-xs text-gray-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-sm mb-1 font-medium text-[#5a4d4d] truncate">
                    {ticket.subject}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#5a4d4d]">{ticket.user?.name || 'Unknown User'}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      ticket.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ticket Chat View */}
        <div className={`flex-1 flex flex-col ${!selectedTicket ? 'hidden md:flex' : 'flex'}`}>
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 md:p-6 border-b border-[#eae0d5] bg-[#fdfbf7] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="md:hidden p-2 -ml-2 text-[#5a4d4d] hover:bg-white rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-lg font-bold text-[#3b2f2f] flex items-center gap-2">
                      {selectedTicket.subject}
                      <span className="text-sm font-medium text-gray-500">(#{selectedTicket._id.substring(18)})</span>
                    </h2>
                    <p className="text-sm text-[#5a4d4d]">
                      {selectedTicket.user?.name} &middot; {selectedTicket.user?.email}
                    </p>
                  </div>
                </div>
                
                {selectedTicket.status === 'open' && (
                  <button 
                    onClick={handleCloseTicket}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Close Ticket
                  </button>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-white">
                {/* Original Description */}
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[#5a4d4d]">{selectedTicket.user?.name}</span>
                    <span className="text-xs text-gray-400">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow-sm bg-[#fdfbf7] border border-[#eae0d5] text-[#3b2f2f] rounded-tl-sm whitespace-pre-wrap">
                    {selectedTicket.description}
                    {selectedTicket.image && (
                      <a href={selectedTicket.image} target="_blank" rel="noreferrer">
                        <img src={selectedTicket.image} alt="Attachment" className="mt-3 rounded-lg max-h-48 object-cover border border-[#eae0d5]" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Chat Array */}
                {selectedTicket.chat?.map((msg, i) => {
                  const isAdmin = msg.senderModel === 'Admin';
                  return (
                    <div key={i} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-[#5a4d4d]">{isAdmin ? 'You' : selectedTicket.user?.name}</span>
                        <span className="text-xs text-gray-400">{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                      <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                        isAdmin 
                          ? 'bg-[#3b2f2f] text-[#fcf9f2] rounded-tr-sm' 
                          : 'bg-[#fdfbf7] border border-[#eae0d5] text-[#3b2f2f] rounded-tl-sm'
                      } whitespace-pre-wrap`}>
                        {msg.message}
                        {msg.image && (
                          <a href={msg.image} target="_blank" rel="noreferrer">
                            <img src={msg.image} alt="Attachment" className="mt-3 rounded-lg max-h-48 object-cover border border-[#eae0d5]" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              {selectedTicket.status === 'open' ? (
                <div className="p-4 border-t border-[#eae0d5] bg-white shrink-0">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors resize-none"
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleReply();
                          }
                        }}
                      />
                    </div>
                    <button 
                      onClick={handleReply}
                      disabled={sending || !replyText.trim()}
                      className="p-3.5 bg-[#c39a5c] text-white rounded-xl hover:bg-[#b0894f] disabled:opacity-50 transition-colors shadow-sm cursor-pointer shrink-0 h-[46px] flex items-center justify-center mb-1"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-t border-[#eae0d5] bg-gray-50 shrink-0 text-center text-sm text-gray-500">
                  This ticket has been closed.
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50">
              <div className="w-16 h-16 bg-[#eae0d5]/50 rounded-full flex items-center justify-center text-[#c39a5c] mb-4">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#3b2f2f]">No ticket selected</h3>
              <p className="text-sm text-[#5a4d4d] mt-1 max-w-sm">Select a ticket from the list to view the conversation and reply to the customer.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
