const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

const gameList = [
    730,      // CS:GO
    570,      // Dota 2
    440,      // TF2
    578080,   // PUBG
    105600,   // Terraria
    1091500,  // Valheim
    1245620,  // Cyberpunk 2077
    359550,   // PUBG BATTLEGROUNDS
    945360,   // Apex Legends
    359320,   // Dead by Daylight
];

module.exports = {
    name: 'steam_top',
    description: 'Get detailed stats for popular Steam games',
    async execute(message, args) {
        try {
            const embeds = [];

            for (const appid of gameList) {
                // Fetch store info
                const storeRes = await axios.get(`https://store.steampowered.com/api/appdetails?appids=${appid}&cc=us&l=en`);
                const data = storeRes.data[appid].data;

                if (!data) continue;

                // Fetch current players
                let playersNow = 'N/A';
                try {
                    const playersRes = await axios.get(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appid}`);
                    playersNow = playersRes.data.response?.player_count ?? 'N/A';
                } catch (err) {
                    playersNow = 'N/A';
                }

                const embed = new EmbedBuilder()
                    .setTitle(data.name)
                    .setURL(`https://store.steampowered.com/app/${appid}`)
                    .setDescription((data.short_description || '').substring(0, 200) + '...')
                    .setImage(data.header_image)
                    .setColor('#1b2838')
                    .addFields(
                        { name: 'Current Players', value: `${playersNow}`, inline: true },
                        { name: 'Price', value: data.is_free ? 'Free' : (data.price_overview?.final_formatted || 'N/A'), inline: true },
                        { name: 'Release Date', value: data.release_date?.date || 'N/A', inline: true },
                        { name: 'Developers', value: data.developers?.join(', ') || 'N/A', inline: true },
                        { name: 'Publishers', value: data.publishers?.join(', ') || 'N/A', inline: true },
                        { name: 'Genres', value: data.genres?.map(g => g.description).join(', ') || 'N/A', inline: true },
                    );

                embeds.push(embed);
            }

            // Send embeds (one by one to avoid Discord limits)
            for (const e of embeds) {
                await message.channel.send({ embeds: [e] });
            }

        } catch (err) {
            console.error(err);
            message.channel.send('Failed to fetch Steam game stats 😢');
        }
    }
};
