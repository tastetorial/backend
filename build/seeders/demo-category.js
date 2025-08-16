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
exports.default = {
    up: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.bulkInsert('categories', [
            {
                name: 'Entertainment',
                description: 'Comedy, music, dance and more',
                image: 'https://placehold.co/600x400?text=Entertainment',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Education',
                description: 'Tutorials, how-to, academic and informative content',
                image: 'https://placehold.co/600x400?text=Education',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Sports',
                description: 'Sports news, highlights and documentaries',
                image: 'https://placehold.co/600x400?text=Sports',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Lifestyle',
                description: 'Fashion, travel, vlogs and daily life',
                image: 'https://placehold.co/600x400?text=Lifestyle',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Technology',
                description: 'Tech reviews, programming and innovations',
                image: 'https://placehold.co/600x400?text=Technology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    }),
    down: (queryInterface) => __awaiter(void 0, void 0, void 0, function* () {
        yield queryInterface.bulkDelete('categories', {});
    }),
};
