const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js')
const Command = require('../../structures/command.js')

module.exports = class InviteCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['convite'],
            description: { pt: "Envia o convite do BOT.", en: "Sends the bot invite." },
            category: 'Info',
            usage: { pt: "convite", en: "invite" },
            title: { pt: "Convite do BOT", en: "BOT Invite" }
        })
    }
    async run({ message, lang }) {
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

        message.nmReply({ embeds: [embed], components: [inviteRow] })
    }
}