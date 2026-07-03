const getInvoiceHtml = (order) => {
  const subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = order.totalPrice - subtotal;

  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'background: #fef3c7; color: #b45309;',
      'Shipped': 'background: #dbeafe; color: #1d4ed8;',
      'Out for Delivery': 'background: #f3e8ff; color: #7e22ce;',
      'Delivered': 'background: #dcfce7; color: #15803d;',
      'Cancelled': 'background: #fee2e2; color: #b91c1c;',
      'Refunded': 'background: #f3f4f6; color: #374151;',
    };
    return colors[status] || 'background: #f3f4f6; color: #374151;';
  };

  return `
    <div id="invoice-content" style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #374151; line-height: 1.6; margin: 0; padding: 40px; background: #f9fafb;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      </style>
      <div class="invoice-box" style="max-width: 800px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); font-size: 15px;">
        
        <!-- Header Section -->
        <div class="header" style="background: linear-gradient(135deg, #3b2f2f 0%, #221a1a 100%); color: white; padding: 40px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="logo" style="font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px;">Artisna.</div>
            <div style="color: #d1d5db; font-size: 14px;">Premium Artwork & Crafts</div>
          </div>
          <div class="info" style="text-align: right;">
            <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">INVOICE</div>
            <div style="color: #e5e7eb;">#${order._id.substring(18).toUpperCase()}</div>
            <div style="color: #9ca3af; font-size: 13px; margin-top: 4px;">Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="details" style="display: flex; justify-content: space-between; padding: 40px; border-bottom: 1px solid #f3f4f6;">
          <div class="customer" style="width: 45%;">
            <div style="font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Billed To</div>
            <div style="font-size: 16px; font-weight: 600; color: #111827;">${order.user?.name || 'Customer'}</div>
            <div style="color: #6b7280; margin-top: 2px;">${order.user?.email || ''}</div>
          </div>
          <div class="shipping" style="width: 45%; text-align: right;">
            <div style="font-size: 12px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Shipped To</div>
            <div style="font-size: 15px; font-weight: 500; color: #374151;">${order.shippingAddress?.street}</div>
            <div style="color: #6b7280; margin-top: 2px;">${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postalCode}</div>
            <div style="color: #6b7280;">${order.shippingAddress?.country}</div>
          </div>
        </div>

        <!-- Status & Payment Info -->
        <div style="padding: 20px 40px; background: #fdfbf7; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f3f4f6;">
          <div>
            <span style="font-size: 13px; color: #6b7280; margin-right: 8px;">Order Status:</span>
            <span style="padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; ${getStatusColor(order.orderStatus || 'Processing')}">${order.orderStatus || 'Processing'}</span>
          </div>
          <div>
             <span style="font-size: 13px; color: #6b7280; margin-right: 8px;">Payment:</span>
             <span style="font-weight: 600; color: #111827;">${order.paymentMethod}</span>
             ${order.paymentId ? `<span style="color: #9ca3af; font-size: 13px; margin-left: 6px;">(${order.paymentId})</span>` : ''}
          </div>
        </div>

        <!-- Items Table -->
        <div style="padding: 40px;">
          <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
            <thead>
              <tr>
                <th style="padding: 16px; background: #f9fafb; color: #4b5563; font-weight: 600; text-align: left; border-radius: 8px 0 0 8px; border-bottom: 2px solid #e5e7eb;">Item Description</th>
                <th style="padding: 16px; background: #f9fafb; color: #4b5563; font-weight: 600; text-align: center; border-bottom: 2px solid #e5e7eb;">Price</th>
                <th style="padding: 16px; background: #f9fafb; color: #4b5563; font-weight: 600; text-align: center; border-bottom: 2px solid #e5e7eb;">Qty</th>
                <th style="padding: 16px; background: #f9fafb; color: #4b5563; font-weight: 600; text-align: right; border-radius: 0 8px 8px 0; border-bottom: 2px solid #e5e7eb;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems.map(item => `
                <tr>
                  <td style="padding: 20px 16px; border-bottom: 1px solid #f3f4f6; font-weight: 500; color: #111827;">${item.name}</td>
                  <td style="padding: 20px 16px; border-bottom: 1px solid #f3f4f6; text-align: center; color: #4b5563;">₹${item.price.toLocaleString('en-IN')}</td>
                  <td style="padding: 20px 16px; border-bottom: 1px solid #f3f4f6; text-align: center; color: #4b5563;">${item.qty}</td>
                  <td style="padding: 20px 16px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 600; color: #111827;">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Totals Section -->
        <div style="padding: 0 40px 40px; display: flex; justify-content: flex-end;">
          <table style="width: 350px;">
            <tr>
              <td style="padding: 12px 16px; color: #6b7280; font-weight: 500;">Subtotal</td>
              <td style="padding: 12px 16px; text-align: right; font-weight: 600; color: #111827;">₹${subtotal.toLocaleString('en-IN')}</td>
            </tr>
            ${shipping > 0 ? `
              <tr>
                <td style="padding: 12px 16px; color: #6b7280; font-weight: 500;">Shipping & Tax</td>
                <td style="padding: 12px 16px; text-align: right; font-weight: 600; color: #111827;">₹${shipping.toLocaleString('en-IN')}</td>
              </tr>
            ` : ''}
            <tr>
              <td colspan="2" style="padding: 0;">
                <div style="margin-top: 12px; padding: 20px 16px; background: #3b2f2f; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; color: white;">
                  <span style="font-weight: 500; font-size: 16px;">Total Amount</span>
                  <span style="font-weight: 700; font-size: 22px;">₹${order.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Footer Section -->
        <div class="footer" style="background: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #f3f4f6;">
          <div style="font-weight: 600; color: #374151; margin-bottom: 8px;">Thank you for your purchase!</div>
          <div style="color: #6b7280; font-size: 13px;">If you have any questions about this invoice, please contact us at <span style="color: #3b2f2f; font-weight: 500;">support@artisna.com</span></div>
        </div>
      </div>
    </div>
  `;
};

export const generateInvoice = (order) => {
  const printWindow = window.open('', '_blank');
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${order._id.substring(18)}</title>
    </head>
    <body>
      ${getInvoiceHtml(order)}
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};

export const downloadInvoice = (order) => {
  const printWindow = window.open('', '_blank');
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Downloading Invoice #${order._id.substring(18)}</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    </head>
    <body>
      <div style="text-align: center; margin-top: 20%; font-family: sans-serif;">
        <h2>Generating PDF... Please wait.</h2>
        <p>This window will close automatically once the download starts.</p>
      </div>
      <div style="display: none;">
        ${getInvoiceHtml(order)}
      </div>
      <script>
        window.onload = function() {
          const element = document.getElementById('invoice-content');
          const opt = {
            margin:       0,
            filename:     'Invoice-${order._id}.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
          };
          
          html2pdf().set(opt).from(element).save().then(() => {
            setTimeout(() => {
              window.close();
            }, 1000);
          });
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
