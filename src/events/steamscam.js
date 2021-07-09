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
        if (message.content.match(/[(http(s)?):\/\/(www\.)?\w]{2,256}\.ru\//gim)) {
            let channel = await this.client.channels.fetch('795357012517978122')
            const embed = new MessageEmbed()
                .setTitle(`Steam Scam from: ${message.author.username} (${message.author.id})`)
                .setDescription(message.content)
                .setColor('red')
            message.delete().then(channel.send(embed))
        } 
    }
}
