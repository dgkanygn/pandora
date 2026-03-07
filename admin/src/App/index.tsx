import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { SidebarProvider } from '../context/SidebarContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Categories from '../pages/Categories';
import Products from '../pages/Products';
import Blog from '../pages/Blog';
import Orders from '../pages/Orders';
import Neighborhoods from '../pages/Neighborhoods';
import Hero from '../pages/Hero';
import Contact from '../pages/Contact';
import About from '../pages/About';


export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SidebarProvider>
                    <Toaster position="top-right" />
                    <Routes>
                        {/* Public Route */}
                        <Route path="/login" element={<Login />} />

                        {/* Protected Routes */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<Dashboard />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="categories" element={<Categories />} />
                            <Route path="products" element={<Products />} />
                            <Route path="blog" element={<Blog />} />
                            <Route path="neighborhoods" element={<Neighborhoods />} />
                            <Route path="hero" element={<Hero />} />
                            <Route path="about" element={<About />} />
                            <Route path="contact" element={<Contact />} />
                        </Route>
                    </Routes>
                </SidebarProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
