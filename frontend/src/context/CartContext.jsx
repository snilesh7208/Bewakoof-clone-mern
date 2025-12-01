import { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import AuthContext from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState({ items: [] });

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart({ items: [] });
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const { data } = await API.get('/cart');
            setCart(data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = async (productId, quantity, size) => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        try {
            const { data } = await API.post('/cart/add', { productId, quantity, size });
            setCart(data);
            toast.success('Added to cart!');
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const { data } = await API.delete(`/cart/remove/${itemId}`);
            setCart(data);
            toast.success('Removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
