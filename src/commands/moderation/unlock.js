const Command = require('../../structures/command.js')

module.exports = class UnlockCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['unblock'],
            description: 'Desbloqueia o canal atual.',
            category: 'Moderation',
            neededPermissions: ['MANAGE_CHANNELS'],
            usage: 'unlock',
            title: 'Unlock'
        })
    }
    async run({ message, guild, lang }) {
        message.channel.updateOverwrite(
            guild.roles.everyone,
            { SEND_MESSAGES: null },
            {reason: `Permissão de @everyone para enviar mensagens é DEFAULT`}
        );

        message.nmReply(this.client.locale(lang, 'CHANNEL_STATUS', {custom: ['status', 'desbloqueado']}));
    }
}