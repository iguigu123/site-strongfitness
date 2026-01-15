import { v4 as uuidv4 } from 'uuid';

export class UserToken {
  id: string;
  refresh_token: string;
  user_id: string;
  expires_date: Date;
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuidv4();
    }
    this.created_at = new Date();
  }
}
