
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export type Category = 
  | 'Entradas' 
  | 'Mercado' 
  | 'Transporte' 
  | 'Comida na rua' 
  | 'Gastos' 
  | 'Xayah' 
  | 'Contas' 
  | 'Dívidas' 
  | 'Cartões' 
  | 'Coisas de casa';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  title: string;
  category: Category;
  type: TransactionType;
}

export interface TransactionFormData {
  date: string;
  amount: string;
  title: string;
  category: Category;
}
