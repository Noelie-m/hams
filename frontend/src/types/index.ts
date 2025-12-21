export interface Appliance {
  id: number;
  name: string;
  model_number?: string;
  purchased_date?: string;
  disposed_date?: string;
  price?: number;
  memo?: string;
  created_at: string;
  updated_at: string;
}
