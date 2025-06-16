
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, PenTool, Camera } from 'lucide-react';
import { DeliveryProtocol, Product } from '@/types/protocol';
import SignatureCapture from './SignatureCapture';
import PhotoUpload from './PhotoUpload';

interface ProtocolFormProps {
  products: Product[];
  onSubmit: (protocol: Omit<DeliveryProtocol, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const ProtocolForm: React.FC<ProtocolFormProps> = ({ products, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientDocument: '',
    clientPhone: '',
    address: '',
    productId: '',
    productDescription: '',
    quantity: 1,
    deliveryValue: 0,
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryTime: new Date().toTimeString().slice(0, 5),
    notes: '',
    status: 'pending' as const,
  });

  const [signature, setSignature] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [showSignature, setShowSignature] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clientName || !formData.productDescription) {
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

  const handleProductSelect = (productId: string) => {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        productId,
        productDescription: selectedProduct.description,
        deliveryValue: selectedProduct.defaultValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        productId: '',
        productDescription: '',
        deliveryValue: 0
      }));
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Novo Protocolo de Entrega
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

          {/* Delivery Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Informações da Entrega</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product">Produto *</Label>
                <Select value={formData.productId} onValueChange={handleProductSelect}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Produto customizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-1">
                <Label htmlFor="productDescription">Descrição do Produto *</Label>
                <Textarea
                  id="productDescription"
                  value={formData.productDescription}
                  onChange={(e) => handleInputChange('productDescription', e.target.value)}
                  required
                  className="mt-1"
                  rows={2}
                  disabled={formData.productId && formData.productId !== 'custom'}
                />
              </div>
              
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="deliveryValue">Valor da Entrega (R$)</Label>
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
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                    <SelectItem value="failed">Falhou</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
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
          <div className="bg-green-50 p-4 rounded-lg">
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
              Salvar Protocolo
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
