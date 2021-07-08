const Command = require('../../structures/command.js')

module.exports = class LockCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['block'],
            description: 'Bloqueia o canal atual.',
            neededPermissions: ['MANAGE_CHANNELS'],
            category: 'Moderation',
            usage: 'lock',
            title: 'Lock'
        })
    }
    async run({ message, lang, guild }) {
        message.channel.updateOverwrite(
            guild.roles.everyone,
            { SEND_MESSAGES: false },
            {reason: `Permissão de @everyone para enviar mensagens é FALSE`}
        );

        message.nmReply(this.client.locale(lang, 'CHANNEL_STATUS', {custom: ['status', 'bloqueado']}));
    }
}