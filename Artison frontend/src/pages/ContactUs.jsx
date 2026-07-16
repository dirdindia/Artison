import React from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactUs() {
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
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <span>support@kalakosh.com</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <Phone className="h-5 w-5" />
                </div>
                <span>+91 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" className="w-full rounded-xl border border-input bg-transparent px-3 py-2" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" className="w-full rounded-xl border border-input bg-transparent px-3 py-2" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea className="w-full rounded-xl border border-input bg-transparent px-3 py-2 h-32 resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full rounded-xl bg-foreground text-background py-2.5 font-semibold hover:bg-foreground/90 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
