const Event = require('../structures/event.js')

module.exports = class JoinEvent extends Event {
    constructor(...args) {
        super(...args, {
            event: 'guildCreate',
            once: false,
            description: 'Triggered when the client join a guild.',
        })
    }
    async run(guild) {
        this.client.guildConfig.set(`${guild.id}`, {muteRole: null, logsChannel: null, modLogsChannel: null, guildPrefix: this.client.defaultPrefix, guildLocale: guild.preferredLocale.split('-')[0] === 'pt' ? 'pt' : 'en'})
        this.client.prefixes.set(guild.id, this.client.defaultPrefix)
        this.client.locales.set(guild.id, guild.preferredLocale.split('-')[0] === 'pt' ? 'pt' : 'en')
        console.log(`Novo servidor: ${guild.name}`)
    }
}