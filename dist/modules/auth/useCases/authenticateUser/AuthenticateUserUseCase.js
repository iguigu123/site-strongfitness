"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUserUseCase = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const tsyringe_1 = require("tsyringe");
const bcryptjs_1 = require("bcryptjs");
const AppError_1 = require("@shared/errors/AppError");
const auth_1 = __importDefault(require("@config/auth"));
let AuthenticateUserUseCase = class AuthenticateUserUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute({ email, password }) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.AppError('Email or password incorrect');
        }
        const passwordMatch = await (0, bcryptjs_1.compare)(password, user.password_hash);
        if (!passwordMatch) {
            throw new AppError_1.AppError('Email or password incorrect');
        }
        const { secret, expiresIn } = auth_1.default.jwt;
        const signOptions = {
            subject: user.id,
            expiresIn: expiresIn,
        };
        const token = (0, jsonwebtoken_1.sign)({}, secret, signOptions);
        return {
            user: {
                name: user.name,
                email: user.email,
            },
            token,
        };
    }
};
exports.AuthenticateUserUseCase = AuthenticateUserUseCase;
exports.AuthenticateUserUseCase = AuthenticateUserUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('UsersRepository')),
    __metadata("design:paramtypes", [Object])
], AuthenticateUserUseCase);
