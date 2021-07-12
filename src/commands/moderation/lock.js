const Command = require('../../structures/command.js')

module.exports = class LockCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['block'],
            description: { pt: 'Bloqueia o canal atual.', en: "Locks the current channel." },
            neededPermissions: ['MANAGE_CHANNELS'],
            category: 'Moderation',
            channel: 'text',
            usage: 'lock',
            title: { pt: 'Bloquear', en: "Lock" }
        })
    }
    async run({ message, lang, guild }) {
        message.channel.updateOverwrite(
            guild.roles.everyone,
            { SEND_MESSAGES: false },
            { reason: `Permissão de @everyone para enviar mensagens é FALSE` }
        );

        message.nmReply(this.client.locale(lang, 'CHANNEL_STATUS', { custom: ['status', 'bloqueado'] }));
    }
}