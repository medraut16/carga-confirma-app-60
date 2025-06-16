
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Trash2, Edit, FileText, User, Truck } from 'lucide-react';
import { DeliveryProtocol, Driver, Vehicle } from '@/types/protocol';

interface ProtocolListProps {
  protocols: DeliveryProtocol[];
  drivers: Driver[];
  vehicles: Vehicle[];
  onDelete: (id: string) => void;
  onEdit: (protocol: DeliveryProtocol) => void;
}

const ProtocolList: React.FC<ProtocolListProps> = ({ protocols, drivers, vehicles, onDelete, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<DeliveryProtocol | null>(null);

  const filteredProtocols = protocols.filter(protocol =>
    protocol.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    protocol.productDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      delivered: { label: 'Entregue', variant: 'default' as const },
      failed: { label: 'Falhou', variant: 'destructive' as const },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Motorista não encontrado';
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.name} (${vehicle.plate})` : 'Veículo não encontrado';
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por cliente ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredProtocols.length} protocolo(s) encontrado(s)
        </div>
      </div>

      {/* Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProtocols.map((protocol) => (
          <Card key={protocol.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {protocol.clientName}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {protocol.productDescription}
                  </p>
                </div>
                <Badge variant={getStatusBadge(protocol.status).variant}>
                  {getStatusBadge(protocol.status).label}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Quantidade:</span>
                  <span className="ml-1 font-medium">{protocol.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-500">Valor:</span>
                  <span className="ml-1 font-medium text-green-600">
                    {formatCurrency(protocol.deliveryValue)}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Data:</span>
                  <span className="ml-1">{formatDate(protocol.deliveryDate)} às {protocol.deliveryTime}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{getDriverName(protocol.driverId)}</span>
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  <Truck className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{getVehicleInfo(protocol.vehicleId)}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProtocol(protocol)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(protocol)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(protocol.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProtocols.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">
                {searchTerm ? 'Nenhum protocolo encontrado' : 'Nenhum protocolo cadastrado'}
              </p>
              <p className="text-sm">
                {searchTerm ? 'Tente ajustar os termos de busca' : 'Clique no botão "Novo Protocolo" para começar'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Protocol Detail Modal */}
      {selectedProtocol && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-none">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle>Detalhes do Protocolo</CardTitle>
                  <Button variant="ghost" onClick={() => setSelectedProtocol(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700">Cliente</h4>
                    <p>{selectedProtocol.clientName}</p>
                    {selectedProtocol.clientDocument && (
                      <p className="text-sm text-gray-600">CPF/CNPJ: {selectedProtocol.clientDocument}</p>
                    )}
                    {selectedProtocol.clientPhone && (
                      <p className="text-sm text-gray-600">Tel: {selectedProtocol.clientPhone}</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700">Endereço</h4>
                    <p>{selectedProtocol.address || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700">Produto</h4>
                    <p>{selectedProtocol.productDescription}</p>
                    <p className="text-sm text-gray-600">Qtd: {selectedProtocol.quantity}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700">Entrega</h4>
                    <p>{formatDate(selectedProtocol.deliveryDate)} às {selectedProtocol.deliveryTime}</p>
                    <p className="text-green-600 font-medium">{formatCurrency(selectedProtocol.deliveryValue)}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700">Motorista</h4>
                    <p>{getDriverName(selectedProtocol.driverId)}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700">Veículo</h4>
                    <p>{getVehicleInfo(selectedProtocol.vehicleId)}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-700">Status</h4>
                    <Badge variant={getStatusBadge(selectedProtocol.status).variant}>
                      {getStatusBadge(selectedProtocol.status).label}
                    </Badge>
                  </div>
                  
                  {selectedProtocol.notes && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-gray-700">Observações</h4>
                      <p>{selectedProtocol.notes}</p>
                    </div>
                  )}
                </div>
                
                {selectedProtocol.signature && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Assinatura</h4>
                    <img 
                      src={selectedProtocol.signature} 
                      alt="Assinatura" 
                      className="border rounded max-w-xs"
                    />
                  </div>
                )}
                
                {selectedProtocol.photos && selectedProtocol.photos.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Fotos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {selectedProtocol.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolList;
