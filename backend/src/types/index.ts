export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  stripe_product_id?: string;
  stripe_price_id?: string;
  status: 'pending' | 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

export interface Admin {
  id: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface Settings {
  id: string;
  stripe_secret_key?: string;
  stripe_public_key?: string;
  updated_at: Date;
}