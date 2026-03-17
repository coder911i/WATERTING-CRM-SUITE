'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  TableProperties, 
  GitPullRequest, 
  CalendarDays, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Inventory', href: '/inventory', icon: TableProperties },
  { name: 'Pipeline', href: '/pipeline', icon: GitPullRequest },
  { name: 'Site Visits', href: '/site-visits', icon: CalendarDays },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-neutral-0 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
      <div className="flex h-[60px] items-center px-6 border-b border-neutral-200 dark:border-neutral-700">
        <span className="text-xl font-semibold tracking-wider text-primary-700 dark:text-primary-400">WATERTING</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-l-4 border-primary-700 pl-2' 
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-primary-700 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400'}`} aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        <Link href="/settings" className="flex items-center px-3 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
          <Settings className="mr-3 h-5 w-5 text-neutral-500" />
          Settings
        </Link>
      </div>
    </div>
  );
}
