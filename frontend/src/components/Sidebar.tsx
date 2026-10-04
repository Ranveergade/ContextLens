/* Layout: Sidebar component - Fixed left 20% width (min 240px, max 320px), staggered motion mount animations matching skills.md */
import React from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  ListChecks,
  CheckSquare,
  Calendar,
  AlertTriangle,
  HelpCircle,
  Search,
  Settings
} from 'lucide-react';

export type MenuId =
  | 'overview'
  | 'documents'
  | 'analysis'
  | 'requirements'
  | 'actions'
  | 'timeline'
  | 'risks'
  | 'questions'
  | 'evidence'
  | 'settings';

interface SidebarProps {
  activeMenu: MenuId;
  onSelectMenu: (menuId: MenuId) => void;
  documentCount?: number;
  actionCount?: number;
  riskCount?: number;
}

interface MenuItem {
  id: MenuId;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  documentCount = 0,
  actionCount = 0,
  riskCount = 0
}) => {
  const menuItems: MenuItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'documents', label: 'Documents', icon: FileText, badge: documentCount },
    { id: 'analysis', label: 'Analysis', icon: Sparkles },
    { id: 'requirements', label: 'Requirements', icon: ListChecks },
    { id: 'actions', label: 'Action Items', icon: CheckSquare, badge: actionCount },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'risks', label: 'Risks', icon: AlertTriangle, badge: riskCount },
    { id: 'questions', label: 'Open Questions', icon: HelpCircle },
    { id: 'evidence', label: 'Evidence Explorer', icon: Search },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 z-30 w-[20%] min-w-[240px] max-w-[320px] bg-white border-r border-slate-200 overflow-y-auto py-6 px-3">
      <div className="space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => onSelectMenu(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-r-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-50 border-l-[3px] border-blue-600 text-blue-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 hover:translate-x-0.5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && Number(item.badge) > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </aside>
  );
};
