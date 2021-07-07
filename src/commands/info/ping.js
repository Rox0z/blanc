const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/command.js')

module.exports = class PingCommand extends Command{
    constructor(...args){
        super(...args, {
            aliases: ['p', 'pong'],
            description: 'Verifica a latência do BOT.',
            category: 'Info',
            usage: 'ping',
            title: 'Ping'
        })
    }
    async run({message}){
        const sent = await message.nmReply({embeds: [new MessageEmbed().setColor('#ff0000').setAuthor('🏓  Pong!').setDescription('⏱️ **`Host`**: `???` ms\n📡 **`API `**: `???` ms').setTimestamp()]});
        //const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
        return sent.edit({embeds: [new MessageEmbed().setColor('#00ff00').setAuthor('🏓  Pong!').setDescription(`⏱️ **\`Host\`**: \`${(sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt)}\` ms\n📡 **\`API \`**: \`${Math.round(this.client.ws.ping)}\` ms`).setTimestamp()]});
    }
}