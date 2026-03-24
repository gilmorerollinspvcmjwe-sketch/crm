/**
 * Mock Data for Orders
 */
import dayjs from 'dayjs';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  sortOrder: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  contractId?: string;
  contractNumber?: string;
  amount: number;
  status: 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  logisticsCompany?: string;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  notes?: string;
  ownerId: string;
  ownerName: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  items: OrderItem[];
}

/** Order status colors */
export const orderStatusColors: Record<string, { bg: string; color: string }> = {
  draft: { bg: '#F5F5F5', color: '#637381' },
  confirmed: { bg: '#E1F5FE', color: '#0288D1' },
  processing: { bg: '#FFF3E0', color: '#ED6C02' },
  shipped: { bg: '#F3E5F5', color: '#7B1FA2' },
  delivered: { bg: '#E8F5E9', color: '#2E7D32' },
  completed: { bg: '#C8E6C9', color: '#1B5E20' },
  cancelled: { bg: '#FFEBEE', color: '#D32F2F' },
};

/** Generate mock order items */
const generateOrderItems = (orderId: string): OrderItem[] => {
  const products = [
    { name: 'ERP Enterprise Edition', sku: 'ERP-ENT-001', price: 500000 },
    { name: 'CRM Standard Edition', sku: 'CRM-STD-001', price: 200000 },
    { name: 'Implementation Service', sku: 'SRV-IMP-001', price: 150000 },
    { name: 'Annual Maintenance', sku: 'SRV-AMC-001', price: 80000 },
    { name: 'Training Service', sku: 'SRV-TRN-001', price: 50000 },
    { name: 'Cloud Hosting (Yearly)', sku: 'CLOUD-YR-001', price: 120000 },
  ];
  
  const itemCount = Math.floor(Math.random() * 3) + 1;
  const items: OrderItem[] = [];
  const selectedProducts = products.sort(() => Math.random() - 0.5).slice(0, itemCount);
  
  selectedProducts.forEach((product, index) => {
    const quantity = Math.floor(Math.random() * 3) + 1;
    items.push({
      id: `item-${orderId}-${index}`,
      orderId,
      productId: `prod-${index}`,
      productName: product.name,
      productSku: product.sku,
      unitPrice: product.price,
      quantity,
      subtotal: product.price * quantity,
      sortOrder: index,
    });
  });
  
  return items;
};

