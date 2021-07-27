const { Client, MessageEmbed } = require('discord.js')
module.exports = class Logger {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.client = client 
        this.client.on('messageDelete', (async (message) => {
            const { guild, author, content, channel } = message
            if (!content) return
            if (author.bot) return
            let lang = this.client.locales.get(guild.id)
            if (this.client.locales.get(guild.id) === null) lang = guild.preferredLocale.split('-')[0] === 'pt' ? 'pt' : 'en'
            let ch = await this.client.guildConfig.get(`${guild.id}.logsChannel`).catch(() => null)
            if (typeof ch === 'string') {
                let logchannel = await this.client.utils.resolveChannel(guild, ch)
                if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.logsChannel`, null).catch(() => null)
                const embed = new MessageEmbed().setTimestamp()
                .setColor('#ff5533')
                .setTitle(this.client.locale(lang, 'DELETED_MESSAGE', {channel}))
                .setAuthor(author.username, author.displayAvatarURL({dynamic:true}))
                .setFooter(this.client.locale(lang, 'AUTHOR', {author}))
                .setDescription(`\`\`\`${content}\`\`\``)

                logchannel.send({embeds: [embed]})
            }
        }))

        this.client.on('messageUpdate', (async (oldMessage, newMessage) => {
            if (!oldMessage || !oldMessage.content || oldMessage.content === newMessage.content) return
            const { guild, author, content: newContent, channel } = newMessage,
                {content: oldContent} = oldMessage
            if (author.bot) return
            if (!oldContent) return
            let lang = this.client.locales.get(guild.id)
            if (this.client.locales.get(guild.id) === null) lang = guild.preferredLocale.split('-')[0] === 'pt' ? 'pt' : 'en'
            let ch = await this.client.guildConfig.get(`${guild.id}.logsChannel`).catch(() => null)
            if (typeof ch === 'string') {
                let logchannel = await this.client.utils.resolveChannel(guild, ch)
                if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.logsChannel`, null).catch(() => null)
                const embed = new MessageEmbed().setTimestamp()
                .setColor('#ffff55')
                .setTitle(this.client.locale(lang, 'EDITED_MESSAGE', {channel}))
                .setAuthor(author.username, author.displayAvatarURL({dynamic:true}), newMessage.url)
                .setFooter(this.client.locale(lang, 'AUTHOR', {author}))
                .addFields([
                    {name:this.client.locale(lang, 'BEFORE'), value: `\`\`\`${oldContent}\`\`\``,inline: false},
                    {name:this.client.locale(lang, 'AFTER'), value: `\`\`\`${newContent}\`\`\``,inline: false}
                ])

                logchannel.send({embeds: [embed]})
            }
        }))

        this.client.on('guildBanAdd', (async (ban) => {
            if (!ban.user) return
            const { guild } = ban
            let ch = await this.client.guildConfig.get(`${guild.id}.logsChannel`).catch(() => null)
            let lang = this.client.locales.get(guild.id)
            if (this.client.locales.get(guild.id) === null) lang = guild.preferredLocale.split('-')[0] === 'pt' ? 'pt' : 'en'
            if (typeof ch === 'string') {
                let logchannel = await this.client.utils.resolveChannel(guild, ch)
                if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.logsChannel`, null).catch(() => null)
                const embed = new MessageEmbed().setTimestamp()
                .setColor('#ff5555')
                .setTitle(this.client.locale(lang, 'BANNED'))
                .setAuthor(ban.user.username, ban.user.displayAvatarURL({dynamic:true}))
                .setFooter(`ID: ${ban.user.id}`)

                logchannel.send({embeds: [embed]})
            }
        }))

        this.client.on('guildBanRemove', (async (ban) => {
            if (!ban.user) return
            const { guild } = ban
            let ch = await this.client.guildConfig.get(`${guild.id}.logsChannel`).catch(() => null)
            let lang = this.client.locales.get(guild.id)
            if (this.client.locales.get(guild.id) === null) lang = guild.preferredLocale.split('-')[0] === 'pt' ? 'pt' : 'en'
            if (typeof ch === 'string') {
                let logchannel = await this.client.utils.resolveChannel(guild, ch)
                if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.logsChannel`, null).catch(() => null)
                const embed = new MessageEmbed().setTimestamp()
                .setColor('#33cc55')
                .setTitle(this.client.locale(lang, 'UNBANNED'))
                .setAuthor(ban.user.username, ban.user.displayAvatarURL({dynamic:true}))
                .setFooter(`ID: ${ban.user.id}`)

                logchannel.send({embeds: [embed]})
            }
        }))
    }
}