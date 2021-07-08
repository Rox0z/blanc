const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/command.js')

module.exports = class AvatarCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['av'],
            description: 'Envia o avatar de um usuário',
            category: 'Info',
            usage: 'avatar [userID|@user]',
            title: 'Avatar'
        })
    }
    async run({ message, args, lang }) {
        let user = await this.client.utils.resolveUser(message, args[0])

        const embed = new MessageEmbed()
            .setAuthor(this.client.locale(lang, 'AVATAR_COMMAND_FROM', {user}), user.displayAvatarURL({ dynamic: true, size: 128 }))
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor('#fefefe')
        message.nmReply({ embeds: [embed]})
    }
}