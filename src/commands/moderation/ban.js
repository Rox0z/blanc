const Command = require("../../structures/command.js");

module.exports = class BanCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["ban"],
            description: "Bane um user.",
            category: "Moderation",
            neededPermissions: ['BAN_MEMBERS'],
            usage: 'ban <userID|@user> [reason]',
            title: 'Ban'
        });
    }
    async run({ args, message, guild, author, data, channel }) {
        let user = await this.client.utils.resolveUser(message, args[0])
        if (user.id === message.author.id) return message.channel.send(`Você não é o Aizeen`)

        let reason = args.slice(1).join(' ')
        await guild.members
            .ban(user.id, { reason: reason })
            .then(message.nmReply("Usuário punido!"));

        let ch = data.modLogsChannel
        if (typeof ch === 'string') {
            let logchannel = await this.client.utils.resolveChannel(guild, ch)
            if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, null).catch(() => null)
            logchannel.send({ embeds: [this.client.embedder.modLog(guild, author, user, reason === '' ? 'Sem Motivo' : reason, 'BAN')] }).catch(() => channel.send('Não foi possivel enviar o Log!'))
        }
    }
};
