import productsData from "@/data/products.json";

export interface ProductSeller {
  name: string;
  rating: number;
}

export interface Product {
  id: number;
  slug: string;
  brand: string;
  title: string;
  price: number;
  originalPrice?: number;
  condition: string;
  location: string;
  material: string;
  color: string;
  dimensions: string;
  style: string;
  room: string;
  description: string;
  seller: ProductSeller;
  images: string[];
}

export const products: Product[] = productsData as Product[];

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: number | string): Product | undefined {
  return products.find((p) => String(p.id) === String(id));
}

export function getRelatedProducts(currentId: number, limit = 4): Product[] {
  return products.filter((p) => p.id !== currentId).slice(0, limit);
}
