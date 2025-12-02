export interface InventoryItem {
    id: string;
    sku: string;
    name: string;
    category: 'Ingredient' | 'Retail' | 'Packaging' | 'Equipment';
    stock: number;
    unit: string;
    parLevel: number;
    unitCost: number;
    supplier: string;
    lastRestock: string;
}

export const MOCK_INVENTORY: InventoryItem[] = [
    { id: '1', sku: 'ING-001', name: 'Ethiopian Yirgacheffe Beans', category: 'Ingredient', stock: 5, unit: 'kg', parLevel: 15, unitCost: 18.50, supplier: 'Global Origins', lastRestock: '2024-05-10' },
    { id: '2', sku: 'ING-002', name: 'Oatly Barista Edition', category: 'Ingredient', stock: 12, unit: 'L', parLevel: 24, unitCost: 3.20, supplier: 'Local Dairy Co', lastRestock: '2024-05-20' },
    { id: '3', sku: 'PKG-101', name: '12oz Bio Cups', category: 'Packaging', stock: 450, unit: 'pcs', parLevel: 1000, unitCost: 0.15, supplier: 'EcoPack', lastRestock: '2024-05-01' },
    { id: '4', sku: 'RET-001', name: 'Ceramic Mug (Black)', category: 'Retail', stock: 8, unit: 'pcs', parLevel: 10, unitCost: 5.00, supplier: 'Ceramics Inc', lastRestock: '2024-04-15' },
    { id: '5', sku: 'ING-003', name: 'Vanilla Syrup', category: 'Ingredient', stock: 2, unit: 'btl', parLevel: 6, unitCost: 12.00, supplier: 'Flavor House', lastRestock: '2024-05-12' },
    { id: '6', sku: 'PKG-102', name: 'Paper Straws', category: 'Packaging', stock: 2000, unit: 'pcs', parLevel: 500, unitCost: 0.02, supplier: 'EcoPack', lastRestock: '2024-05-18' },
    { id: '7', sku: 'ING-004', name: 'Fresh Whole Milk', category: 'Ingredient', stock: 15, unit: 'L', parLevel: 20, unitCost: 1.50, supplier: 'Local Dairy Co', lastRestock: '2024-05-21' },
    { id: '8', sku: 'ING-005', name: 'Espresso Blend Beans', category: 'Ingredient', stock: 20, unit: 'kg', parLevel: 30, unitCost: 14.00, supplier: 'Global Origins', lastRestock: '2024-05-15' },
];
