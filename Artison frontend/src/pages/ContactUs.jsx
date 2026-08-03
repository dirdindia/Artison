import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import api from '../api';
import { toast } from 'sonner';

export default function ContactUs() {
  const [settings, setSettings] = useState({
    supportEmail: 'support@kalakosh.com',
    contactPhone: '+91 123 456 7890',
    businessAddress: 'New Delhi, India'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) {
          setSettings({
            supportEmail: data.supportEmail || 'support@kalakosh.com',
            contactPhone: data.contactPhone || '+91 123 456 7890',
            businessAddress: data.businessAddress || 'New Delhi, India'
          });
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contacts', formData);
      toast.success('Your message has been sent successfully!');
      setFormData({ name: '', email: '', mobile: '', message: '' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <AppShell title="Contact Us">
      <div className="max-w-4xl mx-auto py-12 px-5">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-10 text-amber-950"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Contact Us
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Get in Touch</h2>
            <p className="text-muted-foreground">Have questions about an artwork, your order, or just want to say hello? We'd love to hear from you.</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <span>{settings.supportEmail}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="whitespace-pre-wrap">{settings.businessAddress}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-xl border border-input bg-transparent px-3 py-2" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full rounded-xl border border-input bg-transparent px-3 py-2" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile No.</label>
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full rounded-xl border border-input bg-transparent px-3 py-2" placeholder="Your mobile number" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required className="w-full rounded-xl border border-input bg-transparent px-3 py-2 h-32 resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full flex items-center justify-center rounded-xl bg-foreground text-background py-2.5 font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
