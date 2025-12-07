const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'stats',
    description: 'Show stats of free games posted in the last 72 hours',
    async execute(message, args) {
        try {
            const logPath = path.join(__dirname, '..', 'messages.log');
            if (!fs.existsSync(logPath)) return message.channel.send('No stats available yet 😢');

            const logs = fs.readFileSync(logPath, 'utf-8').split('\n').filter(l => l.trim() !== '');
            const cutoff = Date.now() - 72 * 60 * 60 * 1000; // 72 hours
            const recentLogs = logs.filter(l => new Date(l.split('|')[0].trim()).getTime() >= cutoff);

            if (!recentLogs.length) return message.channel.send('No games posted in the last 72h 😢');

            const embed = new EmbedBuilder()
                .setTitle('Stats of Free Games (Last 72h)')
                .setColor('#6a0dad')
                .setTimestamp();

            for (const log of recentLogs) {
                const [date, title, link] = log.split('|').map(s => s.trim());
                embed.addFields({
                    name: `${title}`,
                    value: `Posted: ${date}\n[Store Link](${link})`
                });
            }

            embed.setFooter({ text: `Total games posted: ${recentLogs.length}` });

            await message.channel.send({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            message.channel.send('Failed to fetch stats 😢');
        }
    }
};
