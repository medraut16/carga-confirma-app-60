
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, DollarSign, X, Save, Tag } from 'lucide-react';
import { Expense, ExpenseCategory } from '@/types/protocol';
import { toast } from '@/hooks/use-toast';

interface ExpenseManagerProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  onExpensesChange: (expenses: Expense[]) => void;
  onCategoriesChange: (categories: ExpenseCategory[]) => void;
}

const ExpenseManager: React.FC<ExpenseManagerProps> = ({ 
  expenses, 
  categories, 
  onExpensesChange, 
  onCategoriesChange 
}) => {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  
  const [expenseFormData, setExpenseFormData] = useState({
    name: '',
    value: 0,
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  });

  const resetExpenseForm = () => {
    setExpenseFormData({
      name: '',
      value: 0,
      categoryId: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setEditingExpense(null);
    setShowExpenseForm(false);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expenseFormData.name || !expenseFormData.categoryId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (editingExpense) {
      const updatedExpenses = expenses.map(exp => 
        exp.id === editingExpense.id 
          ? { ...editingExpense, ...expenseFormData, date: new Date(expenseFormData.date) }
          : exp
      );
      onExpensesChange(updatedExpenses);
      toast({
        title: "Despesa atualizada",
        description: `${expenseFormData.name} foi atualizada com sucesso.`
      });
    } else {
      const newExpense: Expense = {
        ...expenseFormData,
        id: Date.now().toString(),
        date: new Date(expenseFormData.date),
        createdAt: new Date()
      };
      onExpensesChange([...expenses, newExpense]);
      toast({
        title: "Despesa cadastrada",
        description: `${expenseFormData.name} foi adicionada com sucesso.`
      });
    }
    
    resetExpenseForm();
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryFormData.name) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome da categoria",
        variant: "destructive"
      });
      return;
    }

    if (editingCategory) {
      const updatedCategories = categories.map(cat => 
        cat.id === editingCategory.id 
          ? { ...editingCategory, ...categoryFormData }
          : cat
      );
      onCategoriesChange(updatedCategories);
      toast({
        title: "Categoria atualizada",
        description: `${categoryFormData.name} foi atualizada com sucesso.`
      });
    } else {
      const newCategory: ExpenseCategory = {
        ...categoryFormData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      onCategoriesChange([...categories, newCategory]);
      toast({
        title: "Categoria cadastrada",
        description: `${categoryFormData.name} foi adicionada com sucesso.`
      });
    }
    
    resetCategoryForm();
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseFormData({
      name: expense.name,
      value: expense.value,
      categoryId: expense.categoryId,
      date: expense.date.toISOString().split('T')[0],
      notes: expense.notes || ''
    });
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(exp => exp.id !== id);
    onExpensesChange(updatedExpenses);
    toast({
      title: "Despesa excluída",
      description: "A despesa foi removida com sucesso."
    });
  };

  const handleEditCategory = (category: ExpenseCategory) => {
    setCategoryFormData({
      name: category.name,
      description: category.description || ''
    });
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== id);
    onCategoriesChange(updatedCategories);
    toast({
      title: "Categoria excluída",
      description: "A categoria foi removida com sucesso."
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Despesas</h2>
          <p className="text-gray-600">Controle as despesas e categorias</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCategoryForm(true)} variant="outline">
            <Tag className="h-4 w-4 mr-2" />
            Nova Categoria
          </Button>
          <Button onClick={() => setShowExpenseForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nova Despesa
          </Button>
        </div>
      </div>

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias de Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="p-3 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{category.name}</h4>
                    {category.description && (
                      <p className="text-sm text-gray-600">{category.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{expense.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {getCategoryName(expense.categoryId)}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditExpense(expense)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Valor:</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(expense.value)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Data:</span>
                  <span className="text-sm">{formatDate(expense.date)}</span>
                </div>
                {expense.notes && (
                  <p className="text-sm text-gray-600 mt-2">{expense.notes}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {expenses.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhuma despesa cadastrada</p>
              <p className="text-sm">Adicione despesas para controlar os gastos</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
                  </CardTitle>
                  <Button variant="ghost" onClick={resetExpenseForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="expenseName">Nome da Despesa *</Label>
                    <Input
                      id="expenseName"
                      value={expenseFormData.name}
                      onChange={(e) => setExpenseFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expenseValue">Valor (R$) *</Label>
                    <Input
                      id="expenseValue"
                      type="number"
                      step="0.01"
                      min="0"
                      value={expenseFormData.value}
                      onChange={(e) => setExpenseFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expenseCategory">Categoria *</Label>
                    <select
                      id="expenseCategory"
                      value={expenseFormData.categoryId}
                      onChange={(e) => setExpenseFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="expenseDate">Data</Label>
                    <Input
                      id="expenseDate"
                      type="date"
                      value={expenseFormData.date}
                      onChange={(e) => setExpenseFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expenseNotes">Observações</Label>
                    <Textarea
                      id="expenseNotes"
                      value={expenseFormData.notes}
                      onChange={(e) => setExpenseFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={resetExpenseForm}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      {editingExpense ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                  </CardTitle>
                  <Button variant="ghost" onClick={resetCategoryForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="categoryName">Nome da Categoria *</Label>
                    <Input
                      id="categoryName"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="categoryDescription">Descrição</Label>
                    <Textarea
                      id="categoryDescription"
                      value={categoryFormData.description}
                      onChange={(e) => setCategoryFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={resetCategoryForm}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      {editingCategory ? 'Atualizar' : 'Cadastrar'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManager;
