import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await API.get('/orders/admin');
            setOrders(data);
        } catch (error) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await API.put(`/orders/${orderId}/status`, { status: newStatus });
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
            toast.success(`Order status updated to ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Order ID</th>
                            <th className="px-6 py-3 font-medium text-gray-500">User</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Total</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Payment</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="px-6 py-4 font-mono text-sm">#{order._id.slice(-6).toUpperCase()}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{order.user?.name || 'Unknown'}</div>
                                    <div className="text-sm text-gray-500">{order.user?.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-medium">₹{order.totalAmount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                        className={`text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary ${order.status === 'delivered' ? 'text-green-600 border-green-200 bg-green-50' :
                                                order.status === 'cancelled' ? 'text-red-600 border-red-200 bg-red-50' :
                                                    'text-yellow-600 border-yellow-200 bg-yellow-50'
                                            }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="packed">Packed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="out for delivery">Out for Delivery</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-gray-600 hover:text-primary">
                                        <FaEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;
