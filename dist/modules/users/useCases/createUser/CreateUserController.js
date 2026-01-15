"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateUserUseCase_1 = require("./CreateUserUseCase");
const zod_1 = require("zod");
class CreateUserController {
    async handle(request, response) {
        const createUserSchema = zod_1.z.object({
            name: zod_1.z.string().min(3),
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6),
            isAdmin: zod_1.z.boolean().optional(),
            role: zod_1.z.enum(['ADMIN', 'USER']).optional(),
        });
        const { name, email, password, isAdmin, role } = createUserSchema.parse(request.body);
        const createUserUseCase = tsyringe_1.container.resolve(CreateUserUseCase_1.CreateUserUseCase);
        const user = await createUserUseCase.execute({
            name,
            email,
            password,
            isAdmin,
            role,
        });
        return response.status(201).json(user);
    }
}
exports.CreateUserController = CreateUserController;
