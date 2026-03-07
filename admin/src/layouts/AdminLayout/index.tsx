import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSidebar } from '../../context/SidebarContext';
import { HiMenu } from 'react-icons/hi';

export default function AdminLayout() {
    const { collapsed, openMobileSidebar } = useSidebar();

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />

            {/* Mobile Header */}
            <div className="sticky top-0 z-20 flex h-16 items-center border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
                <button
                    onClick={openMobileSidebar}
                    className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                >
                    <span className="sr-only">Open sidebar</span>
                    <HiMenu className="h-6 w-6" aria-hidden="true" />
                </button>
                <span className="ml-2 text-lg font-semibold text-gray-900">Pandora Admin</span>
            </div>

            <div
                className={`transition-all duration-300 ease-in-out ${collapsed ? 'lg:ml-20' : 'lg:ml-72'
                    }`}
            >
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
