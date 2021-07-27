const Event = require('../structures/event.js')

module.exports = class MessageEvent extends Event {
    constructor(...args) {
        super(...args, {
            event: 'messageCreate',
            once: false,
            description: 'Triggered when a message is received',
        })
    }
    async run(message) {
        if (!!this.client?.prefixes?.size === false) return
        const mention = RegExp(`^<@!?${this.client.user.id}>$`),
            mentionPrefix = RegExp(`^<@!?${this.client.user.id}> `);
        if (message.author.bot) return;
        let prefix
        let lang 
        if (message.channel.type !== 'dm') {
            if (this.client.locales.get(message.guild.id) === null) lang = message.guild.preferredLocale.split('-')[0] === 'pt' ? 'pt' : 'en'
            else lang = this.client.locales.get(message.guild.id) 
            let dbprefix =  this.client.prefixes.get(message.guild.id)
            message.content.match(mention) && message.reply(this.client.locale(lang, 'GUILD_PREFIX', {custom: ['prefix', dbprefix]}));
            prefix = message.content.match(mentionPrefix) ? message.content.match(mentionPrefix)[0] : (this.client.defaultPrefix !== dbprefix) ? dbprefix : this.client.defaultPrefix;
        } else {
            lang = 'en'
            message.content.match(mention) && message.reply(this.client.locale(lang, 'BOT_PREFIX', {custom: ['prefix', this.client.defaultPrefix]}))
            prefix = message.content.match(mentionPrefix) ? message.content.match(mentionPrefix)[0] : this.client.defaultPrefix
        }
        if (message.content.startsWith(prefix)) {
            const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g),
                command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
            if (command) {
                const { guild, channel, author } = message;
                if (command.ownerOnly && !this.client.isOwner(message.author.id)) return message.channel.send(this.client.locale(lang, 'ERROR_OWNER_ONLY'))
                if (channel.type !== 'dm' && command.category === 'Admin' && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send(this.client.locale(lang, 'ERROR_ADMIN_ONLY'))
                if (channel.type !== 'dm' && !this.client.canUse(command.neededPermissions, message?.member?.permissions?.toArray())) return message.channel.send(this.client.locale(lang, 'ERROR_USER_PERM'))
                if (channel.type !== 'dm' && !this.client.canUse(command.neededPermissions, message?.guild?.me?.permissions?.toArray())) return message.channel.send(this.client.locale(lang, 'ERROR_CLIENT_PERM'))
                if (!(command.channel === 'both' || !(command.channel === 'text' && (channel.type === 'DM' || channel.type === 'GROUP_DM' || channel.type === 'UNKNOWN')))) return
                !!command.typing && message.channel.sendTyping()
                command.run({ message, args, guild, channel, author, member: message?.member, prefix, lang });
            }
        }
    }
}