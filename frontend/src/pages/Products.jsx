import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Link, useLocation } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = '/products';
                if (categoryParam) {
                    url += `?category=${categoryParam}`;
                }
                const { data } = await API.get(url);
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [categoryParam]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">{categoryParam || 'All Products'}</h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Link key={product._id} to={`/product/${product._id}`} className="group">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition">
                                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8 relative">
                                    <img
                                        src={product.images[0] || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="h-64 w-full object-cover object-center group-hover:opacity-75"
                                    />
                                    {product.stock <= 0 && (
                                        <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">Out of Stock</div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm text-gray-700 font-medium truncate">{product.name}</h3>
                                    <p className="mt-1 text-xs text-gray-500">{product.category}</p>
                                    <div className="mt-2 flex items-center space-x-2">
                                        <p className="text-lg font-bold text-gray-900">₹{product.discountPrice || product.price}</p>
                                        {product.discountPrice && (
                                            <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
                                        )}
                                        {product.discountPrice && (
                                            <p className="text-xs text-green-600 font-bold">
                                                {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