/** Mock orders data */
export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2026-00001',
    customerId: 'cust-001',
    customerName: '北京科技创新有限公司',
    contractId: 'cont-001',
    contractNumber: 'CONT-2026-00001',
    amount: 850000,
    status: 'completed',
    orderDate: '2026-01-15',
    deliveryDate: '2026-02-20',
    deliveryAddress: '北京市海淀区中关村大街1号',
    logisticsCompany: '顺丰速运',
    trackingNumber: 'SF1234567890',
    shippedAt: '2026-02-10',
    deliveredAt: '2026-02-18',
    completedAt: '2026-02-20',
    notes: '客户急需，优先安排发货',
    ownerId: 'user-001',
    ownerName: '张三',
    createdBy: '张三',
    createdAt: '2026-01-15 10:30:00',
    updatedAt: '2026-02-20 16:00:00',
    items: [],
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-2026-00002',
    customerId: 'cust-002',
    customerName: '上海智能制造有限公司',
    amount: 1200000,
    status: 'shipped',
    orderDate: '2026-02-01',
    deliveryDate: '2026-03-25',
    deliveryAddress: '上海市浦东新区张江高科技园区',
    logisticsCompany: '京东物流',
    trackingNumber: 'JD9876543210',
    shippedAt: '2026-03-20',
    notes: '包含定制开发服务',
    ownerId: 'user-002',
    ownerName: '李四',
    createdBy: '李四',
    createdAt: '2026-02-01 14:20:00',
    updatedAt: '2026-03-20 09:00:00',
    items: [],
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-2026-00003',
    customerId: 'cust-003',
    customerName: '广州金融服务有限公司',
    amount: 560000,
    status: 'processing',
    orderDate: '2026-02-20',
    deliveryDate: '2026-04-10',
    deliveryAddress: '广州市天河区珠江新城',
    notes: '金融行业合规要求较高',
    ownerId: 'user-001',
    ownerName: '张三',
    createdBy: '张三',
    createdAt: '2026-02-20 09:15:00',
    updatedAt: '2026-03-15 11:30:00',
    items: [],
  },
  {
    id: 'ord-004',
    orderNumber: 'ORD-2026-00004',
    customerId: 'cust-004',
    customerName: '深圳未来科技有限公司',
    contractId: 'cont-002',
    contractNumber: 'CONT-2026-00002',
    amount: 320000,
    status: 'confirmed',
    orderDate: '2026-03-01',
    deliveryDate: '2026-04-15',
    deliveryAddress: '深圳市南山区科技园',
    notes: '初创公司，需要较多技术支持',
    ownerId: 'user-003',
    ownerName: '王五',
    createdBy: '王五',
    createdAt: '2026-03-01 16:45:00',
    items: [],
  },
  {
    id: 'ord-005',
    orderNumber: 'ORD-2026-00005',
    customerId: 'cust-005',
    customerName: '杭州电子商务有限公司',
    amount: 780000,
    status: 'draft',
    orderDate: '2026-03-10',
    ownerId: 'user-002',
    ownerName: '李四',
    createdBy: '李四',
    createdAt: '2026-03-10 11:00:00',
    items: [],
  },
  {
    id: 'ord-006',
    orderNumber: 'ORD-2026-00006',
    customerId: 'cust-006',
    customerName: '成都医疗科技有限公司',
    amount: 450000,
    status: 'delivered',
    orderDate: '2026-01-25',
    deliveryDate: '2026-03-01',
    deliveryAddress: '成都市高新区天府大道',
    logisticsCompany: '顺丰速运',
    trackingNumber: 'SF2345678901',
    shippedAt: '2026-02-25',
    deliveredAt: '2026-02-28',
    ownerId: 'user-001',
    ownerName: '张三',
    createdBy: '张三',
    createdAt: '2026-01-25 14:30:00',
    updatedAt: '2026-02-28 17:00:00',
    items: [],
  },
  {
    id: 'ord-007',
    orderNumber: 'ORD-2026-00007',
    customerId: 'cust-007',
    customerName: '武汉汽车零部件有限公司',
    amount: 890000,
    status: 'processing',
    orderDate: '2026-02-15',
    deliveryDate: '2026-04-01',
    deliveryAddress: '武汉市东湖高新区',
    ownerId: 'user-003',
    ownerName: '王五',
    createdBy: '王五',
    createdAt: '2026-02-15 10:00:00',
    updatedAt: '2026-03-01 09:30:00',
    items: [],
  },
  {
    id: 'ord-008',
    orderNumber: 'ORD-2026-00008',
    customerId: 'cust-008',
    customerName: '南京教育科技有限公司',
    amount: 280000,
    status: 'cancelled',
    orderDate: '2026-02-10',
    cancelledAt: '2026-02-20',
    cancelReason: '客户预算调整，暂时取消订单',
    ownerId: 'user-002',
    ownerName: '李四',
    createdBy: '李四',
    createdAt: '2026-02-10 15:20:00',
    updatedAt: '2026-02-20 11:00:00',
    items: [],
  },
  {
    id: 'ord-009',
    orderNumber: 'ORD-2026-00009',
    customerId: 'cust-009',
    customerName: '天津物流有限公司',
    amount: 620000,
    status: 'confirmed',
    orderDate: '2026-03-05',
    deliveryDate: '2026-04-20',
    deliveryAddress: '天津市滨海新区',
    ownerId: 'user-001',
    ownerName: '张三',
    createdBy: '张三',
    createdAt: '2026-03-05 09:45:00',
    items: [],
  },
  {
    id: 'ord-010',
    orderNumber: 'ORD-2026-00010',
    customerId: 'cust-010',
    customerName: '苏州精密制造有限公司',
    contractId: 'cont-003',
    contractNumber: 'CONT-2026-00003',
    amount: 1500000,
    status: 'shipped',
    orderDate: '2026-02-25',
    deliveryDate: '2026-04-05',
    deliveryAddress: '苏州市工业园区',
    logisticsCompany: '德邦物流',
    trackingNumber: 'DB4567890123',
    shippedAt: '2026-03-22',
    ownerId: 'user-003',
    ownerName: '王五',
    createdBy: '王五',
    createdAt: '2026-02-25 13:10:00',
    updatedAt: '2026-03-22 16:00:00',
    items: [],
  },
  {
    id: 'ord-011',
    orderNumber: 'ORD-2026-00011',
    customerId: 'cust-011',
    customerName: '青岛海洋科技有限公司',
    amount: 380000,
    status: 'draft',
    orderDate: '2026-03-15',
    ownerId: 'user-002',
    ownerName: '李四',
    createdBy: '李四',
    createdAt: '2026-03-15 10:30:00',
    items: [],
  },
  {
    id: 'ord-012',
    orderNumber: 'ORD-2026-00012',
    customerId: 'cust-012',
    customerName: '厦门旅游服务有限公司',
    amount: 195000,
    status: 'completed',
    orderDate: '2026-01-10',
    deliveryDate: '2026-02-15',
    deliveryAddress: '厦门市思明区',
    logisticsCompany: '中通快递',
    trackingNumber: 'ZT7890123456',
    shippedAt: '2026-02-08',
    deliveredAt: '2026-02-14',
    completedAt: '2026-02-15',
    ownerId: 'user-001',
    ownerName: '张三',
    createdBy: '张三',
    createdAt: '2026-01-10 11:20:00',
    updatedAt: '2026-02-15 14:30:00',
    items: [],
  },
  {
    id: 'ord-013',
    orderNumber: 'ORD-2026-00013',
    customerId: 'cust-013',
    customerName: '西安软件有限公司',
    amount: 420000,
    status: 'delivered',
    orderDate: '2026-02-05',
    deliveryDate: '2026-03-20',
    deliveryAddress: '西安市高新区',
    logisticsCompany: '顺丰速运',
    trackingNumber: 'SF3456789012',
    shippedAt: '2026-03-15',
    deliveredAt: '2026-03-19',
    ownerId: 'user-003',
    ownerName: '王五',
    createdBy: '王五',
    createdAt: '2026-02-05 16:00:00',
    updatedAt: '2026-03-19 12:00:00',
    items: [],
  },
  {
    id: 'ord-014',
    orderNumber: 'ORD-2026-00014',
    customerId: 'cust-014',
    customerName: '长沙新媒体有限公司',
    amount: 165000,
    status: 'processing',
    orderDate: '2026-03-08',
    deliveryDate: '2026-04-12',
    deliveryAddress: '长沙市岳麓区',
    ownerId: 'user-002',
    ownerName: '李四',
    createdBy: '李四',
    createdAt: '2026-03-08 09:00:00',
    updatedAt: '2026-03-18 10:30:00',
    items: [],
  },
  {
    id: 'ord-015',
    orderNumber: 'ORD-2026-00015',
    customerId: 'cust-015',
    customerName: '郑州物流科技有限公司',
    amount: 530000,
    status: 'confirmed',
    orderDate: '2026-03-12',
    deliveryDate: '2026-04-25',
    deliveryAddress: '郑州市郑东新区',
    notes: '需要定制接口对接',
    ownerId: 'user-001',
    ownerName: '张三',
    createdBy: '张三',
    createdAt: '2026-03-12 14:45:00',
    items: [],
  },
  {
    id: 'ord-016',
    orderNumber: 'ORD-2026-00016',
    customerId: 'cust-002',
    customerName: '上海智能制造有限公司',
    amount: 680000,
    status: 'draft',
    orderDate: '2026-03-18',
    ownerId: 'user-002',
    ownerName: '李四',
    createdBy: '李四',
    createdAt: '2026-03-18 11:30:00',
    items: [],
  },
  {
    id: 'ord-017',
    orderNumber: 'ORD-2026-00017',
    customerId: 'cust-006',
    customerName: '成都医疗科技有限公司',
    contractId: 'cont-004',
    contractNumber: 'CONT-2026-00004',
    amount: 920000,
    status: 'shipped',
    orderDate: '2026-02-28',
    deliveryDate: '2026-04-08',
    deliveryAddress: '成都市高新区天府大道',
    logisticsCompany: '京东物流',
    trackingNumber: 'JD1122334455',
    shippedAt: '2026-03-24',
    ownerId: 'user-003',
    ownerName: '王五',
    createdBy: '王五',
    createdAt: '2026-02-28 10:15:00',
    updatedAt: '2026-03-24 15:00:00',
    items: [],
  },
  {
    id: 'ord-018',
    orderNumber: 'ORD-2026-00018',
    customerId: 'cust-009',
    customerName: '天津物流有限公司',
    amount: 245000,
    status: 'cancelled',
    orderDate: '2026-02-22',
    cancelledAt: '2026-03-05',
    cancelReason: '客户选择其他供应商',
    ownerId: 'user-001',
    ownerName: '张三',
    createdBy: '张三',
    createdAt: '2026-02-22 13:30:00',
    updatedAt: '2026-03-05 09:00:00',
    items: [],
  },
];

