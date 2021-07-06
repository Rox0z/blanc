const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/command.js')

module.exports = class IconCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['icon', 'svi'],
            description: 'Envia o ícone do server.',
            category: 'Info',
            channel: 'text',
            usage: 'icon [guildID]',
            title: 'Server icon'
        })
    }
    async run({ message, args, guild }) {
        let gguild = args[0] ? this.client.utils.resolveGuild(args[0], this.client.guilds.cache) : guild
        if (!gguild.icon) return message.nmReply('Servidor não possui imagem!')
        let iconURL = gguild.iconURL({dynamic: true, size: 512})
        const embed = new MessageEmbed()
            .setAuthor(`Icon from: ${gguild.name}`, iconURL+'?size=128')
            .setImage(iconURL+'?size=512')
            .setColor('#fefefe')
        message.nmReply({ embeds: [embed]})
    }
}