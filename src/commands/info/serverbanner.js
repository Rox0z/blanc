const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/command.js')

module.exports = class BannerCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['banner', 'svb'],
            description: 'Envia banner do server.',
            category: 'Info',
            channel: 'text',
            usage: 'banner [guildID]',
            title: 'Server banner'
        })
    }
    async run({ message, args, guild }) {
        let gguild = args[0] ? this.client.utils.resolveGuild(args[0], this.client.guilds.cache) : guild
        if (!gguild.banner) return message.nmReply('Servidor não possui um banner!')
        let bannerURL = `https://cdn.discordapp.com/banners/${gguild.id}/${gguild.banner}.png?size=1024`
        const embed = new MessageEmbed()
            .setAuthor(`Banner from: ${gguild.name}`, bannerURL)
            .setImage(bannerURL)
            .setColor('#fefefe')
        message.nmReply({ embeds: [embed] })
    }
}