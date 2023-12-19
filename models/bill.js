import mongoose from 'mongoose';

// Define PharmacyProduct Schema (assuming it's already defined)
import { PharmacyProduct } from './pharmacyProductModel'; // Adjust the path accordingly

// Define BillProduct Schema
const billProductSchema = new mongoose.Schema({
  bill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PharmacyProduct',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const BillProduct = mongoose.model('BillProduct', billProductSchema);

// Define Bill Schema
const billSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CustomUser',
    required: false,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  invoice_number: {
    type: String,
    unique: true,
  },
  receipt_number: {
    type: String,
    unique: true,
  },
  is_invoice: {
    type: Boolean,
    default: true,
  },
  is_receipt: {
    type: Boolean,
    default: false,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PharmacyProduct',
      through: 'BillProduct',
    },
  ],
});

billSchema.pre('save', async function (next) {
  if (!this.invoice_number && this.is_invoice) {
    const lastInvoice = await this.constructor.findOne({ is_invoice: true }).sort('-invoice_number').exec();
    const lastNumber = lastInvoice ? parseInt(lastInvoice.invoice_number.split('-')[1]) : 0;
    this.invoice_number = `INV-${String(lastNumber + 1).padStart(4, '0')}`;
  }

  if (!this.receipt_number && this.is_receipt) {
    const lastReceipt = await this.constructor.findOne({ is_receipt: true }).sort('-receipt_number').exec();
    const lastNumber = lastReceipt ? parseInt(lastReceipt.receipt_number.split('-')[1]) : 0;
    this.receipt_number = `RECEIPT-${String(lastNumber + 1).padStart(4, '0')}`;
  }

  next();
});

const Bill = mongoose.model('Bill', billSchema);

export { Bill, BillProduct };
