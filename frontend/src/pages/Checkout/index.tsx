import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import type { CreateOrderData, Order, Neighborhood } from '../../services/api';
import toast from 'react-hot-toast';
import { validateCheckoutForm, type CheckoutFormErrors } from './utils/validationSchema';
import Modal from '../../components/Modal';
import { FaExclamationTriangle } from 'react-icons/fa';

import CheckoutOrderSummary from './components/CheckoutOrderSummary';
import SenderSection from './components/SenderSection';
import DeliverySection from './components/DeliverySection';
import AdditionalOptionsSection from './components/AdditionalOptionsSection';
import BillingSection from './components/BillingSection';
import PaymentSection from './components/PaymentSection';
import OrderSuccessView from './components/OrderSuccessView';

interface CheckoutFormData {
    senderName: string;
    senderEmail: string;
    senderPhone: string;
    senderCity: string;
    senderAddress: string;
    recipientName: string;
    deliveryDate: string;
    deliveryTime: string;
    recipientPhone: string;
    deliveryAddress: string;
    flowerNote: string;
    district: string;
    deliveryNote: string;
    showNameOnCard: string;
    deliveryConfirmation: string;
    messageToFlorist: string;
    billingType: 'individual' | 'corporate';
    paymentMethod: string;
    tckn?: string;
    taxOffice?: string;
    taxNumber?: string;
    agreement: boolean;
}

