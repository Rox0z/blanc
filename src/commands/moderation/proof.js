const Command = require('../../structures/command.js')

module.exports = class ProofCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: {pt: 'Cria uma embed de prova e envia para o canal especificado.', en: 'Creates a proof embed and sends to a specified channel.'},
            category: 'Moderation',
            channel: 'text',
            neededPermissions: ['MANAGE_MESSAGES'],
            title: {pt: 'Provas', en: 'Proofs'},
            usage: {pt: 'prova <usuárioID|@usuáio> [motivo]', en: 'proof <userID|@user> [reason]'},
        })
    }
    async run({message, args, guild, channel, author, prefix, lang}) {
        message.reply('work-it') 
    }
}