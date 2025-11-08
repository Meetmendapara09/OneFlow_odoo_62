'use client';

import { useState, useEffect } from 'react';
import { FileText, DollarSign, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface VendorBill {
  id?: number;
  billNumber?: string;
  purchaseOrderId?: number;
  vendorId: number;
  vendorName: string;
  projectId?: number;
  billDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  paymentStatus: string;
  status: string;
  notes?: string;
  createdAt?: string;
}

export default function VendorBillsPage() {
  const [bills, setBills] = useState<VendorBill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<VendorBill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBills = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/vendor-bills');
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error('Error fetching vendor bills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handlePostBill = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/vendor-bills/${id}/post`, {
        method: 'POST'
      });
      fetchBills();
    } catch (error) {
      console.error('Error posting bill:', error);
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedBill || !paymentAmount) return;
    
    try {
      await fetch(`http://localhost:8080/api/vendor-bills/${selectedBill.id}/record-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(paymentAmount) })
      });
      setShowPaymentModal(false);
      setPaymentAmount('');
      setSelectedBill(null);
      fetchBills();
    } catch (error) {
      console.error('Error recording payment:', error);
    }
  };

  const handleCancelBill = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/vendor-bills/${id}/cancel`, {
        method: 'POST'
      });
      fetchBills();
    } catch (error) {
      console.error('Error cancelling bill:', error);
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesStatus = filterStatus === 'All' || bill.paymentStatus === filterStatus;
    const matchesSearch = bill.billNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          bill.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalBilled = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const totalPaid = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
  const totalOutstanding = totalBilled - totalPaid;
  const overdueCount = bills.filter(bill => {
    const dueDate = new Date(bill.dueDate);
    return bill.paymentStatus !== 'Paid' && dueDate < new Date();
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
      'Posted': 'badge-info',
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
                <p className="text-sm opacity-70">Total Billed</p>
                <p className="text-3xl font-bold">${totalBilled.toFixed(2)}</p>
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
          placeholder="Search by bill number or vendor..."
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
      </div>

      {/* Vendor Bills Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Bill #</th>
              <th>Vendor</th>
              <th>Bill Date</th>
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
            {filteredBills.map((bill) => {
              const remaining = bill.totalAmount - bill.paidAmount;
              const isOverdue = new Date(bill.dueDate) < new Date() && bill.paymentStatus !== 'Paid';
              
              return (
                <tr key={bill.id} className={isOverdue ? 'bg-error bg-opacity-10' : ''}>
                  <td className="font-mono">{bill.billNumber}</td>
                  <td>{bill.vendorName}</td>
                  <td>{bill.billDate}</td>
                  <td>
                    {bill.dueDate}
                    {isOverdue && <Clock className="inline w-4 h-4 ml-2 text-error" />}
                  </td>
                  <td className="font-semibold">${bill.totalAmount.toFixed(2)}</td>
                  <td className="text-success">${bill.paidAmount.toFixed(2)}</td>
                  <td className="text-warning">${remaining.toFixed(2)}</td>
                  <td>
                    <span className={getPaymentStatusBadge(bill.paymentStatus)}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadge(bill.status)}>{bill.status}</span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {bill.status === 'Draft' && (
                        <button
                          className="btn btn-xs btn-info"
                          onClick={() => handlePostBill(bill.id!)}
                        >
                          Post
                        </button>
                      )}
                      {bill.paymentStatus !== 'Paid' && bill.status !== 'Cancelled' && (
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => {
                            setSelectedBill(bill);
                            setShowPaymentModal(true);
                          }}
                        >
                          Pay
                        </button>
                      )}
                      {bill.status !== 'Cancelled' && bill.status !== 'Paid' && (
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleCancelBill(bill.id!)}
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
      {showPaymentModal && selectedBill && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Record Payment</h3>
            <div className="mb-4">
              <p className="text-sm opacity-70">Bill: {selectedBill.billNumber}</p>
              <p className="text-sm opacity-70">Vendor: {selectedBill.vendorName}</p>
              <p className="text-lg font-semibold mt-2">
                Outstanding: ${(selectedBill.totalAmount - selectedBill.paidAmount).toFixed(2)}
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
                  setSelectedBill(null);
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
    </div>
  );
}
