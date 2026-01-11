
import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Minus,
  TrendingUp,
  TrendingDown,
  Wallet
} from 'lucide-react';
import { Transaction, TransactionType } from './types';
import TransactionModal from './components/TransactionModal';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import TransactionsView from './components/TransactionsView';

const INITIAL_DATA: Transaction[] = [
  { id: '1', title: 'Salário Mensal', amount: 5000, category: 'Entradas', date: '2023-11-01', type: TransactionType.INCOME },
  { id: '2', title: 'Supermercado Mensal', amount: 850, category: 'Mercado', date: '2023-11-02', type: TransactionType.EXPENSE },
  { id: '3', title: 'Aluguel Casa', amount: 1500, category: 'Contas', date: '2023-11-03', type: TransactionType.EXPENSE },
  { id: '4', title: 'Uber - Trabalho', amount: 45, category: 'Transporte', date: '2023-11-04', type: TransactionType.EXPENSE },
  { id: '5', title: 'Jantar Sábado', amount: 120, category: 'Comida na rua', date: '2023-11-05', type: TransactionType.EXPENSE },
  { id: '6', title: 'Freela UI Design', amount: 1200, category: 'Entradas', date: '2023-11-06', type: TransactionType.INCOME },
  { id: '7', title: 'Assinatura Netflix', amount: 55.90, category: 'Gastos', date: '2023-11-07', type: TransactionType.EXPENSE },
  { id: '8', title: 'Energia Elétrica', amount: 210, category: 'Contas', date: '2023-11-08', type: TransactionType.EXPENSE },
];

export type ViewType = 'dashboard' | 'transactions';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_DATA);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<TransactionType>(TransactionType.INCOME);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const stats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((acc, curr) => acc + curr.amount, 0);
    const expenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, curr) => acc + curr.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const openAddModal = (type: TransactionType) => {
    setEditingTransaction(null);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalType(transaction.type);
    setIsModalOpen(true);
  };

  const handleDuplicateTransaction = (transaction: Transaction) => {
    const duplicated: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substring(7),
      date: new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [duplicated, ...prev]);
  };

  const handleSaveTransaction = (data: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? { ...data, id: editingTransaction.id } : t));
    } else {
      const transaction: Transaction = {
        ...data,
        id: Math.random().toString(36).substring(7),
      };
      setTransactions(prev => [transaction, ...prev]);
    }
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        currentView={currentView} 
        setView={setCurrentView} 
      />

      <main className={`flex-1 transition-all duration-300 p-4 md:p-8 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {currentView === 'dashboard' ? 'Dashboard' : 'Transações'}
            </h1>
            <p className="text-slate-400">
              {currentView === 'dashboard' 
                ? 'Bem-vindo de volta ao seu controle financeiro.' 
                : 'Gerencie e filtre todo o seu histórico financeiro.'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => openAddModal(TransactionType.INCOME)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/20 hover:bg-[#FF7A00]/20 transition-all font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Entrada</span>
            </button>
            <button 
              onClick={() => openAddModal(TransactionType.EXPENSE)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all font-medium"
            >
              <Minus className="w-4 h-4" />
              <span className="hidden sm:inline">Saída</span>
            </button>
          </div>
        </header>

        {currentView === 'dashboard' ? (
          <DashboardView transactions={transactions} stats={stats} />
        ) : (
          <TransactionsView 
            transactions={transactions} 
            onDelete={handleDeleteTransaction}
            onEdit={handleEditTransaction}
            onDuplicate={handleDuplicateTransaction}
          />
        )}
      </main>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveTransaction}
        type={modalType}
        initialData={editingTransaction || undefined}
      />
    </div>
  );
};

export default App;
