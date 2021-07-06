const Command = require('../../structures/command.js')

module.exports = class AvatarCommand extends Command{
    constructor(...args){
        super(...args, {
            aliases: ['rr'],
            description: 'Reload commands cache',
            category: 'Owner',
            ownerOnly: true,
            usage: 'reload',
            title: 'Reload'
        })
    }
    async run({message}) {
        let sent = await message.nmReply('Reloading...')
        await this.client.utils.loadCommands()
        return sent.nmEdit('↻ Reloaded')
    }
}