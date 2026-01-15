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
exports.AuthenticateUserService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const tsyringe_1 = require("tsyringe");
const bcryptjs_1 = require("bcryptjs");
const uuid_1 = require("uuid");
const AppError_1 = require("@shared/errors/AppError");
const auth_1 = __importDefault(require("@config/auth"));
let AuthenticateUserService = class AuthenticateUserService {
    constructor(usersRepository, userTokensRepository) {
        this.usersRepository = usersRepository;
        this.userTokensRepository = userTokensRepository;
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
        const { secret, expiresIn, refreshTokenExpiresInDays } = auth_1.default.jwt;
        const signOptions = {
            subject: user.id,
            expiresIn: expiresIn,
        };
        const token = (0, jsonwebtoken_1.sign)({}, secret, signOptions);
        const refresh_token = (0, uuid_1.v4)();
        const expires_date = new Date();
        expires_date.setDate(expires_date.getDate() + refreshTokenExpiresInDays);
        await this.userTokensRepository.create({
            user_id: user.id,
            refresh_token,
            expires_date,
        });
        return {
            user: {
                name: user.name,
                email: user.email,
            },
            token,
            refresh_token,
        };
    }
};
exports.AuthenticateUserService = AuthenticateUserService;
exports.AuthenticateUserService = AuthenticateUserService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('UsersRepository')),
    __param(1, (0, tsyringe_1.inject)('UserTokensRepository')),
    __metadata("design:paramtypes", [Object, Object])
], AuthenticateUserService);
