const { MessageEmbed } = require("discord.js")

module.exports = class Logger {
    constructor(client) {
        this.client = client
    }
    modLog(guild, author, userMember, reason, type, time = null) {
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
        let iconURL;
        if (guild.icon.startsWith("a_")) {
            iconURL = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif?size=128`;
        } else {
            iconURL = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`;
        }
        const embed = new MessageEmbed()
            .setTitle(`${userMember.username} | ${type}`)
            .setColor(color)
            .setThumbnail(author.displayAvatarURL({ dynamic: true, size: 256 }))
            .setFooter(guild.name, iconURL)
            .setTimestamp()
            .addFields([
                {
                    name: 'Membro:',
                    value: `NOME: \`${userMember.username}#${userMember.discriminator}\`\nID: \`${userMember.id}\``,
                    inline: false
                },
                {
                    name: 'Moderador:',
                    value: `NOME: \`${author.username}#${author.discriminator}\`\nID: \`${author.id}\``,
                    inline: false
                },
                {
                    name: 'Motivo:',
                    value: `\`\`\`${reason}\`\`\``,
                    inline: false
                },
            ])
        if (time) { embed.addField('Terminará:', `<t:${time}:R>`, false) }
        return embed
    }
}