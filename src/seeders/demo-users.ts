import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';
import { hashSync } from 'bcryptjs';

const roles = ['viewer', 'creator', 'admin'];

export default {
    up: async (queryInterface: QueryInterface) => {
        const users = [];

        for (let i = 0; i < 10; i++) {
            users.push({
                email: faker.internet.email(),
                emailVerified: faker.datatype.boolean(),
                phone: '080' + faker.string.numeric(7),
                username: faker.internet.userName(),
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                birthday: faker.date.birthdate({ min: 1980, max: 2005, mode: 'year' }),
                status: 'ACTIVE',          // change if you have other statuses
                password: hashSync('password123', 10),
                role: roles[Math.floor(Math.random() * roles.length)],           // change if you have other roles
                deviceToken: faker.datatype.boolean() ? faker.string.uuid() : null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await queryInterface.bulkInsert('user', users);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('user', {});
    },
};
