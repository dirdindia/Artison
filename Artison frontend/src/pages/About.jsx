import React from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';

export default function About() {
  return (
    <AppShell title="About Kalakosh">
      <div className="max-w-4xl mx-auto py-12 px-5">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold text-center mb-10 text-amber-950"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          About Kalakosh
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6 text-lg text-muted-foreground leading-relaxed"
        >
          <p>
            Art has always been the language of civilizations. It preserves memories, reflects identities, sparks conversations, and transcends generations. At Kalakosh, we believe that every creation—whether born from centuries-old traditions or contemporary imagination—has the power to inspire, connect, and endure.
          </p>
          <p>
            Founded with a vision to celebrate India's extraordinary artistic heritage, Kalakosh is dedicated to bringing the country's local and indigenous art forms to the world. Behind every handcrafted masterpiece lies the quiet devotion of an artisan, years of inherited wisdom, and a story waiting to be discovered. Through our platform, we strive to ensure that these remarkable traditions continue to thrive, while empowering the artists whose craftsmanship keeps them alive.
          </p>
          <p>
            Yet, our vision extends beyond preserving the past. We celebrate art in all its expressions—from the timeless beauty of traditional paintings and handcrafted works to contemporary canvases, striking 3D artworks, and thoughtfully sculpted forms. By curating both heritage and modern creativity under one roof, we create a space where tradition and innovation exist in harmony, each enriching the other.
          </p>
          <p>
            Kalakosh is more than a destination for collecting art; it is a movement to honour creativity in all its forms. Every piece you discover here is a testament to imagination, dedication, and the enduring value of human craftsmanship.
          </p>
          <div className="pt-8 text-center">
            <p className="font-display font-semibold text-foreground text-2xl md:text-3xl italic text-amber-900" style={{ fontFamily: "'Dancing Script', cursive" }}>
              Because art is not merely something we admire—it is something we inherit, preserve, and pass forward. And through Kalakosh, every creation finds not only a home, but a story that continues to be told.
            </p>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
