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
exports.RefreshTokenService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const tsyringe_1 = require("tsyringe");
const uuid_1 = require("uuid");
const auth_1 = __importDefault(require("@config/auth"));
const AppError_1 = require("@shared/errors/AppError");
let RefreshTokenService = class RefreshTokenService {
    constructor(userTokensRepository) {
        this.userTokensRepository = userTokensRepository;
    }
    async execute({ refresh_token }) {
        const userToken = await this.userTokensRepository.findByRefreshToken(refresh_token);
        if (!userToken) {
            throw new AppError_1.AppError('Refresh Token does not exist!');
        }
        if (userToken.expires_date.getTime() < new Date().getTime()) {
            await this.userTokensRepository.deleteById(userToken.id);
            throw new AppError_1.AppError('Refresh Token expired!');
        }
        const { secret, expiresIn, refreshTokenExpiresInDays } = auth_1.default.jwt;
        const signOptions = {
            subject: userToken.user_id,
            expiresIn: expiresIn,
        };
        const token = (0, jsonwebtoken_1.sign)({}, secret, signOptions);
        await this.userTokensRepository.deleteById(userToken.id);
        const new_refresh_token = (0, uuid_1.v4)();
        const expires_date = new Date();
        expires_date.setDate(expires_date.getDate() + refreshTokenExpiresInDays);
        await this.userTokensRepository.create({
            user_id: userToken.user_id,
            refresh_token: new_refresh_token,
            expires_date,
        });
        return {
            token,
            refresh_token: new_refresh_token,
        };
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('UserTokensRepository')),
    __metadata("design:paramtypes", [Object])
], RefreshTokenService);
