const Command = require("../../structures/command.js");

module.exports = class UnbanCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["ban"],
            description: { pt: "Desbane um usuário.", en: "Unbans a user" },
            category: "Moderation",
            neededPermissions: ['BAN_MEMBERS'],
            usage: { pt: "unban <usuárioID|@usuário> [...motivo]", en: 'unban <userID|@user> [...reason]' },
            channel: 'text',
            title: 'Unban'
        });
    }
    async run({ args, message, guild, author, channel, lang }) {
        if (!args[0]) return message.nmReply(this.client.locale(lang, 'ERROR_NO_USER'))
        let user = await this.client.utils.resolveUser(message, args[0], {resolveAuthor: false})
        if (!user) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_USER'))
        if (user.id === message.author.id) return message.channel.send('?')

        let reason = args.slice(1).join(' ')
        await guild.members
            .unban(user.id, { reason: reason })
            .then(message.nmReply(this.client.locale(lang, 'USER_PUNISHED')));

            let ch = await this.client.guildConfig.get(`${guild.id}.modLogsChannel`)
        if (typeof ch === 'string') {
            let logchannel = await this.client.utils.resolveChannel(guild, ch)
            if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, null).catch(() => null)
            logchannel.send({ embeds: [this.client.embedder.modLog(guild, author, user, reason.length > 0 ? this.client.locale(lang, 'NO_REASON') : reason, 'UNBAN', lang)] }).catch(() => channel.send(this.client.locale(lang, 'ERROR_CANNOT_LOG')))
        }
    }
};
