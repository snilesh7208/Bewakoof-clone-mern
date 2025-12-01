import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import API from '../api/axios';
import AuthContext from './AuthContext';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState({ items: [] });

    const fetchCart = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await API.get('/cart');
            setCart(data || { items: [] });
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart({ items: [] });
        }
    }, [user, fetchCart]);

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

    const clearCart = () => {
        setCart({ items: [] });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export { CartContext };
