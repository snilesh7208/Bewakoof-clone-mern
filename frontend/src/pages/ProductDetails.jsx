import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import CartContext from '../context/CartContext';
import { FaStar, FaShoppingCart } from 'react-icons/fa';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await API.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        addToCart(product._id, 1, selectedSize);
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
                {/* Image Gallery */}
                <div className="flex flex-col-reverse">
                    <div className="w-full aspect-w-1 aspect-h-1">
                        <img
                            src={product.images[0] || 'https://via.placeholder.com/500'}
                            alt={product.name}
                            className="w-full h-full object-center object-cover rounded-lg shadow-lg"
                        />
                    </div>
                </div>

                {/* Product Info */}
                <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>

                    <div className="mt-3">
                        <h2 className="sr-only">Product information</h2>
                        <div className="flex items-center space-x-4">
                            <p className="text-3xl text-gray-900 font-bold">₹{product.discountPrice || product.price}</p>
                            {product.discountPrice && (
                                <>
                                    <p className="text-xl text-gray-500 line-through">₹{product.price}</p>
                                    <span className="text-green-600 font-bold text-lg">
                                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="sr-only">Description</h3>
                        <div className="text-base text-gray-700 space-y-6" dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>

                    <div className="mt-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm text-gray-900 font-medium">Size</h3>
                            <a href="#" className="text-sm font-medium text-primary hover:text-yellow-500">Size guide</a>
                        </div>

                        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4 mt-4">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 ${selectedSize === size ? 'border-primary ring-2 ring-primary text-primary' : 'border-gray-200 text-gray-900'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 flex sm:flex-col1">
                        <button
                            onClick={handleAddToCart}
                            className="max-w-xs flex-1 bg-primary border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary sm:w-full"
                        >
                            <FaShoppingCart className="mr-2" /> Add to Cart
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-gray-500 text-sm">100% Original Products | Free Delivery on orders above ₹500</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
