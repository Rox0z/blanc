const Command = require("../../structures/command.js");

module.exports = class UnmuteCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["unmute", 'desilenciar'],
            description: { pt: "Des-silencia um membro.", en: "Unmutes a member." },
            category: "Moderation",
            neededPermissions: ['MANAGE_ROLES'],
            usage: { pt: "unmute <membroID|@membro> [...motivo]", en: 'unmute <memberID|@member> [...reason]' },
            channel: 'text',
            title: { pt: 'Des-silenciar', en: "Unmute" }
        });
    }
    async run({ author, args, message, guild, data, channel, lang }) {
        if (!args[0]) return message.nmReply(this.client.locale(lang, 'ERROR_NO_USER'))
        let user = await this.client.utils.resolveUser(message, args[0], {resolveAuthor: false})
        if (!user) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_USER'))
        if (user.id === message.author.id) return message.channel.send(`?`)
        let member = await guild.members.fetch(user.id)
        let muterole = data.muteRole
        if ( muterole === null) return message.nmReply(this.client.locale(lang, 'ERROR_MUTE_DISABLED'))
        if (!member.roles.cache.has(muterole)) return message.nmReply(this.client.locale(lang, 'ERROR_ALREADY_UNMUTE', {user}))
        await member.roles.remove(muterole)
        let reason = args.slice(1).join(' ')

        let job = await this.client.agenda.jobs(
            {
                data: {
                    "memberID": member.user.id,
                    "guildID": guild.id,
                    "muteroleID": muterole
                }
            }
        );
        await job[0].remove();
        message.nmReply(this.client.locale(lang, 'USER_UNMUTED', {user}))
        let ch = await this.client.guildConfig.get(`${guild.id}.modLogsChannel`)
        if (typeof ch === 'string') {
            let logchannel = await this.client.utils.resolveChannel(guild, ch)
            if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, null).catch(() => null)
            logchannel.send({ embeds: [this.client.embedder.modLog(guild, author, user, reason.length > 0 ? this.client.locale(lang, 'NO_REASON') : reason, 'UNMUTE', lang)] }).catch(() => channel.send(this.client.locale(lang, 'ERROR_CANNOT_LOG')))
        }
    }
};
