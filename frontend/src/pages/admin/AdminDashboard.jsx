import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { FaUser, FaShoppingBag, FaMoneyBillWave, FaBox } from 'react-icons/fa';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await API.get('/admin/stats');
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-4 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <FaUser size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-4 rounded-full bg-green-100 text-green-600 mr-4">
                        <FaShoppingBag size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Orders</p>
                        <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-4 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Revenue</p>
                        <h3 className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                    <div className="p-4 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <FaBox size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Products</p>
                        <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link to="/admin/products" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                    <h3 className="text-xl font-bold mb-2">Manage Products</h3>
                    <p className="text-gray-600">Add, edit, or delete products and manage stock.</p>
                </Link>
                <Link to="/admin/orders" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                    <h3 className="text-xl font-bold mb-2">Manage Orders</h3>
                    <p className="text-gray-600">View orders and update delivery status.</p>
                </Link>
                <Link to="/admin/users" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                    <h3 className="text-xl font-bold mb-2">Manage Users</h3>
                    <p className="text-gray-600">View users, change roles, or block access.</p>
                </Link>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-bold">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stats.recentOrders?.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order._id.slice(-6).toUpperCase()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{order.user?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">₹{order.totalAmount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <Link to={`/admin/orders/${order._id}`} className="text-primary hover:text-yellow-600">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
