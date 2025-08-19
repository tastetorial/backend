"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const bcryptjs_1 = require("bcryptjs");
exports.default = {
    up: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        const users = [
            {
                email: 'admin@example.com',
                emailVerified: true,
                phone: '080' + faker_1.faker.string.numeric(7),
                username: 'admin',
                firstname: 'Admin',
                lastname: 'User',
                birthday: faker_1.faker.date.birthdate({ min: 1980, max: 2005, mode: 'year' }),
                status: 'ACTIVE',
                password: (0, bcryptjs_1.hashSync)('admin123', 10),
                role: 'admin',
                deviceToken: faker_1.faker.datatype.boolean() ? faker_1.faker.string.uuid() : null,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ];
        yield queryInterface.bulkInsert('users', users);
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.bulkDelete('users', {});
    }),
};
