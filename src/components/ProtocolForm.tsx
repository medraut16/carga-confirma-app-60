import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, PenTool, Camera, Plus, Trash2 } from 'lucide-react';
import { DeliveryProtocol, Product, Driver, Vehicle, DeliveryProduct } from '@/types/protocol';
import SignatureCapture from './SignatureCapture';
import PhotoUpload from './PhotoUpload';

interface ProtocolFormProps {
  products: Product[];
  drivers: Driver[];
  vehicles: Vehicle[];
  onSubmit: (protocol: Omit<DeliveryProtocol, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  editingProtocol?: DeliveryProtocol | null;
}

const ProtocolForm: React.FC<ProtocolFormProps> = ({ 
  products, 
  drivers, 
  vehicles, 
  onSubmit, 
  onCancel, 
  editingProtocol 
}) => {
  const [formData, setFormData] = useState({
    clientName: editingProtocol?.clientName || '',
    clientDocument: editingProtocol?.clientDocument || '',
    clientPhone: editingProtocol?.clientPhone || '',
    address: editingProtocol?.address || '',
    products: editingProtocol?.products || [{ productId: '', productName: '', productDescription: '', quantity: 1, compartmentId: '' }] as DeliveryProduct[],
    deliveryValue: editingProtocol?.deliveryValue || 0,
    deliveryDate: editingProtocol ? editingProtocol.deliveryDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    deliveryTime: editingProtocol?.deliveryTime || new Date().toTimeString().slice(0, 5),
    driverId: editingProtocol?.driverId || '',
    vehicleId: editingProtocol?.vehicleId || '',
    notes: editingProtocol?.notes || '',
    status: editingProtocol?.status || 'scheduled' as const,
  });

  const [signature, setSignature] = useState(editingProtocol?.signature || '');
  const [photos, setPhotos] = useState<string[]>(editingProtocol?.photos || []);
  const [showSignature, setShowSignature] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || formData.products.some(p => !p.productName) || !formData.driverId || !formData.vehicleId) {
      alert('Por favor, preencha os campos obrigatórios');
      return;
    }

    onSubmit({
      ...formData,
      deliveryDate: new Date(formData.deliveryDate),
      signature,
      photos,
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { productId: '', productName: '', productDescription: '', quantity: 1, compartmentId: '' }]
    }));
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateProduct = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      )
    }));
  };

  const handleProductSelect = (index: number, productId: string) => {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      updateProduct(index, 'productId', productId);
      updateProduct(index, 'productName', selectedProduct.name);
      updateProduct(index, 'productDescription', selectedProduct.description);
    } else {
      updateProduct(index, 'productId', '');
      updateProduct(index, 'productName', '');
      updateProduct(index, 'productDescription', '');
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {editingProtocol ? 'Editar Protocolo de Entrega' : 'Novo Protocolo de Entrega'}
          </CardTitle>
          <Button variant="ghost" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Dados do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="clientDocument">CPF/CNPJ</Label>
                <Input
                  id="clientDocument"
                  value={formData.clientDocument}
                  onChange={(e) => handleInputChange('clientDocument', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="clientPhone">Telefone</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Driver and Vehicle Information - moved before products */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Motorista e Veículo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="driver">Motorista *</Label>
                <select
                  id="driver"
                  value={formData.driverId}
                  onChange={(e) => handleInputChange('driverId', e.target.value)}
                  className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um motorista</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="vehicle">Veículo (Placa) *</Label>
                <select
                  id="vehicle"
                  value={formData.vehicleId}
                  onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                  className="mt-1 w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecione um veículo</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.plate})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedVehicle && selectedVehicle.compartments && selectedVehicle.compartments.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  Compartimentos disponíveis no veículo selecionado:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedVehicle.compartments.map(comp => (
                    <div key={comp.id} className="text-xs bg-white p-2 rounded border">
                      <span className="font-medium">{comp.name}</span>
                      <br />
                      <span className="text-gray-600">Capacidade: {comp.capacity}L</span>
                      {comp.currentProduct && (
                        <>
                          <br />
                          <span className="text-orange-600">
                            Em uso: {comp.currentQuantity}L
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Products Information - updated */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Produtos da Entrega</h3>
              <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar Produto
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.products.map((product, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded-lg bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-700">Produto {index + 1}</h4>
                    {formData.products.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeProduct(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Produto *</Label>
                      <Select value={product.productId} onValueChange={(value) => handleProductSelect(index, value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">Produto customizado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label>Descrição do Produto *</Label>
                      <Textarea
                        value={product.productDescription}
                        onChange={(e) => updateProduct(index, 'productDescription', e.target.value)}
                        required
                        className="mt-1"
                        rows={2}
                        disabled={product.productId && product.productId !== 'custom'}
                      />
                    </div>
                    
                    {selectedVehicle && selectedVehicle.compartments && selectedVehicle.compartments.length > 0 && (
                      <div className="md:col-span-2">
                        <Label>Compartimento do Veículo *</Label>
                        <Select value={product.compartmentId} onValueChange={(value) => updateProduct(index, 'compartmentId', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Selecione o compartimento para este produto" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedVehicle.compartments.map(comp => (
                              <SelectItem key={comp.id} value={comp.id}>
                                {comp.name} - Capacidade: {comp.capacity}L
                                {comp.currentProduct && ` (Em uso: ${comp.currentQuantity}L)`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-600 mt-1">
                          Selecione em qual compartimento do veículo este produto será transportado
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <Label htmlFor="deliveryValue">Valor Total da Entrega (R$)</Label>
              <Input
                id="deliveryValue"
                type="number"
                step="0.01"
                min="0"
                value={formData.deliveryValue}
                onChange={(e) => handleInputChange('deliveryValue', parseFloat(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Informações da Entrega</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryDate">Data da Entrega</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="deliveryTime">Horário da Entrega</Label>
                <Input
                  id="deliveryTime"
                  type="time"
                  value={formData.deliveryTime}
                  onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendado</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Signature and Photos */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Assinatura e Fotos</h3>
            <div className="flex flex-wrap gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSignature(true)}
                className="flex items-center gap-2"
              >
                <PenTool className="h-4 w-4" />
                {signature ? 'Editar Assinatura' : 'Capturar Assinatura'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPhotos(true)}
                className="flex items-center gap-2"
              >
                <Camera className="h-4 w-4" />
                Anexar Fotos ({photos.length})
              </Button>
            </div>
            
            {signature && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Assinatura capturada:</p>
                <img src={signature} alt="Assinatura" className="border rounded max-w-xs" />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {editingProtocol ? 'Atualizar Protocolo' : 'Salvar Protocolo'}
            </Button>
          </div>
        </form>

        {/* Signature Modal */}
        {showSignature && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full">
              <SignatureCapture
                onSave={setSignature}
                onCancel={() => setShowSignature(false)}
                initialSignature={signature}
              />
            </div>
          </div>
        )}

        {/* Photos Modal */}
        {showPhotos && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <PhotoUpload
                photos={photos}
                onPhotosChange={setPhotos}
                onClose={() => setShowPhotos(false)}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProtocolForm;
