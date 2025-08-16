import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';

export default {
    up: async (queryInterface: QueryInterface) => {
        const userIds = [2, 4, 5, 7, 9];

        const creators = userIds.map((userId) => ({
            bio: faker.lorem.sentences({ min: 1, max: 3 }),
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        await queryInterface.bulkInsert('creators', creators);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('creators', {});
    },
};
