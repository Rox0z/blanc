const Command = require('../../structures/command.js'),
    { MessageEmbed, MessageActionRow, MessageButton, MessageComponentInteractionCollector } = require('discord.js-light'),
    badges = {
        "VERIFIED": "<:verifiedg:841518169100124180> ",
        "PARTNERED": "<:newpartnerb:841518387481935932> ",
        "lvl0": "<:lvl0:861000947953958943> ",
        "lvl1": "<:lvl1:861001000026636288> ",
        "lvl2": "<:lvl2:861001047648370698> ",
        "lvl3": "<:lvl3:861001066106322975> ",
        "": ""
    },
    localeEmoji = require('locale-emoji')

module.exports = class ServerInfoCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['si', 'guildinfo', 'server', 'guild'],
            description: { pt: 'Mostra as informações do servidor.', en: "Shows the server information." },
            category: 'Info',
            channel: 'text',
            title: { pt: "Informação do servidor", en: "Server info" },
            usage: 'serverinfo [serverID]',
        })
    }
    async run({ message, args, guild, channel, author, lang }) {
        let server = !isNaN(args[0]) && this.client.utils.resolveGuild(args[0], this.client.guilds.cache, true, true) || guild
        if (!server) return
        let members = await server.members.fetch(false),
            owner = await this.client.users.fetch(server.ownerID, false);
        const strings = this.client.locale(lang, 'SERVERINFO_COMMAND_FIELDS')
        const embed = new MessageEmbed()
            .setColor('#fefefe')
            .setTitle(`${badges[this.client.utils.guildBadge(server)]}${server.name}    ${localeEmoji(server.preferredLocale)}`)
            .setThumbnail(server.iconURL({ dynamic: true }))
            .setDescription(`${this.client.emoji.icons['calendar']} **${strings.SINCE}** <t:${Math.round(server.createdTimestamp / 1000)}:F>`)
            .addFields([
                { name: `${this.client.emoji.icons['role']} ${strings.ROLES}`, value: `\`\`\`${server.roles.cache.size - 1}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['emoji']} ${strings.EMOJIS}`, value: `\`\`\`${server.emojis.cache.size}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['sticker']} ${strings.STICKERS}`, value: `\`\`\`${server?.stickers?.cache?.size || '0'}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['members']} ${strings.MEMBERS}`, value: `\`\`\`${server.memberCount}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['integration']} ${strings.BOTS}`, value: `\`\`\`${members.filter(m => m.user.bot).size}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['owner']} ${owner.username}:`, value: `\`\`\`${server.ownerID}\`\`\``, inline: false },
                { name: `${this.client.emoji.icons['id']} ${strings.SERVER_ID}`, value: `\`\`\`${server.id}\`\`\``, inline: false },
            ]),
            embedchannels = new MessageEmbed()
                .setTitle(`${badges[this.client.utils.guildBadge(server)]}${server.name}    ${localeEmoji(server.preferredLocale)}`)
                .setColor('#fefefe')
                .setThumbnail(server.iconURL({ dynamic: true }))
                .addFields([
                    { name: `${this.client.emoji.channels['text']} ${strings.TEXT_CHANNEL}`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'text').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['voice']} ${strings.VOICE_CHANNEL}`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'voice').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['stage']} ${strings.STAGE_CHANNEL}`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'stage').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['news']} ${strings.NEWS_CHANNEL}`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'news').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['store']} ${strings.STORE_CHANNEL}`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'store').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['thread']} ${strings.THREADS_CHANNEL}`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'public_thread' || c.type === 'private_thread' || c.type === 'news_thread').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['rules']} ${strings.RULES_CHANNEL}`, value: `${server.rulesChannel || this.client.locale(lang, 'NONE')}`, inline: true },
                    { name: `${this.client.emoji.channels['voice']} AFK:`, value: `${server.afkChannel || this.client.locale(lang, 'NONE')}`, inline: true },
                ]),
            embedroles = new MessageEmbed()
                .setTitle(`${badges[this.client.utils.guildBadge(server)]}${server.name}    ${localeEmoji(server.preferredLocale)}`)
                .setColor('#fefefe')
                .setThumbnail(server.iconURL({ dynamic: true }))
                .addFields([
                    { name: `${this.client.emoji.icons['role']} ${strings.TOTAL}`, value: `\`\`\`${server.roles.cache.size - 1}\`\`\``, inline: true },
                    { name: `${this.client.emoji.icons['mod']} ${strings.MODS}`, value: `\`\`\`${server.roles.cache.array().filter(c => c.permissions.toArray().hasAny(this.client.MODPERMS)).length}\`\`\``, inline: true },
                    { name: `${this.client.emoji.icons['members']} ${strings.COMMONS}`, value: `\`\`\`${(server.roles.cache.size - 1) - (server.roles.cache.array().filter(c => c.permissions.toArray().hasAny(this.client.MODPERMS)).length)}\`\`\``, inline: true },
                    { name: `${this.client.emoji.icons['activity']} ${strings.ROLES}`, value: this.client.utils.trimArray(server.roles.cache.sort((a, b) => b.position - a.position).array().slice(0, -1), 20).join('\n') }
                ])
            ,
            chan = new MessageButton().setEmoji('841742417514332213').setStyle('SECONDARY').setCustomID('channels').setLabel(this.client.locale(lang, 'BUTTONLABEL_CHANNELS')),
            role = new MessageButton().setEmoji('841519139184705556').setStyle('SECONDARY').setCustomID('roles').setLabel(this.client.locale(lang, 'BUTTONLABEL_ROLES')),
            back = new MessageButton().setEmoji('841742417783029822').setStyle('PRIMARY').setCustomID('back'),
            home = new MessageActionRow().addComponents([chan, role]),
            menu = new MessageActionRow().addComponents([back]);

        if (server.channels.cache.filter(c => (c.type === 'public_thread' || c.type === 'private_thread' || c.type === 'news_thread') && !c.archived).size > 0) {
            let threads = server.channels.cache.filter(c => c.type === 'public_thread' || c.type === 'private_thread' || c.type === 'news_thread'),
                putext = threads.filter(t => t.type === 'public_thread' && !server.channels.forge(t.parentID).nsfw).size,
                prtext = threads.filter(t => t.type === 'private_thread').size,
                nsftext = threads.filter(t => t.type === 'public_thread' && server.channels.forge(t.parentID).nsfw).size,
                punews = threads.filter(t => t.type === 'news_thread' && !server.channels.forge(t.parentID).nsfw && !!channel.permissionOverwrites.filter(r => r.id === server.roles.everyone.id).first()?.deny.toArray().includes('VIEW_CHANNEL') === false).size,
                prnews = threads.filter(t => t.type === 'news_thread' && !!channel.permissionOverwrites.filter(r => r.id === server.roles.everyone.id).first()?.deny.toArray().includes('VIEW_CHANNEL')).size,
                nsfnews = threads.filter(t => t.type === 'news_thread' && server.channels.forge(t.parentID).nsfw).size,
                field = {
                    name: this.client.emoji.channels['start'],
                    value: [
                        `${putext > 0 ? `${prtext > 0 ? this.client.emoji.channels['midn'] : this.client.emoji.channels['midend']}${this.client.emoji.channels['thread']}: ${putext}\n` : ''}`,
                        `${prtext > 0 ? `${nsftext > 0 ? this.client.emoji.channels['midn'] : this.client.emoji.channels['midend']}${this.client.emoji.channels['privatethread']}: ${prtext}\n` : ''}`,
                        `${nsftext > 0 ? `${punews > 0 ? this.client.emoji.channels['midn'] : this.client.emoji.channels['midend']}${this.client.emoji.channels['threadnsfw']}: ${nsftext}\n` : ''}`,
                        `${punews > 0 ? `${prnews > 0 ? this.client.emoji.channels['midn'] : this.client.emoji.channels['midend']}${this.client.emoji.channels['newsthread']}: ${punews}\n` : ''}`,
                        `${prnews > 0 ? `${nsfnews > 0 ? this.client.emoji.channels['midn'] : this.client.emoji.channels['midend']}${this.client.emoji.channels['newsprivatethread']}: ${prnews}\n` : ''}`,
                        `${nsfnews > 0 ? `${this.client.emoji.channels['midend']}${this.client.emoji.channels['newsthreadnsfw']}: ${nsfnews}` : ''}`,
                    ].join(''),
                    inline: true
                }
            embedchannels.addFields([field])
        }
        let sent = await message.nmReply({ embeds: [embed], components: [home] })
        const col = new MessageComponentInteractionCollector(sent, { time: 18e4 })

        col.on('collect', async (interaction) => {
            if (interaction.user.id !== author.id) return interaction.reply({ content: this.client.locale(lang, 'ERROR_AUTHOR_ONLY'), ephemeral: true })
            interaction.deferUpdate()
            "back" === interaction.customID
                ? sent.nmEdit({ embeds: [embed], components: [home] })
                : "channels" === interaction.customID
                    ? sent.nmEdit({ embeds: [embedchannels], components: [menu] })
                    : "roles" === interaction.customID && sent.nmEdit({ embeds: [embedroles], components: [menu] })

        })
        col.on('end', () => {
            sent.nmEdit({ embeds: [embed], components: [] })
        })
    }
}