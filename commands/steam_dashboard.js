const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'steam_top',
    description: 'Get top 15 most played Steam games stats with images',
    async execute(message, args) {
        try {
            // Fetch top games by concurrent players
            const response = await axios.get('https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/');
            const games = response.data.response.ranks.slice(0, 15); // Top 15

            const embed = new EmbedBuilder()
                .setTitle('🎮 Top 15 Steam Games by Players')
                .setColor('#1b2838')
                .setTimestamp();

            for (const game of games) {
                const thumbnail = `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`;

                embed.addFields({
                    name: game.name,
                    value: `Players: ${game.players.toLocaleString()}\n[Steam Store Link](https://store.steampowered.com/app/${game.appid})`,
                });

                embed.setImage(thumbnail); // optional: adds last game's image as main embed image
            }

            await message.channel.send({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            message.channel.send('.');
        }
    }
};
