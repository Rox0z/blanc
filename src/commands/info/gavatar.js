const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/command.js')

module.exports = class GAvatarCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['gav'],
            description: 'Envia o avatar de servidor de um membro',
            category: 'Info',
            usage: 'gavatar [memberID|@member]',
            title: 'Guild avatar'
        })
    }
    async run({ message, args, guild }) {
        let user = await this.client.utils.resolveUser(message, args[0])
        let member = await this.client.utils.resolveMemberInfo(user.id, guild)
        if (!member) return message.nmReply('Usuário não é um membro do servidor!')
        if (!member.avatar) return message.nmReply('Usuário não possui avatar de servidor!')
        let GavatarURL 
        if (member.avatar.startsWith("a_")) {
            GavatarURL = `https://cdn.discordapp.com/guilds/${guild.id}/users/${user.id}/avatars/${member.avatar}.gif?size=512`;
        } else {
            GavatarURL = `https://cdn.discordapp.com/guilds/${guild.id}/users/${user.id}/avatars/${member.avatar}.png?size=512`;
        }
        const embed = new MessageEmbed()
            .setAuthor(`Avatar de servidor de: ${user.username}`, GavatarURL)
            .setImage(GavatarURL)
            .setColor('#fefefe')
        message.nmReply({ embeds: [embed]})
    }
}