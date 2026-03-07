import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    HiHome,
    HiTag,
    HiShoppingCart,
    HiDocumentText,
    HiOutlineLogout,
    HiChevronDoubleLeft,
    HiChevronDoubleRight,
    HiUser,
    HiClipboardList,
    HiLocationMarker,
    HiPhotograph,
    HiPhone
} from 'react-icons/hi';
import { useSidebar } from '../../context/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiX } from 'react-icons/hi';

const MENU_GROUPS = [
    {
        title: 'İçerik & Katalog Yönetimi',
        items: [
            { path: '/orders', label: 'Sipariş Yönetimi', icon: HiClipboardList },
            { path: '/categories', label: 'Kategori Yönetimi', icon: HiTag },
            { path: '/products', label: 'Ürün Yönetimi', icon: HiShoppingCart },
            { path: '/blog', label: 'Blog Yönetimi', icon: HiDocumentText },
            { path: '/neighborhoods', label: 'Semt Yönetimi', icon: HiLocationMarker },
        ]
    },
    {
        title: 'Site & Görünüm Yönetimi',
        items: [
            { path: '/hero', label: 'Hero Section Yönetimi', icon: HiPhotograph },
            { path: '/about', label: 'Hakkımızda Yönetimi', icon: HiDocumentText },
            { path: '/contact', label: 'İletişim Bilgileri', icon: HiPhone },
        ]
    }
];

export default function Sidebar() {
    const { collapsed, toggleSidebar, isMobileOpen, closeMobileSidebar } = useSidebar();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const renderSidebarContent = () => (
        <div className="flex h-full flex-col bg-slate-900 text-white shadow-xl">
            {/* Logo Section with Collapse Button */}
            <div className={`flex h-20 items-center justify-between border-b border-slate-800 transition-all duration-300 ${collapsed ? 'px-2' : 'px-4'}`}>
                <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                    {/* <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
                        <span className="text-xl font-bold text-white">C</span>
                    </div> */}
                    <span className={`text-lg font-bold transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
                        Pandora Admin
                    </span>
                </div>
                {/* Collapse Button - Desktop Only */}
                <button
                    onClick={toggleSidebar}
                    className={`hidden lg:flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer ${collapsed ? 'mx-auto' : ''}`}
                    title={collapsed ? "Genişlet" : "Daralt"}
                >
                    {collapsed ? <HiChevronDoubleRight size={18} /> : <HiChevronDoubleLeft size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-6">
                {/* Dashboard Link */}
                <Link
                    to="/"
                    onClick={() => window.innerWidth < 1024 && closeMobileSidebar()}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 cursor-pointer
                        ${location.pathname === '/'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        }`}
                >
                    <HiHome size={24} className={`min-w-[24px] transition-colors ${location.pathname === '/' ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <span className={`whitespace-nowrap font-medium transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                        Dashboard
                    </span>
                    {collapsed && (
                        <div className="absolute left-full ml-2 hidden rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg group-hover:block group-hover:opacity-100 z-50 whitespace-nowrap">
                            Dashboard
                        </div>
                    )}
                </Link>

                {MENU_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-1">
                        {!collapsed && (
                            <h3 className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                {group.title}
                            </h3>
                        )}
                        {collapsed && (
                            <div className="my-2 border-t border-slate-800" />
                        )}
                        <div className="space-y-1">
                            {group.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => window.innerWidth < 1024 && closeMobileSidebar()}
                                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 cursor-pointer
                                            ${isActive
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <item.icon size={24} className={`min-w-[24px] transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                        <span className={`whitespace-nowrap font-medium transition-all duration-300 ${collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                                            {item.label}
                                        </span>

                                        {/* Tooltip for collapsed state */}
                                        {collapsed && (
                                            <div className="absolute left-full ml-2 hidden rounded-md bg-slate-800 px-2 py-1 text-xs text-white opacity-0 shadow-lg group-hover:block group-hover:opacity-100 z-50 whitespace-nowrap">
                                                {item.label}
                                            </div>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Section */}
            <div className="border-t border-slate-800 p-3">
                <div className={`rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 p-3 transition-all duration-300 ${collapsed ? 'flex flex-col items-center gap-2' : ''}`}>
                    {/* User Info */}
                    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                        <div className="relative">
                            <div className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-indigo-400/30">
                                <HiUser className="text-white" size={20} />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                        </div>
                        <div className={`flex flex-col overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                            <span className="text-sm font-semibold text-white">Admin</span>
                            <span className="text-xs text-slate-400 truncate max-w-[140px]">{user?.email || 'admin@cicekci.com'}</span>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className={`mt-3 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer ${collapsed ? 'justify-center w-full mt-2' : 'w-full justify-center'}`}
                        title="Çıkış Yap"
                    >
                        <HiOutlineLogout size={18} />
                        <span className={`text-sm font-medium ${collapsed ? 'hidden' : 'block'}`}>Çıkış Yap</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-30 hidden h-full transition-all duration-300 lg:block
                    ${collapsed ? 'w-20' : 'w-72'}
                `}
            >
                {renderSidebarContent()}
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <Transition.Root show={isMobileOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 lg:hidden" onClose={closeMobileSidebar}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-900 pb-4 pt-5 shadow-xl">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white cursor-pointer"
                                            onClick={closeMobileSidebar}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <HiX className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>

                                <div className="h-full px-2">
                                    <div className="flex h-full flex-col bg-slate-900 text-white">
                                        {/* Mobile Logo */}
                                        <div className="flex h-20 items-center px-6 border-b border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
                                                    <span className="text-xl font-bold text-white">C</span>
                                                </div>
                                                <span className="text-lg font-bold">Pandora Admin</span>
                                            </div>
                                        </div>

                                        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-6">
                                            {/* Mobile Dashboard Link */}
                                            <Link
                                                to="/"
                                                onClick={closeMobileSidebar}
                                                className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 cursor-pointer
                                                    ${location.pathname === '/'
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                    }`}
                                            >
                                                <HiHome size={24} />
                                                <span className="font-medium">Dashboard</span>
                                            </Link>

                                            {MENU_GROUPS.map((group) => (
                                                <div key={group.title} className="space-y-1">
                                                    <h3 className="px-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                        {group.title}
                                                    </h3>
                                                    <div className="space-y-1">
                                                        {group.items.map((item) => {
                                                            const isActive = location.pathname === item.path;
                                                            return (
                                                                <Link
                                                                    key={item.path}
                                                                    to={item.path}
                                                                    onClick={closeMobileSidebar}
                                                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200 cursor-pointer
                                                                        ${isActive
                                                                            ? 'bg-indigo-600 text-white'
                                                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                                                        }`}
                                                                >
                                                                    <item.icon size={24} />
                                                                    <span className="font-medium">{item.label}</span>
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </nav>

                                        {/* Mobile User Section */}
                                        <div className="border-t border-slate-800 p-4">
                                            <div className="rounded-xl bg-gradient-to-br from-slate-800 to-slate-800/50 p-4">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="relative">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-2 ring-indigo-400/30">
                                                            <HiUser className="text-white" size={20} />
                                                        </div>
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-white">Admin</span>
                                                        <span className="text-xs text-slate-400">{user?.email || 'admin@cicekci.com'}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
                                                >
                                                    <HiOutlineLogout size={18} />
                                                    <span className="font-medium">Çıkış Yap</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}
