const { Collection } = require('discord.js-light');
const Event = require('../structures/event.js')

module.exports = class ReadyEvent extends Event {
    constructor(...args) {
        super(...args, {
            event: 'ready',
            once: true,
            description: 'Triggered when the client is ready.',
        })
    }
    async run() {
        console.log("My eyes are open, but everything is blanc..."), console.table({ "Default prefix": this.client.defaultPrefix, "Client name": this.client.user.username, Owners: this.client.ownerID.join(", ") });
        //console.log("Events");
        //console.table(this.client.events.map((event) => ({ name: event.id, description: event.description })).reduce((e, { name, ...i }) => ((e[name] = i), e), {}));
        //console.log("Commands");
        //console.table(this.client.commands.map((cmd) => ({ name: cmd.name, description: cmd.description, category: cmd.category })).reduce((e, { name, ...i }) => ((e[name] = i), e), {}));
        console.log("Guilds");
        console.table(this.client.guilds.cache.sort((a,b) => b.memberCount - a.memberCount).map((guild) => ({ name: guild.name, id: guild.id, members: guild.memberCount })).reduce((e, { name, ...i }) => ((e[name] = i), e), {}))
        for (const guild of this.client.guilds.cache.array()) {
            let prefix = await this.client.guildConfig.get(`${guild.id}.guildPrefix`)
            let locale = await this.client.guildConfig.get(`${guild.id}.guildLocale`)
            this.client.prefixes.set(guild.id, {prefix, locale})
        }
    }
}