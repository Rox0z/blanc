const Command = require('../../structures/command.js'),
    { MessageEmbed } = require('discord.js-light');

module.exports = class UserInfoCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['user', 'ui'],
            description: { pt: 'Mostra as informações de um usuário.', en: 'Shows info about any user.' },
            category: 'Info',
            channel: 'both',
            neededPermissions: [],
            title: { pt: 'Informação de Usuário', en: 'User Info' },
            usage: { pt: 'userinfo [usuárioID|@usuário]', en: 'userinfo [userID|@user]' },
        })
    }
    async run({ message, args, guild, channel, author, prefix, lang }) {
        let user = await this.client.utils.resolveUser(message, args[0]),
        badges = await this.client.utils.getBadges(user, guild)
        const embed = new MessageEmbed()
            .setTitle(`User  - ${user.tag}`)
            .setDescription(badges.map(badge => badge = this.client.utils.badgesEmojis[badge]).join(' '))
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setColor('#fefefe')
            .addFields([
                {
                    "name": `${this.client.emoji.icons['members']} Name:`,
                    "value": `\`\`\`${user.tag}\`\`\``,
                    "inline": true
                },
                {
                    "name": `${this.client.emoji.icons['id']} ID:`,
                    "value": `\`\`\`${user.id}\`\`\``,
                    "inline": true
                },
                {
                    "name": `${this.client.emoji.icons['calendar']} Created:`,
                    "value": `<t:${Math.round(user.createdTimestamp / 1000)}:D>`
                }
            ])
        message.nmReply({ embeds: [embed] })
    }
}