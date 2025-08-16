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
        // 🔁 Adjust to your actual existing user and category IDs
        const creatorIds = [2, 4, 5, 7, 9];
        const categoryIds = [1, 2, 3, 4, 5];
        const videos = [];
        for (let i = 0; i < 30; i++) {
            const randomCreatorId = creatorIds[Math.floor(Math.random() * creatorIds.length)];
            const randomCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
            videos.push({
                title: faker_1.faker.lorem.words({ min: 2, max: 5 }),
                videoUrl: faker_1.faker.internet.url(),
                thumbnailUrl: faker_1.faker.image.url(),
                description: faker_1.faker.lorem.sentence(),
                views: faker_1.faker.number.int({ min: 0, max: 5000 }),
                status: 'published',
                tags: faker_1.faker.lorem.words({ min: 2, max: 5 }),
                categoryId: randomCategoryId,
                userId: randomCreatorId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        yield queryInterface.bulkInsert('videos', videos);
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.bulkDelete('videos', {});
    }),
};
