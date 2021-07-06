module.exports = class tasks {
    constructor(client, agenda) {
        this.agenda = agenda
        this.client = client
        agenda.define('unmute',
            async (job) => {
                const { memberID, guildID, muteroleID } = job.attrs.data;
                //console.table({ memberID, guildID, muteroleID })
                let guild = this.client.utils.resolveGuild(guildID, this.client.guilds.cache)
                let member = await guild.members.fetch(memberID)
                member.roles.remove([muteroleID])
                guild?.members?.cache.sweep((e) => e.user.id !== this.client.user.id)
                await job.remove()
            })
                agenda.define('temprole',
                async (job) => {
                const { memberID, guildID, rolesID } = job.attrs.data;
                let guild = this.client.utils.resolveGuild(guildID, this.client.guilds.cache)
                    let member = await guild.members.fetch(memberID)
                    member.roles.remove(rolesID)
                    guild?.members?.cache.sweep((e) => e.user.id !== this.client.user.id)
                    await job.remove()
                })
    }

}