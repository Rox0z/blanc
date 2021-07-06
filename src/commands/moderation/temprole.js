const Command = require("../../structures/command.js"),
    ms = require("../../util/millisecond.js"),
    moment = require('moment');

module.exports = class TemproleCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["temprole", "tmprole"],
            description: "Atribui ao membro cargos temporários. (Não extende o tempo.)",
            category: "Moderation",
            neededPermissions: ['MANAGE_ROLES'],
            usage: 'temprole <userID|@user> <time> <...roles>',
            title: 'Temporary role'
        });
    }
    async run({ args, message, guild }) {
        if (!args[2]) return message.channel.send(`Você precisa especificar os cargos!`)
        let user = await this.client.utils.resolveUser(message, args[0])
        let member = await guild.members.fetch(user.id).catch(() => null)
        if (!member) return message.channel.send(`Usuário não é um membro!`)
        let roles = args.slice(2).map(arg => arg = arg.match(/(<@&)?(\d{17,19})>?/)[2])
        try { await member.roles.add(roles) } catch { return message.channel.send(`Houve um erro ao adicionar os cargos.`) }

        await this.client.agenda.schedule(Date.now() + ms(args[1]),
            'temprole',
            {
                memberID: member.user.id,
                guildID: guild.id,
                rolesID: roles
            })
        message.nmReply(`${member.user.username} perderá os cargos <t:${Math.round(Date.now() / 1000) + Math.round(ms(args[1]) / 1000)}:R>`)
    }
};
