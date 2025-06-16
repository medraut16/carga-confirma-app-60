
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeliveryProtocol, Expense, DailyFinancial } from '@/types/protocol';
import { TrendingUp, TrendingDown, DollarSign, Package, Truck, AlertCircle } from 'lucide-react';

interface DashboardProps {
  protocols: DeliveryProtocol[];
  expenses: Expense[];
  onNavigateToReports?: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ protocols, expenses, onNavigateToReports }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Calcular dados do dia atual
  const todayProtocols = protocols.filter(p => {
    const deliveryDate = new Date(p.deliveryDate);
    deliveryDate.setHours(0, 0, 0, 0);
    return deliveryDate.getTime() === today.getTime();
  });

  const todayExpenses = expenses.filter(e => {
    const expenseDate = new Date(e.date);
    expenseDate.setHours(0, 0, 0, 0);
    return expenseDate.getTime() === today.getTime();
  });

  const todayRevenue = todayProtocols
    .filter(p => p.status === 'delivered')
    .reduce((sum, p) => sum + p.deliveryValue, 0);

  const todayExpenseTotal = todayExpenses.reduce((sum, e) => sum + e.value, 0);
  const todayProfit = todayRevenue - todayExpenseTotal;

  const scheduledToday = todayProtocols.filter(p => p.status === 'scheduled').length;
  const deliveredToday = todayProtocols.filter(p => p.status === 'delivered').length;

  // Dados dos últimos 7 dias para comparação
  const last7Days: DailyFinancial[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayProtocols = protocols.filter(p => {
      const deliveryDate = new Date(p.deliveryDate);
      deliveryDate.setHours(0, 0, 0, 0);
      return deliveryDate.getTime() === date.getTime();
    });

    const dayExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      expenseDate.setHours(0, 0, 0, 0);
      return expenseDate.getTime() === date.getTime();
    });

    const revenue = dayProtocols
      .filter(p => p.status === 'delivered')
      .reduce((sum, p) => sum + p.deliveryValue, 0);
    
    const expenseTotal = dayExpenses.reduce((sum, e) => sum + e.value, 0);

    last7Days.push({
      date,
      totalRevenue: revenue,
      totalExpenses: expenseTotal,
      profit: revenue - expenseTotal,
      deliveryCount: dayProtocols.filter(p => p.status === 'delivered').length,
      expenseCount: dayExpenses.length
    });
  }

  const weeklyProfit = last7Days.reduce((sum, day) => sum + day.profit, 0);
  const avgDailyProfit = weeklyProfit / 7;

  const handleRevenueClick = () => {
    if (onNavigateToReports) {
      onNavigateToReports('delivery-reports');
    }
  };

  const handleExpenseClick = () => {
    if (onNavigateToReports) {
      onNavigateToReports('expense-reports');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
        <p className="text-sm sm:text-base text-gray-600">Visão geral do desempenho financeiro de hoje</p>
      </div>

      {/* Cards principais - Mobile: 1 column, Tablet: 2, Desktop: 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className={`${todayProfit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resultado do Dia</p>
                <p className={`text-xl sm:text-2xl font-bold ${todayProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(todayProfit)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {todayProfit >= 0 ? 'Lucro' : 'Prejuízo'}
                </p>
              </div>
              {todayProfit >= 0 ? (
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-blue-50 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={handleRevenueClick}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita do Dia</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(todayRevenue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {deliveredToday} entregas realizadas
                </p>
              </div>
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="bg-orange-50 border-orange-200 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={handleExpenseClick}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Despesas do Dia</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(todayExpenseTotal)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {todayExpenses.length} lançamentos
                </p>
              </div>
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entregas Pendentes</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">{scheduledToday}</p>
                <p className="text-xs text-gray-500 mt-1">
                  programadas para hoje
                </p>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo semanal - Mobile: 1 column, Desktop: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Últimos 7 Dias</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lucro Total da Semana</span>
                <span className={`font-bold text-sm sm:text-base ${weeklyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(weeklyProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Média Diária</span>
                <span className={`font-bold text-sm sm:text-base ${avgDailyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(avgDailyProfit)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Status das Entregas</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Entregues Hoje</span>
                </div>
                <span className="font-bold text-green-600">{deliveredToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pendentes Hoje</span>
                </div>
                <span className="font-bold text-yellow-600">{scheduledToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Total Programadas</span>
                </div>
                <span className="font-bold text-blue-600">{todayProtocols.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico - Mobile responsive */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Evolução do Lucro (Últimos 7 Dias)</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2">
            {last7Days.map((day, index) => {
              const maxProfit = Math.max(...last7Days.map(d => Math.abs(d.profit)));
              const height = maxProfit > 0 ? (Math.abs(day.profit) / maxProfit) * (window.innerWidth < 640 ? 160 : 200) : 20;
              const isPositive = day.profit >= 0;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2 text-center">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      notation: 'compact'
                    }).format(day.profit)}
                  </div>
                  <div
                    className={`w-full rounded-t ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ height: `${height}px`, minHeight: '4px' }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-1">
                    {day.date.getDate()}/{day.date.getMonth() + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
