import { v4 as uuidv4 } from 'uuid';

export class User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  isAdmin: boolean;
  role: 'ADMIN' | 'USER';
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
    this.isAdmin = false;
    this.role = 'USER';
    this.created_at = new Date();
  }
}
