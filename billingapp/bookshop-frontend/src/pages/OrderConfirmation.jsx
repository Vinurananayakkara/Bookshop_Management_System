import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Home, ShoppingBag } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderId, total } = location.state || {};

  const generateBill = () => {
    // Create a simple bill/invoice
    const billContent = `
BOOKSHOP INVOICE
================

Order ID: ${orderId}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Customer: ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : 'Guest'}

Items Purchased:
${JSON.parse(localStorage.getItem('cart') || '[]').map(item => 
  `- ${item.name} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`
).join('\n')}

Subtotal: $${(parseFloat(total) / 1.08).toFixed(2)}
Tax (8%): $${(parseFloat(total) * 0.08 / 1.08).toFixed(2)}
Total: $${total}

Thank you for your purchase!
Visit us again at BookShop.
    `;

    const blob = new Blob([billContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BookShop_Invoice_${orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Number</h3>
                <p className="text-lg font-semibold text-gray-900">{orderId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h3>
                <p className="text-lg font-semibold text-gray-900">${total}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Order Date</h3>
                <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Delivery</h3>
                <p className="text-lg font-semibold text-gray-900">3-5 business days</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-gray-600">
              We've sent a confirmation email with your order details. You can track your order status in your account.
            </p>
            <p className="text-sm text-gray-500">
              If you have any questions about your order, please contact our customer support team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={generateBill}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Invoice
            </button>
            <Link
              to="/books"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-gray-900">Order Confirmed</p>
                <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-gray-900">Processing</p>
                <p className="text-sm text-gray-600">We're preparing your books for shipment</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-gray-500">Shipped</p>
                <p className="text-sm text-gray-500">Your order will be shipped within 1-2 business days</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <p className="font-medium text-gray-500">Delivered</p>
                <p className="text-sm text-gray-500">Estimated delivery in 3-5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
