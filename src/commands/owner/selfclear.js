const Command = require('../../structures/command.js')

module.exports = class SelfClearCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['sc'],
            description: 'Clear this BOT messages.',
            category: 'Owner',
            typing: false,
            ownerOnly: true,
            channel: 'text',
            neededPermissions: [],
            title: 'Self Clear',
            usage: 'selfclear',
        })
    }
    async run({message, args, guild, channel, author, prefix, lang}) {
        channel.bulkDelete( ((await channel.messages.fetch()).filter(m => m.author === this.client.user).array()).slice(0,200))
    }
}