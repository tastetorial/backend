import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';

export default {
    up: async (queryInterface: QueryInterface) => {
        // ⚠️ Replace with the actual user IDs in your database
        const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        const follows = [];

        for (let i = 0; i < 15; i++) {
            let followerId = faker.helpers.arrayElement(userIds);
            let followingId = faker.helpers.arrayElement(userIds);

            // ensure a user does not follow themselves
            while (followerId === followingId) {
                followingId = faker.helpers.arrayElement(userIds);
            }

            follows.push({
                followerId,
                followingId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await queryInterface.bulkInsert('follow', follows);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('follow', {});
    },
};
