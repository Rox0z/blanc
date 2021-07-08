const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/command.js')

module.exports = class BannerCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['banner', 'svb'],
            description: { pt: 'Envia banner do server.', en: "Sends the server banner." },
            category: 'Info',
            channel: 'text',
            usage: 'banner [serverID]',
            title: { pt: "Banner do server", en: "Server banner" }
        })
    }
    async run({ message, args, guild, lang }) {
        let gguild = args[0] ? this.client.utils.resolveGuild(args[0], this.client.guilds.cache) : guild
        if (!gguild.banner) return message.nmReply(this.client.locale(lang, 'ERROR_NO_GUILD_BANNER'))
        let bannerURL = `https://cdn.discordapp.com/banners/${gguild.id}/${gguild.banner}.png?size=1024`
        const embed = new MessageEmbed()
            .setAuthor(this.client.locale(lang, 'GUILD_BANNER_COMMAND_FROM', { guild: gguild }), bannerURL)
            .setImage(bannerURL)
            .setColor('#fefefe')
        message.nmReply({ embeds: [embed] })
    }
}