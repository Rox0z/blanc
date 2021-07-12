const Command = require("../../structures/command.js");

module.exports = class BanCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["ban"],
            description: { pt: "Bane um usuário.", en: "Bans a user" },
            category: "Moderation",
            neededPermissions: ['BAN_MEMBERS'],
            usage: { pt: "ban <usuárioID|@usuário> [...motivo]", en: 'ban <userID|@user> [...reason]' },
            channel: 'text',
            title: 'Ban'
        });
    }
    async run({ args, message, guild, author, channel, lang }) {
        if (!args[0]) return message.nmReply(this.client.locale(lang, 'ERROR_NO_USER'))
        let user = await this.client.utils.resolveUser(message, args[0], {author:false})
        if (!user) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_USER'))
        if (user.id === message.author.id) return message.channel.send(this.client.locale(lang, 'ERROR_SELFPUNISH'))

        let reason = args.slice(1).join(' ')
        await guild.members
            .ban(user.id, { reason: reason })
            .then(message.nmReply(this.client.locale(lang, 'USER_PUNISHED')));

        let ch = await this.client.guildConfig.get(`${guild.id}.modLogsChannel`)
        if (typeof ch === 'string') {
            let logchannel = await this.client.utils.resolveChannel(guild, ch)
            if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, null).catch(() => null)
            logchannel.send({ embeds: [this.client.embedder.modLog(guild, author, user, reason.length > 0 ? this.client.locale(lang, 'NO_REASON') : reason, 'BAN', lang)] }).catch(() => channel.send(this.client.locale(lang, 'ERROR_CANNOT_LOG')))
        }
    }
};
