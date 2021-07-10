const { MessageEmbed } = require('discord.js')
const Event = require('../structures/event.js')

module.exports = class ScamEvent extends Event {
    constructor(...args) {
        super(...args, {
            event: 'message',
            once: false,
            description: 'Triggered when a .ru URL is received',
        })
    }
    async run(message) {
        if (message?.content?.match(/[(http(s)?):\/\/(www\.)?\w]{2,256}\.ru\//gim)) {
            let content = message.content
            const banned = await message.guild.members
            .ban(message.author.id, { days: 1, reason: `Scam link with .ru` })
            if(!banned) return 
            let channel = await this.client.channels.fetch('722147859184746656')
            const embed = new MessageEmbed()
                .setTitle(`BANNED - Steam Scam from: ${message.author.username} (${message.author.id})`)
                .setDescription('```'+content+'```')
                .setColor('#f00')
            message.delete().then(channel.send({embeds: [embed]}))
        } 
    }
}
