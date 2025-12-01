import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import About from './pages/About';
import MyOrders from './pages/MyOrders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/orders" element={<MyOrders />} />
              </Routes>
            </main>
            <footer className="bg-gray-800 text-white py-8">
              <div className="container mx-auto px-4 text-center">
                <p>&copy; 2023 Bewakoof Clone. All rights reserved.</p>
              </div>
            </footer>
          </div>
          <ToastContainer position="bottom-right" />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
