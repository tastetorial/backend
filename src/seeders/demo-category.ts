import { QueryInterface } from 'sequelize';

export default {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkInsert('categories', [
            {
                name: 'Entertainment',
                description: 'Comedy, music, dance and more',
                image: 'https://placehold.co/600x400?text=Entertainment',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Education',
                description: 'Tutorials, how-to, academic and informative content',
                image: 'https://placehold.co/600x400?text=Education',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Sports',
                description: 'Sports news, highlights and documentaries',
                image: 'https://placehold.co/600x400?text=Sports',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Lifestyle',
                description: 'Fashion, travel, vlogs and daily life',
                image: 'https://placehold.co/600x400?text=Lifestyle',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Technology',
                description: 'Tech reviews, programming and innovations',
                image: 'https://placehold.co/600x400?text=Technology',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.bulkDelete('categories', {});
    },
};
