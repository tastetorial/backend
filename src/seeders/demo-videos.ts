import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';

export default {
    up: async (queryInterface: QueryInterface) => {
        // 🔁 Adjust to your actual existing user and category IDs
        const userIds = [1, 2, 3, 4, 5];
        const categoryIds = [1, 2, 3, 4, 5];

        const videos = [];

        for (let i = 0; i < 10; i++) {
            const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
            const randomCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];

            videos.push({
                title: faker.lorem.words({ min: 2, max: 5 }),
                videoUrl: faker.internet.url(),
                thumbnailUrl: faker.image.url(),  // if you're using faker <v8 use faker.image.imageUrl()
                description: faker.lorem.sentence(),
                views: faker.number.int({ min: 0, max: 5000 }),
                status: 'PUBLISHED',              // or use random if you have multiple statuses
                tags: faker.lorem.words({ min: 2, max: 5 }),
                categoryId: randomCategoryId,
                userId: randomUserId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await queryInterface.bulkInsert('video', videos);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('video', {});
    },
};
