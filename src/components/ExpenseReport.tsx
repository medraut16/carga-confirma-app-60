
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { Expense, ExpenseCategory, ExpenseFilters } from '@/types/protocol';

interface ExpenseReportProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
}

const ExpenseReport: React.FC<ExpenseReportProps> = ({ expenses, categories }) => {
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [showReport, setShowReport] = useState(false);

  const handleFilterChange = (field: keyof ExpenseFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filters.startDate && expense.date < filters.startDate) return false;
    if (filters.endDate && expense.date > filters.endDate) return false;
    if (filters.categoryId && expense.categoryId !== filters.categoryId) return false;
    return true;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  };

  const generateReport = () => {
    setShowReport(true);
  };

  const exportReport = () => {
    const reportData = filteredExpenses.map(expense => ({
      'Nome': expense.name,
      'Categoria': getCategoryName(expense.categoryId),
      'Valor': expense.value,
      'Data': formatDate(expense.date),
      'Observações': expense.notes || ''
    }));

    const csvContent = [
      Object.keys(reportData[0] || {}).join(','),
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_despesas_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Calculate category summary
  const categorySummary = filteredExpenses.reduce((acc, expense) => {
    const categoryName = getCategoryName(expense.categoryId);
    if (!acc[categoryName]) {
      acc[categoryName] = {
        totalValue: 0,
        count: 0
      };
    }
    
    acc[categoryName].totalValue += expense.value;
    acc[categoryName].count++;
    
    return acc;
  }, {} as Record<string, any>);

  const totalValue = filteredExpenses.reduce((sum, expense) => sum + expense.value, 0);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Filtros do Relatório de Despesas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Categoria</Label>
              <select
                id="category"
                value={filters.categoryId || 'all'}
                onChange={(e) => handleFilterChange('categoryId', e.target.value === 'all' ? undefined : e.target.value)}
                className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button onClick={generateReport} className="bg-blue-600 hover:bg-blue-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
            
            {showReport && (
              <Button onClick={exportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {showReport && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Total de Despesas</p>
                    <p className="text-2xl font-bold text-red-800">{filteredExpenses.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Valor Total</p>
                    <p className="text-2xl font-bold text-orange-800">{formatCurrency(totalValue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Valor Médio</p>
                    <p className="text-2xl font-bold text-purple-800">
                      {filteredExpenses.length > 0 ? formatCurrency(totalValue / filteredExpenses.length) : formatCurrency(0)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Summary */}
          {Object.keys(categorySummary).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resumo por Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Categoria</th>
                        <th className="border border-gray-300 p-3 text-left">Quantidade</th>
                        <th className="border border-gray-300 p-3 text-left">Valor Total</th>
                        <th className="border border-gray-300 p-3 text-left">Valor Médio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(categorySummary).map(([categoryName, data]) => (
                        <tr key={categoryName} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3 font-medium">{categoryName}</td>
                          <td className="border border-gray-300 p-3">
                            <Badge variant="secondary">{data.count}</Badge>
                          </td>
                          <td className="border border-gray-300 p-3">{formatCurrency(data.totalValue)}</td>
                          <td className="border border-gray-300 p-3">{formatCurrency(data.totalValue / data.count)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Report */}
          <Card>
            <CardHeader>
              <CardTitle>Relatório Detalhado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Nome</th>
                      <th className="border border-gray-300 p-2 text-left">Categoria</th>
                      <th className="border border-gray-300 p-2 text-left">Valor</th>
                      <th className="border border-gray-300 p-2 text-left">Data</th>
                      <th className="border border-gray-300 p-2 text-left">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2">{expense.name}</td>
                        <td className="border border-gray-300 p-2">
                          <Badge variant="secondary">{getCategoryName(expense.categoryId)}</Badge>
                        </td>
                        <td className="border border-gray-300 p-2 text-red-600 font-medium">
                          {formatCurrency(expense.value)}
                        </td>
                        <td className="border border-gray-300 p-2">{formatDate(expense.date)}</td>
                        <td className="border border-gray-300 p-2">{expense.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredExpenses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma despesa encontrada com os filtros aplicados
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ExpenseReport;
