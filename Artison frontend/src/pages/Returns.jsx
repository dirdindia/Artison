import React from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';

export default function Returns() {
  return (
    <AppShell title="Returns & Refunds">
      <div className="max-w-4xl mx-auto py-12 px-5">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-10 text-amber-950"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Returns & Refunds
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 text-lg text-muted-foreground leading-relaxed"
        >
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">Return Policy</h2>
            <p>We accept returns up to 14 days after delivery, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return. Custom-made or personalized artworks are generally non-refundable.</p>
          </div>
          
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">Damaged Items</h2>
            <p>In the event that your order arrives damaged in any way, please email us as soon as possible with your order number and a photo of the item's condition. We address these on a case-by-case basis but will try our best to work towards a satisfactory solution.</p>
          </div>

          <div className="bg-card p-6 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">Refund Process</h2>
            <p>Once your return is received and inspected, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within a certain amount of days.</p>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
