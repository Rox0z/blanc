const Command = require('../../structures/command.js')

module.exports = class AvatarCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['fake'],
            description: 'Gera um card de perfil.',
            category: 'Casual',
            usage: 'fake [memberID|@member] [bannerURL|attach] [white?]',
            title: 'Fake profile'
        })
    }
    async run({message, args}) {
        message.nmReply({files: [this.client.utils.attach(await this.client.gen.fakeProfile(message, args[0], args[1], args[2]), 'profile.png')]});
    }
}