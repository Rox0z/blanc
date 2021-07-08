const Command = require("../../structures/command.js");

module.exports = class UnmuteCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["unmute", 'desilenciar'],
            description: "Des-silencia um membro.",
            category: "Moderation",
            neededPermissions: ['MANAGE_ROLES'],
            usage: 'unmute <userID|@user> [reason]',
            title: 'Unmute'
        });
    }
    async run({ author, args, message, guild, data, channel }) {
        let user = await this.client.utils.resolveUser(message, args[0])
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
            logchannel.send({ embeds: [this.client.embedder.modLog(guild, author, user, reason === '' ? this.client.locale(lang, 'NO_REASON') : reason, 'UNMUTE')] }).catch(() => channel.send(this.client.locale(lang, 'ERROR_CANNOT_LOG')))
        }
    }
};
