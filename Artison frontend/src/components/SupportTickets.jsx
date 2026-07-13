import { useState, useEffect } from "react";
import { Ticket, Loader2, Image as ImageIcon, Send, X } from "lucide-react";
import api from "@/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function SupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // New Ticket State
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Chat State
  const [replyMessage, setReplyMessage] = useState("");
  const [replyImage, setReplyImage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [uploadingReplyImage, setUploadingReplyImage] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/tickets/my-tickets');
      setTickets(data);
    } catch (error) {
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, setImageFn, setUploadingFn) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingFn(true);
    try {
      const { data } = await api.post('/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        setImageFn(data.data.url);
        toast.success('Image uploaded');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingFn(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/tickets', {
        subject,
        description,
        image
      });
      setTickets([data, ...tickets]);
      setIsNewTicketOpen(false);
      setSubject("");
      setDescription("");
      setImage("");
      toast.success("Ticket raised successfully!");
    } catch (error) {
      toast.error("Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchTicketDetails = async (id) => {
    try {
      const { data } = await api.get(`/tickets/${id}`);
      setSelectedTicket(data);
    } catch (error) {
      toast.error("Failed to fetch ticket details");
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() && !replyImage) return;

    setSendingReply(true);
    try {
      const { data } = await api.post(`/tickets/${selectedTicket._id}/reply`, {
        message: replyMessage,
        image: replyImage
      });
      setSelectedTicket(data);
      setReplyMessage("");
      setReplyImage("");
    } catch (error) {
      toast.error("Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold px-1">My Support Tickets</h3>
        <button 
          onClick={() => setIsNewTicketOpen(true)}
          className="bg-foreground text-background px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Ticket className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="rounded-2xl bg-card p-8 text-center shadow-soft">
          <Ticket className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="font-medium text-foreground">No tickets raised</p>
          <p className="text-sm text-muted-foreground mt-1">If you have any issues, feel free to raise a ticket.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div 
              key={ticket._id} 
              onClick={() => fetchTicketDetails(ticket._id)}
              className="rounded-2xl bg-card p-5 shadow-soft space-y-3 cursor-pointer hover:border-primary/30 border border-transparent transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-foreground">{ticket.subject}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(ticket.createdAt).toLocaleString()} • {ticket.chat?.length || 0} messages
                  </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${ticket.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {ticket.status}
                </div>
              </div>
              <div className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-xl border border-border/50 line-clamp-2">
                {ticket.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Ticket Modal */}
      {isNewTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-lg rounded-3xl p-6 shadow-xl relative overflow-hidden animate-in zoom-in-95">
            <button onClick={() => setIsNewTicketOpen(false)} className="absolute right-5 top-5 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><Ticket className="w-5 h-5 text-primary" /> Raise a New Ticket</h2>
            
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-sm font-medium ml-1">Subject</label>
                <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Briefly describe your issue" />
              </div>
              <div>
                <label className="text-sm font-medium ml-1">Description</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Provide more details..." />
              </div>
              <div>
                <label className="text-sm font-medium ml-1 block mb-2">Attachment (Optional)</label>
                {image ? (
                  <div className="relative inline-block">
                    <img src={image} alt="Attachment" className="h-24 w-auto rounded-lg border border-border" />
                    <button type="button" onClick={() => setImage("")} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"><X className="w-3 h-3" /></button>
                  </div>
                ) : (
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setImage, setUploadingImage)} 
                      disabled={uploadingImage}
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20 transition-colors"
                    />
                    {uploadingImage && <Loader2 className="absolute right-4 top-2 h-5 w-5 animate-spin text-primary" />}
                  </div>
                )}
              </div>
              <button type="submit" disabled={submitting || uploadingImage} className="w-full rounded-xl bg-foreground py-3.5 text-sm font-semibold text-background shadow-soft transition-transform active:scale-[0.98] mt-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Submit Ticket"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details & Chat Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-2xl h-[85vh] rounded-3xl shadow-xl relative overflow-hidden animate-in zoom-in-95 flex flex-col">
            <div className="p-5 border-b border-border flex items-start justify-between bg-secondary/30">
              <div>
                <h2 className="text-lg font-bold">{selectedTicket.subject}</h2>
                <div className="text-sm text-muted-foreground mt-1">Ticket #{selectedTicket._id.substring(18)}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${selectedTicket.status === 'open' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {selectedTicket.status}
                </span>
                <button onClick={() => setSelectedTicket(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-secondary/10">
              {/* Original Request */}
              <div className="flex flex-col items-end">
                <div className="max-w-[80%] bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-4 shadow-sm">
                  <div className="text-xs opacity-70 mb-1 flex justify-between">
                    <span>You</span>
                    <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{selectedTicket.description}</p>
                  {selectedTicket.image && (
                    <a href={selectedTicket.image} target="_blank" rel="noreferrer">
                      <img src={selectedTicket.image} alt="Attachment" className="mt-3 rounded-lg max-h-48 object-cover border border-white/20" />
                    </a>
                  )}
                </div>
              </div>

              {/* Chat Thread */}
              {selectedTicket.chat?.map((msg, idx) => {
                const isUser = msg.senderModel === 'User';
                return (
                  <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${isUser ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border border-border rounded-tl-sm'}`}>
                      <div className={`text-xs mb-1 flex justify-between gap-4 ${isUser ? 'opacity-70' : 'text-muted-foreground'}`}>
                        <span>{isUser ? 'You' : 'Support Team'}</span>
                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>
                      {msg.message && <p className="text-sm whitespace-pre-wrap">{msg.message}</p>}
                      {msg.image && (
                        <a href={msg.image} target="_blank" rel="noreferrer">
                          <img src={msg.image} alt="Attachment" className="mt-3 rounded-lg max-h-48 object-cover border border-black/10" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input */}
            {selectedTicket.status === 'open' ? (
              <form onSubmit={handleSendReply} className="p-4 border-t border-border bg-card">
                {replyImage && (
                  <div className="mb-3 relative inline-block">
                    <img src={replyImage} className="h-16 rounded border border-border" alt="reply attachment" />
                    <button type="button" onClick={() => setReplyImage("")} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"><X className="w-3 h-3" /></button>
                  </div>
                )}
                <div className="flex items-end gap-2">
                  <div className="relative">
                    <input 
                      type="file" 
                      id="reply-image" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setReplyImage, setUploadingReplyImage)}
                    />
                    <label htmlFor="reply-image" className="p-3 bg-secondary rounded-xl text-muted-foreground hover:text-foreground cursor-pointer flex items-center justify-center transition-colors">
                      {uploadingReplyImage ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                    </label>
                  </div>
                  <input 
                    type="text" 
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <button type="submit" disabled={sendingReply || uploadingReplyImage || (!replyMessage.trim() && !replyImage)} className="p-3 bg-primary text-primary-foreground rounded-xl disabled:opacity-50 transition-colors">
                    {sendingReply ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 border-t border-border bg-secondary/30 text-center text-sm text-muted-foreground">
                This ticket has been closed.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
