'use client';

import { useState, useEffect } from 'react';
import { Clock, DollarSign, Package, CheckCircle2, XCircle } from 'lucide-react';

interface SalesOrderLine {
  id?: number;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface SalesOrder {
  id?: number;
  orderNumber?: string;
  customerId: number;
  customerName: string;
  projectId?: number;
  orderDate: string;
  deliveryDate?: string;
  totalAmount: number;
  currency: string;
  status: string;
  notes?: string;
  items: SalesOrderLine[];
  createdAt?: string;
}

export default function SalesOrdersPage() {
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState<SalesOrder>({
    customerId: 0,
    customerName: '',
    orderDate: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    currency: 'USD',
    status: 'Draft',
    items: []
  });
  
  const [lineItem, setLineItem] = useState<SalesOrderLine>({
    productName: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    subtotal: 0
  });

  const fetchSalesOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sales-orders');
      const data = await response.json();
      setSalesOrders(data);
    } catch (error) {
      console.error('Error fetching sales orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/sales-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchSalesOrders();
        setFormData({
          customerId: 0,
          customerName: '',
          orderDate: new Date().toISOString().split('T')[0],
          totalAmount: 0,
          currency: 'USD',
          status: 'Draft',
          items: []
        });
      }
    } catch (error) {
      console.error('Error creating sales order:', error);
    }
  };

  const handleAddLineItem = () => {
    const subtotal = lineItem.quantity * lineItem.unitPrice;
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...lineItem, subtotal }],
      totalAmount: prev.totalAmount + subtotal
    }));
    setLineItem({
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      subtotal: 0
    });
  };

  const handleRemoveLineItem = (index: number) => {
    const removedItem = formData.items[index];
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
      totalAmount: prev.totalAmount - removedItem.subtotal
    }));
  };

  const handleConfirmOrder = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/sales-orders/${id}/confirm`, {
        method: 'POST'
      });
      fetchSalesOrders();
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  const handleCancelOrder = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/sales-orders/${id}/cancel`, {
        method: 'POST'
      });
      fetchSalesOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const filteredOrders = salesOrders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalDraft = salesOrders.filter(o => o.status === 'Draft').length;
  const totalConfirmed = salesOrders.filter(o => o.status === 'Confirmed').length;
  const totalRevenue = salesOrders
    .filter(o => ['Confirmed', 'In Progress', 'Done'].includes(o.status))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const getStatusBadge = (status: string) => {
    const styles = {
      'Draft': 'badge-ghost',
      'Confirmed': 'badge-info',
      'In Progress': 'badge-warning',
      'Done': 'badge-success',
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
                <p className="text-sm opacity-70">Total Orders</p>
                <p className="text-3xl font-bold">{salesOrders.length}</p>
              </div>
              <Package className="w-10 h-10 opacity-50" />
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Draft Orders</p>
                <p className="text-3xl font-bold">{totalDraft}</p>
              </div>
              <Clock className="w-10 h-10 opacity-50" />
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Confirmed</p>
                <p className="text-3xl font-bold">{totalConfirmed}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 opacity-50" />
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70">Total Revenue</p>
                <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by order number or customer..."
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
          <option>Draft</option>
          <option>Confirmed</option>
          <option>In Progress</option>
          <option>Done</option>
          <option>Cancelled</option>
        </select>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Sales Order
        </button>
      </div>

      {/* Sales Orders Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Order Date</th>
              <th>Delivery Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="font-mono">{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.orderDate}</td>
                <td>{order.deliveryDate || 'N/A'}</td>
                <td className="font-semibold">${order.totalAmount.toFixed(2)} {order.currency}</td>
                <td>
                  <span className={getStatusBadge(order.status)}>{order.status}</span>
                </td>
                <td>
                  <div className="flex gap-2">
                    {order.status === 'Draft' && (
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => handleConfirmOrder(order.id!)}
                      >
                        Confirm
                      </button>
                    )}
                    {order.status !== 'Cancelled' && order.status !== 'Done' && (
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleCancelOrder(order.id!)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg mb-4">Create New Sales Order</h3>
            <form onSubmit={handleSubmit}>
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">Customer Name</label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">Order Date</label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">Delivery Date</label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={formData.deliveryDate || ''}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  />
                </div>
                <div className="form-control">
                  <label className="label">Status</label>
                  <select
                    className="select select-bordered"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option>Draft</option>
                    <option>Confirmed</option>
                  </select>
                </div>
              </div>

              {/* Line Items Section */}
              <div className="divider">Line Items</div>
              
              {/* Add Line Item Form */}
              <div className="card bg-base-200 p-4 mb-4">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Product Name"
                    className="input input-bordered input-sm"
                    value={lineItem.productName}
                    onChange={(e) => setLineItem({ ...lineItem, productName: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    className="input input-bordered input-sm"
                    value={lineItem.description}
                    onChange={(e) => setLineItem({ ...lineItem, description: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    className="input input-bordered input-sm"
                    value={lineItem.quantity}
                    onChange={(e) => setLineItem({ ...lineItem, quantity: parseFloat(e.target.value) || 0 })}
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Unit Price"
                    className="input input-bordered input-sm"
                    value={lineItem.unitPrice}
                    onChange={(e) => setLineItem({ ...lineItem, unitPrice: parseFloat(e.target.value) || 0 })}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleAddLineItem}
                    disabled={!lineItem.productName || lineItem.quantity <= 0 || lineItem.unitPrice <= 0}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Line Items List */}
              {formData.items.length > 0 && (
                <div className="overflow-x-auto mb-4">
                  <table className="table table-compact w-full">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.productName}</td>
                          <td className="text-sm">{item.description}</td>
                          <td>{item.quantity}</td>
                          <td>${item.unitPrice.toFixed(2)}</td>
                          <td className="font-semibold">${item.subtotal.toFixed(2)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-xs btn-error"
                              onClick={() => handleRemoveLineItem(index)}
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-end mb-4">
                <div className="text-right">
                  <p className="text-sm opacity-70">Total Amount</p>
                  <p className="text-2xl font-bold">${formData.totalAmount.toFixed(2)} {formData.currency}</p>
                </div>
              </div>

              {/* Notes */}
              <div className="form-control mb-4">
                <label className="label">Notes</label>
                <textarea
                  className="textarea textarea-bordered"
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="modal-action">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formData.items.length === 0}>
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
