import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import API from '../api/axios';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('info');
    const [addresses, setAddresses] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        addressType: 'Home',
        isDefault: false
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchAddresses();
    }, [user, navigate]);

    const fetchAddresses = async () => {
        try {
            const { data } = await API.get('/addresses');
            setAddresses(data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error('Failed to fetch addresses');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
            toast.error('Please fill all required fields');
            return;
        }

        // Validate phone number
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            toast.error('Phone number must be 10 digits');
            return;
        }

        // Validate pincode
        if (!/^[0-9]{6}$/.test(formData.pincode)) {
            toast.error('Pincode must be 6 digits');
            return;
        }

        try {
            if (editingId) {
                await API.put(`/addresses/${editingId}`, formData);
                toast.success('Address updated successfully');
            } else {
                const response = await API.post('/addresses', formData);
                console.log('Address created:', response.data);
                toast.success('Address added successfully');
            }
            resetForm();
            fetchAddresses();
        } catch (error) {
            console.error('Error saving address:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Error saving address';
            toast.error(errorMsg);
        }
    };

    const handleEdit = (address) => {
        setFormData(address);
        setEditingId(address._id);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        try {
            await API.delete(`/addresses/${id}`);
            toast.success('Address deleted successfully');
            fetchAddresses();
        } catch (error) {
            toast.error('Error deleting address');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            addressLine1: '',
            addressLine2: '',
            landmark: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
            addressType: 'Home',
            isDefault: false
        });
        setEditingId(null);
        setShowAddForm(false);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex flex-col space-y-2">
                            <button
                                onClick={() => setActiveTab('info')}
                                className={`text-left px-4 py-2 rounded ${activeTab === 'info' ? 'bg-primary text-black font-bold' : 'hover:bg-gray-100'}`}
                            >
                                Personal Info
                            </button>
                            <button
                                onClick={() => setActiveTab('addresses')}
                                className={`text-left px-4 py-2 rounded ${activeTab === 'addresses' ? 'bg-primary text-black font-bold' : 'hover:bg-gray-100'}`}
                            >
                                Addresses
                            </button>
                            <button
                                onClick={() => navigate('/orders')}
                                className="text-left px-4 py-2 rounded hover:bg-gray-100"
                            >
                                My Orders
                            </button>
                            <button
                                onClick={logout}
                                className="text-left px-4 py-2 rounded hover:bg-red-50 text-red-600 font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3">
                    {activeTab === 'info' && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <p className="mt-1 text-gray-900">{user.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <p className="mt-1 text-gray-900">{user.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                                    <p className="mt-1 text-gray-900">{user.mobile || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Account Type</label>
                                    <p className="mt-1 text-gray-900 capitalize">{user.role || 'User'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'addresses' && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">My Addresses</h2>
                                {!showAddForm && (
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="bg-primary px-4 py-2 rounded font-semibold hover:bg-yellow-400 flex items-center gap-2"
                                    >
                                        <FaPlus /> Add Address
                                    </button>
                                )}
                            </div>

                            {/* Add/Edit Form */}
                            {showAddForm && (
                                <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 rounded bg-gray-50">
                                    <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full border rounded px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Phone (10 digits) *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="9876543210"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Street Address *</label>
                                            <input
                                                type="text"
                                                name="addressLine1"
                                                value={formData.addressLine1}
                                                onChange={handleInputChange}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="Building number, street name"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Apartment/House Number</label>
                                            <input
                                                type="text"
                                                name="addressLine2"
                                                value={formData.addressLine2}
                                                onChange={handleInputChange}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Landmark/Reference</label>
                                            <input
                                                type="text"
                                                name="landmark"
                                                value={formData.landmark}
                                                onChange={handleInputChange}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">City *</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full border rounded px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">State *</label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full border rounded px-3 py-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Pincode (6 digits) *</label>
                                            <input
                                                type="text"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                className="w-full border rounded px-3 py-2"
                                                placeholder="110001"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Country</label>
                                            <input
                                                type="text"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                className="w-full border rounded px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Address Type</label>
                                            <select
                                                name="addressType"
                                                value={formData.addressType}
                                                onChange={handleInputChange}
                                                className="w-full border rounded px-3 py-2"
                                            >
                                                <option value="Home">Home</option>
                                                <option value="Work">Work</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="isDefault"
                                                id="isDefault"
                                                checked={formData.isDefault}
                                                onChange={handleInputChange}
                                                className="rounded"
                                            />
                                            <label htmlFor="isDefault" className="ml-2 text-sm font-medium">Set as default address</label>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            type="submit"
                                            className="bg-primary px-6 py-2 rounded font-semibold hover:bg-yellow-400"
                                        >
                                            {editingId ? 'Update' : 'Add'} Address
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="bg-gray-300 px-6 py-2 rounded font-semibold hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Address List */}
                            <div className="space-y-4">
                                {addresses.length === 0 ? (
                                    <p className="text-gray-600">No addresses saved yet. Add one to get started!</p>
                                ) : (
                                    addresses.map(address => (
                                        <div key={address._id} className="border rounded-lg p-4 hover:bg-gray-50 relative">
                                            {address.isDefault && (
                                                <span className="absolute top-2 right-2 bg-primary px-2 py-1 text-xs font-bold rounded">
                                                    DEFAULT
                                                </span>
                                            )}
                                            <p className="font-bold text-lg">{address.name}</p>
                                            <p className="text-sm text-gray-500 mb-1">{address.addressType}</p>
                                            <p className="text-gray-600">{address.addressLine1}</p>
                                            {address.addressLine2 && <p className="text-gray-600">{address.addressLine2}</p>}
                                            {address.landmark && <p className="text-gray-600">Landmark: {address.landmark}</p>}
                                            <p className="text-gray-600">{address.city}, {address.state} - {address.pincode}</p>
                                            <p className="text-gray-600">{address.country}</p>
                                            <p className="text-gray-600 font-semibold">📞 {address.phone}</p>
                                            <div className="flex gap-3 mt-3">
                                                <button
                                                    onClick={() => handleEdit(address)}
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(address._id)}
                                                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                                >
                                                    <FaTrash /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
