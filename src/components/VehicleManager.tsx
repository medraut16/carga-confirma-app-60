
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, Truck, X, Save, Package } from 'lucide-react';
import { Vehicle, VehicleCompartment } from '@/types/protocol';
import { toast } from '@/hooks/use-toast';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  onVehiclesChange: (vehicles: Vehicle[]) => void;
}

const VehicleManager: React.FC<VehicleManagerProps> = ({ vehicles, onVehiclesChange }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    plate: '',
    fuelTankCapacity: 0,
    transportCapacity: 0,
    compartments: [] as VehicleCompartment[]
  });

  const resetForm = () => {
    setFormData({
      name: '',
      model: '',
      plate: '',
      fuelTankCapacity: 0,
      transportCapacity: 0,
      compartments: []
    });
    setEditingVehicle(null);
    setShowForm(false);
  };

  const addCompartment = () => {
    const newCompartment: VehicleCompartment = {
      id: Date.now().toString(),
      name: `Compartimento ${formData.compartments.length + 1}`,
      capacity: 0
    };
    setFormData(prev => ({
      ...prev,
      compartments: [...prev.compartments, newCompartment]
    }));
  };

  const updateCompartment = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      compartments: prev.compartments.map((comp, i) => 
        i === index ? { ...comp, [field]: value } : comp
      )
    }));
  };

  const removeCompartment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      compartments: prev.compartments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.plate) {
      toast({
        title: "Erro",
        description: "Por favor, preencha os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (editingVehicle) {
      const updatedVehicles = vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { ...editingVehicle, ...formData }
          : v
      );
      onVehiclesChange(updatedVehicles);
      toast({
        title: "Veículo atualizado",
        description: `${formData.name} foi atualizado com sucesso.`
      });
    } else {
      const newVehicle: Vehicle = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      onVehiclesChange([...vehicles, newVehicle]);
      toast({
        title: "Veículo cadastrado",
        description: `${formData.name} foi adicionado com sucesso.`
      });
    }
    
    resetForm();
  };

  const handleEdit = (vehicle: Vehicle) => {
    setFormData({
      name: vehicle.name,
      model: vehicle.model,
      plate: vehicle.plate,
      fuelTankCapacity: vehicle.fuelTankCapacity,
      transportCapacity: vehicle.transportCapacity,
      compartments: vehicle.compartments || []
    });
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const updatedVehicles = vehicles.filter(v => v.id !== id);
    onVehiclesChange(updatedVehicles);
    toast({
      title: "Veículo excluído",
      description: "O veículo foi removido com sucesso."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Veículos</h2>
          <p className="text-gray-600">Cadastre e gerencie os veículos da frota</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Veículo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{vehicle.name}</h3>
                  <p className="text-sm text-gray-600">Modelo: {vehicle.model}</p>
                  <p className="text-sm font-medium text-blue-600">Placa: {vehicle.plate}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <p>Tanque combustível: {vehicle.fuelTankCapacity}L</p>
                <p>Capacidade transporte: {vehicle.transportCapacity}kg</p>
                <p>Compartimentos: {vehicle.compartments?.length || 0}</p>
              </div>

              {vehicle.compartments && vehicle.compartments.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-gray-700 mb-2">Compartimentos:</p>
                  <div className="space-y-1">
                    {vehicle.compartments.map((comp, index) => (
                      <div key={comp.id} className="text-xs text-gray-600 flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {comp.name}: {comp.capacity}L
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhum veículo cadastrado</p>
              <p className="text-sm">Adicione veículos para o sistema</p>
            </div>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}
                  </CardTitle>
                  <Button variant="ghost" onClick={resetForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome do Veículo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="model">Modelo</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plate">Placa *</Label>
                      <Input
                        id="plate"
                        value={formData.plate}
                        onChange={(e) => setFormData(prev => ({ ...prev, plate: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fuelTankCapacity">Tanque Combustível (L)</Label>
                      <Input
                        id="fuelTankCapacity"
                        type="number"
                        min="0"
                        value={formData.fuelTankCapacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, fuelTankCapacity: parseFloat(e.target.value) || 0 }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="transportCapacity">Capacidade de Transporte (kg)</Label>
                    <Input
                      id="transportCapacity"
                      type="number"
                      min="0"
                      value={formData.transportCapacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, transportCapacity: parseFloat(e.target.value) || 0 }))}
                      className="mt-1"
                    />
                  </div>

                  {/* Compartimentos */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <Label>Compartimentos</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addCompartment}>
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {formData.compartments.map((compartment, index) => (
                        <div key={compartment.id} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Label>Nome</Label>
                            <Input
                              value={compartment.name}
                              onChange={(e) => updateCompartment(index, 'name', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div className="flex-1">
                            <Label>Capacidade (L)</Label>
                            <Input
                              type="number"
                              min="0"
                              value={compartment.capacity}
                              onChange={(e) => updateCompartment(index, 'capacity', parseInt(e.target.value) || 0)}
                              className="mt-1"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeCompartment(index)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-2" />
                      {editingVehicle ? 'Atualizar' : 'Cadastrar'}
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

export default VehicleManager;
