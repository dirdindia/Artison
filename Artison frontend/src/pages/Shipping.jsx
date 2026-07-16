import React from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';

export default function Shipping() {
  return (
    <AppShell title="Shipping & Delivery">
      <div className="max-w-4xl mx-auto py-12 px-5">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-10 text-amber-950"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Shipping & Delivery
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 text-lg text-muted-foreground leading-relaxed"
        >
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">Processing Time</h2>
            <p>All orders are processed within 1 to 3 business days (excluding weekends and holidays) after receiving your order confirmation email. You will receive another notification when your order has shipped.</p>
          </div>
          
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">Domestic Shipping Rates and Estimates</h2>
            <p>Shipping charges for your order will be calculated and displayed at checkout. We offer standard and expedited shipping options.</p>
          </div>
          
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">International Shipping</h2>
            <p>We offer international shipping to select countries. Shipping charges and delivery times vary by destination. Please note that your order may be subject to import duties and taxes, which are incurred once a shipment reaches your destination country.</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">How do I check the status of my order?</h2>
            <p>When your order has shipped, you will receive an email notification from us which will include a tracking number you can use to check its status. Please allow 48 hours for the tracking information to become available.</p>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
