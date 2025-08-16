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
exports.default = {
    up: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        // ⚠️ Replace with the actual user IDs in your database
        const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const follows = [];
        for (let i = 0; i < 15; i++) {
            let followerId = faker_1.faker.helpers.arrayElement(userIds);
            let followingId = faker_1.faker.helpers.arrayElement(userIds);
            // ensure a user does not follow themselves
            while (followerId === followingId) {
                followingId = faker_1.faker.helpers.arrayElement(userIds);
            }
            follows.push({
                followerId,
                followingId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        yield queryInterface.bulkInsert('follow', follows);
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.bulkDelete('follow', {});
    }),
};
