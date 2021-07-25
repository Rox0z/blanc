const BlancClient = require('./src/structures/BlancClient.js')
const { Intents } = require('discord.js-light')
require('./src/structures/prototypes').init()

class Blanc extends BlancClient {
    constructor() {
        super({
            ownerID: process.env.OWNER.split('|'),
            defaultPrefix: '.',
            token: process.env.TOKEN
        }, {
            cacheGuilds: true,
            cacheChannels: true,
            cacheOverwrites: true,
            cacheRoles: true,
            cacheEmojis: true,
            cachePresences: true,
            cacheMembers: false,
            intents: Intents.ALL,
            //properties: { $browser: "Discord iOS" }
            partials: [
                //'GUILDS',
                //'GUILD_MEMBERS',
                //'GUILD_BANS',
                //'GUILD_EMOJIS',
                //'GUILD_WEBHOOKS',
                //'GUILD_INVITES',
                //'GUILD_PRESENCES',
                'GUILD_MESSAGES',
                'GUILD_MESSAGE_REACTIONS',
                //'DIRECT_MESSAGES',
                //'DIRECT_MESSAGE_REACTIONS',
                //'DIRECT_MESSAGE_TYPING',
                //'GUILD_MESSAGE_TYPING'
            ],
            presence: {
                activity: {
                    name: 'YOU',
                    type: "WATCHING"
                }
            },
        });
    }
}

const client = new Blanc()

client.init()


