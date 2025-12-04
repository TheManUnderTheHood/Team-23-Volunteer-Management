import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, MapPin, User, List } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    if (!user) return null;

    const isActive = (path) => location.pathname === path ? 'text-teal-600 bg-teal-50 font-semibold' : 'text-gray-600 hover:bg-gray-50';

    return (
        <nav className="bg-white shadow-xs border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-teal-600 flex items-center gap-2">
                            <MapPin className="h-8 w-8" />
                            VolunHero
                        </Link>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                            <Link to="/" className={`px-3 py-2 rounded-md text-sm ${isActive('/')}`}>
                                Dashboard
                            </Link>
                            <Link to="/tasks" className={`px-3 py-2 rounded-md text-sm ${isActive('/tasks')}`}>
                                Find Tasks
                            </Link>
                            <Link to="/my-shifts" className={`px-3 py-2 rounded-md text-sm ${isActive('/my-shifts')}`}>
                                My Shifts
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <span className="hidden md:block text-sm font-medium text-gray-700">{user.name}</span>
                        </div>
                        <button 
                            onClick={logout}
                            className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;