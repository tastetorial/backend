import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';

export default {
    up: async (queryInterface: QueryInterface) => {
        // 🔁 Adjust to your actual existing user and category IDs
        const creatorIds = [2, 4, 5, 7, 9];
        const categoryIds = [1, 2, 3, 4, 5];

        const videos = [];

        for (let i = 0; i < 30; i++) {
            const randomCreatorId = creatorIds[Math.floor(Math.random() * creatorIds.length)];
            const randomCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];

            videos.push({
                title: faker.lorem.words({ min: 2, max: 5 }),
                videoUrl: faker.internet.url(),
                thumbnailUrl: faker.image.url(),
                description: faker.lorem.sentence(),
                views: faker.number.int({ min: 0, max: 5000 }),
                status: 'published',
                tags: faker.lorem.words({ min: 2, max: 5 }),
                categoryId: randomCategoryId,
                userId: randomCreatorId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await queryInterface.bulkInsert('videos', videos);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('videos', {});
    },
};
