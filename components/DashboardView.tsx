
import React, { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction, TransactionType } from '../types';
import { CATEGORY_ICONS, COLORS } from '../constants';
import OverviewCard from './OverviewCard';

interface DashboardViewProps {
  transactions: Transaction[];
  stats: { income: number; expenses: number; balance: number };
}

const DashboardView: React.FC<DashboardViewProps> = ({ transactions, stats }) => {
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayTransactions = transactions.filter(t => t.date === date);
      const dayIncome = dayTransactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
      const dayExpense = dayTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: date.split('-').slice(1).join('/'),
        income: dayIncome,
        expense: dayExpense
      };
    });
  }, [transactions]);

  const pieData = useMemo(() => {
    const categoriesMap: Record<string, number> = {};
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        categoriesMap[t.category] = (categoriesMap[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categoriesMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Top Stat Cards */}
      <div className="md:col-span-4">
        <OverviewCard 
          title="Saldo Total" 
          value={stats.balance} 
          icon={<Wallet className="w-6 h-6 text-[#FF7A00]" />} 
          color="text-[#FF7A00]"
        />
      </div>
      <div className="md:col-span-4">
        <OverviewCard 
          title="Entradas Mensais" 
          value={stats.income} 
          icon={<TrendingUp className="w-6 h-6 text-emerald-400" />} 
          color="text-emerald-400"
        />
      </div>
      <div className="md:col-span-4">
        <OverviewCard 
          title="Saídas Mensais" 
          value={stats.expenses} 
          icon={<TrendingDown className="w-6 h-6 text-red-400" />} 
          color="text-red-400"
        />
      </div>

      {/* Main Chart Card */}
      <div className="md:col-span-8 glass-card rounded-2xl p-6 min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Análise de Fluxo</h3>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Entradas</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Saídas</div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.income} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.income} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.expense} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.expense} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$ ${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Area type="monotone" dataKey="income" stroke={COLORS.income} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" stroke={COLORS.expense} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Distribution */}
      <div className="md:col-span-4 glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-6">Distribuição de Gastos</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={[COLORS.primary, '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][index % 6]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 mt-4">
          {pieData.slice(0, 3).map((item, idx) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: [COLORS.primary, '#3b82f6', '#10b981'][idx] }}></div>
                <span className="text-slate-400">{item.name}</span>
              </div>
              <span className="font-medium">R$ {item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="md:col-span-12 glass-card rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Transações Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="pb-4 font-semibold px-2">Data</th>
                <th className="pb-4 font-semibold px-2">Descrição</th>
                <th className="pb-4 font-semibold px-2">Categoria</th>
                <th className="pb-4 font-semibold px-2 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 text-sm text-slate-400 px-2">{new Date(t.date).toLocaleDateString()}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                        {CATEGORY_ICONS[t.category] || <Plus className="w-4 h-4" />}
                      </div>
                      <span className="font-medium text-slate-200">{t.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                      {t.category}
                    </span>
                  </td>
                  <td className={`py-4 px-2 text-right font-semibold ${t.type === TransactionType.INCOME ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'} R$ {t.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
