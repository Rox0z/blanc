module.exports = class tasks {
    constructor(client, agenda) {
        this.agenda = agenda
        this.client = client
        agenda.define('unmute',
            async (job) => {
                const { memberID, guildID, muteroleID } = job.attrs.data;
                let guild = this.client.utils.resolveGuild(guildID, this.client.guilds.cache)
                let member = await guild.members.fetch(memberID)
                member.roles.remove([muteroleID])
                let ch = await this.client.guildConfig.get(`${guildID}.modLogsChannel`)
                if (typeof ch === 'string') {
                    let reason = {
                        en: 'It\'s time to speak again!',
                        pt: 'É hora de falar de novo!',
                    }
                    let lang;
                    if (this.client.locales.get(guildID) === null) lang = guild.preferredLocale.split('-')[0] === 'pt' ? 'pt' : 'en'
                    else lang = this.client.locales.get(guildID)
                    let logchannel = await this.client.utils.resolveChannel(guild, ch)
                    if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, null).catch(() => null)
                    logchannel.send({ embeds: [this.client.embedder.modLog(guild, this.client.user, member.user, reason[lang], 'UNMUTE', lang)] }).catch(() => null)
                }
                await job.remove()
            })
        agenda.define('temprole',
            async (job) => {
                const { memberID, guildID, rolesID } = job.attrs.data;
                let guild = this.client.utils.resolveGuild(guildID, this.client.guilds.cache)
                let member = await guild.members.fetch(memberID)
                member.roles.remove(rolesID)
                await job.remove()
            })
    }

}