const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/command.js')

module.exports = class IconCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['icon', 'svi'],
            description: { pt: 'Envia o ícone do server.', en: "Sends the server icon." },
            category: 'Info',
            channel: 'text',
            usage: 'icon [serverID]',
            title: { pt: "Ícone do server", en: "Server icon" }
        })
    }
    async run({ message, args, guild, lang }) {
        let gguild = args[0] ? this.client.utils.resolveGuild(args[0], this.client.guilds.cache) : guild
        if (!gguild.icon) return message.nmReply(this.client.locale(lang, 'ERROR_NO_GUILD_ICON'))
        let iconURL = gguild.iconURL({ dynamic: true, })
        const embed = new MessageEmbed()
            .setAuthor(this.client.locale(lang, 'GUILD_ICON_COMMAND_FROM', { guild: gguild }), iconURL + '?size=128')
            .setImage(iconURL + '?size=512')
            .setColor('#fefefe')
        message.nmReply({ embeds: [embed] })
    }
}