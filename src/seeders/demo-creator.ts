import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';

export default {
    up: async (queryInterface: QueryInterface) => {
        // → if you already have user IDs in your user table, list them here or query dynamically.
        // For this example, we’ll assume the users with IDs 3, 5, 7, 8, 10 are creators.
        const userIds = [3, 5, 7, 8, 10];

        const creators = userIds.map((userId) => ({
            bio: faker.lorem.sentences({ min: 1, max: 3 }),
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        await queryInterface.bulkInsert('creator', creators);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('creator', {});
    },
};
