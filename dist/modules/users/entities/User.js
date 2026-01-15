"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const uuid_1 = require("uuid");
class User {
    constructor() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
        this.isAdmin = false;
        this.role = 'USER';
        this.created_at = new Date();
    }
}
exports.User = User;
