import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { FaBox, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, delivered, cancelled

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/orders/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                setOrders([]);
                console.error('Orders data is not an array:', data);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return <FaCheckCircle className="text-green-500" />;
            case 'shipped':
            case 'out for delivery':
                return <FaTruck className="text-blue-500" />;
            case 'cancelled':
                return <FaTimesCircle className="text-red-500" />;
            default:
                return <FaBox className="text-yellow-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
            case 'out for delivery':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'confirmed':
            case 'packed':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status.toLowerCase() === filter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>

            {/* Filter Tabs */}
            <div className="flex space-x-4 mb-6 border-b">
                <button
                    onClick={() => setFilter('all')}
                    className={`pb-2 px-4 font-medium ${filter === 'all' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
                >
                    All Orders ({orders.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`pb-2 px-4 font-medium ${filter === 'pending' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter('delivered')}
                    className={`pb-2 px-4 font-medium ${filter === 'delivered' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
                >
                    Delivered
                </button>
                <button
                    onClick={() => setFilter('cancelled')}
                    className={`pb-2 px-4 font-medium ${filter === 'cancelled' ? 'border-b-2 border-primary text-primary' : 'text-gray-600'}`}
                >
                    Cancelled
                </button>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                    <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Orders Found</h2>
                    <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
                    <a href="/products" className="bg-primary text-black px-6 py-3 rounded-md font-semibold hover:bg-yellow-500 transition">
                        Start Shopping
                    </a>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
                                <div>
                                    <p className="text-sm text-gray-600">Order ID: <span className="font-semibold text-gray-800">#{order._id.slice(-8).toUpperCase()}</span></p>
                                    <p className="text-sm text-gray-600">Placed on: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(order.status)}
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="px-6 py-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 py-3 border-b last:border-b-0">
                                        <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                                            {item.product && item.product.images && item.product.images.length > 0 ? (
                                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaBox className="text-gray-400 text-2xl" />
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-semibold text-gray-800">
                                                {item.product ? item.product.name : 'Product Unavailable'}
                                            </h3>
                                            <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                                            <p className="text-sm font-semibold text-gray-800">₹{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Footer */}
                            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="text-2xl font-bold text-gray-800">₹{order.totalAmount}</p>
                                </div>
                                <div className="flex space-x-3">
                                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-100 transition">
                                        View Details
                                    </button>
                                    {order.status.toLowerCase() === 'delivered' && (
                                        <button className="px-4 py-2 bg-primary text-black rounded-md text-sm font-semibold hover:bg-yellow-500 transition">
                                            Download Invoice
                                        </button>
                                    )}
                                    {['pending', 'confirmed'].includes(order.status.toLowerCase()) && (
                                        <button className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition">
                                            Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
