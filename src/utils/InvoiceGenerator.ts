/**
 * Invoice Generator - Generate PDF invoices for orders
 * Uses jsPDF for client-side PDF generation
 */

import jsPDF from 'jspdf';
import { Order } from '@/types';
import { CURRENCY } from './constants';

export const generateInvoice = (order: Order) => {
  const doc = new jsPDF();
  
  // Colors
  const primaryColor = '#3C2A21'; // Coffee brown
  const accentColor = '#D4A574'; // Coffee accent

  // Header - Company Name
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  doc.text('Coffee & Co.', 105, 25, { align: 'center' });
  
  // Invoice Title
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text('INVOICE', 105, 35, { align: 'center' });
  
  // Divider line
  doc.setDrawColor(accentColor);
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);
  
  // Order Information
  doc.setFontSize(10);
  doc.setTextColor(60);
  
  // Left column - Order Details
  doc.setFont('helvetica', 'bold');
  doc.text('Order Details:', 20, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order ID: ${order.id}`, 20, 62);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 20, 69);
  doc.text(`Time: ${new Date(order.createdAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  })}`, 20, 76);
  doc.text(`Status: ${order.status}`, 20, 83);
  
  // Right column - Customer Details
  if (order.customerName) {
    doc.setFont('helvetica', 'bold');
    doc.text('Customer:', 120, 55);
    doc.setFont('helvetica', 'normal');
    doc.text(order.customerName, 120, 62);
  }
  
  if (order.location) {
    doc.setFont('helvetica', 'bold');
    doc.text('Delivery Address:', 120, 69);
    doc.setFont('helvetica', 'normal');
    const locationLines = doc.splitTextToSize(order.location, 70);
    doc.text(locationLines, 120, 76);
  }
  
  // Items Table Header
  const tableTop = 100;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(accentColor);
  doc.rect(20, tableTop, 170, 8, 'F');
  doc.setTextColor(255);
  doc.text('Item', 25, tableTop + 5.5);
  doc.text('Qty', 130, tableTop + 5.5);
  doc.text('Price', 155, tableTop + 5.5);
  doc.text('Total', 175, tableTop + 5.5, { align: 'right' });
  
  // Items
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60);
  let y = tableTop + 15;
  
  order.items.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, y - 4, 170, 8, 'F');
    }
    
    // Item name (truncate if too long)
    const itemName = item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name;
    doc.text(itemName, 25, y);
    
    // Variant/Size info
    if (item.selectedVariant || item.selectedSize) {
      const variant = item.selectedVariant?.name || item.selectedSize || '';
      doc.setFontSize(7);
      doc.setTextColor(120);
      doc.text(`(${variant})`, 25, y + 3);
      doc.setFontSize(9);
      doc.setTextColor(60);
    }
    
    // Quantity
    doc.text(`${item.quantity}`, 135, y, { align: 'center' });
    
    // Unit Price
    doc.text(`${CURRENCY}${item.price.toFixed(2)}`, 160, y, { align: 'right' });
    
    // Line Total
    const lineTotal = item.price * item.quantity;
    doc.text(`${CURRENCY}${lineTotal.toFixed(2)}`, 185, y, { align: 'right' });
    
    y += item.selectedVariant || item.selectedSize ? 12 : 10;
    
    // Check for page break
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
  });
  
  // Divider before total
  doc.setDrawColor(200);
  doc.line(20, y + 2, 190, y + 2);
  y += 10;
  
  // Total
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text('TOTAL:', 140, y);
  doc.setFontSize(14);
  doc.text(`${CURRENCY}${order.total.toFixed(2)}`, 185, y, { align: 'right' });
  
  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120);
  doc.text('Thank you for your order!', 105, 280, { align: 'center' });
  doc.text('Coffee & Co. - Premium Coffee Experience', 105, 285, { align: 'center' });
  
  // Generate filename with order ID and date
  const filename = `invoice-${order.id.replace('#', '')}-${new Date(order.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}.pdf`;
  
  // Download
  doc.save(filename);
};
