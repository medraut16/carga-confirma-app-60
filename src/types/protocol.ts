
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultValue: number;
  createdAt: Date;
}

export interface Driver {
  id: string;
  name: string;
  mainVehicleId: string;
  createdAt: Date;
}

export interface VehicleCompartment {
  id: string;
  name: string;
  capacity: number; // em litros
  currentProduct?: string; // ID do produto atualmente armazenado
  currentQuantity?: number; // quantidade atual armazenada
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  plate: string;
  fuelTankCapacity: number;
  transportCapacity: number;
  compartments: VehicleCompartment[];
  createdAt: Date;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  name: string;
  value: number;
  categoryId: string;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export interface DeliveryProduct {
  productId: string;
  productName: string;
  productDescription: string;
  quantity: number;
  compartmentId?: string; // compartimento onde está armazenado
}

export interface DeliveryProtocol {
  id: string;
  clientName: string;
  clientDocument: string;
  clientPhone: string;
  address: string;
  products: DeliveryProduct[]; // array de produtos
  deliveryValue: number; // valor único para toda a entrega
  deliveryDate: Date;
  deliveryTime: string;
  driverId: string;
  vehicleId: string;
  signature?: string;
  photos: string[];
  notes?: string;
  status: 'scheduled' | 'delivered';
  actualDeliveryDate?: Date;
  actualDeliveryTime?: string;
  createdAt: Date;
}

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  clientName?: string;
  status?: string;
  productId?: string;
  driverId?: string;
  vehicleId?: string;
}

export interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
}

export interface DailyFinancial {
  date: Date;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  deliveryCount: number;
  expenseCount: number;
}
