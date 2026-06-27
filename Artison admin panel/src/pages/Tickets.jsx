import React, { useState } from 'react';
import { Search, MessageCircle, MoreVertical, X, Send } from 'lucide-react';

const mockTickets = [
  { id: '#TK-105', subject: 'Shipping Delay', customer: 'Rahul Sharma', email: 'rahul.s@email.com', priority: 'High', status: 'Open', date: '2 hours ago', unread: true },
  { id: '#TK-104', subject: 'Custom Frame Request', customer: 'Sneha Rao', email: 'sneha.r@email.com', priority: 'Medium', status: 'In Progress', date: '5 hours ago', unread: false },
  { id: '#TK-103', subject: 'Payment Failed', customer: 'Ajay Verma', email: 'ajay.v@email.com', priority: 'Low', status: 'Closed', date: '1 day ago', unread: false },
  { id: '#TK-102', subject: 'Product damaged upon arrival', customer: 'Neha Gupta', email: 'neha.g@email.com', priority: 'High', status: 'Open', date: '1 day ago', unread: true },
];

const mockMessages = [
  { sender: 'customer', name: 'Rahul Sharma', time: '10:30 AM', text: 'Hi, I placed my order 5 days ago and it still shows processing. Can you please provide an update?' },
  { sender: 'admin', name: 'You', time: '11:15 AM', text: 'Hello Rahul, I apologize for the delay. We had a slight issue with the courier partner. It has been dispatched today and will reach you in 2 days.' },
  { sender: 'customer', name: 'Rahul Sharma', time: '12:00 PM', text: 'Okay, thank you for the update! Could you share the tracking link when possible?' },
];

export default function Tickets() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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
            {mockTickets.map(ticket => (
              <div 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedTicket?.id === ticket.id 
                    ? 'bg-[#c39a5c]/5 border-l-4 border-l-[#c39a5c]' 
                    : 'hover:bg-[#fdfbf7] border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#3b2f2f] text-sm">{ticket.id}</span>
                    {ticket.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#c39a5c]"></span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{ticket.date}</span>
                </div>
                <h3 className={`text-sm mb-1 ${ticket.unread ? 'font-bold text-[#3b2f2f]' : 'font-medium text-[#5a4d4d]'}`}>
                  {ticket.subject}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-[#5a4d4d]">{ticket.customer}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    ticket.status === 'Open' ? 'bg-amber-100 text-amber-700' :
                    ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
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
                      <span className="text-sm font-medium text-gray-500">({selectedTicket.id})</span>
                    </h2>
                    <p className="text-sm text-[#5a4d4d]">
                      {selectedTicket.customer} &middot; {selectedTicket.email}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-[#5a4d4d] hover:text-[#3b2f2f] hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#eae0d5]">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-white">
                {mockMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#5a4d4d]">{msg.name}</span>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                      msg.sender === 'admin' 
                        ? 'bg-[#3b2f2f] text-[#fcf9f2] rounded-tr-sm' 
                        : 'bg-[#fdfbf7] border border-[#eae0d5] text-[#3b2f2f] rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-[#eae0d5] bg-white shrink-0">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full bg-[#fdfbf7] border border-[#eae0d5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#c39a5c]/20 focus:border-[#c39a5c] transition-colors resize-none"
                      rows={3}
                    />
                  </div>
                  <button className="p-3.5 bg-[#c39a5c] text-white rounded-xl hover:bg-[#b0894f] transition-colors shadow-sm cursor-pointer shrink-0 h-[46px] flex items-center justify-center mb-1">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
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
