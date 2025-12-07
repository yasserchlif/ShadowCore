module.exports = {
    name: 'hello',
    description: 'Say hello to the bot',
    execute(message, args) {
        message.channel.send('Hello! I am alive 😎');
    }
};
