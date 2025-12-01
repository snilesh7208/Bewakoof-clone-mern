import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await API.get('/products');
            setProducts(data);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
                toast.success('Product deleted successfully');
            } catch (error) {
                toast.error('Failed to delete product');
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link to="/admin/product/new" className="bg-primary text-black px-4 py-2 rounded flex items-center gap-2 hover:bg-yellow-500">
                    <FaPlus /> Add Product
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Image</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Price</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Category</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Stock</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td className="px-6 py-4">
                                    <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                </td>
                                <td className="px-6 py-4">{product.name}</td>
                                <td className="px-6 py-4">₹{product.price}</td>
                                <td className="px-6 py-4 capitalize">{product.category}</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3">
                                        <Link to={`/admin/product/${product._id}/edit`} className="text-blue-600 hover:text-blue-800">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800">
                                            <FaTrash />
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

export default AdminProducts;
