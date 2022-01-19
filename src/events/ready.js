const Event = require('../structures/event.js'),
    boxen = require('boxen');
module.exports = class ReadyEvent extends Event {
    constructor(...args) {
        super(...args, {
            event: 'ready',
            once: true,
            description: 'Triggered when the client is ready.',
        })
    }
    async run() {
        console.log("My eyes are open, but everything is blanc...")
        console.log(boxen(`Prefix: ${this.client.defaultPrefix}\nName:   ${this.client.user.tag}\nOwners: ${this.client.ownerID.join(', ')}\nGuild count: ${this.client.guilds.cache.size}`, { align: 'left', padding: 1, margin: 1, borderStyle: 'round' }))
        //console.log("Events");
        //console.table(this.client.events.map((event) => ({ name: event.id, description: event.description })).reduce((e, { name, ...i }) => ((e[name] = i), e), {}));
        //console.log("Commands");
        //console.table(this.client.commands.map((cmd) => ({ name: cmd.name, description: cmd.description, category: cmd.category })).reduce((e, { name, ...i }) => ((e[name] = i), e), {}));
        //console.log("Guilds");
        //console.table(this.client.guilds.cache.sort((a,b) => b.memberCount - a.memberCount).map((guild) => ({ name: guild.name, id: guild.id, members: guild.memberCount })).reduce((e, { name, ...i }) => ((e[name] = i), e), {}))
        for (const guild of this.client.guilds.cache.toJSON()) {
            let prefix = await this.client.guildConfig.get(`${guild.id}.guildPrefix`)
            let locale = await this.client.guildConfig.get(`${guild.id}.guildLocale`)
            this.client.prefixes.set(guild.id, prefix)
            this.client.locales.set(guild.id, locale)
        }
    }
}