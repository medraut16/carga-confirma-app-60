
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, User, X, Save } from 'lucide-react';
import { Driver, Vehicle } from '@/types/protocol';
import { toast } from '@/hooks/use-toast';

interface DriverManagerProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  onDriversChange: (drivers: Driver[]) => void;
}

const DriverManager: React.FC<DriverManagerProps> = ({ drivers, vehicles, onDriversChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    mainVehicleId: ''
  });

  const resetForm = () => {
    setFormData({ name: '', mainVehicleId: '' });
    setEditingDriver(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome do motorista",
        variant: "destructive"
      });
      return;
    }

    if (editingDriver) {
      const updatedDrivers = drivers.map(d => 
        d.id === editingDriver.id 
          ? { ...editingDriver, ...formData }
          : d
      );
      onDriversChange(updatedDrivers);
      toast({
        title: "Motorista atualizado",
        description: `${formData.name} foi atualizado com sucesso.`
      });
    } else {
      const newDriver: Driver = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      onDriversChange([...drivers, newDriver]);
      toast({
        title: "Motorista cadastrado",
        description: `${formData.name} foi adicionado com sucesso.`
      });
    }
    
    resetForm();
  };

  const handleEdit = (driver: Driver) => {
    setFormData({
      name: driver.name,
      mainVehicleId: driver.mainVehicleId
    });
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedDrivers = drivers.filter(d => d.id !== id);
    onDriversChange(updatedDrivers);
    toast({
      title: "Motorista excluído",
      description: "O motorista foi removido com sucesso."
    });
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.name} (${vehicle.plate})` : 'Veículo não encontrado';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Motoristas</h2>
          <p className="text-gray-600">Cadastre e gerencie os motoristas</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Motorista
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <Card key={driver.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{driver.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Veículo principal: {getVehicleName(driver.mainVehicleId)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(driver)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(driver.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {drivers.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhum motorista cadastrado</p>
              <p className="text-sm">Adicione motoristas para o sistema</p>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {editingDriver ? 'Editar Motorista' : 'Novo Motorista'}
                  </CardTitle>
                  <Button variant="ghost" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Motorista *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="mainVehicleId">Veículo Principal</Label>
                    <select
                      id="mainVehicleId"
                      value={formData.mainVehicleId}
                      onChange={(e) => setFormData(prev => ({ ...prev, mainVehicleId: e.target.value }))}
                      className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione um veículo</option>
                      {vehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} ({vehicle.plate})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      {editingDriver ? 'Atualizar' : 'Cadastrar'}
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

export default DriverManager;
