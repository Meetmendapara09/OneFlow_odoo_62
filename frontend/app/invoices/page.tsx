'use client';

import { useState, useEffect } from 'react';
import { FileText, DollarSign, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface InvoiceLine {
  id?: number;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface CustomerInvoice {
  id?: number;
  invoiceNumber?: string;
  salesOrderId?: number;
  customerId: number;
  customerName: string;
  projectId?: number;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  paymentStatus: string;
  status: string;
  notes?: string;
  paymentTerms?: string;
  items: InvoiceLine[];
  createdAt?: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/invoices');
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSendInvoice = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/invoices/${id}/send`, {
        method: 'POST'
      });
      fetchInvoices();
    } catch (error) {
      console.error('Error sending invoice:', error);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedInvoice || !paymentAmount) return;
    
    try {
      await fetch(`http://localhost:8080/api/invoices/${selectedInvoice.id}/record-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(paymentAmount) })
      });
      setShowPaymentModal(false);
      setPaymentAmount('');
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const handleCancelInvoice = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/invoices/${id}/cancel`, {
        method: 'POST'
      });
      fetchInvoices();
    } catch (error) {
      console.error('Error cancelling invoice:', error);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = filterStatus === 'All' || invoice.paymentStatus === filterStatus;
    const matchesSearch = invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalOutstanding = totalInvoiced - totalPaid;
  const overdueCount = invoices.filter(inv => {
    const dueDate = new Date(inv.dueDate);
    return inv.paymentStatus !== 'Paid' && dueDate < new Date();
  }).length;

  const getPaymentStatusBadge = (status: string) => {
    const styles = {
      'Unpaid': 'badge-error',
      'Partial': 'badge-warning',
      'Paid': 'badge-success'
    };
    return `badge ${styles[status as keyof typeof styles] || 'badge-ghost'}`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      'Draft': 'badge-ghost',
      'Sent': 'badge-info',
      'Paid': 'badge-success',
      'Cancelled': 'badge-error'
    };
    return `badge ${styles[status as keyof typeof styles] || 'badge-ghost'}`;
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Total Invoiced</p>
                <p className="text-3xl font-bold">${totalInvoiced.toFixed(2)}</p>
              </div>
              <FileText className="w-10 h-10 opacity-50" />
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Total Paid</p>
                <p className="text-3xl font-bold text-success">${totalPaid.toFixed(2)}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 opacity-50" />
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Outstanding</p>
                <p className="text-3xl font-bold text-warning">${totalOutstanding.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 opacity-50" />
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Overdue</p>
                <p className="text-3xl font-bold text-error">{overdueCount}</p>
              </div>
              <AlertCircle className="w-10 h-10 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by invoice number or customer..."
          className="input input-bordered flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="select select-bordered w-full md:w-48"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option>All</option>
          <option>Unpaid</option>
          <option>Partial</option>
          <option>Paid</option>
        </select>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Invoice
        </button>
      </div>

      {/* Invoices Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Invoice Date</th>
              <th>Due Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Outstanding</th>
              <th>Payment Status</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => {
              const remaining = invoice.totalAmount - invoice.paidAmount;
              const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.paymentStatus !== 'Paid';
              
              return (
                <tr key={invoice.id} className={isOverdue ? 'bg-error bg-opacity-10' : ''}>
                  <td className="font-mono">{invoice.invoiceNumber}</td>
                  <td>{invoice.customerName}</td>
                  <td>{invoice.invoiceDate}</td>
                  <td>
                    {invoice.dueDate}
                    {isOverdue && <Clock className="inline w-4 h-4 ml-2 text-error" />}
                  </td>
                  <td className="font-semibold">${invoice.totalAmount.toFixed(2)}</td>
                  <td className="text-success">${invoice.paidAmount.toFixed(2)}</td>
                  <td className="text-warning">${remaining.toFixed(2)}</td>
                  <td>
                    <span className={getPaymentStatusBadge(invoice.paymentStatus)}>
                      {invoice.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadge(invoice.status)}>{invoice.status}</span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {invoice.status === 'Draft' && (
                        <button
                          className="btn btn-xs btn-info"
                          onClick={() => handleSendInvoice(invoice.id!)}
                        >
                          Send
                        </button>
                      )}
                      {invoice.paymentStatus !== 'Paid' && invoice.status !== 'Cancelled' && (
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowPaymentModal(true);
                          }}
                        >
                          Record Payment
                        </button>
                      )}
                      {invoice.status !== 'Cancelled' && invoice.status !== 'Paid' && (
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleCancelInvoice(invoice.id!)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Record Payment</h3>
            <div className="mb-4">
              <p className="text-sm opacity-70">Invoice: {selectedInvoice.invoiceNumber}</p>
              <p className="text-sm opacity-70">Customer: {selectedInvoice.customerName}</p>
              <p className="text-lg font-semibold mt-2">
                Outstanding: ${(selectedInvoice.totalAmount - selectedInvoice.paidAmount).toFixed(2)}
              </p>
            </div>
            <div className="form-control mb-4">
              <label className="label">Payment Amount</label>
              <input
                type="number"
                step="0.01"
                className="input input-bordered"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter payment amount"
              />
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentAmount('');
                  setSelectedInvoice(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleRecordPayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal - Simplified version */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Create New Invoice</h3>
            <p className="text-sm opacity-70 mb-4">
              For full invoice creation with line items, use the manual entry form or generate from a Sales Order.
            </p>
            <div className="alert alert-info">
              <FileText className="w-6 h-6" />
              <span>Invoice creation UI coming soon. Use Sales Order generation or API for now.</span>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
