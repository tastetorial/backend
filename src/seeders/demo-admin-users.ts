import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';
import { hashSync } from 'bcryptjs';


export default {
    up: async (queryInterface: QueryInterface) => {
        const users = [
            {
                email: 'admin@example.com',
                emailVerified: true,
                phone: '080' + faker.string.numeric(7),
                username: 'admin',
                firstname: 'Admin',
                lastname: 'User',
                birthday: faker.date.birthdate({ min: 1980, max: 2005, mode: 'year' }),
                status: 'ACTIVE',
                password: hashSync('admin123', 10),
                role: 'admin',
                deviceToken: faker.datatype.boolean() ? faker.string.uuid() : null,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ];



        await queryInterface.bulkInsert('users', users);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('users', {});
    },
};
