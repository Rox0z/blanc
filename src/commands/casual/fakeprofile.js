const Command = require('../../structures/command.js')

module.exports = class AvatarCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['fake'],
            description: { pt: "Gera um card de perfil.", en: "Generate a profile card." },
            category: 'Casual',
            usage: { pt: "fake [memberoID|@membero] [bannerURL|anexo] [branco?]", en: "fake [memberID|@member] [bannerURL|attach] [white?]" },
            title: { pt: "Perfil fake", en: "Fake profile" }
        })
    }
    async run({ message, args }) {
        if (args[2].toLowerCase() === 'branco') args[2] = 'white'
        message.nmReply({ files: [this.client.utils.attach(await this.client.gen.fakeProfile(message, args[0], args[1], args[2]), 'profile.png')] });
    }
}