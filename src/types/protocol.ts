
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultValue: number;
  createdAt: Date;
}

export interface DeliveryProtocol {
  id: string;
  clientName: string;
  clientDocument: string;
  clientPhone: string;
  address: string;
  productId: string;
  productDescription: string;
  quantity: number;
  deliveryValue: number;
  deliveryDate: Date;
  deliveryTime: string;
  signature: string;
  photos: string[];
  notes?: string;
  status: 'pending' | 'delivered' | 'failed';
  createdAt: Date;
}

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  clientName?: string;
  status?: string;
  productId?: string;
}
