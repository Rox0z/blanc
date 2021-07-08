const { MessageEmbed } = require('discord.js'),
    chroma = require('chroma-js')
const Command = require('../../structures/command.js')

module.exports = class PingCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['p', 'pong'],
            description: { pt: "Verifica a latência do BOT.", en: "Verify the BOT latency." },
            category: 'Info',
            usage: 'ping',
            title: 'Ping'
        })
    }
    async run({ message }) {
        const sent = await message.nmReply({ embeds: [new MessageEmbed().setColor('#ff0000').setAuthor('🏓  Pong!').setDescription('⏱️ **`BOT`**: `???` ms\n📡 **`API `**: `???` ms').setTimestamp()] });
        const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
        return sent.nmEdit({ embeds: [new MessageEmbed().setColor(chroma.scale(['#0f0', '#ff0', '#f00'])(timeDiff / 700).hex()).setAuthor('🏓  Pong!').setDescription(`⏱️ **\`BOT\`**: \`${timeDiff}\` ms\n📡 **\`API \`**: \`${Math.round(this.client.ws.ping)}\` ms`).setTimestamp()] });
    }
}