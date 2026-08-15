import React from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';

export default function PrivacyPolicy() {
  return (
    <AppShell title="Privacy Policy">
      <div className="max-w-4xl mx-auto py-12 px-5">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-10 text-amber-950"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Privacy Policy
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-8 text-sm md:text-base text-muted-foreground leading-relaxed"
        >
          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <p className="mb-4"><strong>Effective Date:</strong> 15 August 2026<br/>
            <strong>Last Updated:</strong> 15 August 2026</p>
            <p className="mb-4">At KalaKosh, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how KalaKosh collects, uses, stores, processes, and protects information when you visit or use our website, purchase our products, create an account, or otherwise interact with our services.</p>
            <p>By accessing or using the KalaKosh website, you agree to the practices described in this Privacy Policy. If you do not agree with any part of this policy, please discontinue use of the website.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">1. About KalaKosh</h2>
            <p>KalaKosh is an online platform offering traditional, regional, contemporary, handmade, artistic, and creative products, including artworks, handicrafts, sculptures, paintings, and other related products.</p>
            <p className="mt-2">For the purposes of this Privacy Policy, “KalaKosh,” “we,” “us,” or “our” refers to the operator of the KalaKosh website, while “you” or “your” refers to any visitor, customer, or user of the website.</p>
          </div>
          
          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <p className="mb-4">We may collect different types of information depending on how you interact with our website.</p>
            
            <h3 className="text-lg font-medium text-foreground mb-2 mt-6">A. Information You Provide Directly</h3>
            <p className="mb-2">When you create an account, place an order, contact us, or use certain features of the website, we may collect:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Full name</li>
              <li>Mobile/telephone number</li>
              <li>Email address</li>
              <li>Billing and shipping address</li>
              <li>Delivery details</li>
              <li>Account login information</li>
              <li>Order and purchase details</li>
              <li>Payment-related information</li>
              <li>Feedback, reviews, queries, or other communications you submit</li>
              <li>Any other information that you voluntarily provide to us</li>
            </ul>
            <p className="mb-6">We only request information that is reasonably necessary to provide our services or fulfill the relevant purpose.</p>

            <h3 className="text-lg font-medium text-foreground mb-2">B. Payment Information</h3>
            <p className="mb-2">Payments may be processed through third-party payment gateways. Depending on the payment method used, the payment service provider may collect and process information such as card details, bank details, UPI information, or other payment credentials.</p>
            <p className="mb-2">KalaKosh does not intend to store complete debit card, credit card, or banking credentials on its own servers unless expressly required and legally permitted.</p>
            <p className="mb-6">You should review the privacy policy and terms of the relevant payment service provider before making a payment.</p>

            <h3 className="text-lg font-medium text-foreground mb-2">C. Automatically Collected Information</h3>
            <p className="mb-2">When you visit our website, certain technical information may be collected automatically, including:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>Operating system</li>
              <li>Date and time of access</li>
              <li>Pages visited</li>
              <li>Referring website or source</li>
              <li>Approximate location derived from technical information</li>
              <li>Website usage and interaction data</li>
            </ul>
            <p className="mb-6">This information may be used to improve website functionality, security, performance, and user experience.</p>

            <h3 className="text-lg font-medium text-foreground mb-2">D. Cookies and Similar Technologies</h3>
            <p className="mb-2">KalaKosh may use cookies and similar technologies to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Keep you signed in</li>
              <li>Remember shopping-cart items and preferences</li>
              <li>Enable essential website functions</li>
              <li>Understand how visitors use the website</li>
              <li>Improve website performance</li>
              <li>Personalize certain website features</li>
              <li>Analyze website traffic and user engagement</li>
            </ul>
            <p>You may be able to control or disable cookies through your browser settings. However, disabling certain cookies may affect the functionality of the website.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="mb-2">We may use the information collected for legitimate business and operational purposes, including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Creating and managing your account;</li>
              <li>Processing and fulfilling orders;</li>
              <li>Processing payments and refunds;</li>
              <li>Arranging delivery and shipping;</li>
              <li>Communicating with you regarding your orders;</li>
              <li>Responding to questions, complaints, and support requests;</li>
              <li>Providing information about products and services;</li>
              <li>Improving our website, products, and services;</li>
              <li>Maintaining website security and preventing fraud or misuse;</li>
              <li>Conducting analytics and understanding customer preferences;</li>
              <li>Sending promotional or marketing communications where permitted by applicable law;</li>
              <li>Complying with applicable laws, regulations, court orders, and governmental requirements; and</li>
              <li>Protecting the rights, property, and safety of KalaKosh, its users, customers, and other persons.</li>
            </ul>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Sharing of Personal Information</h2>
            <p className="mb-4">KalaKosh does not sell or rent your personal information to third parties.</p>
            <p className="mb-2">We may, however, share necessary information with trusted third parties where required to operate our website and provide our services. These may include:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Payment gateway and payment-processing providers;</li>
              <li>Courier, logistics, and delivery partners;</li>
              <li>Website hosting and technology service providers;</li>
              <li>Analytics and website-performance providers;</li>
              <li>Customer-support or communication service providers;</li>
              <li>Professional advisers, auditors, or legal representatives; and</li>
              <li>Government authorities, law-enforcement agencies, courts, or regulatory bodies where legally required.</li>
            </ul>
            <p>Third-party service providers may only receive information reasonably necessary for performing their relevant services.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Marketing Communications</h2>
            <p className="mb-4">Where permitted by applicable law, KalaKosh may send you information about new products, offers, events, promotions, or other updates.</p>
            <p className="mb-4">You may opt out of promotional communications at any time by using the unsubscribe option provided in the communication or by contacting us.</p>
            <p>Please note that even if you opt out of promotional communications, we may continue to send essential communications relating to your account, transactions, orders, payments, deliveries, security, or other services.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Data Security</h2>
            <p className="mb-4">We take reasonable technical and organizational measures to protect personal information against unauthorized access, alteration, disclosure, loss, misuse, or destruction.</p>
            <p className="mb-4">However, no method of transmitting or storing information electronically can be guaranteed to be completely secure. Accordingly, while we strive to protect your information, we cannot guarantee absolute security.</p>
            <p>You are responsible for keeping your account credentials confidential and should notify us promptly if you believe your account has been accessed without authorization.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Data Retention</h2>
            <p className="mb-2">We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Providing our services;</li>
              <li>Maintaining transaction and business records;</li>
              <li>Resolving disputes;</li>
              <li>Preventing fraud or misuse;</li>
              <li>Complying with legal, tax, accounting, and regulatory obligations; and</li>
              <li>Enforcing our agreements and protecting our legal rights.</li>
            </ul>
            <p>When information is no longer required, we may securely delete, anonymize, or otherwise dispose of it in accordance with applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Your Privacy Rights</h2>
            <p className="mb-2">Subject to applicable law, you may have rights regarding your personal information, including the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Request access to personal information held about you;</li>
              <li>Request correction of inaccurate or incomplete information;</li>
              <li>Request deletion of information where legally permissible;</li>
              <li>Withdraw consent where processing is based on consent;</li>
              <li>Opt out of certain marketing communications; and</li>
              <li>Raise a concern or grievance regarding the processing of your personal information.</li>
            </ul>
            <p className="mb-4">To exercise any applicable privacy right, you may contact us using the details provided in the Contact Us section below.</p>
            <p>We may need to verify your identity before processing certain requests.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Children's Privacy</h2>
            <p className="mb-4">The KalaKosh website is not intended to knowingly collect personal information directly from children without appropriate authorization or consent where required by applicable law.</p>
            <p>If you believe that a child has provided personal information to us in circumstances where such collection was not appropriate, please contact us so that we can take reasonable steps to address the matter.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Third-Party Websites and Services</h2>
            <p className="mb-4">Our website may contain links to third-party websites, social-media platforms, payment gateways, delivery services, or other external services.</p>
            <p>KalaKosh is not responsible for the privacy practices, security, content, or policies of third-party websites or services. We encourage you to review the privacy policies of those third parties before providing them with personal information.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Reviews, Feedback, and User-Generated Content</h2>
            <p className="mb-4">If you submit a product review, testimonial, feedback, photograph, comment, or other content to KalaKosh, certain portions of that content may be displayed publicly on the website or our social-media channels, depending on the feature used and your submission.</p>
            <p>Please avoid submitting sensitive personal information or information that you do not want to be publicly displayed.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">12. Changes to This Privacy Policy</h2>
            <p className="mb-4">KalaKosh may update or modify this Privacy Policy from time to time to reflect changes in our practices, technology, services, or applicable legal requirements.</p>
            <p>The updated version will be posted on this page with a revised “Last Updated” date. Your continued use of the website after the updated policy becomes effective constitutes your acknowledgment of the revised policy, to the extent permitted by applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">13. Grievance Redressal</h2>
            <p className="mb-4">If you have any questions, concerns, complaints, or grievances regarding the collection or use of your personal information, you may contact our designated privacy/grievance contact.</p>
            <div className="mb-4 pl-4 border-l-2 border-primary/30">
              <p><strong>Grievance/Privacy Contact:</strong> Admin</p>
              <p><strong>Email:</strong> <a href="mailto:dird.india@gmail.com" className="text-primary hover:underline">dird.india@gmail.com</a></p>
            </div>
            <p>We will make reasonable efforts to review and address privacy-related concerns within the timeframe required under applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">14. Applicable Law</h2>
            <p className="mb-4">This Privacy Policy shall be governed by and interpreted in accordance with the laws applicable in India, including applicable data-protection and privacy legislation and rules, as amended or replaced from time to time.</p>
            <p>Any dispute relating to this Privacy Policy shall be subject to the jurisdiction of the courts having appropriate jurisdiction over KalaKosh, subject to applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">15. Contact Us</h2>
            <p className="mb-4">If you have any questions regarding this Privacy Policy or the way KalaKosh handles your personal information, please contact us:</p>
            <div className="pl-4 border-l-2 border-primary/30">
              <p><strong>KalaKosh</strong></p>
              <p><strong>Email:</strong> <a href="mailto:dird.india@gmail.com" className="text-primary hover:underline">dird.india@gmail.com</a></p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
