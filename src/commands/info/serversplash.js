const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/command.js')

module.exports = class SplashCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['splash', 'svs'],
            description: { pt: 'Envia o splash do server.', en: "Sends the server splash." },
            category: 'Info',
            channel: 'text',
            usage: 'splash [serverID]',
            title: { pt: "Splash do servidor", en: "Server splash" }
        })
    }
    async run({ message, args, guild, lang }) {
        let gguild = args[0] ? this.client.utils.resolveGuild(args[0], this.client.guilds.cache) : guild
        if (!gguild.splash) return message.nmReply(this.client.locale(lang, 'ERROR_NO_GUILD_SPLASH'))
        let splashURL = `https://cdn.discordapp.com/splashes/${gguild.id}/${gguild.splash}.png?size=1024`
        const embed = new MessageEmbed()
            .setAuthor(this.client.locale(lang, 'GUILD_SPLASH_COMMAND_FROM', {guild: gguild}), splashURL)
            .setImage(splashURL)
            .setColor('#fefefe')
        message.nmReply({ embeds: [embed] })
    }
}