
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Search, Package, User, Calendar, DollarSign } from 'lucide-react';
import { DeliveryProtocol } from '@/types/protocol';

interface ProtocolListProps {
  protocols: DeliveryProtocol[];
  onDelete: (id: string) => void;
}

const ProtocolList: React.FC<ProtocolListProps> = ({ protocols, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState<DeliveryProtocol | null>(null);

  const filteredProtocols = protocols.filter(protocol =>
    protocol.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    protocol.productDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      delivered: { label: 'Entregue', variant: 'default' as const },
      failed: { label: 'Falhou', variant: 'destructive' as const },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por cliente ou produto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Protocol Cards */}
      <div className="grid gap-4">
        {filteredProtocols.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Nenhum protocolo encontrado' : 'Nenhum protocolo cadastrado'}
            </p>
          </Card>
        ) : (
          filteredProtocols.map((protocol) => (
            <Card key={protocol.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {protocol.clientName}
                      </h3>
                      <Badge variant={getStatusBadge(protocol.status).variant}>
                        {getStatusBadge(protocol.status).label}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {protocol.productDescription}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProtocol(protocol)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(protocol.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>Qtd: {protocol.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span>{formatCurrency(protocol.deliveryValue)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(protocol.deliveryDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{protocol.deliveryTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Protocol Detail Modal */}
      {selectedProtocol && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-none">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Detalhes do Protocolo
                  </h2>
                  <Button variant="ghost" onClick={() => setSelectedProtocol(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Dados do Cliente</h3>
                    <div className="space-y-2">
                      <p><strong>Nome:</strong> {selectedProtocol.clientName}</p>
                      <p><strong>Documento:</strong> {selectedProtocol.clientDocument || 'Não informado'}</p>
                      <p><strong>Telefone:</strong> {selectedProtocol.clientPhone || 'Não informado'}</p>
                      <p><strong>Endereço:</strong> {selectedProtocol.address || 'Não informado'}</p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">Dados da Entrega</h3>
                    <div className="space-y-2">
                      <p><strong>Produto:</strong> {selectedProtocol.productDescription}</p>
                      <p><strong>Quantidade:</strong> {selectedProtocol.quantity}</p>
                      <p><strong>Valor:</strong> {formatCurrency(selectedProtocol.deliveryValue)}</p>
                      <p><strong>Data:</strong> {formatDate(selectedProtocol.deliveryDate)}</p>
                      <p><strong>Horário:</strong> {selectedProtocol.deliveryTime}</p>
                      <p><strong>Status:</strong> 
                        <Badge variant={getStatusBadge(selectedProtocol.status).variant} className="ml-2">
                          {getStatusBadge(selectedProtocol.status).label}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Signature */}
                {selectedProtocol.signature && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Assinatura</h3>
                    <img
                      src={selectedProtocol.signature}
                      alt="Assinatura"
                      className="border rounded-lg max-w-md"
                    />
                  </div>
                )}

                {/* Photos */}
                {selectedProtocol.photos.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                      Fotos ({selectedProtocol.photos.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedProtocol.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedProtocol.notes && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Observações</h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedProtocol.notes}
                    </p>
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
