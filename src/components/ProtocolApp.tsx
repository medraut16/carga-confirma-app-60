
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, FileText, BarChart3, Plus, Settings } from 'lucide-react';
import { DeliveryProtocol, Product } from '@/types/protocol';
import ProtocolForm from './ProtocolForm';
import ProtocolList from './ProtocolList';
import ReportGenerator from './ReportGenerator';
import ProductManager from './ProductManager';
import { toast } from '@/hooks/use-toast';

const ProtocolApp = () => {
  const [protocols, setProtocols] = useState<DeliveryProtocol[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load protocols
    const savedProtocols = localStorage.getItem('deliveryProtocols');
    if (savedProtocols) {
      const parsed = JSON.parse(savedProtocols);
      setProtocols(parsed.map((p: any) => ({
        ...p,
        deliveryDate: new Date(p.deliveryDate),
        createdAt: new Date(p.createdAt)
      })));
    }

    // Load products
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      const parsed = JSON.parse(savedProducts);
      setProducts(parsed.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
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

  const handleCreateProtocol = (protocol: Omit<DeliveryProtocol, 'id' | 'createdAt'>) => {
    const newProtocol: DeliveryProtocol = {
      ...protocol,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const updatedProtocols = [...protocols, newProtocol];
    saveProtocols(updatedProtocols);
    setShowForm(false);
    toast({
      title: "Protocolo criado com sucesso!",
      description: `Protocolo para ${protocol.clientName} foi registrado.`,
    });
  };

  const handleDeleteProtocol = (id: string) => {
    const updatedProtocols = protocols.filter(p => p.id !== id);
    saveProtocols(updatedProtocols);
    toast({
      title: "Protocolo excluído",
      description: "O protocolo foi removido com sucesso.",
    });
  };

  const stats = {
    total: protocols.length,
    delivered: protocols.filter(p => p.status === 'delivered').length,
    pending: protocols.filter(p => p.status === 'pending').length,
    failed: protocols.filter(p => p.status === 'failed').length,
    totalProducts: products.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Sistema de Protocolo de Correspondência
          </h1>
          <p className="text-gray-600">
            Gerencie entregas, colete assinaturas e gere relatórios completos
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Entregues</p>
                  <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Falharam</p>
                  <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-red-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Produtos</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalProducts}</p>
                </div>
                <Settings className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white shadow-xl">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Gerenciamento de Protocolos
              </CardTitle>
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Protocolo
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Protocolos
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Produtos
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Relatórios
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="mt-6">
                <ProtocolList 
                  protocols={protocols}
                  onDelete={handleDeleteProtocol}
                />
              </TabsContent>
              
              <TabsContent value="products" className="mt-6">
                <ProductManager 
                  products={products}
                  onProductsChange={saveProducts}
                />
              </TabsContent>
              
              <TabsContent value="reports" className="mt-6">
                <ReportGenerator 
                  protocols={protocols}
                  products={products}
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
                onSubmit={handleCreateProtocol}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtocolApp;
