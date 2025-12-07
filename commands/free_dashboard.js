const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'free_dashboard',
    description: 'Show a dashboard of free Epic Games with links and images',
    async execute(message, args) {
        try {
            const response = await axios.get('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US');
            const games = response.data.data.Catalog.searchStore.elements;

            const freeGames = games.filter(g => g.promotions?.promotionalOffers?.length > 0);

            if (!freeGames.length) {
                message.channel.send('No free games today 😢');
                return;
            }

            const dashboardEmbed = new EmbedBuilder()
                .setTitle('🎮 Free Epic Games Dashboard')
                .setColor('#6a0dad')
                .setDescription(`Showing ${freeGames.length} free games today!`);

            for (const game of freeGames) {
                const title = game.title;
                const url = `https://www.epicgames.com/store/en-US/p/${game.productSlug}`;
                const image = game.keyImages[0]?.url;
                const description = game.description?.substring(0, 200) || '';

                dashboardEmbed.addFields({
                    name: `[${title}](${url})`,
                    value: description,
                    inline: false
                });

                if (image) {
                    dashboardEmbed.setImage(image);
                }
            }

            message.channel.send({ embeds: [dashboardEmbed] });
        } catch (err) {
            console.error(err);
            message.channel.send('Failed to fetch free games 😢');
        }
    }
};
