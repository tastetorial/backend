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
        const viewerId = [1, 3, 6, 10, 12, 13, 14, 15, 16];
        const creatorId = [2, 4, 5, 7, 9];
        const follows = [];
        for (let i = 0; i < 20; i++) {
            let followerId = faker_1.faker.helpers.arrayElement(viewerId);
            let followingId = faker_1.faker.helpers.arrayElement(creatorId);
            // ensure a user does not follow themselves
            while (followerId === followingId) {
                followingId = faker_1.faker.helpers.arrayElement(creatorId);
            }
            const follow = {
                followerId,
                followingId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            follows.push(follow);
        }
        yield queryInterface.bulkInsert('follows', follows);
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.bulkDelete('follows', {});
    }),
};
