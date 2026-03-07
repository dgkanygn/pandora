import { HiShoppingCart, HiTag, HiDocumentText, HiClipboardList, HiLocationMarker } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import OrderStatsWidget from '../../components/OrderStatsWidget';

const cards = [
    {
        title: 'Sipariş Yönetimi',
        path: '/orders',
        icon: HiClipboardList,
        bgClass: 'bg-green-50',
        textClass: 'text-green-600',
        hoverBgClass: 'group-hover:bg-green-600',
        hoverTextClass: 'group-hover:text-white',
    },
    {
        title: 'Ürün Yönetimi',
        path: '/products',
        icon: HiShoppingCart,
        bgClass: 'bg-indigo-50',
        textClass: 'text-indigo-600',
        hoverBgClass: 'group-hover:bg-indigo-600',
        hoverTextClass: 'group-hover:text-white',
    },
    {
        title: 'Kategori Yönetimi',
        path: '/categories',
        icon: HiTag,
        bgClass: 'bg-purple-50',
        textClass: 'text-purple-600',
        hoverBgClass: 'group-hover:bg-purple-600',
        hoverTextClass: 'group-hover:text-white',
    },
    {
        title: 'Semt Yönetimi',
        path: '/neighborhoods',
        icon: HiLocationMarker,
        bgClass: 'bg-blue-50',
        textClass: 'text-blue-600',
        hoverBgClass: 'group-hover:bg-blue-600',
        hoverTextClass: 'group-hover:text-white',
    },
    {
        title: 'Blog Yönetimi',
        path: '/blog',
        icon: HiDocumentText,
        bgClass: 'bg-orange-50',
        textClass: 'text-orange-600',
        hoverBgClass: 'group-hover:bg-orange-600',
        hoverTextClass: 'group-hover:text-white',
    }
];

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Mağaza yönetimine hoş geldiniz.</p>
            </div>

            {/* Order Stats Widget */}
            <OrderStatsWidget />

            {/* Quick Access */}
            <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Hızlı Erişim</h2>
                <div className="flex flex-wrap gap-3">
                    {cards.map((card, index) => (
                        <Link
                            key={index}
                            to={card.path}
                            className={`group flex items-center gap-2.5 rounded-xl bg-white border border-gray-100 px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer`}
                        >
                            <div className={`flex-shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-lg ${card.bgClass} ${card.textClass} transition-all duration-200 ${card.hoverBgClass} ${card.hoverTextClass}`}>
                                <card.icon className="h-4.5 w-4.5" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{card.title}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
