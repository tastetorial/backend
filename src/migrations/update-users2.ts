import { QueryInterface, QueryTypes } from 'sequelize';
import { faker } from '@faker-js/faker';
import { User } from '../models/User';

export async function up(queryInterface: QueryInterface) {
    // fetch all existing users
    const users: { id: number }[] = await queryInterface.sequelize.query(
        'SELECT id FROM users',
        { type: QueryTypes.SELECT }
    );

    for (const user of users) {
        const avatarUrl = faker.image.avatar();

        await queryInterface.bulkUpdate(
            'users',
            { avatar: avatarUrl, updatedAt: new Date() },
            { id: user.id }
        );
    }
}

export async function down(queryInterface: QueryInterface) {
    // optional: clear avatar column for rollback
    await queryInterface.bulkUpdate('users', { avatar: null }, {});
}
