
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Save } from 'lucide-react';
import { DeliveryProtocol } from '@/types/protocol';
import { toast } from '@/hooks/use-toast';
import SignatureCapture from './SignatureCapture';
import PhotoUpload from './PhotoUpload';

interface DeliveryConfirmationProps {
  protocol: DeliveryProtocol;
  onConfirm: (updatedProtocol: DeliveryProtocol) => void;
  onCancel: () => void;
}

const DeliveryConfirmation: React.FC<DeliveryConfirmationProps> = ({
  protocol,
  onConfirm,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    actualDeliveryDate: new Date().toISOString().split('T')[0],
    actualDeliveryTime: new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    signature: '',
    photos: [] as string[],
    notes: protocol.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.signature) {
      toast({
        title: "Assinatura obrigatória",
        description: "Por favor, colete a assinatura do cliente",
        variant: "destructive"
      });
      return;
    }

    const updatedProtocol: DeliveryProtocol = {
      ...protocol,
      status: 'delivered',
      actualDeliveryDate: new Date(formData.actualDeliveryDate),
      actualDeliveryTime: formData.actualDeliveryTime,
      signature: formData.signature,
      photos: formData.photos,
      notes: formData.notes
    };

    onConfirm(updatedProtocol);
    toast({
      title: "Entrega confirmada!",
      description: `Entrega para ${protocol.clientName} foi confirmada com sucesso.`
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle>Confirmar Entrega</CardTitle>
              <Button variant="ghost" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Informações da entrega */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Detalhes da Entrega</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Cliente:</span>
                  <p className="font-medium">{protocol.clientName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Telefone:</span>
                  <p className="font-medium">{protocol.clientPhone}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Endereço:</span>
                  <p className="font-medium">{protocol.address}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Produtos:</span>
                  <div className="space-y-1 mt-1">
                    {protocol.products.map((product, index) => (
                      <p key={index} className="font-medium">
                        {product.quantity}x {product.productName}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Valor:</span>
                  <p className="font-medium text-green-600">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(protocol.deliveryValue)}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data e hora de entrega */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="actualDeliveryDate">Data da Entrega *</Label>
                  <Input
                    id="actualDeliveryDate"
                    type="date"
                    value={formData.actualDeliveryDate}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      actualDeliveryDate: e.target.value 
                    }))}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="actualDeliveryTime">Hora da Entrega *</Label>
                  <Input
                    id="actualDeliveryTime"
                    type="time"
                    value={formData.actualDeliveryTime}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      actualDeliveryTime: e.target.value 
                    }))}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Assinatura */}
              <div>
                <Label>Assinatura do Cliente *</Label>
                <div className="mt-2">
                  <SignatureCapture
                    onSave={(signature) => 
                      setFormData(prev => ({ ...prev, signature }))
                    }
                    onCancel={() => {}}
                    initialSignature={formData.signature}
                  />
                </div>
              </div>

              {/* Upload de fotos */}
              <div>
                <Label>Fotos da Entrega (Opcional)</Label>
                <div className="mt-2">
                  <PhotoUpload
                    photos={formData.photos}
                    onPhotosChange={(photos) => 
                      setFormData(prev => ({ ...prev, photos }))
                    }
                    onClose={() => {}}
                  />
                </div>
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observações sobre a entrega..."
                  className="mt-1"
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Confirmar Entrega
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryConfirmation;
