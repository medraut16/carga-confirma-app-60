
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Calendar, Clock, Package, User, MapPin, X } from 'lucide-react';
import { DeliveryProtocol } from '@/types/protocol';

interface ProtocolListProps {
  protocols: DeliveryProtocol[];
  onEdit?: (protocol: DeliveryProtocol) => void;
  onDelete?: (id: string) => void;
  onView?: (protocol: DeliveryProtocol) => void;
}

const ProtocolList: React.FC<ProtocolListProps> = ({ 
  protocols, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      delivered: { label: 'Entregue', variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      failed: { label: 'Falhou', variant: 'destructive' as const, className: 'bg-red-100 text-red-800' },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  if (protocols.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Nenhum protocolo encontrado</p>
            <p className="text-sm">Crie um novo protocolo para começar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {protocols.map((protocol) => (
        <Card key={protocol.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Client and Product Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {protocol.clientName}
                    </h3>
                    {protocol.clientDocument && (
                      <p className="text-sm text-gray-600">{protocol.clientDocument}</p>
                    )}
                  </div>
                  <Badge 
                    variant={getStatusBadge(protocol.status).variant}
                    className={getStatusBadge(protocol.status).className}
                  >
                    {getStatusBadge(protocol.status).label}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span className="font-medium">Produto:</span>
                    <span>{protocol.productDescription}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium">Quantidade:</span>
                    <span>{protocol.quantity}</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium">Valor:</span>
                    <span className="text-green-600 font-semibold">
                      {formatCurrency(protocol.deliveryValue)}
                    </span>
                  </div>
                  
                  {protocol.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{protocol.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Info */}
              <div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(protocol.deliveryDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{protocol.deliveryTime}</span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-xs text-gray-500">
                      Criado em: {formatDate(protocol.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {onView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(protocol)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </Button>
                )}
                
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(protocol)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                )}
                
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(protocol.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                )}
              </div>
            </div>

            {/* Additional Info */}
            {(protocol.signature || protocol.photos.length > 0 || protocol.notes) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {protocol.signature && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Assinatura capturada
                    </span>
                  )}
                  
                  {protocol.photos.length > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {protocol.photos.length} foto(s) anexada(s)
                    </span>
                  )}
                  
                  {protocol.notes && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                      Observações adicionadas
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProtocolList;
