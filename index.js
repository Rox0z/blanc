const BlancClient = require('./src/structures/BlancClient.js')
const { Intents } = require('discord.js')
const { AutoPoster } = require('topgg-autoposter')

class Blanc extends BlancClient {
    constructor() {
        super({
            ownerID: process.env.OWNER.split('|'),
            defaultPrefix: '.',
            token: process.env.TOKEN
        }, {
            intents: Object.values(Intents.FLAGS).reduce((acc, p) => acc | p, 0),
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

AutoPoster(process.env.TOPGG_TOKEN, client)

require('./src/structures/prototypes').init(client)
client.init()


