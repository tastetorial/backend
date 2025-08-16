import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';

export default {
    up: async (queryInterface: QueryInterface) => {
        // ⚠️ Replace with the actual user IDs in your database
        const viewerId = [1, 3, 6, 10, 12, 13, 14, 15, 16];
        const creatorId = [2, 4, 5, 7, 9];

        const follows = [];

        for (let i = 0; i < 20; i++) {
            let followerId = faker.helpers.arrayElement(viewerId);
            let followingId = faker.helpers.arrayElement(creatorId);

            // ensure a user does not follow themselves
            while (followerId === followingId) {
                followingId = faker.helpers.arrayElement(creatorId);
            }

            const follow = {
                followerId,
                followingId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            follows.push(follow);
        }

        await queryInterface.bulkInsert('follows', follows);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('follows', {});
    },
};
