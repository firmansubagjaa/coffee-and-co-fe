
import { Product } from '@/types';

const BASE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Espresso Romano',
    description: 'A shot of espresso with a slice of lemon.',
    subDescriptions: ['Single Origin', 'Medium Roast', 'Citrus Notes'],
    price: 3.50,
    category: 'coffee',
    image: 'https://picsum.photos/id/1060/400/400',
    images: [
      'https://picsum.photos/id/1060/800/800',
      'https://picsum.photos/id/425/800/800', // Coffee beans
      'https://picsum.photos/id/63/800/800', // Cup on table
    ],
    rating: 4.8,
    origin: 'Ethiopia & Colombia Blend',
    roastLevel: 'Medium-Dark',
    tastingNotes: ['Dark Chocolate', 'Caramel', 'Dried Fruit'],
    sizes: ['S', 'M', 'L'],
    grindOptions: ['Whole Bean', 'Ground', 'Espresso', 'French Press']
  },
  {
    id: '2',
    name: 'Cappuccino Art',
    description: 'Rich espresso with steamed milk foam art.',
    subDescriptions: ['Latte Art', 'Steamed Milk', 'Rich Foam'],
    price: 4.25,
    category: 'coffee',
    image: 'https://picsum.photos/id/766/400/400',
    images: [
      'https://picsum.photos/id/766/800/800',
      'https://picsum.photos/id/30/800/800', // Mug
      'https://picsum.photos/id/158/800/800', // Jazz vibe
    ],
    rating: 4.9,
    origin: 'Brazil Santos',
    roastLevel: 'Medium',
    tastingNotes: ['Nutty', 'Cocoa', 'Smooth'],
    sizes: ['S', 'M', 'L'],
    grindOptions: ['Whole Bean', 'Ground', 'Espresso']
  },
  {
    id: '3',
    name: 'French Croissant',
    description: 'Buttery, flaky, and freshly baked every morning.',
    subDescriptions: ['Freshly Baked', 'Butter Rich', 'Crispy Layers'],
    price: 3.00,
    category: 'pastry',
    image: 'https://picsum.photos/id/431/400/400',
    images: [
      'https://picsum.photos/id/431/800/800',
      'https://picsum.photos/id/488/800/800', // Bread
    ],
    rating: 4.7
  },
  {
    id: '4',
    name: 'Cold Brew Reserve',
    description: 'Steeped for 18 hours for maximum smoothness.',
    subDescriptions: ['18h Steep', 'Low Acidity', 'Smooth Finish'],
    price: 5.00,
    category: 'coffee',
    image: 'https://picsum.photos/id/425/400/400',
    images: [
      'https://picsum.photos/id/425/800/800',
      'https://picsum.photos/id/323/800/800',
    ],
    rating: 4.6,
    origin: 'Sumatra Mandheling',
    roastLevel: 'Dark',
    tastingNotes: ['Earth', 'Spice', 'Full Body'],
    sizes: ['M', 'L'],
    grindOptions: ['Whole Bean', 'Ground']
  },
  {
    id: '5',
    name: 'Caramel Macchiato',
    description: 'Espresso poured over vanilla milk, topped with caramel.',
    subDescriptions: ['Sweet Caramel', 'Vanilla Milk', 'Espresso Shot'],
    price: 4.75,
    category: 'coffee',
    image: 'https://picsum.photos/id/312/400/400',
    rating: 4.8,
    sizes: ['S', 'M', 'L']
  },
  {
    id: '6',
    name: 'Blueberry Muffin',
    description: 'Packed with fresh blueberries and a sugar crust.',
    subDescriptions: ['Fresh Berries', 'Sugar Crust', 'Soft Center'],
    price: 3.25,
    category: 'pastry',
    image: 'https://picsum.photos/id/1080/400/400',
    images: [
        'https://picsum.photos/id/1080/800/800',
        'https://picsum.photos/id/102/800/800', // Raspberries/fruit vibe
    ],
    rating: 4.5
  }
];

// Generate more products to demonstrate pagination
const GENERATED_PRODUCTS: Product[] = Array.from({ length: 30 }).map((_, i) => {
  const base = BASE_PRODUCTS[i % BASE_PRODUCTS.length];
  return {
    ...base,
    id: `gen-${i + 7}`,
    name: `${base.name} ${i + 1}`, // Differentiate names
    price: base.price + (i % 3), // Vary price slightly
    rating: 4 + (Math.random() * 1), // Random rating between 4-5
  };
});

// Changed from const to let to allow mutation
let MOCK_PRODUCTS: Product[] = [...BASE_PRODUCTS, ...GENERATED_PRODUCTS];

export const fetchProducts = async (): Promise<Product[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_PRODUCTS;
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_PRODUCTS.find(p => p.id === id);
};

export const fetchRelatedProducts = async (currentId: string): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return MOCK_PRODUCTS.filter(p => p.id !== currentId).slice(0, 3);
};

// CRUD Operations for Dashboard
export const addProduct = async (product: Omit<Product, 'id' | 'rating'>): Promise<Product> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newProduct: Product = {
        ...product,
        id: Math.random().toString(36).substr(2, 9),
        rating: 0
    };
    MOCK_PRODUCTS = [newProduct, ...MOCK_PRODUCTS];
    return newProduct;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    MOCK_PRODUCTS = MOCK_PRODUCTS.map(p => p.id === id ? { ...p, ...updates } : p);
    return MOCK_PRODUCTS.find(p => p.id === id);
};

export const deleteProduct = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
    return true;
};
