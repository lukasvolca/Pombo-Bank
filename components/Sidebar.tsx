
import React from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  ChevronLeft, 
  ChevronRight,
  Bird
} from 'lucide-react';
import { ViewType } from '../App';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, currentView, setView }) => {
  const menuItems: { icon: React.ReactNode; label: string; view: ViewType }[] = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', view: 'dashboard' },
    { icon: <ArrowRightLeft size={20} />, label: 'Transações', view: 'transactions' },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 bg-[#222222] border-r border-white/5 flex flex-col
      ${isOpen ? 'w-64' : 'w-20'} hidden md:flex`}
    >
      <div className="p-6 flex items-center justify-between">
        {isOpen ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF7A00] flex items-center justify-center shadow-lg shadow-[#FF7A00]/20">
              <Bird className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Pombo Bank</span>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[#FF7A00] flex items-center justify-center mx-auto shadow-lg shadow-[#FF7A00]/20">
            <Bird className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all
            ${currentView === item.view 
              ? 'bg-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/20' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className="min-w-[24px]">{item.icon}</span>
            {isOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
