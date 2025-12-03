import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  FileText,
  Tag,
  Users,
  Star,
  LogOut,
  Sparkles,
  FileType,
  Menu,
  Phone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
  { name: 'Преглед', href: '/admin', icon: LayoutDashboard },
  { name: 'Услуги', href: '/admin/services', icon: Package },
  { name: 'Категории', href: '/admin/categories', icon: FolderOpen },
  { name: 'Топ Услуги', href: '/admin/top-services', icon: Sparkles },
  { name: 'Блог', href: '/admin/blog', icon: FileText },
  { name: 'Промоции', href: '/admin/promotions', icon: Tag },
  { name: 'Екип', href: '/admin/team', icon: Users },
  { name: 'Отзиви', href: '/admin/reviews', icon: Star },
  { name: 'Конфигурация Header', href: '/admin/header-config', icon: Menu },
  { name: 'Конфигурация Контакти', href: '/admin/contact-config', icon: Phone },
  { name: 'Типове страници', href: '/admin/page-types', icon: FileType },
];

export default function AdminDashboard() {
  const { adminUser, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-nude-50 via-white to-nude-100">
      <div className="flex h-screen">
        <aside className="w-64 bg-gradient-to-b from-charcoal-600 to-charcoal-700 text-white flex flex-col">
          <div className="p-6 border-b border-white/10">
            <h1 className="font-serif text-2xl">
              <span className="text-white">Admin</span>
              <span className="text-gold-400"> Panel</span>
            </h1>
            <p className="text-sm text-gray-300 mt-2">{adminUser?.full_name}</p>
            <p className="text-xs text-gray-400">{adminUser?.email}</p>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gold-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Изход</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
