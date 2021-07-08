const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js-light')
const Command = require('../../structures/command.js')

module.exports = class InviteCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['convite'],
            description: 'Envia o convite do BOT.',
            category: 'Info',
            usage: 'invite',
            title: 'BOT Invite'
        })
    }
    async run({message, lang}) {
        let inviteurl = `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=2080900287&scope=bot%20applications.commands`
        const embed = new MessageEmbed()
        .setTitle(`${this.client.user.username} | ${this.client.locale(lang, 'BUTTONLABEL_INVITE')}`)
        .setDescription(this.client.locale(lang, 'INVITE_DESCRIPTION'))
        .setAuthor(this.client.user.username, this.client.user.displayAvatarURL(), inviteurl)
        .setFooter('By: DemonN#8180')
        .setColor('#fefefe')
        .setTimestamp(this.client.user.createdTimestamp),
        inviteButton = new MessageButton().setURL(inviteurl).setLabel(this.client.locale(lang, 'BUTTONLABEL_INVITE')).setEmoji('861002080445267979').setStyle('LINK'),
        inviteRow = new MessageActionRow().addComponents([inviteButton])

        message.nmReply({embeds: [embed], components: [inviteRow]})
    }
}