const Checkout: React.FC = () => {
    const { items, clearCart } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CheckoutFormData>({
        senderName: '',
        senderEmail: '',
        senderPhone: '',
        senderCity: '',
        senderAddress: '',
        recipientName: '',
        deliveryDate: '',
        flowerNote: '',
        deliveryTime: '',
        recipientPhone: '',
        deliveryAddress: '',
        district: '',
        deliveryNote: '',
        showNameOnCard: 'no',
        deliveryConfirmation: 'no',
        messageToFlorist: '',
        billingType: 'individual',
        paymentMethod: 'credit_card',
        agreement: false
    });

    const [errors, setErrors] = useState<CheckoutFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
    const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
    const [orderError, setOrderError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNeighborhoods = async () => {
            try {
                const data = await api.neighborhoods.getAll();
                setNeighborhoods(data);
            } catch (error) {
                console.error('Failed to fetch neighborhoods:', error);
                toast.error('Semt bilgileri yüklenemedi.');
            }
        };
        fetchNeighborhoods();
    }, []);

    useEffect(() => {
        // Only redirect if cart is empty AND no completed order
        if (items.length === 0 && !completedOrder) {
            navigate('/cart');
            toast.error('Sepetiniz boş.');
        }
    }, [items, navigate, completedOrder]);

    // Pre-fill sender info from user data
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                senderName: user.username || '',
                senderEmail: user.email || '',
                senderPhone: user.phone || ''
            }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear the error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Yup Validation
        const validationErrors = await validateCheckoutForm(formData as unknown as Record<string, unknown>);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Lütfen formdaki hataları düzeltiniz.');
            // Scroll to first error
            const firstErrorField = Object.keys(validationErrors)[0];
            const element = document.querySelector(`[name="${firstErrorField}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            // Prepare order items
            const orderItems = items.map(item => ({
                product_id: item.id,
                product_name: item.name,
                price: item.price,
                quantity: item.quantity
            }));

            // Get neighborhood/district info
            const selectedNeighborhood = neighborhoods.find(n => n.id.toString() === formData.district);

            // Prepare order data for API
            const orderData: CreateOrderData = {
                address: formData.deliveryAddress,
                items: orderItems,
                customer_name: formData.senderName,
                customer_email: formData.senderEmail,
                customer_phone: formData.senderPhone,
                customer_city: formData.senderCity,
                customer_address: formData.senderAddress,
                receiver_name: formData.recipientName,
                delivery_date: formData.deliveryDate,
                delivery_time_slot: formData.deliveryTime,
                receiver_phone: formData.recipientPhone,
                city: 'Eskişehir',
                district: selectedNeighborhood?.name || formData.district,
                delivery_note: formData.deliveryNote,
                show_name_on_card: formData.showNameOnCard === 'yes',
                delivery_confirmation: formData.deliveryConfirmation === 'yes',
                user_message: formData.messageToFlorist,
                invoice_type: formData.billingType,
                payment_method: formData.paymentMethod,
                tckn: formData.billingType === 'individual' ? formData.tckn : undefined,
                tax_office: formData.billingType === 'corporate' ? formData.taxOffice : undefined,
                tax_number: formData.billingType === 'corporate' ? formData.taxNumber : undefined,
                contract_accepted: formData.agreement,
                flower_note: formData.flowerNote
            };

            // Create order via API
            const order = await api.orders.create(orderData, token || undefined);

            toast.success('Siparişiniz başarıyla alındı!');
            setCompletedOrder(order);
            clearCart();
        } catch (error: unknown) {
            console.error('Order creation error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Sipariş oluşturulurken bir hata oluştu.';
            setOrderError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show nothing while redirecting
    if (items.length === 0 && !completedOrder) return null;

    // Show success view if order is completed
    if (completedOrder) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex flex-col">
                <Navbar />
                <OrderSuccessView order={completedOrder} />
                <Footer />
            </div>
        );
    }

    const shippingCost = parseFloat((neighborhoods.find(n => n.id.toString() === formData.district)?.price || 0).toString());

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 pt-32 flex-grow">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Ödeme İşlemleri</h1>

                {/* Two Column Layout */}
                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    {/* Left Column - Form */}
                    <div className="flex-1 lg:max-w-2xl">
                        <form onSubmit={handleSubmit}>
                            <SenderSection formData={formData} handleChange={handleChange} errors={errors} />
                            <DeliverySection formData={formData} handleChange={handleChange} errors={errors} neighborhoods={neighborhoods} />
                            <AdditionalOptionsSection formData={formData} handleChange={handleChange} errors={errors} />
                            <BillingSection formData={formData} handleChange={handleChange} errors={errors} />
                            <PaymentSection formData={formData} handleChange={handleChange} errors={errors} />

                            {/* Agreement & Support */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="agreement"
                                        checked={formData.agreement}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500 border-gray-300 transition cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600">
                                        <a href="/distance-sales-contract" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 hover:underline cursor-pointer">Mesafeli Satış Sözleşmesi</a>'ni okudum, kabul ediyorum.
                                    </span>
                                </label>
                                {errors.agreement && (
                                    <p className="text-red-500 text-xs mt-2">{errors.agreement}</p>
                                )}
                            </div>

                            {/* Submit Button - Mobile Only */}
                            <div className="lg:hidden">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.agreement}
                                    className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition transform hover:-translate-y-1 cursor-pointer ${isSubmitting || !formData.agreement
                                        ? 'bg-gray-400 cursor-not-allowed transform-none'
                                        : 'bg-pink-600 hover:bg-pink-700'
                                        }`}
                                >
                                    {isSubmitting ? 'İşleniyor...' : `Ödemeyi Tamamla`}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Order Summary (Sticky) */}
                    <div className="lg:w-96">
                        <div className="lg:sticky lg:top-28">
                            <CheckoutOrderSummary shippingCost={shippingCost} />

                            {/* Submit Button - Desktop Only */}
                            <div className="hidden lg:block">
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !formData.agreement}
                                    className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition transform hover:-translate-y-1 cursor-pointer ${isSubmitting || !formData.agreement
                                        ? 'bg-gray-400 cursor-not-allowed transform-none'
                                        : 'bg-pink-600 hover:bg-pink-700'
                                        }`}
                                >
                                    {isSubmitting ? 'İşleniyor...' : `Ödemeyi Tamamla`}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Order Error Modal */}
            <Modal
                isOpen={orderError !== null}
                onClose={() => setOrderError(null)}
                title="Sipariş Oluşturulamadı"
            >
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <FaExclamationTriangle className="text-red-500" size={28} />
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed">{orderError}</p>
                    <button
                        onClick={() => setOrderError(null)}
                        className="mt-2 px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl transition cursor-pointer"
                    >
                        Tamam
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Checkout;
