import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, FileText, BarChart3, Plus, Settings, User, Truck, DollarSign, Calendar } from 'lucide-react';
import { DeliveryProtocol, Product, Driver, Vehicle, Expense, ExpenseCategory } from '@/types/protocol';
import ProtocolForm from './ProtocolForm';
import ProtocolList from './ProtocolList';
import ReportGenerator from './ReportGenerator';
import ProductManager from './ProductManager';
import DriverManager from './DriverManager';
import VehicleManager from './VehicleManager';
import ExpenseManager from './ExpenseManager';
import ExpenseReport from './ExpenseReport';
import Dashboard from './Dashboard';
import DeliveryScheduler from './DeliveryScheduler';
import DeliveryConfirmation from './DeliveryConfirmation';
import { toast } from '@/hooks/use-toast';

const ProtocolApp = () => {
  const [protocols, setProtocols] = useState<DeliveryProtocol[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  const [showForm, setShowForm] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<DeliveryProtocol | null>(null);
  const [confirmingDelivery, setConfirmingDelivery] = useState<DeliveryProtocol | null>(null);

  useEffect(() => {
    // Load all data from localStorage
    const savedProtocols = localStorage.getItem('deliveryProtocols');
    if (savedProtocols) {
      const parsed = JSON.parse(savedProtocols);
      setProtocols(parsed.map((p: any) => ({
        ...p,
        deliveryDate: new Date(p.deliveryDate),
        createdAt: new Date(p.createdAt)
      })));
    }

    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      const parsed = JSON.parse(savedProducts);
      setProducts(parsed.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      })));
    }

    const savedDrivers = localStorage.getItem('drivers');
    if (savedDrivers) {
      const parsed = JSON.parse(savedDrivers);
      setDrivers(parsed.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt)
      })));
    }

    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      const parsed = JSON.parse(savedVehicles);
      setVehicles(parsed.map((v: any) => ({
        ...v,
        createdAt: new Date(v.createdAt)
      })));
    }

    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      const parsed = JSON.parse(savedExpenses);
      setExpenses(parsed.map((e: any) => ({
        ...e,
        date: new Date(e.date),
        createdAt: new Date(e.createdAt)
      })));
    }

    const savedCategories = localStorage.getItem('expenseCategories');
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      setExpenseCategories(parsed.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt)
      })));
    }
  }, []);

  const saveProtocols = (newProtocols: DeliveryProtocol[]) => {
    localStorage.setItem('deliveryProtocols', JSON.stringify(newProtocols));
    setProtocols(newProtocols);
  };

  const saveProducts = (newProducts: Product[]) => {
    localStorage.setItem('products', JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const saveDrivers = (newDrivers: Driver[]) => {
    localStorage.setItem('drivers', JSON.stringify(newDrivers));
    setDrivers(newDrivers);
  };

  const saveVehicles = (newVehicles: Vehicle[]) => {
    localStorage.setItem('vehicles', JSON.stringify(newVehicles));
    setVehicles(newVehicles);
  };

  const saveExpenses = (newExpenses: Expense[]) => {
    localStorage.setItem('expenses', JSON.stringify(newExpenses));
    setExpenses(newExpenses);
  };

  const saveExpenseCategories = (newCategories: ExpenseCategory[]) => {
    localStorage.setItem('expenseCategories', JSON.stringify(newCategories));
    setExpenseCategories(newCategories);
  };

  const handleCreateProtocol = (protocol: Omit<DeliveryProtocol, 'id' | 'createdAt'>) => {
    const newProtocol: DeliveryProtocol = {
      ...protocol,
      id: Date.now().toString(),
      status: 'scheduled',
      createdAt: new Date()
    };
    
    const updatedProtocols = [...protocols, newProtocol];
    saveProtocols(updatedProtocols);
    setShowForm(false);
    setEditingProtocol(null);
    toast({
      title: "Entrega programada com sucesso!",
      description: `Entrega para ${protocol.clientName} foi programada.`,
    });
  };

  const handleUpdateProtocol = (protocol: Omit<DeliveryProtocol, 'id' | 'createdAt'>) => {
    if (editingProtocol) {
      const updatedProtocols = protocols.map(p => 
        p.id === editingProtocol.id 
          ? { ...editingProtocol, ...protocol }
          : p
      );
      saveProtocols(updatedProtocols);
      setShowForm(false);
      setEditingProtocol(null);
      toast({
        title: "Protocolo atualizado com sucesso!",
        description: `Protocolo para ${protocol.clientName} foi atualizado.`,
      });
    }
  };

  const handleEditProtocol = (protocol: DeliveryProtocol) => {
    setEditingProtocol(protocol);
    setShowForm(true);
  };

  const handleDeleteProtocol = (id: string) => {
    const updatedProtocols = protocols.filter(p => p.id !== id);
    saveProtocols(updatedProtocols);
    toast({
      title: "Protocolo excluído",
      description: "O protocolo foi removido com sucesso.",
    });
  };

  const handleConfirmDelivery = (protocol: DeliveryProtocol) => {
    setConfirmingDelivery(protocol);
  };

  const handleDeliveryConfirmed = (updatedProtocol: DeliveryProtocol) => {
    const updatedProtocols = protocols.map(p => 
      p.id === updatedProtocol.id ? updatedProtocol : p
    );
    saveProtocols(updatedProtocols);
    setConfirmingDelivery(null);
  };

  const stats = {
    total: protocols.length,
    delivered: protocols.filter(p => p.status === 'delivered').length,
    pending: protocols.filter(p => p.status === 'scheduled').length,
    totalProducts: products.length,
    totalDrivers: drivers.length,
    totalVehicles: vehicles.length,
    totalExpenses: expenses.reduce((sum, exp) => sum + exp.value, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sistema de Gestão de Entregas
          </h1>
          <p className="text-gray-600">
            Dashboard completo para controle de entregas e finanças
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Entregas</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Entregues</p>
                  <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="h-6 w-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-yellow-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Produtos</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalProducts}</p>
                </div>
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Motoristas</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.totalDrivers}</p>
                </div>
                <User className="h-6 w-6 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Veículos</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalVehicles}</p>
                </div>
                <Truck className="h-6 w-6 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">Despesas</p>
                  <p className="text-lg font-bold text-red-600">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      notation: 'compact'
                    }).format(stats.totalExpenses)}
                  </p>
                </div>
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white shadow-xl">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Sistema de Gestão
              </CardTitle>
              <Button 
                onClick={() => {
                  setEditingProtocol(null);
                  setShowForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Programar Entrega
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="scheduler" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Entregas
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Histórico
                </TabsTrigger>
                <TabsTrigger value="cadastros" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Cadastros
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Relatórios
                </TabsTrigger>
                <TabsTrigger value="expenses" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Despesas
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="mt-6">
                <Dashboard 
                  protocols={protocols}
                  expenses={expenses}
                />
              </TabsContent>

              <TabsContent value="scheduler" className="mt-6">
                <DeliveryScheduler 
                  protocols={protocols}
                  products={products}
                  drivers={drivers}
                  vehicles={vehicles}
                  onProtocolsChange={saveProtocols}
                  onConfirmDelivery={handleConfirmDelivery}
                />
              </TabsContent>
              
              <TabsContent value="list" className="mt-6">
                <ProtocolList 
                  protocols={protocols}
                  drivers={drivers}
                  vehicles={vehicles}
                  onDelete={handleDeleteProtocol}
                  onEdit={handleEditProtocol}
                />
              </TabsContent>
              
              <TabsContent value="cadastros" className="mt-6">
                <Tabs defaultValue="products" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="products">Produtos</TabsTrigger>
                    <TabsTrigger value="drivers">Motoristas</TabsTrigger>
                    <TabsTrigger value="vehicles">Veículos</TabsTrigger>
                    <TabsTrigger value="expense-categories">Categorias</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="products" className="mt-6">
                    <ProductManager 
                      products={products}
                      onProductsChange={saveProducts}
                    />
                  </TabsContent>

                  <TabsContent value="drivers" className="mt-6">
                    <DriverManager 
                      drivers={drivers}
                      vehicles={vehicles}
                      onDriversChange={saveDrivers}
                    />
                  </TabsContent>

                  <TabsContent value="vehicles" className="mt-6">
                    <VehicleManager 
                      vehicles={vehicles}
                      onVehiclesChange={saveVehicles}
                    />
                  </TabsContent>

                  <TabsContent value="expense-categories" className="mt-6">
                    <ExpenseManager 
                      expenses={expenses}
                      categories={expenseCategories}
                      onExpensesChange={saveExpenses}
                      onCategoriesChange={saveExpenseCategories}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>
              
              <TabsContent value="reports" className="mt-6">
                <Tabs defaultValue="delivery-reports" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="delivery-reports">Relatório de Entregas</TabsTrigger>
                    <TabsTrigger value="expense-reports">Relatório de Despesas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="delivery-reports" className="mt-6">
                    <ReportGenerator 
                      protocols={protocols}
                      products={products}
                      drivers={drivers}
                      vehicles={vehicles}
                    />
                  </TabsContent>

                  <TabsContent value="expense-reports" className="mt-6">
                    <ExpenseReport 
                      expenses={expenses}
                      categories={expenseCategories}
                    />
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="expenses" className="mt-6">
                <ExpenseManager 
                  expenses={expenses}
                  categories={expenseCategories}
                  onExpensesChange={saveExpenses}
                  onCategoriesChange={saveExpenseCategories}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Protocol Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <ProtocolForm
                products={products}
                drivers={drivers}
                vehicles={vehicles}
                onSubmit={editingProtocol ? handleUpdateProtocol : handleCreateProtocol}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProtocol(null);
                }}
                editingProtocol={editingProtocol}
              />
            </div>
          </div>
        )}

        {/* Delivery Confirmation Modal */}
        {confirmingDelivery && (
          <DeliveryConfirmation
            protocol={confirmingDelivery}
            onConfirm={handleDeliveryConfirmed}
            onCancel={() => setConfirmingDelivery(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ProtocolApp;
