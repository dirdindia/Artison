import React from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';

export default function TermsOfService() {
  return (
    <AppShell title="Terms of Use">
      <div className="max-w-4xl mx-auto py-12 px-5">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-display font-bold text-center mb-10 text-amber-950"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Terms of Use
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
            <p className="mb-4">Welcome to KalaKosh. These Terms of Use (“Terms”) govern your access to and use of the KalaKosh website, including browsing, creating an account, purchasing products, submitting reviews or feedback, and using any other services or features made available through the website.</p>
            <p>By accessing or using the website, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with these Terms, please do not use the website.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">1. About KalaKosh</h2>
            <p>KalaKosh is an online platform offering traditional, regional, contemporary, handmade, artistic, and creative products, including paintings, handicrafts, sculptures, artworks, and other related products.</p>
            <p className="mt-2">For these Terms, “KalaKosh,” “we,” “us,” or “our” refers to the operator of the KalaKosh website, and “you” or “your” refers to any visitor, user, or customer of the website.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">2. Eligibility</h2>
            <p className="mb-2">By using the website, you represent that:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>You are legally capable of entering into a binding agreement under applicable law;</li>
              <li>The information you provide to KalaKosh is accurate and complete;</li>
              <li>You will use the website only for lawful purposes; and</li>
              <li>You will comply with these Terms and all applicable laws and regulations.</li>
            </ul>
            <p>If you are accessing the website on behalf of an organization or another person, you represent that you have the authority to bind that organization or person to these Terms.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">3. Account Registration</h2>
            <p className="mb-4">Certain features of the website may require you to create an account.</p>
            <p className="mb-2">You are responsible for:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Providing accurate and current information;</li>
              <li>Maintaining the confidentiality of your login credentials;</li>
              <li>Keeping your account information updated;</li>
              <li>Preventing unauthorized access to your account; and</li>
              <li>All activities carried out through your account, to the extent permitted by law.</li>
            </ul>
            <p className="mb-2">You should notify KalaKosh immediately if you suspect unauthorized access to your account.</p>
            <p>KalaKosh reserves the right to suspend or terminate accounts that contain inaccurate information or are used in violation of these Terms.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">4. Products and Product Information</h2>
            <p className="mb-4">We make reasonable efforts to ensure that product descriptions, photographs, specifications, dimensions, prices, and other information displayed on the website are accurate.</p>
            <p className="mb-2">However:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Colours may appear differently depending on your device or screen settings.</li>
              <li>Handmade and handcrafted products may contain minor variations in colour, texture, dimensions, patterns, or finish.</li>
              <li>Certain products may have natural irregularities that are inherent to their handmade or artistic nature.</li>
              <li>Product availability may change without prior notice.</li>
              <li>Images displayed on the website may be representative and may not always perfectly reflect the physical product.</li>
            </ul>
            <p>Such variations do not necessarily constitute defects where they are inherent characteristics of the product.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">5. Product Availability</h2>
            <p className="mb-4">All products displayed on the website are subject to availability.</p>
            <p className="mb-2">KalaKosh reserves the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Limit the quantity of products available for purchase;</li>
              <li>Discontinue a product;</li>
              <li>Correct errors in product descriptions or pricing;</li>
              <li>Refuse or cancel an order where necessary; and</li>
              <li>Modify product specifications or availability without prior notice.</li>
            </ul>
            <p>If an order is cancelled because a product is unavailable or due to an error in the listing, any amount already paid for the cancelled order will be handled in accordance with our applicable refund policy.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">6. Prices and Taxes</h2>
            <p className="mb-2">Product prices displayed on the website will be those applicable at the time of purchase, subject to correction of inadvertent errors.</p>
            <p className="mb-2">Prices may be inclusive or exclusive of applicable taxes, shipping charges, duties, or other charges depending on how they are displayed at checkout.</p>
            <p className="mb-2">The final amount payable will be shown before you complete the purchase.</p>
            <p>KalaKosh reserves the right to change prices at any time. Such changes will not affect orders that have already been accepted, except where permitted or required by applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">7. Orders and Acceptance</h2>
            <p className="mb-2">When you place an order, you are making an offer to purchase the selected products.</p>
            <p className="mb-2">An order confirmation received by email, SMS, or other communication does not necessarily constitute final acceptance of the order if further verification is required.</p>
            <p className="mb-2">KalaKosh reserves the right to accept, reject, or cancel an order in circumstances including:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Product unavailability;</li>
              <li>Incorrect pricing or product information;</li>
              <li>Suspected fraudulent or unauthorized transactions;</li>
              <li>Incorrect shipping information;</li>
              <li>Technical errors;</li>
              <li>Violation of these Terms; or</li>
              <li>Other legitimate reasons permitted by law.</li>
            </ul>
            <p>If an order is cancelled after payment has been received, the applicable amount will be refunded in accordance with our refund policy.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">8. Payment</h2>
            <p className="mb-2">Payments may be processed through third-party payment service providers.</p>
            <p className="mb-2">By making a payment through the website, you agree to comply with the terms and conditions applicable to the selected payment method or payment service provider.</p>
            <p className="mb-2">KalaKosh does not request or intentionally collect sensitive payment credentials such as your complete card PIN or banking password.</p>
            <p>You must ensure that the payment information provided by you is accurate and that you are authorized to use the selected payment method.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">9. Shipping and Delivery</h2>
            <p className="mb-2">KalaKosh may use third-party logistics and delivery partners to fulfil orders.</p>
            <p className="mb-2">Delivery timelines displayed on the website are estimates unless expressly stated otherwise. Actual delivery may be affected by factors including:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Product availability;</li>
              <li>Location;</li>
              <li>Weather conditions;</li>
              <li>Transportation disruptions;</li>
              <li>Public holidays;</li>
              <li>Government restrictions;</li>
              <li>Incorrect or incomplete address information; and</li>
              <li>Circumstances beyond our reasonable control.</li>
            </ul>
            <p className="mb-2">KalaKosh will not be responsible for delays caused by circumstances beyond its reasonable control, subject to applicable law.</p>
            <p>You are responsible for providing an accurate delivery address and contact information.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">10. Returns, Refunds, and Cancellations</h2>
            <p className="mb-2">Returns, replacements, refunds, and cancellations shall be governed by the Refund and Cancellation Policy published on the KalaKosh website.</p>
            <p className="mb-2">Customers should carefully review the applicable policy before placing an order.</p>
            <p className="mb-2">Certain products may be non-returnable or subject to special return conditions due to their nature, customization, hygiene considerations, or other legitimate reasons, where permitted by applicable law.</p>
            <p>Nothing in these Terms limits any mandatory consumer rights available to you under applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">11. Intellectual Property</h2>
            <p className="mb-2">All content available on the KalaKosh website, including but not limited to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>KalaKosh's name and logo;</li>
              <li>Website design and layout;</li>
              <li>Text and written content;</li>
              <li>Product descriptions;</li>
              <li>Photographs and images;</li>
              <li>Graphics and illustrations;</li>
              <li>Videos;</li>
              <li>Artwork created or commissioned by KalaKosh;</li>
              <li>Trademarks, service marks, and branding; and</li>
              <li>Software and website functionality</li>
            </ul>
            <p className="mb-4">is owned by or licensed to KalaKosh or its respective content owners and is protected by applicable intellectual-property laws.</p>
            <p className="mb-2">You may access and use the website for personal and lawful purposes.</p>
            <p className="mb-2">You may not, without prior written permission:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Copy or reproduce substantial portions of the website;</li>
              <li>Download or commercially exploit website content;</li>
              <li>Reproduce, modify, distribute, or sell KalaKosh's branding or proprietary content;</li>
              <li>Use KalaKosh's name or logo in a manner suggesting unauthorized affiliation;</li>
              <li>Scrape or systematically collect website content;</li>
              <li>Use website content to create a competing commercial service; or</li>
              <li>Remove copyright, trademark, or other proprietary notices.</li>
            </ul>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">12. Artwork and Artist Rights</h2>
            <p className="mb-2">KalaKosh may feature artworks, photographs, designs, or other creative works belonging to individual artists, artisans, creators, or other rights holders.</p>
            <p className="mb-2">The purchase of a physical artwork or product does not automatically transfer copyright or other intellectual-property rights in the underlying artwork unless expressly stated otherwise in writing.</p>
            <p className="mb-2">Unless otherwise specified, copyright and other intellectual-property rights remain with the respective rights holder.</p>
            <p>Customers may not reproduce, commercially exploit, digitally distribute, modify, or create derivative works from purchased artwork without the necessary authorization.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">13. User-Generated Content</h2>
            <p className="mb-4">The website may allow users to submit reviews, ratings, comments, photographs, feedback, testimonials, or other content (“User Content”).</p>
            <p className="mb-2">By submitting User Content, you represent that:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>You own or have the necessary rights and permissions to submit the content;</li>
              <li>The content does not infringe another person's intellectual-property, privacy, or other rights;</li>
              <li>The content is not unlawful, defamatory, abusive, fraudulent, misleading, or otherwise objectionable; and</li>
              <li>The content does not contain malicious software or harmful code.</li>
            </ul>
            <p className="mb-2">You grant KalaKosh a non-exclusive, royalty-free, worldwide license to use, reproduce, display, publish, adapt, and distribute User Content for purposes connected with operating, promoting, and improving KalaKosh, subject to applicable law.</p>
            <p>KalaKosh reserves the right to remove User Content that violates these Terms or applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">14. Prohibited Uses</h2>
            <p className="mb-2">You agree not to use the website to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Violate any applicable law or regulation;</li>
              <li>Commit fraud or facilitate fraudulent activity;</li>
              <li>Impersonate another person or entity;</li>
              <li>Provide false or misleading information;</li>
              <li>Gain unauthorized access to accounts, systems, or data;</li>
              <li>Introduce viruses, malware, or other harmful code;</li>
              <li>Interfere with website security or functionality;</li>
              <li>Scrape, crawl, or collect website data through unauthorized automated means;</li>
              <li>Attempt to reverse engineer website software where prohibited by law;</li>
              <li>Use the website for unauthorized commercial purposes;</li>
              <li>Infringe intellectual-property rights;</li>
              <li>Harass, threaten, abuse, or harm other users; or</li>
              <li>Engage in any activity that could damage KalaKosh or its users.</li>
            </ul>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">15. Third-Party Services and Links</h2>
            <p className="mb-2">KalaKosh may use or provide access to third-party services, including payment gateways, shipping providers, analytics services, social-media platforms, and other external services.</p>
            <p className="mb-2">Third-party services may have their own terms and privacy policies. KalaKosh is not responsible for the policies, security, availability, or performance of third-party services, except to the extent required by applicable law.</p>
            <p>Links to third-party websites are provided for convenience and do not necessarily constitute endorsement by KalaKosh.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">16. Website Availability</h2>
            <p className="mb-2">We aim to keep the KalaKosh website available and functioning properly. However, uninterrupted access cannot be guaranteed.</p>
            <p className="mb-2">The website may occasionally be unavailable due to:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Maintenance;</li>
              <li>Updates;</li>
              <li>Technical problems;</li>
              <li>Security incidents;</li>
              <li>Server or network failures;</li>
              <li>Third-party service interruptions; or</li>
              <li>Circumstances beyond our reasonable control.</li>
            </ul>
            <p>KalaKosh reserves the right to modify, suspend, or discontinue any part of the website or its services where reasonably necessary, subject to applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">17. Disclaimer</h2>
            <p className="mb-2">To the maximum extent permitted by applicable law, the website and its content are provided on an “as available” basis.</p>
            <p className="mb-2">KalaKosh does not guarantee that:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>The website will always be available;</li>
              <li>The website will be completely error-free;</li>
              <li>All information will always be current or accurate;</li>
              <li>The website will be free from technical vulnerabilities; or</li>
              <li>Every product will be suitable for every user's particular requirements.</li>
            </ul>
            <p>Nothing in these Terms excludes or limits any warranty, right, or protection that cannot legally be excluded or limited under applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">18. Limitation of Liability</h2>
            <p className="mb-2">To the maximum extent permitted by applicable law, KalaKosh shall not be liable for indirect, incidental, special, consequential, or punitive losses arising from your use of the website or services, except where such liability cannot legally be excluded.</p>
            <p>Nothing in these Terms shall exclude or limit liability for matters that cannot lawfully be excluded or limited under applicable Indian law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">19. Indemnification</h2>
            <p className="mb-2">To the extent permitted by applicable law, you agree to indemnify and hold harmless KalaKosh, its owners, employees, representatives, service providers, and affiliates from claims, losses, liabilities, damages, costs, and expenses arising from:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Your violation of these Terms;</li>
              <li>Your unlawful use of the website;</li>
              <li>Your infringement of another person's rights; or</li>
              <li>Your User Content or other material submitted to the website.</li>
            </ul>
            <p>This clause will apply only to the extent permitted by applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">20. Suspension and Termination</h2>
            <p className="mb-2">KalaKosh may suspend or terminate your access to the website or your account if:</p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>You materially violate these Terms;</li>
              <li>You engage in fraudulent or unlawful activity;</li>
              <li>Your actions threaten the security or operation of the website;</li>
              <li>Required by law or a governmental authority; or</li>
              <li>There is another legitimate reason requiring suspension or termination.</li>
            </ul>
            <p>Termination will not affect rights or obligations that arose before termination.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">21. Privacy</h2>
            <p className="mb-2">Your use of the website is also subject to our Privacy Policy, which explains how KalaKosh collects, uses, stores, and protects personal information.</p>
            <p>By using the website, you acknowledge that you have reviewed the Privacy Policy.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">22. Changes to These Terms</h2>
            <p className="mb-2">KalaKosh may update these Terms from time to time to reflect changes in our services, business practices, technology, or applicable laws.</p>
            <p className="mb-2">The updated Terms will be posted on the website with a revised “Last Updated” date.</p>
            <p>Your continued use of the website after updated Terms become effective constitutes acceptance of the revised Terms, to the extent permitted by applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">23. Governing Law and Jurisdiction</h2>
            <p className="mb-2">These Terms shall be governed by and interpreted in accordance with the laws of India.</p>
            <p>Subject to applicable law, disputes arising from or relating to these Terms or your use of the website shall be subject to the jurisdiction of the courts having appropriate jurisdiction over KalaKosh.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">24. Severability</h2>
            <p className="mb-2">If any provision of these Terms is found to be invalid, unlawful, or unenforceable, that provision shall be modified or interpreted to the minimum extent necessary to make it enforceable, where legally possible.</p>
            <p>The remaining provisions shall continue to remain in full force and effect.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">25. Entire Agreement</h2>
            <p>These Terms, together with the Privacy Policy, Refund and Cancellation Policy, Shipping Policy, and any other policies expressly incorporated into the website, constitute the terms governing your use of KalaKosh, subject to applicable law.</p>
          </div>

          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50">
            <h2 className="text-xl font-semibold text-foreground mb-4">26. Contact Us</h2>
            <p className="mb-4">For questions, complaints, or concerns regarding these Terms, please contact:</p>
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
