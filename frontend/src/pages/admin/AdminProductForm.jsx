import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-toastify';

const AdminProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        discountPrice: '',
        stock: '',
        images: '',
        sizes: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const { data } = await API.get(`/products/${id}`);
            setFormData({
                ...data,
                images: data.images.join(', '), // Convert array to comma-separated string for input
                sizes: data.sizes // Keep as array
            });
        } catch (error) {
            toast.error('Failed to fetch product details');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeChange = (e) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, sizes: options }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                ...formData,
                images: formData.images.split(',').map(url => url.trim()).filter(url => url), // Convert string back to array
                price: Number(formData.price),
                discountPrice: Number(formData.discountPrice),
                stock: Number(formData.stock)
            };

            if (isEditMode) {
                await API.put(`/products/${id}`, productData);
                toast.success('Product updated successfully');
            } else {
                await API.post('/products', productData);
                toast.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
                        <input
                            type="number"
                            name="discountPrice"
                            value={formData.discountPrice}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        >
                            <option value="">Select Category</option>
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="mobile-covers">Mobile Covers</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (Hold Ctrl to select multiple)</label>
                    <select
                        multiple
                        value={formData.sizes}
                        onChange={handleSizeChange}
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none h-32"
                    >
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (Comma separated)</label>
                    <input
                        type="text"
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        required
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold py-3 rounded hover:bg-yellow-500 transition disabled:bg-gray-300"
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Create Product')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;
