
import React from 'react';
import { 
  PlusCircle, 
  ShoppingCart, 
  Bus, 
  Utensils, 
  CreditCard, 
  Home, 
  Heart, 
  FileText, 
  AlertCircle, 
  TrendingUp,
  LayoutDashboard,
  ArrowRightLeft,
  Settings,
  Wallet
} from 'lucide-react';
import { Category } from './types';

export const CATEGORIES: Category[] = [
  'Entradas', 
  'Mercado', 
  'Transporte', 
  'Comida na rua', 
  'Gastos', 
  'Xayah', 
  'Contas', 
  'Dívidas', 
  'Cartões', 
  'Coisas de casa'
];

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'Entradas': <TrendingUp className="w-5 h-5 text-emerald-400" />,
  'Mercado': <ShoppingCart className="w-5 h-5 text-sky-400" />,
  'Transporte': <Bus className="w-5 h-5 text-blue-400" />,
  'Comida na rua': <Utensils className="w-5 h-5 text-orange-400" />,
  'Gastos': <PlusCircle className="w-5 h-5 text-slate-400" />,
  'Xayah': <Heart className="w-5 h-5 text-pink-400" />,
  'Contas': <FileText className="w-5 h-5 text-amber-400" />,
  'Dívidas': <AlertCircle className="w-5 h-5 text-red-400" />,
  'Cartões': <CreditCard className="w-5 h-5 text-orange-500" />,
  'Coisas de casa': <Home className="w-5 h-5 text-indigo-400" />,
};

export const COLORS = {
  primary: '#FF7A00', // Banco Inter Orange
  income: '#10b981', // Green
  expense: '#ef4444', // Red
  bg: '#222222',
  slate: {
    700: '#334155',
    800: '#1e293b',
    900: '#222222'
  }
};