const Command = require("../../structures/command.js"),
    ms = require("../../util/millisecond.js");

module.exports = class MuteCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["mute", 'mutar', 'silenciar'],
            description: "Silencia um membro.",
            category: "Moderation",
            neededPermissions: ['MANAGE_ROLES'],
            usage: 'mute <memberID|@member> <time> [reason]',
            title: 'Mute'
        });
    }
    async run({ args, message, guild, author, data, channel }) {
        let user = await this.client.utils.resolveUser(message, args[0])
        if (user.id === message.author.id) return message.channel.send(`Você não é o Aizeen`)
        let member = await guild.members.fetch(user.id).catch(() => null)
        if (!member) return message.channel.send(`Usuário não é um membro!`)
        let muterole = data.muteRole
        if (muterole === null) return message.nmReply('O comando `mute` está desativado neste servidor')
        let valid = this.client.utils.resolveRole(muterole, guild.roles.cache)
        if (!valid) return (await this.client.guildConfig.set(`${guild.id}.muteRole`, null).catch(() => null), message.nmReply('O cargo `mute` está inválido. O comando foi desativado neste servidor!'))
        if (ms(args[1]) === 0) return message.nmReply('Especifique um tempo! formato: `mute <@user> <tempo> [motivo]`')
        await member.roles.add(muterole)
        let reason = args.slice(2).join(' ')
        await this.client.agenda.schedule(Date.now() + ms(args[1]), 'unmute', { memberID: member.user.id, guildID: guild.id, muteroleID: muterole })
        message.nmReply("Usuário punido!")
        let ch = data.modLogsChannel
        if (typeof ch === 'string') {
            let logchannel = await this.client.utils.resolveChannel(guild, ch)
            if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, null).catch(() => null)
            logchannel.send({ embeds: [this.client.embedder.modLog(guild, author, user, reason === '' ? 'Sem Motivo' : reason, 'MUTE', Math.round((Date.now() + ms(args[1])) / 1000))] }).catch(() => channel.send('Não foi possivel enviar o Log!'))
        }
    }
};
