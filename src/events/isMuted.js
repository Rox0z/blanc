const Event = require('../structures/event.js')

module.exports = class IsMutedEvent extends Event {
    constructor(...args) {
        super(...args, {
            event: 'guildMemberAdd',
            once: false,
            description: 'Triggered when a member join a guild with the mute role.',
        })
    }
    async run(member) {
        if (!member.user) return
        let muterole = await this.client.guildConfig.get(`${member.guild.id}.muteRole`).catch(() => null)
        if ( muterole === null) return 
        let job = await this.client.agenda.jobs(
            {
                data: {
                    "memberID": member.user.id,
                    "guildID": member.guild.id,
                    "muteroleID": muterole
                }
            }
        );
        if (job.length > 0) {
            let fetchedMember = await this.client.utils.resolveMember(member.user, member.guild)
            await fetchedMember.roles.add(muterole)
        } else return
        this.client.users.cache.sweep((e) => e.id !== this.client.user.id)
    }
}