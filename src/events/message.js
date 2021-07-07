const Event = require('../structures/event.js')

module.exports = class MessageEvent extends Event {
    constructor(...args) {
        super(...args, {
            event: 'message',
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
        if (message.channel.type === 'text') {
            let dbprefix =  this.client.prefixes.get(message.guild.id)
            message.content.match(mention) && message.reply(`Meu prefixo neste servidor é \`${dbprefix}\``);
            prefix = message.content.match(mentionPrefix) ? message.content.match(mentionPrefix)[0] : (this.client.defaultPrefix !== dbprefix) ? dbprefix : this.client.defaultPrefix;
        } else {
            message.content.match(mention) && message.reply(`Meu prefixo é \`${this.client.defaultPrefix}\``)
            prefix = message.content.match(mentionPrefix) ? message.content.match(mentionPrefix)[0] : this.client.defaultPrefix
        }
        if (message.content.startsWith(prefix)) {
            const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g),
                command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));
            if (command) {
                const { guild, channel, author } = message;
                if (command.ownerOnly && !this.client.isOwner(message.author.id)) return message.channel.send('`Apenas o dono pode executar esse comando!`')
                if (channel.type !== 'dm' && command.category === 'Admin' && !message.member.permissions.has('ADMINISTRATOR')) return message.channel.send('`Apenas um adminstrador pode executar esse comando!`')
                if (channel.type !== 'dm' && !this.client.canUse(command.neededPermissions, message?.member?.permissions?.toArray())) return message.channel.send('`Você não possui as permissões necessárias para executar esse comando!`')
                if (channel.type !== 'dm' && !this.client.canUse(command.neededPermissions, message?.guild?.me?.permissions?.toArray())) return message.channel.send('`Eu não possuo as permissões necessárias para executar esse comando!`')
                if (!(command.channel === 'both' || command.channel === channel.type)) return
                !!command.typing && message.channel.startTyping()
                command.run({ message: message, args: args, guild: guild, channel: channel, author: author, member: message?.member });
                guild?.members?.cache.sweep((e) => e.user.id !== this.client.user.id)
                this.client.users.cache.sweep((e) => e.id !== this.client.user.id)
                message.channel.stopTyping()
            }
        }
    }
}