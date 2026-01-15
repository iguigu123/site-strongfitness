import { v4 as uuidv4 } from 'uuid';

export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  image_url: string;
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
    this.stock = 0;
    this.status = 'ACTIVE';
    this.created_at = new Date();
  }
}
