const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'free',
    description: 'Fetch current free games from Epic Games Store',
    async execute(target, args) {
        // target can be message or channel object
        const channel = target.channel ? target.channel : target;

        try {
            const response = await axios.get('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US');
            const games = response.data.data.Catalog.searchStore.elements;

            const freeGames = games.filter(g => g.promotions?.promotionalOffers?.length > 0);

            if (!freeGames.length) {
                channel.send('No free games today 😢');
                return;
            }

            for (const game of freeGames) {
                const embed = new EmbedBuilder()
                    .setTitle(game.title)
                    .setURL(`https://www.epicgames.com/store/en-US/p/${game.productSlug}`)
                    .setDescription((game.description?.substring(0, 200) || '') + '...')
                    .setImage(game.keyImages[0]?.url)
                    .setColor('#6a0dad');

                await channel.send({ embeds: [embed] });

                // Log the message to messages.log
                const log = `${new Date().toLocaleString()} | ${game.title} | https://www.epicgames.com/store/en-US/p/${game.productSlug}\n`;
                fs.appendFileSync('messages.log', log);
            }
        } catch (err) {
            console.error(err);
            channel.send('Failed to fetch free games 😢');
        }
    }
};
