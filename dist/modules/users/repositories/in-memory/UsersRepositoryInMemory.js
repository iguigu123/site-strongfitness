"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepositoryInMemory = void 0;
const User_1 = require("../../entities/User");
class UsersRepositoryInMemory {
    constructor() {
        this.users = [];
    }
    async create({ name, email, password_hash, isAdmin }) {
        const user = new User_1.User();
        Object.assign(user, {
            name,
            email,
            password_hash,
            isAdmin,
        });
        this.users.push(user);
        return user;
    }
    async findByEmail(email) {
        return this.users.find(user => user.email === email);
    }
    async findById(id) {
        return this.users.find(user => user.id === id);
    }
}
exports.UsersRepositoryInMemory = UsersRepositoryInMemory;
