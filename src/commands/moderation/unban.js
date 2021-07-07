const Command = require("../../structures/command.js");

module.exports = class UnbanCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["ban"],
            description: "Desbane um usuário.",
            category: "Moderation",
            neededPermissions: ['BAN_MEMBERS'],
            usage: 'unban <userID|@user> [reason]',
            title: 'Unban'
        });
    }
    async run({ args, message, guild, author, channel }) {
        let user = await this.client.utils.resolveUser(message, args[0])
        if (user.id === message.author.id) return message.channel.send(`Como assim unban?`)

        let reason = args.slice(1).join(' ')
        await guild.members
            .unban(user.id, { reason: reason })
            .then(message.nmReply("Usuário liberado!"));

            let ch = await this.client.guildConfig.get(`${guild.id}.modLogsChannel`)
        if (typeof ch === 'string') {
            let logchannel = await this.client.utils.resolveChannel(guild, ch)
            if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, null).catch(() => null)
            logchannel.send({ embeds: [this.client.embedder.modLog(guild, author, user, reason === '' ? 'Sem Motivo' : reason, 'UNBAN')] }).catch(() => channel.send('Não foi possivel enviar o Log!'))
        }
    }
};
