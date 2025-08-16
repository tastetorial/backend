import { QueryInterface } from 'sequelize';
import { faker } from '@faker-js/faker';

export default {
    up: async (queryInterface: QueryInterface) => {
        // 👉 replace these arrays with your actual user and video IDs
        const userIds = new Array(16).fill(0).map((_, i) => i + 1);
        const videoIds = new Array(30).fill(0).map((_, i) => i + 1);

        const reactions = [];

        for (let i = 0; i < 100; i++) {
            const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
            const randomVideoId = videoIds[Math.floor(Math.random() * videoIds.length)];

            const isLike = faker.datatype.boolean();
            const hasComment = faker.datatype.boolean();

            reactions.push({
                like: isLike,
                comment: hasComment ? faker.lorem.sentence() : null,
                videoId: randomVideoId,
                userId: randomUserId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await queryInterface.bulkInsert('reactions', reactions);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('reactions', {});
    },
};