// Generate items for each order
mockOrders.forEach(order => {
  order.items = generateOrderItems(order.id);
  // Recalculate amount based on items
  if (order.items.length > 0) {
    order.amount = order.items.reduce((sum, item) => sum + item.subtotal, 0);
  }
});

/** Get all orders */
export const getOrders = (): Order[] => {
  return mockOrders;
};

/** Get order by ID */
export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find(order => order.id === id);
};

/** Get order by order number */
export const getOrderByNumber = (orderNumber: string): Order | undefined => {
  return mockOrders.find(order => order.orderNumber === orderNumber);
};

/** Get orders by customer ID */
export const getOrdersByCustomerId = (customerId: string): Order[] => {
  return mockOrders.filter(order => order.customerId === customerId);
};

/** Get orders by status */
export const getOrdersByStatus = (status: Order['status']): Order[] => {
  return mockOrders.filter(order => order.status === status);
};

/** Filter orders */
export const filterOrders = (filters: {
  search?: string;
  status?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
}): Order[] => {
  return mockOrders.filter(order => {
    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      if (!order.orderNumber.toLowerCase().includes(search) &&
          !order.customerName.toLowerCase().includes(search)) {
        return false;
      }
    }
    
    // Status filter
    if (filters.status && order.status !== filters.status) {
      return false;
    }
    
    // Customer filter
    if (filters.customerId && order.customerId !== filters.customerId) {
      return false;
    }
    
    // Date range filter
    if (filters.dateFrom && order.orderDate < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && order.orderDate > filters.dateTo) {
      return false;
    }
    
    // Amount range filter
    if (filters.amountMin !== undefined && order.amount < filters.amountMin) {
      return false;
    }
    if (filters.amountMax !== undefined && order.amount > filters.amountMax) {
      return false;
    }
    
    return true;
  });
};

/** Order status labels */
export const orderStatusLabels: Record<Order['status'], string> = {
  draft: '草稿',
  confirmed: '已确认',
  processing: '处理中',
  shipped: '已发货',
  delivered: '已送达',
  completed: '已完成',
  cancelled: '已取消',
};

/** Order status flow */
export const orderStatusFlow: Order['status'][] = [
  'draft',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'completed',
];