const { MessageActionRow, MessageEmbed, MessageButton } = require('discord.js-light')
const Command = require('../../structures/command.js')

module.exports = class InviteCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: 'Envia o convite do BOT.',
            category: 'Info',
            usage: 'invite',
            title: 'BOT Invite'
        })
    }
    async run({message, args, guild, channel, author}) {
        let inviteurl = `https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=2080900287&scope=bot%20applications.commands`
        const embed = new MessageEmbed()
        .setTitle(`${this.client.user.username} | Invite`)
        .setDescription(`>>> Obrigado por considerar me adicionar em seu servidor!\nCaso precise de suporte você pode me contactar, \`DemonN#8180\` no servidor do **[Policia Em Ação](https://discord.gg/policia)**`)
        .setAuthor(this.client.user.username, this.client.user.displayAvatarURL(), inviteurl)
        .setFooter('By: DemonN#8180')
        .setColor('#fefefe')
        .setTimestamp(this.client.user.createdTimestamp),
        inviteButton = new MessageButton().setURL(inviteurl).setLabel('CONVITE').setEmoji('861002080445267979').setStyle('LINK'),
        inviteRow = new MessageActionRow().addComponents([inviteButton])

        message.nmReply({embeds: [embed], components: [inviteRow]})
    }
}