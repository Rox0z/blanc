const { MessageEmbed } = require("discord.js")

module.exports = class Logger {
    constructor(client) {
        this.client = client
    }
    modLog(guild, author, userMember, reason, type, lang, time = null) {
        let color
        switch (type) {
            case 'BAN':
                color = '#ff3333'
                break;
            case 'UNBAN':
                color = '#33dd55'
                break;
            case 'MUTE':
                color = '#eeee55'
                break;
            case 'UNMUTE':
                color = '#5555ee'
                break;
            default:
                break;
        }
        const embed = new MessageEmbed()
            .setTitle(`${userMember.username} | ${type}`)
            .setColor(color)
            .setThumbnail(author.displayAvatarURL({ dynamic: true, size: 256 }))
            .setFooter(guild.name, guild.iconURL({ dynamic: true, }).catch(()=>null))
            .setTimestamp()
            .addFields([
                {
                    name: 'Membro:',
                    value: `${this.client.emoji.icons['members']}: \`${userMember.username}#${userMember.discriminator}\`\n${this.client.emoji.icons['id']}: \`${userMember.id}\``,
                    inline: false
                },
                {
                    name: 'Moderador:',
                    value: `${this.client.emoji.icons['mod']}: \`${author.username}#${author.discriminator}\`\n${this.client.emoji.icons['id']}: \`${author.id}\``,
                    inline: false
                },
                {
                    name: `${this.client.emoji['activity']} ${this.client.locale(lang, 'REASON')}`,
                    value: `\`\`\`${reason}\`\`\``,
                    inline: false
                },
            ])
        if (time) { embed.addField(`${this.client.emoji.icons['clock']} ${this.client.locale(lang, 'ENDING_IN')}`, `<t:${time}:R>`, false) }
        return embed
    }
}