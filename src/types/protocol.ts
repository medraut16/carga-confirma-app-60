
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

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  plate: string;
  fuelTankCapacity: number;
  transportCapacity: number;
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
