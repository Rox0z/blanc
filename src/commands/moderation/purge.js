const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/command.js')

module.exports = class PurgeCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['clear', 'limpar'],
            description: { pt: 'Apaga até 100 mensagens simultâneas', en: 'Bulk delete up to 100 messages' },
            category: 'Moderation',
            channel: 'text',
            neededPermissions: ['MANAGE_MESSAGES'],
            title: { pt: 'Limpar', en: 'Purge' },
            usage: { pt: 'limpar <ID|contem|text|bots|arquivos|embeds> [<texto>|limite <= 100]', en: 'purge <ID|match|text|bots|files|embeds> [<text>|limit <= 100]' },
        })
    }
    async run({ message, args, guild, channel, author, prefix, lang }) {
        if (!args[0]) return channel.send(this.client.locale(lang, 'ERROR_INVALID_OPERATION'))
        let purgeLimit = 100,
            messages,
            type = args[0];

        if (/(<@)?!?(\d{17,19})>?/gmi.test(type)) {
            let user = await this.client.utils.resolveUser(message, type, { author: false, mention: false })
            messages = (((await channel.messages.fetch({ limit: 100 })).filter(m => !m.pinned).filter(m => m !== message).filter(m => m.author === user)).toJSON()).slice(0, args?.[1] ? args[1] > purgeLimit ? purgeLimit : args[1] : purgeLimit)
        } else if (!isNaN(type)) {
            messages = (((await channel.messages.fetch({ limit: 100 })).filter(m => !m.pinned).filter(m => m !== message)).toJSON()).slice(0, args[0] ? args[0] > purgeLimit ? purgeLimit : args[0] : purgeLimit)
        } else if ((type === 'text' || type === 'match' || type === 'contem')) {
            if (!args[1]) return channel.send(this.client.locale(lang, 'ERROR_INVALID_TEXT'))
            messages = (((await channel.messages.fetch({ limit: 100 })).filter(m => !m.pinned).filter(m => m !== message).filter(this.fetchFilter({ type, text: args.slice(1).join(' ') }))).toJSON()).slice(0, args[2] ? args[2] > purgeLimit ? purgeLimit : args[2] : purgeLimit)
        } else {
            messages = ((await channel.messages.fetch({ limit: 100 })).filter(m => !m.pinned).filter(m => m !== message).filter(this.fetchFilter({ type })))
        }
        channel.bulkDelete(messages, true)
            .catch(() => message.nmReply(this.client.locale(lang, 'ERROR_UNKNOWN')))
            //.then(() => message.nmReply({ embeds: [new MessageEmbed().setTitle(this.client.locale(lang, 'SUCCESS')).setColor('#00ff00').setDescription(this.client.locale(lang, 'DELETED', { custom: ['number', messages.length] }))] }))
    }
    fetchFilter({ type, user, text } = {}) {
        switch (type) {
            case 'bots':
                return m => m.author.bot
            case 'match':
            case 'contem':
                return m => m.content.includes(text)
            case 'text':
                return m => m.content === text
            case 'links':
                return m => m.content.test(/(https?:\/\/(?:[a-z0-9]+\.)?[a-z0-9]+\.com)(\/\S*)/gmi)
            case 'embeds':
                return m => m.embeds.length >= 1
            case 'files':
            case 'arquivos':
                return m => m.attachments.size >= 1
        }
    }
}