
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Calendar, DollarSign, Package, TrendingUp } from 'lucide-react';
import { DeliveryProtocol, ReportFilters } from '@/types/protocol';

interface ReportGeneratorProps {
  protocols: DeliveryProtocol[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ protocols }) => {
  const [filters, setFilters] = useState<ReportFilters>({});
  const [showReport, setShowReport] = useState(false);

  const handleFilterChange = (field: keyof ReportFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredProtocols = protocols.filter(protocol => {
    if (filters.startDate && protocol.deliveryDate < filters.startDate) return false;
    if (filters.endDate && protocol.deliveryDate > filters.endDate) return false;
    if (filters.clientName && !protocol.clientName.toLowerCase().includes(filters.clientName.toLowerCase())) return false;
    if (filters.status && protocol.status !== filters.status) return false;
    return true;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendente', variant: 'secondary' as const },
      delivered: { label: 'Entregue', variant: 'default' as const },
      failed: { label: 'Falhou', variant: 'destructive' as const },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const generateReport = () => {
    setShowReport(true);
  };

  const exportReport = () => {
    const reportData = filteredProtocols.map(protocol => ({
      'Cliente': protocol.clientName,
      'Produto': protocol.productDescription,
      'Quantidade': protocol.quantity,
      'Valor': protocol.deliveryValue,
      'Data': formatDate(protocol.deliveryDate),
      'Horário': protocol.deliveryTime,
      'Status': protocol.status,
      'Endereço': protocol.address,
      'Observações': protocol.notes || ''
    }));

    const csvContent = [
      Object.keys(reportData[0] || {}).join(','),
      ...reportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_protocolos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const totalValue = filteredProtocols.reduce((sum, protocol) => sum + protocol.deliveryValue, 0);
  const totalQuantity = filteredProtocols.reduce((sum, protocol) => sum + protocol.quantity, 0);
  const deliveredCount = filteredProtocols.filter(p => p.status === 'delivered').length;
  const pendingCount = filteredProtocols.filter(p => p.status === 'pending').length;
  const failedCount = filteredProtocols.filter(p => p.status === 'failed').length;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Filtros do Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : undefined)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="clientName">Cliente</Label>
              <Input
                id="clientName"
                placeholder="Nome do cliente"
                value={filters.clientName || ''}
                onChange={(e) => handleFilterChange('clientName', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value === 'all' ? undefined : value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="failed">Falhou</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button onClick={generateReport} className="bg-blue-600 hover:bg-blue-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Gerar Relatório
            </Button>
            
            {showReport && (
              <Button onClick={exportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {showReport && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total de Protocolos</p>
                    <p className="text-2xl font-bold text-blue-800">{filteredProtocols.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Valor Total</p>
                    <p className="text-2xl font-bold text-green-800">{formatCurrency(totalValue)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Quantidade Total</p>
                    <p className="text-2xl font-bold text-purple-800">{totalQuantity}</p>
                  </div>
                  <Package className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Taxa de Entrega</p>
                    <p className="text-2xl font-bold text-orange-800">
                      {filteredProtocols.length > 0 ? Math.round((deliveredCount / filteredProtocols.length) * 100) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <span className="font-medium">Entregues</span>
                  <Badge variant="default">{deliveredCount}</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Pendentes</span>
                  <Badge variant="secondary">{pendingCount}</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <span className="font-medium">Falharam</span>
                  <Badge variant="destructive">{failedCount}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Report */}
          <Card>
            <CardHeader>
              <CardTitle>Relatório Detalhado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Cliente</th>
                      <th className="border border-gray-300 p-2 text-left">Produto</th>
                      <th className="border border-gray-300 p-2 text-left">Qtd</th>
                      <th className="border border-gray-300 p-2 text-left">Valor</th>
                      <th className="border border-gray-300 p-2 text-left">Data</th>
                      <th className="border border-gray-300 p-2 text-left">Horário</th>
                      <th className="border border-gray-300 p-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProtocols.map((protocol) => (
                      <tr key={protocol.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-2">{protocol.clientName}</td>
                        <td className="border border-gray-300 p-2">{protocol.productDescription}</td>
                        <td className="border border-gray-300 p-2">{protocol.quantity}</td>
                        <td className="border border-gray-300 p-2">{formatCurrency(protocol.deliveryValue)}</td>
                        <td className="border border-gray-300 p-2">{formatDate(protocol.deliveryDate)}</td>
                        <td className="border border-gray-300 p-2">{protocol.deliveryTime}</td>
                        <td className="border border-gray-300 p-2">
                          <Badge variant={getStatusBadge(protocol.status).variant}>
                            {getStatusBadge(protocol.status).label}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredProtocols.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum protocolo encontrado com os filtros aplicados
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportGenerator;
