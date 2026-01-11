
import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, CreditCard, DollarSign } from 'lucide-react';
import { Transaction, TransactionType, Category, TransactionFormData } from '../types';
import { CATEGORIES } from '../constants';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Transaction, 'id'>) => void;
  type: TransactionType;
  initialData?: Transaction;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, type, initialData }) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: type === TransactionType.INCOME ? 'Entradas' : 'Mercado'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount.toString(),
        date: initialData.date,
        category: initialData.category
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: type === TransactionType.INCOME ? 'Entradas' : 'Mercado'
      });
    }
  }, [initialData, type, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      type
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-[#222222] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className={`h-1.5 w-full ${type === TransactionType.INCOME ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">
              {initialData ? 'Editar' : 'Nova'} {type === TransactionType.INCOME ? 'Entrada' : 'Saída'}
            </h2>
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Descrição</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Salário, Almoço..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 transition-all"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Valor</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    placeholder="0,00"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 transition-all"
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Data</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="date" 
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 transition-all"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Categoria</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40 transition-all appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-slate-400 font-medium hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold transition-all shadow-lg
                ${type === TransactionType.INCOME 
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' 
                  : 'bg-red-600 hover:bg-red-500 shadow-red-500/20'}`}
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;