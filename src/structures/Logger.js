const { Client, MessageEmbed } = require('discord.js-light')
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
            let ch = await this.client.guildConfig.get(`${guild.id}.logsChannel`).catch(() => null)
            if (typeof ch === 'string') {
                let logchannel = await this.client.utils.resolveChannel(guild, ch)
                if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.logsChannel`, null).catch(() => null)
                const embed = new MessageEmbed().setTimestamp()
                .setColor('#ff5533')
                .setTitle(`Deleted message in ${channel.name}`)
                .setAuthor(author.username, author.displayAvatarURL({dynamic:true}))
                .setFooter(`Author: ${author.id}`)
                .setDescription(`\`\`\`${content}\`\`\``)

                logchannel.send({embeds: [embed]})
            }
        }))

        this.client.on('messageUpdate', (async (oldMessage, newMessage) => {
            if (!oldMessage || !oldMessage.content || oldMessage.content === newMessage.content) return
            const { guild, author, content: newContent, channel } = newMessage,
                {content: oldContent} = oldMessage
            if (!oldContent) return
            let ch = await this.client.guildConfig.get(`${guild.id}.logsChannel`).catch(() => null)
            if (typeof ch === 'string') {
                let logchannel = await this.client.utils.resolveChannel(guild, ch)
                if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.logsChannel`, null).catch(() => null)
                const embed = new MessageEmbed().setTimestamp()
                .setColor('#ffff55')
                .setTitle(`Updated message in ${channel.name}`)
                .setAuthor(author.username, author.displayAvatarURL({dynamic:true}))
                .setFooter(`Author: ${author.id}`)
                .setDescription(`Before:\`\`\`${oldContent}\`\`\`After:\`\`\`${newContent}\`\`\``)

                logchannel.send({embeds: [embed]})
            }
        }))

        this.client.on('guildBanAdd', (async (ban) => {
            if (!ban.user) return
            const { guild } = ban
            let ch = await this.client.guildConfig.get(`${guild.id}.logsChannel`).catch(() => null)

            if (typeof ch === 'string') {
                let logchannel = await this.client.utils.resolveChannel(guild, ch)
                if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.logsChannel`, null).catch(() => null)
                const embed = new MessageEmbed().setTimestamp()
                .setColor('#ff5555')
                .setTitle(`User banned`)
                .setAuthor(ban.user.username, ban.user.displayAvatarURL({dynamic:true}))
                .setFooter(`User ID: ${ban.user.id}`)

                logchannel.send({embeds: [embed]})
            }
        }))

        this.client.on('guildBanRemove', (async (ban) => {
            if (!ban.user) return
            const { guild } = ban
            let ch = await this.client.guildConfig.get(`${guild.id}.logsChannel`).catch(() => null)

            if (typeof ch === 'string') {
                let logchannel = await this.client.utils.resolveChannel(guild, ch)
                if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.logsChannel`, null).catch(() => null)
                const embed = new MessageEmbed().setTimestamp()
                .setColor('#33cc55')
                .setTitle(`User unbanned`)
                .setAuthor(ban.user.username, ban.user.displayAvatarURL({dynamic:true}))
                .setFooter(`User ID: ${ban.user.id}`)

                logchannel.send({embeds: [embed]})
            }
        }))
    }
}