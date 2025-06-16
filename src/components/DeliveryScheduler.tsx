
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Truck, Package, CheckCircle, Plus } from 'lucide-react';
import { DeliveryProtocol, Product, Driver, Vehicle } from '@/types/protocol';
import { toast } from '@/hooks/use-toast';

interface DeliverySchedulerProps {
  protocols: DeliveryProtocol[];
  products: Product[];
  drivers: Driver[];
  vehicles: Vehicle[];
  onProtocolsChange: (protocols: DeliveryProtocol[]) => void;
  onConfirmDelivery: (protocol: DeliveryProtocol) => void;
}

const DeliveryScheduler: React.FC<DeliverySchedulerProps> = ({
  protocols,
  products,
  drivers,
  vehicles,
  onProtocolsChange,
  onConfirmDelivery
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedDateObj = new Date(selectedDate);
  selectedDateObj.setHours(0, 0, 0, 0);

  const scheduledDeliveries = protocols.filter(p => {
    const deliveryDate = new Date(p.deliveryDate);
    deliveryDate.setHours(0, 0, 0, 0);
    return deliveryDate.getTime() === selectedDateObj.getTime();
  }).sort((a, b) => a.deliveryTime.localeCompare(b.deliveryTime));

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Produto não encontrado';
  };

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver?.name || 'Motorista não encontrado';
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.name} (${vehicle.plate})` : 'Veículo não encontrado';
  };

  const handleConfirmDelivery = (protocol: DeliveryProtocol) => {
    onConfirmDelivery(protocol);
  };

  const pendingDeliveries = scheduledDeliveries.filter(d => d.status === 'scheduled');
  const completedDeliveries = scheduledDeliveries.filter(d => d.status === 'delivered');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Programação de Entregas</h2>
          <p className="text-gray-600">Gerencie as entregas programadas por data</p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <Label htmlFor="date-select">Selecionar Data</Label>
            <Input
              id="date-select"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Resumo do dia */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingDeliveries.length}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{completedDeliveries.length}</p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total do Dia</p>
                <p className="text-2xl font-bold text-blue-600">{scheduledDeliveries.length}</p>
              </div>
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de entregas pendentes */}
      {pendingDeliveries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Entregas Pendentes ({pendingDeliveries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDeliveries.map((protocol) => (
                <div
                  key={protocol.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-yellow-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          {protocol.deliveryTime}
                        </Badge>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {protocol.clientName}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{protocol.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{getProductName(protocol.productId)} - Qtd: {protocol.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{getDriverName(protocol.driverId)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span>{getVehicleInfo(protocol.vehicleId)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(protocol.deliveryValue)}
                        </span>
                        <span className="text-sm text-gray-500">
                          Tel: {protocol.clientPhone}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleConfirmDelivery(protocol)}
                      className="bg-green-600 hover:bg-green-700 text-white ml-4"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar Entrega
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de entregas concluídas */}
      {completedDeliveries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Entregas Concluídas ({completedDeliveries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedDeliveries.map((protocol) => (
                <div
                  key={protocol.id}
                  className="border rounded-lg p-4 bg-green-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-green-100 text-green-800">
                          Entregue às {protocol.actualDeliveryTime || protocol.deliveryTime}
                        </Badge>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {protocol.clientName}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>{getProductName(protocol.productId)} - Qtd: {protocol.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{getDriverName(protocol.driverId)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(protocol.deliveryValue)}
                        </span>
                        {protocol.signature && (
                          <Badge className="bg-blue-100 text-blue-800">
                            Assinatura coletada
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mensagem quando não há entregas */}
      {scheduledDeliveries.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Nenhuma entrega programada</p>
              <p className="text-sm">Não há entregas programadas para {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeliveryScheduler;
