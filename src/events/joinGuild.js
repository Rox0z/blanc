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
        this.client.guildConfig.set(`${guild.id}`, {muteRole: null, logsChannel: null, modLogsChannel: null, guildPrefix: this.client.defaultPrefix})
        this.client.prefixes.set(guild.id, this.client.defaultPrefix)
        .then(()=>console.log(`Novo servidor: ${guild.name}`))
        this.client.users.cache.sweep((e) => e.id !== this.client.user.id)
    }
}