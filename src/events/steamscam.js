const { MessageEmbed } = require('discord.js')
const Event = require('../structures/event.js')

module.exports = class ScamEvent extends Event {
    constructor(...args) {
        super(...args, {
            event: 'messageCreate',
            once: false,
            description: 'Triggered when a .ru URL is received',
        })
    }
    async run(message) {
        if (message.guild.id !== '275458197941125121') return 
        if (message?.content?.match(/[(http(s)?):\/\/(www\.)?\w]{2,256}\.ru\//gim)) {
            let content = message.content
            const banned = await message.guild.members
                .ban(message.author.id, { days: 1, reason: `Scam link with .ru` })
            if (!banned) return
            const embed = new MessageEmbed()
                .setTitle(`BANNED - Steam Scam from: ${message.author.username} (${message.author.id})`)
                .setDescription('```' + content + '```')
                .setColor('#f00')

            let ch = await this.client.guildConfig.get(`${message.guild.id}.logsChannel`)
            if (typeof ch === 'string') {
                let logchannel = await this.client.utils.resolveChannel(message.guild, ch)
                if (!logchannel) return await this.client.guildConfig.set(`${message.guild.id}.logsChannel`, null).catch(() => null)
                logchannel.send({ embeds: [embed] })
            }
            message.delete()
        }
    }
}
