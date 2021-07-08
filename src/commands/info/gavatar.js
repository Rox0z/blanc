const { MessageEmbed } = require('discord.js')
const Command = require('../../structures/command.js')

module.exports = class GAvatarCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['gav'],
            description: { pt: "Envia o avatar de servidor de um membro", en: "Sends the guild avatar of a member." },
            category: 'Info',
            usage: { pt: "gavatar [membroID|@membro]", en: "gavatar [memberID|@member]" },
            title: { pt: "Avatar de servidor", en: "Guild avatar" }
        })
    }
    async run({ message, args, guild, lang }) {
        let user = await this.client.utils.resolveUser(message, args[0])
        let member = await this.client.utils.resolveMemberInfo(user.id, guild)
        if (!member) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_MEMBER'))
        if (!member.avatar) return message.nmReply(this.client.locale(lang, 'ERROR_NO_GUILD_AVATAR'))
        let GavatarURL
        if (member.avatar.startsWith("a_")) {
            GavatarURL = `https://cdn.discordapp.com/guilds/${guild.id}/users/${user.id}/avatars/${member.avatar}.gif?size=512`;
        } else {
            GavatarURL = `https://cdn.discordapp.com/guilds/${guild.id}/users/${user.id}/avatars/${member.avatar}.png?size=512`;
        }
        const embed = new MessageEmbed()
            .setAuthor(this.client.locale(lang, 'GUILD_AVATAR_COMMAND_FROM', { user }), GavatarURL)
            .setImage(GavatarURL)
            .setColor('#fefefe')
        message.nmReply({ embeds: [embed] })
    }
}