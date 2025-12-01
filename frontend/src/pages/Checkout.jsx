import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import API from '../api/axios';
import AuthContext from '../context/AuthContext';

const Checkout = () => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [address, setAddress] = useState('');
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const { data } = await API.get('/addresses');
            setAddresses(data);
            if (data.length > 0) {
                setAddress(data[0]._id);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error('Failed to fetch addresses');
        }
    };

    const validItems = cart.items?.filter(item => item.product) || [];

    const subtotal = validItems.reduce((acc, item) => {
        const price = item.product.discountPrice || item.product.price;
        return acc + price * item.quantity;
    }, 0);

    const amountAfterDiscount = subtotal - couponDiscount;
    const gst = amountAfterDiscount * 0.18;
    const deliveryCharges = subtotal >= 999 ? 0 : 99;
    const totalAmount = amountAfterDiscount + gst + deliveryCharges;

    const applyCoupon = async () => {
        if (!couponCode) {
            toast.error('Please enter a coupon code');
            return;
        }
        try {
            const { data } = await API.post('/orders/apply-coupon', {
                code: couponCode,
                orderAmount: subtotal
            });
            setCouponDiscount(data.discount);
            toast.success('Coupon applied successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid coupon');
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (!address) {
            toast.error('Please select a delivery address');
            return;
        }

        if (paymentMethod === 'Card') {
            if (!stripe || !elements) {
                toast.error('Payment system is initializing. Please try again in a moment.');
                return;
            }

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                toast.error('Card element not found. Please refresh the page.');
                return;
            }
        }

        setLoading(true);

        try {
            let paymentMethodId = null;

            if (paymentMethod === 'Card') {
                try {
                    const cardElement = elements.getElement(CardElement);
                    const { error, paymentMethod: pm } = await stripe.createPaymentMethod({
                        type: 'card',
                        card: cardElement,
                    });

                    if (error) {
                        toast.error(error.message);
                        setLoading(false);
                        return;
                    }

                    paymentMethodId = pm.id;
                } catch (stripeError) {
                    toast.error('Card processing failed: ' + stripeError.message);
                    setLoading(false);
                    return;
                }
            }

            // Find the selected address object
            const selectedAddress = addresses.find(addr => addr._id === address);

            if (!selectedAddress) {
                toast.error('Address not found');
                setLoading(false);
                return;
            }

            // Map address fields from Address model to Order model format
            const orderAddress = {
                name: selectedAddress.name,
                phone: selectedAddress.phone,
                street: selectedAddress.addressLine1 + (selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''),
                city: selectedAddress.city,
                state: selectedAddress.state,
                pincode: selectedAddress.pincode,
                country: selectedAddress.country || 'India'
            };

            const orderData = {
                items: validItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    size: item.size,
                    price: item.product.discountPrice || item.product.price
                })),
                address: orderAddress,
                paymentMethod,
                paymentMethodId,
                couponCode: couponCode || undefined
            };

            console.log('Sending order data:', orderData);

            const { data } = await API.post('/orders/checkout', orderData);

            // Clear cart after successful order
            clearCart();

            toast.success('Order placed successfully!');
            navigate(`/orders`);
        } catch (error) {
            console.error('Checkout error:', error.response?.data || error);
            toast.error(error.response?.data?.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (validItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <button
                    onClick={() => navigate('/products')}
                    className="bg-primary px-6 py-2 rounded hover:bg-yellow-400"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Delivery Address</h2>
                            {addresses.length > 0 ? (
                                <div>
                                    <select
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        {addresses.map(addr => (
                                            <option key={addr._id} value={addr._id}>
                                                {addr.name} - {addr.addressLine1}, {addr.city} - {addr.pincode}
                                            </option>
                                        ))}
                                    </select>
                                    {address && addresses.find(a => a._id === address) && (
                                        <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                                            <p className="text-sm text-gray-900">
                                                <strong>{addresses.find(a => a._id === address)?.name}</strong><br />
                                                {addresses.find(a => a._id === address)?.addressLine1}
                                                {addresses.find(a => a._id === address)?.addressLine2 && <>, {addresses.find(a => a._id === address)?.addressLine2}</>}
                                                <br />
                                                {addresses.find(a => a._id === address)?.city}, {addresses.find(a => a._id === address)?.state} - {addresses.find(a => a._id === address)?.pincode}
                                                <br />
                                                📞 {addresses.find(a => a._id === address)?.phone}
                                            </p>
                                        </div>
                                    )}
                                    <a href="/profile" className="text-primary font-semibold text-sm mt-3 inline-block hover:underline">+ Add Another Address</a>
                                </div>
                            ) : (
                                <p className="text-gray-600 mb-4">No addresses saved yet</p>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Payment Method</h2>
                            <div className="space-y-3">
                                {stripe && (
                                    <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition" style={{ borderColor: paymentMethod === 'Card' ? '#FCD34D' : '#E5E7EB' }}>
                                        <input
                                            type="radio"
                                            value="Card"
                                            checked={paymentMethod === 'Card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="w-4 h-4"
                                        />
                                        <span className="ml-3 font-semibold text-gray-900">Credit/Debit Card</span>
                                    </label>
                                )}
                                <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary transition" style={{ borderColor: paymentMethod === 'COD' ? '#FCD34D' : '#E5E7EB' }}>
                                    <input
                                        type="radio"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4"
                                    />
                                    <span className="ml-3 font-semibold text-gray-900">Cash on Delivery</span>
                                </label>
                            </div>
                            {!stripe && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                                    ℹ️ Card payments are not available. Use Cash on Delivery.
                                </div>
                            )}
                        </div>

                        {/* Card Details - Only show if Card selected */}
                        {paymentMethod === 'Card' && (
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="text-xl font-bold mb-4 text-gray-900">Card Details</h2>
                                {!stripe || !elements ? (
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                                        Loading payment system... Please wait.
                                    </div>
                                ) : (
                                    <CardElement
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: '16px',
                                                    color: '#424770',
                                                    '::placeholder': {
                                                        color: '#aab7c4',
                                                    },
                                                },
                                                invalid: {
                                                    color: '#9e2146',
                                                },
                                            },
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {/* Coupon */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">Promo Code</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter promo code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button
                                    onClick={applyCoupon}
                                    className="bg-primary px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
                                >
                                    Apply
                                </button>
                            </div>
                            {couponDiscount > 0 && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                                    ✓ Discount of ₹{couponDiscount.toFixed(2)} applied!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="bg-white rounded-lg p-6 shadow-sm h-fit">
                        <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>

                        {/* Items List */}
                        <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                            {validItems.map(item => (
                                <div key={item._id} className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-sm">{item.product.name}</p>
                                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        ₹{((item.product.discountPrice || item.product.price) * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            {couponDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{couponDiscount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>GST (18%)</span>
                                <span>₹{gst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Delivery</span>
                                <span className="font-semibold text-gray-900">{deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}</span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
                        </div>

                        {/* Place Order Button */}
                        <button
                            onClick={handleCheckout}
                            disabled={loading || !address}
                            className="w-full bg-primary py-3 rounded-lg font-bold text-black hover:bg-yellow-400 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Processing Order...' : 'Place Order'}
                        </button>

                        {/* Security Badge */}
                        <div className="mt-4 p-3 bg-gray-50 rounded text-center text-xs text-gray-600">
                            🔒 Your payment information is secure
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
