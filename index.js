require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const schedule = require('node-schedule');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Load commands
client.commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Ready
client.once('ready', () => {
    console.log(`ShadowCore is online as ${client.user.tag}`);
});

// Message handler
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;

    const args = message.content.slice(1).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (client.commands.has(commandName)) {
        try {
            client.commands.get(commandName).execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('Something went wrong!');
        }
    }
});

// Schedule daily free game post at 18:00
schedule.scheduleJob('0 18 * * *', () => {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel) return;
    const freeCommand = client.commands.get('free');
    freeCommand.execute(channel, []);
});

client.login(process.env.TOKEN);
