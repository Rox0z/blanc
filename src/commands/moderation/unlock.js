const Command = require('../../structures/command.js')

module.exports = class UnlockCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['unblock', 'desbloquear'],
            description: { pt: 'Desbloqueia o canal atual.', en: "Unlocks the current channel." },
            category: 'Moderation',
            neededPermissions: ['MANAGE_CHANNELS'],
            usage: 'unlock',
            channel: 'text',
            title: { pt: 'Desbloquear', en: "Unlock" },
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