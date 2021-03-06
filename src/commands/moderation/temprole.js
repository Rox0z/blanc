const Command = require("../../structures/command.js"),
    ms = require("../../util/millisecond.js");

module.exports = class TemproleCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["temprole", "tmprole"],
            description: { pt: "Atribui ao membro cargos temporários. (Não extende o tempo.)", en: "Gives the target member temporary roles. (Don't extends time.)" },
            category: "Moderation",
            neededPermissions: ['MANAGE_ROLES'],
            usage: { pt: "temprole <membroID|@membro> <tempo> <...cargos>", en: 'temprole <memberID|@member> <time> <...roles>' },
            channel: 'text',
            title: { pt: "Cargo temporário", en: 'Temporary role' }
        });
    }
    async run({ args, message, guild, lang }) {
        if (!args[0]) return message.nmReply(this.client.locale(lang, 'ERROR_NO_USER'))
        if (!args[2]) return message.channel.send(this.client.locale(lang, 'ERROR_PROVIDE_ROLES', { custom: ['prefix', prefix] }))
        let user = await this.client.utils.resolveUser(message, args[0], {author: false, mention: false})
        let member = await guild.members.fetch(user.id).catch(() => null)
        if (!member) return message.channel.send(this.client.locale(lang, 'ERROR_INVALID_MEMBER'))
        let roles = args.slice(2).map(arg => arg = arg.match(/(<@&)?(\d{17,19})>?/)[2])
        try { await member.roles.add(roles) } catch { return message.channel.send(this.client.locale(lang, 'ERROR_ADD_ROLES')) }

        await this.client.agenda.schedule(Date.now() + ms(args[1]),
            'temprole',
            {
                memberID: member.user.id,
                guildID: guild.id,
                rolesID: roles
            })
        message.nmReply(this.client.locale(lang, 'RESPONSES_TEMPROLES', { user, custom: ['timestamp', Math.round((Date.now() + ms(args[1])) / 1000)] }))
    }
};
