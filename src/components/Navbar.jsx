import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bot, LogOut, LayoutDashboard, PlusCircle, User, Home, Mail, Shield, Trash2, X, AlertTriangle, Loader2, MoreVertical, Settings, Activity, Sun, Moon } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { logout, user, isAuthenticated, fetchMe, deleteAccount, loading } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [showProfile, setShowProfile] = useState(false);

    // Close dropdown on route change
    useEffect(() => {
        setShowProfile(false);
    }, [location.pathname]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchMe();
        }
    }, [isAuthenticated, fetchMe]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        const result = await Swal.fire({
            title: 'Delete Account?',
            text: "Your account will be deactivated for 90 days, after which it will be permanently deleted. Your agents will be kept in trash for 3 days before being removed.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: theme === 'dark' ? '#333' : '#e2e8f0',
            confirmButtonText: 'Yes, deactivate account'
        });

        if (result.isConfirmed) {
            const res = await deleteAccount();
            if (res.success) {
                Swal.fire({
                    title: 'Account Deleted',
                    text: 'Your account has been successfully removed.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 2000
                });
                navigate('/register');
            } else {
                Swal.fire({
                    title: 'Error',
                    text: res.message,
                    icon: 'error',
                });
            }
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-nav h-20 px-8 flex items-center justify-between">
            {/* Left Section: Logo */}
            <div className="flex-1 flex justify-start">
                <Link to="/" className="flex items-center group">
                    <img src="/logo.png" alt="Agentic AI" className="h-12 w-auto object-contain transition-all group-hover:scale-105" />
                </Link>
            </div>

            {/* Center Section: Navigation Links */}
            <div className="hidden lg:flex items-center justify-center gap-10 text-[11px] font-black uppercase tracking-[0.2em] flex-1">
                {isAuthenticated ? (
                    <>
                        <Link to="/" className="nav-link-premium group flex items-center gap-2">
                            <Home size={14} className="text-accent-primary group-hover:scale-110 transition-transform" />
                            <span>Home</span>
                        </Link>
                        <Link to="/dashboard" className="nav-link-premium group flex items-center gap-2">
                            <LayoutDashboard size={14} className="text-accent-primary group-hover:scale-110 transition-transform" />
                            <span>Workspace</span>
                        </Link>
                        <Link to="/agents/create" className="nav-link-premium group flex items-center gap-2">
                            <PlusCircle size={14} className="text-accent-primary group-hover:scale-110 transition-transform" />
                            <span>Create Agent</span>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/" className="nav-link-premium group flex items-center gap-2">
                            <Home size={14} className="text-accent-primary group-hover:scale-110 transition-transform" />
                            <span>Home</span>
                        </Link>
                        <Link to="/features" className="nav-link-premium">Features</Link>
                        <Link to="/pricing" className="nav-link-premium">Pricing</Link>
                        <Link to="/docs" className="nav-link-premium">Docs</Link>
                    </>
                )}
            </div>

            {/* Right Section: Theme Toggle + User Info / Auth Buttons */}
            <div className="flex-1 flex justify-end items-center gap-6">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl hover:bg-white/5 dark:hover:bg-white/5 hover:border-white/10 border border-transparent transition-all cursor-pointer group"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    <AnimatePresence mode="wait">
                        {theme === 'dark' ? (
                            <motion.div
                                key="sun"
                                initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Sun size={20} className="text-amber-400 group-hover:text-amber-300 transition-colors" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="moon"
                                initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
                                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Moon size={20} className="text-slate-600 group-hover:text-slate-500 transition-colors" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                {isAuthenticated ? (
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 pr-6 border-r border-theme">
                            <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                                <User size={18} className="text-accent-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-white uppercase tracking-tight">
                                    {user?.name || user?.username || user?.email?.split('@')[0] || 'User'}
                                </span>
                                <div className="flex items-center gap-1.5 leading-none mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">Online</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <button
                                onClick={() => setShowProfile(!showProfile)}
                                className={`p-2.5 rounded-xl transition-all cursor-pointer border ${showProfile ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary' : 'hover:bg-theme-surface text-slate-400 hover:text-white dark:hover:text-white border-transparent hover:border-theme'}`}
                            >
                                <MoreVertical size={20} className={`${showProfile ? 'rotate-90' : ''} transition-transform duration-300`} />
                            </button>

                            <AnimatePresence>
                                {showProfile && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setShowProfile(false)}
                                            className="fixed inset-0 z-[90]"
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
                                            className="absolute right-0 top-full mt-4 w-[280px] z-[100] origin-top-right"
                                        >
                                            <div className="bg-menu-dropdown shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-theme rounded-[30px] overflow-hidden relative">
                                                {/* Premium Glow effect */}
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/15 blur-3xl -mr-16 -mt-16 animate-pulse" />

                                                <div className="p-7">
                                                    <div className="flex items-center gap-4 pb-6 border-b border-white/5 mb-6">
                                                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center border border-white/10 shrink-0 shadow-inner">
                                                            <User size={26} className="text-accent-primary" />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <h4 className="text-[13px] font-black text-white uppercase tracking-tight truncate">
                                                                {user?.name || 'Agentic User'}
                                                            </h4>
                                                            <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">{user?.email}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                                                                    <Activity size={14} className="text-emerald-500" />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                                <span className="text-[9px] font-black uppercase text-emerald-500">Online</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/10">
                                                                    <Shield size={14} className="text-blue-400" />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</span>
                                                            </div>
                                                            <span className="text-[9px] font-black uppercase text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">Verified</span>
                                                        </div>

                                                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                                                                    <LayoutDashboard size={14} className="text-slate-400" />
                                                                </div>
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role</span>
                                                            </div>
                                                            <span className="text-[9px] font-black uppercase text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/5">Standard</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-300 font-bold text-[10px] uppercase tracking-widest hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-300"
                                                        >
                                                            <LogOut size={14} className="text-accent-primary" /> Logout
                                                        </button>

                                                        <button
                                                            onClick={handleDeleteAccount}
                                                            disabled={loading}
                                                            className="w-full py-4 rounded-2xl bg-red-500/[0.03] border border-red-500/10 text-red-500/80 font-bold text-[10px] uppercase tracking-widest hover:bg-red-500/10 hover:border-red-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group active:scale-95 duration-300"
                                                        >
                                                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} className="group-hover:scale-110 transition-transform" />}
                                                            Delete Account
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-xs font-bold text-theme-primary hover:text-accent-primary transition-all uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-theme-surface hover:scale-105 duration-300">
                            Log In
                        </Link>
                        <Link to="/register" className="btn-premium px-8 py-3.5 text-xs shadow-glow-orange">
                            Start Building
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
