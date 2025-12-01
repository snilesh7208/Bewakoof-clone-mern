import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary">
                    <span className="text-black">Bewakoof</span><span className="text-yellow-400">.clone</span>
                </Link>

                <div className="hidden md:flex space-x-6 font-medium text-gray-700">
                    <Link to="/products?category=Men" className="hover:text-primary transition">Men</Link>
                    <Link to="/products?category=Women" className="hover:text-primary transition">Women</Link>
                    <Link to="/products?category=Mobile Covers" className="hover:text-primary transition">Mobile Covers</Link>
                    <Link to="/about" className="hover:text-primary transition">About Us</Link>
                    <Link to="/contact" className="hover:text-primary transition">Contact Us</Link>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search by product, category or collection"
                            className="bg-gray-100 rounded-md px-4 py-2 pl-10 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
                    </div>

                    <div className="flex items-center space-x-4 text-xl">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-1 hover:text-primary"
                                >
                                    <FaUser />
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 border border-gray-100 z-10">
                                        <div className="px-4 py-2 border-b text-sm text-gray-600">Hello, {user.name}</div>
                                        {user.role === 'admin' && (
                                            <Link to="/admin/dashboard" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-primary">Admin Dashboard</Link>
                                        )}
                                        <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 hover:bg-gray-50 text-sm">My Profile</Link>
                                        <Link to="/orders" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 hover:bg-gray-50 text-sm">My Orders</Link>
                                        <button onClick={() => { logout(); setIsProfileOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-500">Logout</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-semibold hover:text-primary">Login</Link>
                        )}

                        <Link to="/cart" className="relative hover:text-primary">
                            <FaShoppingCart />
                            {cart?.items?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cart.items.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
