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
        // 👉 replace these arrays with your actual user and video IDs
        const userIds = new Array(16).fill(0).map((_, i) => i + 1);
        const videoIds = new Array(30).fill(0).map((_, i) => i + 1);
        const reactions = [];
        for (let i = 0; i < 100; i++) {
            const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
            const randomVideoId = videoIds[Math.floor(Math.random() * videoIds.length)];
            const isLike = faker_1.faker.datatype.boolean();
            const hasComment = faker_1.faker.datatype.boolean();
            reactions.push({
                like: isLike,
                comment: hasComment ? faker_1.faker.lorem.sentence() : null,
                videoId: randomVideoId,
                userId: randomUserId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        yield queryInterface.bulkInsert('reactions', reactions);
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.bulkDelete('reactions', {});
    }),
};
