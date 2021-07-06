const Command = require("../../structures/command.js"),
    ms = require("../../util/millisecond.js");

module.exports = class RemoveTmpRolesCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["rtemprole", "rtmprole", "removetmproles"],
            description: "Remove os cargos temporários de um usuário.",
            category: "Moderation",
            neededPermissions: ['MANAGE_ROLES'],
            usage: 'rtemprole <userID|@user>',
            title: 'Remove temporary roles'
        });
    }
    async run({ args, message, guild }) {
        let user = await this.client.utils.resolveUser(message, args[0])
        let member = await guild.members.fetch(user.id)
        let job = await this.client.agenda.jobs(
            {
                name: "temprole"
            }
        );
        job = job.filter(job => job.attrs.data.memberID === member.user.id && job.attrs.data.guildID === guild.id)[0]

        await member.roles.remove(job.attrs.data.rolesID).catch(() => channel.send('Não foi possivel remover os cargos!'))
        await job.remove();
        message.nmReply(`Foi removido todos os cargos temporários de ${member.user.username}.`)
    }
};
