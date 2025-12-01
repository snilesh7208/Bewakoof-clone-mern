import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { toast } from 'react-toastify';
import { FaUserShield, FaBan, FaUnlock } from 'react-icons/fa';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/admin/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId, currentRole) => {
        const newRole = currentRole === 'user' ? 'admin' : 'user';
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            try {
                await API.put(`/admin/users/${userId}/role`, { role: newRole });
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, role: newRole } : user
                ));
                toast.success('User role updated successfully');
            } catch (error) {
                toast.error('Failed to update user role');
            }
        }
    };

    const handleBlockToggle = async (userId, isBlocked) => {
        const action = isBlocked ? 'unblock' : 'block';
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                await API.put(`/admin/users/${userId}/block`);
                setUsers(users.map(user =>
                    user._id === userId ? { ...user, isBlocked: !isBlocked } : user
                ));
                toast.success(`User ${action}ed successfully`);
            } catch (error) {
                toast.error(`Failed to ${action} user`);
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Role</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 font-medium">{user.name}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleRoleUpdate(user._id, user.role)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Toggle Admin Role"
                                        >
                                            <FaUserShield />
                                        </button>
                                        <button
                                            onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                                            className={`${user.isBlocked ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
                                            title={user.isBlocked ? "Unblock User" : "Block User"}
                                        >
                                            {user.isBlocked ? <FaUnlock /> : <FaBan />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
