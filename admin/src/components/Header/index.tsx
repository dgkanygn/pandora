import { useNavigate } from 'react-router-dom';
import { HiMenu, HiOutlineLogout } from 'react-icons/hi';
import { useSidebar } from '../../context/SidebarContext';

export default function Header() {
    const { toggleSidebar } = useSidebar();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Implement logout logic here
        navigate('/login');
    };

    return (
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="rounded p-2 text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                    <HiMenu size={24} />
                </button>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Admin User</span>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 cursor-pointer"
                >
                    <HiOutlineLogout size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
}
