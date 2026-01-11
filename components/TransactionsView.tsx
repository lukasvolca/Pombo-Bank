
import React, { useState, useMemo } from 'react';
import { Search, Filter, Trash2, ArrowUpRight, ArrowDownRight, ListFilter, Copy, Pencil } from 'lucide-react';
import { Transaction, TransactionType, Category } from '../types';
import { CATEGORY_ICONS, CATEGORIES } from '../constants';

interface TransactionsViewProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
  onDuplicate: (transaction: Transaction) => void;
}

const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, onDelete, onEdit, onDuplicate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'Todos'>('Todos');
  const [filterType, setFilterType] = useState<'All' | TransactionType>('All');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'Todos' || t.category === filterCategory;
        const matchesType = filterType === 'All' || t.type === filterType;
        return matchesSearch && matchesCategory && matchesType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterCategory, filterType]);

  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expenses, count: filteredTransactions.length };
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      {/* Mini Stats for Filtered View */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 border-l-4 border-emerald-500">
          <p className="text-slate-400 text-xs uppercase font-semibold">Entradas (Filtro)</p>
          <p className="text-emerald-400 font-bold text-xl mt-1">R$ {stats.income.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-red-500">
          <p className="text-slate-400 text-xs uppercase font-semibold">Saídas (Filtro)</p>
          <p className="text-red-400 font-bold text-xl mt-1">R$ {stats.expenses.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-xl p-4 border-l-4 border-[#FF7A00]">
          <p className="text-slate-400 text-xs uppercase font-semibold">Total Itens</p>
          <p className="text-[#FF7A00] font-bold text-xl mt-1">{stats.count} Transações</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Pesquisar por descrição..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <ListFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/40"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as any)}
            >
              <option value="Todos">Categorias</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex bg-slate-800/50 border border-slate-700 rounded-xl p-1">
            {(['All', TransactionType.INCOME, TransactionType.EXPENSE] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterType === type 
                    ? 'bg-[#FF7A00] text-white shadow-lg' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'All' ? 'Tudo' : type === TransactionType.INCOME ? 'Entradas' : 'Saídas'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Data</th>
                <th className="py-4 px-6 font-semibold">Descrição</th>
                <th className="py-4 px-6 font-semibold">Categoria</th>
                <th className="py-4 px-6 font-semibold text-right">Valor</th>
                <th className="py-4 px-6 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="group hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-sm text-slate-400 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-slate-800 border border-slate-700 ${t.type === TransactionType.INCOME ? 'text-emerald-400' : 'text-red-400'}`}>
                          {t.type === TransactionType.INCOME ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        </div>
                        <span className="font-medium text-slate-200">{t.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        {CATEGORY_ICONS[t.category]}
                        <span className="text-slate-400 text-sm">{t.category}</span>
                      </div>
                    </td>
                    <td className={`py-4 px-6 text-right font-semibold whitespace-nowrap ${t.type === TransactionType.INCOME ? 'text-emerald-400' : 'text-red-400'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(t)}
                          title="Editar"
                          className="p-2 text-slate-400 hover:text-[#FF7A00] hover:bg-[#FF7A00]/10 rounded-lg transition-all"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => onDuplicate(t)}
                          title="Duplicar"
                          className="p-2 text-slate-400 hover:text-sky-400 hover:bg-sky-400/10 rounded-lg transition-all"
                        >
                          <Copy size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete(t.id)}
                          title="Excluir"
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <Filter size={40} className="text-slate-700" />
                      <p>Nenhuma transação encontrada para os filtros aplicados.</p>
                      <button 
                        onClick={() => {setSearchTerm(''); setFilterCategory('Todos'); setFilterType('All');}}
                        className="text-[#FF7A00] text-sm font-medium hover:underline mt-2"
                      >
                        Limpar todos os filtros
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsView;
