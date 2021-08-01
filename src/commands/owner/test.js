const Command = require('../../structures/command.js')

module.exports = class TestCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['nuke'],
            description: { pt: 'Test', en: 'Test' },
            category: 'Owner',
            ownerOnly: true,
            typing: true,
            channel: 'both',
            neededPermissions: [],
            title: { pt: 'Test', en: 'Test' },
            usage: { pt: 'Test', en: 'Test' },
        })
    }
    async run({ message, args, guild, channel, author, prefix, lang }) {
        message.nmReply('Deletando...')
        
    }
}
