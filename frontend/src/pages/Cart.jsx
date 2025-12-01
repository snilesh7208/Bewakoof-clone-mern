import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const Cart = () => {
    const { cart, removeFromCart } = useContext(CartContext);

    const validItems = cart.items?.filter(item => item.product) || [];

    const totalAmount = validItems.reduce((acc, item) => {
        const price = item.product.discountPrice || item.product.price;
        return acc + price * item.quantity;
    }, 0);

    if (!validItems.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                <Link to="/products" className="text-primary hover:underline">Continue Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                <div className="lg:col-span-7">
                    {validItems.map((item) => (
                        <div key={item._id} className="flex py-6 border-b border-gray-200">
                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                    src={item.product.images[0] || 'https://via.placeholder.com/150'}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover object-center"
                                />
                            </div>

                            <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                            <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                                        </h3>
                                        <p className="ml-4">₹{(item.product.discountPrice || item.product.price) * item.quantity}</p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                                    <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">Qty {item.quantity}</p>

                                    <div className="flex">
                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item._id)}
                                            className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                        >
                                            <FaTrash className="mr-1" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                    <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <div className="text-base font-medium text-gray-900">Order Total</div>
                            <div className="text-base font-medium text-gray-900">₹{totalAmount}</div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            className="w-full rounded-md border border-transparent bg-primary px-4 py-3 text-base font-medium text-black shadow-sm hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-50"
                            onClick={() => alert('Checkout functionality to be implemented with Stripe')}
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
