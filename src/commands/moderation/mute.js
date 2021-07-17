const Command = require("../../structures/command.js"),
    ms = require("../../util/millisecond.js");

module.exports = class MuteCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["mute", 'mutar', 'silenciar'],
            description: { pt: "Silencia um membro.", en: "Mutes a member." },
            category: "Moderation",
            neededPermissions: ['MANAGE_ROLES'],
            channel: 'text',
            usage: { pt: "mute <membroID|@membro> <tempo> [...motivo]", en: 'mute <memberID|@member> <time> [...reason]' },
            title: { pt: 'Silenciar', en: "Mute" }
        });
    }
    async run({ args, message, guild, author, lang, channel, prefix }) {
        if (!args[0]) return message.nmReply(this.client.locale(lang, 'ERROR_NO_USER'))
        let user = await this.client.utils.resolveUser(message, args[0], {author: false})
        if (!user) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_USER'))
        if (user.id === message.author.id) return message.channel.send(this.client.locale(lang, 'ERROR_SELFPUNISH'))
        let member = await guild.members.fetch(user.id).catch(() => null)
        if (!member) return message.channel.send(this.client.locale(lang, 'ERROR_INVALID_MEMBER'))
        let muterole = await this.client.guildConfig.get(`${guild.id}.muteRole`)
        if (muterole === null) return message.nmReply(this.client.locale(lang, 'ERROR_MUTE_DISABLED'))
        let valid = this.client.utils.resolveRole(muterole, guild.roles.cache)
        if (!valid) return (await this.client.guildConfig.set(`${guild.id}.muteRole`, null).catch(() => null), message.nmReply(this.client.locale(lang, 'ERROR_MUTE_INVALID')))
        if (ms(args[1]) === 0) return message.nmReply(this.client.locale(lang, 'ERROR_MUTE_TIME', { custom: ['prefix', prefix] }))
        try { await member.roles.add(muterole) } catch { return message.nmReply(this.client.locale(lang, 'ERROR_CANNOT_MUTE')) }
        let reason = args.slice(2).join(' ')
        await this.client.agenda.schedule(Date.now() + ms(args[1]), 'unmute', { memberID: member.user.id, guildID: guild.id, muteroleID: muterole })
        message.nmReply(this.client.locale(lang, 'USER_PUNISHED'))
        let ch = await this.client.guildConfig.get(`${guild.id}.modLogsChannel`)
        if (typeof ch === 'string') {
            let logchannel = await this.client.utils.resolveChannel(guild, ch)
            if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, null).catch(() => null)
            logchannel.send({ embeds: [this.client.embedder.modLog(guild, author, user, reason.length > 0 ? this.client.locale(lang, 'NO_REASON') : reason, 'MUTE', lang, Math.round((Date.now() + ms(args[1])) / 1000))] }).catch(() => channel.send(this.client.locale(lang, 'ERROR_CANNOT_LOG')))
        }
    }
};
