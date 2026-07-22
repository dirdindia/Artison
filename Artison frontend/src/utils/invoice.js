import api from '../api';

const getInvoiceHtml = async (order) => {
  const subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = order.totalPrice - subtotal;
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const customerName = order.user?.name || order.guestName || userInfo.name || 'Customer';
  const customerEmail = order.user?.email || order.guestEmail || userInfo.email || '';

  let storeName = 'KALAKOSH';
  let address = 'Kalakosh Complex, Artisan Road, Craft City, India';
  let phone = '+91 9999900000';
  let email = 'support@kalakosh.com';

  try {
    const { data } = await api.get('/settings');
    if (data) {
      storeName = (data.storeName || storeName).toUpperCase();
      address = data.businessAddress?.replace(/\n/g, ', ') || address;
      phone = data.contactPhone || phone;
      email = data.supportEmail || email;
    }
  } catch (err) {
    console.error('Failed to load settings', err);
  }

  return `
    <div id="invoice-content" style="font-family: Arial, sans-serif; padding: 20px; font-size: 12px; color: #000; background: white;">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
      </style>
      <div style="border: 1px solid #000; max-width: 800px; margin: auto;">
        
        <!-- Header -->
        <div style="display: flex; border-bottom: 1px solid #000; padding: 10px;">
          <div style="width: 25%; display: flex; align-items: center; justify-content: center; border-right: 1px solid #000;">
            <div style="width: 60px; height: 60px; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; font-size: 36px; font-weight: bold; border-radius: 4px;">
              ${storeName.charAt(0)}
            </div>
          </div>
          <div style="width: 50%; text-align: center; padding: 0 10px;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: bold;">${storeName}</h1>
            <p style="margin: 4px 0 0; font-size: 11px;">${address}</p>
            <p style="margin: 2px 0 0; font-size: 11px;">PHONE: ${phone}, E-MAIL: ${email}</p>
          </div>
          <div style="width: 25%; border-left: 1px solid #000; padding-left: 10px; font-size: 10px; display: flex; flex-direction: column; justify-content: center;">
            <div><strong>GST IN:</strong> 22AAAAA0000A1Z5</div>
            <div style="margin-top: 4px;"><strong>SAC/HSN CODE:</strong> 998311</div>
          </div>
        </div>

        <div style="text-align: center; border-bottom: 1px solid #000; padding: 4px; font-weight: bold; font-size: 14px; background: #f9f9f9;">
          Tax Invoice
        </div>

        <!-- Customer Details Grid -->
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 8px; vertical-align: top;">
              <div style="font-weight: bold; margin-bottom: 4px;">Customer & ADDRESS</div>
              <div style="text-transform: uppercase;">${customerName}</div>
              <div>${order.shippingAddress?.street}</div>
              <div>${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.postalCode}</div>
              <div>${order.shippingAddress?.country}</div>
              ${order.shippingAddress?.phone ? `<div>Ph: ${order.shippingAddress.phone}</div>` : ''}
              ${customerEmail ? `<div>Email: ${customerEmail}</div>` : ''}
            </td>
            <td style="width: 50%; border-bottom: 1px solid #000; vertical-align: top; padding: 0;">
              <table style="width: 100%; border-collapse: collapse; height: 100%;">
                <tr>
                  <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 6px; width: 50%;"><strong>Bill No.</strong><br/>${order._id.substring(18).toUpperCase()}</td>
                  <td style="border-bottom: 1px solid #000; padding: 6px; width: 50%;"><strong>Date</strong><br/>${new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="border-right: 1px solid #000; border-bottom: 1px solid #000; padding: 6px;"><strong>Order Status</strong><br/>${order.orderStatus || 'Processing'}</td>
                  <td style="border-bottom: 1px solid #000; padding: 6px;"><strong>Payment</strong><br/>${order.paymentMethod}</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 6px;"><strong>Payment ID:</strong> ${order.paymentId || 'N/A'}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Items Grid -->
        <table style="width: 100%; border-collapse: collapse; text-align: center;">
          <tr style="border-bottom: 1px solid #000;">
            <th style="border-right: 1px solid #000; padding: 8px; width: 10%;">Date</th>
            <th style="border-right: 1px solid #000; padding: 8px; width: 50%;">Description</th>
            <th style="border-right: 1px solid #000; padding: 8px; width: 10%;">Qty</th>
            <th style="border-right: 1px solid #000; padding: 8px; width: 15%;">Price (₹)</th>
            <th style="padding: 8px; width: 15%;">Amount (₹)</th>
          </tr>
          ${order.orderItems.map((item, index) => `
            <tr>
              <td style="border-right: 1px solid #000; border-bottom: ${index === order.orderItems.length - 1 ? '1px solid #000' : 'none'}; padding: 8px; vertical-align: top;">${new Date(order.createdAt).toLocaleDateString()}</td>
              <td style="border-right: 1px solid #000; border-bottom: ${index === order.orderItems.length - 1 ? '1px solid #000' : 'none'}; padding: 8px; text-align: left;">${item.name}</td>
              <td style="border-right: 1px solid #000; border-bottom: ${index === order.orderItems.length - 1 ? '1px solid #000' : 'none'}; padding: 8px; vertical-align: top;">${item.qty}</td>
              <td style="border-right: 1px solid #000; border-bottom: ${index === order.orderItems.length - 1 ? '1px solid #000' : 'none'}; padding: 8px; vertical-align: top;">${item.price.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
              <td style="border-bottom: ${index === order.orderItems.length - 1 ? '1px solid #000' : 'none'}; padding: 8px; vertical-align: top;">${(item.price * item.qty).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
            </tr>
          `).join('')}
          <tr style="height: 120px;">
            <td style="border-right: 1px solid #000; border-bottom: 1px solid #000;"></td>
            <td style="border-right: 1px solid #000; border-bottom: 1px solid #000;"></td>
            <td style="border-right: 1px solid #000; border-bottom: 1px solid #000;"></td>
            <td style="border-right: 1px solid #000; border-bottom: 1px solid #000;"></td>
            <td style="border-bottom: 1px solid #000;"></td>
          </tr>
        </table>

        <!-- Totals & Signatures -->
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 70%; border-right: 1px solid #000; padding: 12px; vertical-align: top;">
              <div style="font-weight: bold; margin-bottom: 10px;">Remark : <span style="font-weight: normal;">Online Order</span></div>
              <div style="font-weight: bold; margin-bottom: 40px;">Amount in words:<br/><span style="font-weight: normal;">Indian Rupees ${order.totalPrice.toLocaleString('en-IN')} Only</span></div>
              
              <div style="display: flex; justify-content: space-between; margin-top: 50px; padding: 0 20px;">
                <div style="text-align: center; width: 35%; border-top: 1px dashed #000; padding-top: 5px;">Cashier's Signature</div>
                <div style="text-align: center; width: 35%; border-top: 1px dashed #000; padding-top: 5px;">Guest's Signature</div>
              </div>
            </td>
            <td style="width: 30%; padding: 0; vertical-align: top;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 8px; border-bottom: 1px solid #000; border-right: 1px solid #000; font-weight: bold;">Subtotal</td>
                  <td style="padding: 6px 8px; border-bottom: 1px solid #000; text-align: right;">${subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 8px; border-bottom: 1px solid #000; border-right: 1px solid #000; font-weight: bold;">Shipping/Tax</td>
                  <td style="padding: 6px 8px; border-bottom: 1px solid #000; text-align: right;">${shipping.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 8px; border-bottom: 1px solid #000; border-right: 1px solid #000; font-weight: bold;">TOTAL</td>
                  <td style="padding: 6px 8px; border-bottom: 1px solid #000; text-align: right; font-weight: bold;">${order.totalPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 8px; border-bottom: 1px solid #000; border-right: 1px solid #000; font-weight: bold;">ADVANCE</td>
                  <td style="padding: 6px 8px; border-bottom: 1px solid #000; text-align: right;">0.00</td>
                </tr>
                <tr>
                  <td style="padding: 6px 8px; border-right: 1px solid #000; font-weight: bold;">BALANCE</td>
                  <td style="padding: 6px 8px; text-align: right; font-weight: bold;">${order.totalPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <!-- Footer Terms -->
        <div style="padding: 8px; text-align: center; font-size: 10px; font-weight: bold;">
          SUBJECT TO JURISDICTION | E. & O. E. | THANK YOU FOR HONOURING US BY YOUR VISIT
        </div>

      </div>
    </div>
  `;
};

export const generateInvoice = async (order) => {
  const printWindow = window.open('', '_blank');
  
  const invoiceHtmlContent = await getInvoiceHtml(order);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${order._id.substring(18)}</title>
    </head>
    <body>
      ${invoiceHtmlContent}
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

export const downloadInvoice = async (order) => {
  const printWindow = window.open('', '_blank');
  
  const invoiceHtmlContent = await getInvoiceHtml(order);

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
        ${invoiceHtmlContent}
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
