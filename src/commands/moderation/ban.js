const Command = require("../../structures/command.js"),
    { MessageEmbed } = require('discord.js');

module.exports = class BanCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["ban", "forceban"],
            description: { pt: "Bane um ou vários usuário.", en: "Bans one or more users" },
            category: "Moderation",
            neededPermissions: ['BAN_MEMBERS'],
            usage: { pt: "ban <...usuárioID|@usuário> [...motivo]", en: 'ban <...userID|@user> [...reason]' },
            channel: 'text',
            title: 'Ban'
        });
    }
    async run({ args, message, guild, author, channel, lang }) {
        if (!args[0]) return message.nmReply(this.client.locale(lang, 'ERROR_NO_USER'))
        let { users, reason, fails } = await this.client.utils.multiResolver(message, args)
        if (!users) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_USER'))
        if (users.includes(author)) return message.channel.send(this.client.locale(lang, 'ERROR_SELFPUNISH'))
        let banned = new Array()
        for (let [i, user] of users.entries()) {
            let bwned = await guild.bans.fetch(user.id).catch(() => null), ban
            if (!bwned) { ban = await guild.members.ban(user.id, { reason }).catch(() => null) }
            bwned ? (delete users[i] && banned.push(`${user.id} (${user.tag})`)) : ban ? null : (delete users[i] && fails.push(`${user.id} (${user.tag})`))
        }
        users = users.filter(u => u)
        message.react('841742417303961622')
        let color
        if (fails.length >= 1 && banned.length >= 1) {color = '#ff0000'} else if (fails.length >= 1 || banned.length >= 1) {color = '#ff8800'} else {color = '#00ff00'}
        const embed = new MessageEmbed()
            .setColor(color)
            .setTitle(this.client.locale(lang, 'USER_PUNISHED'))
            .addField(this.client.locale(lang, 'REASON'), `\`\`\`${reason.length === 0 ? this.client.locale(lang, 'NO_REASON') : reason}\`\`\``, false)
        if (banned.length >= 1) { embed.addField(this.client.locale(lang, 'ALREADY_BANNED'), `\`\`\`\n${banned.join('\n')}\`\`\``, false) }
        if (fails.length >= 1) { embed.addField(this.client.locale(lang, 'ERROR_FAILED_BANS'), `\`\`\`\n${fails.join('\n')}\`\`\``, false) }
        message.nmReply({embeds: [embed]})
        let ch = await this.client.guildConfig.get(`${guild.id}.modLogsChannel`)
        if (typeof ch === 'string') {
            let logchannel = await this.client.utils.resolveChannel(guild, ch)
            if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, null).catch(() => null)
            for (let user of users) {
                logchannel.send({ embeds: [this.client.embedder.modLog(guild, author, user, reason.length === 0 ? this.client.locale(lang, 'NO_REASON') : reason, 'BAN', lang)] }).catch(() => channel.send(this.client.locale(lang, 'ERROR_CANNOT_LOG')))
            }
        }
    }
};
