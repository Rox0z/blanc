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
            description: 'Mostra as informações do servidor.',
            category: 'Info',
            channel: 'text',
            title: 'Server info',
            usage: 'serverinfo [guildID]',
        })
    }
    async run({ message, args, guild, channel, author }) {
        let server = !isNaN(args[0]) && this.client.utils.resolveGuild(args[0], this.client.guilds.cache, true, true) || guild
        if (!server) return
        let members = await server.members.fetch(false),
        owner = await this.client.users.fetch(server.ownerID, false);
        const embed = new MessageEmbed()
            .setColor('#fefefe')
            .setTitle(`${badges[this.client.utils.guildBadge(guild)]}${guild.name}    ${localeEmoji(server.preferredLocale)}`)
            .setThumbnail(server.iconURL({ dynamic: true }))
            .setDescription(`${this.client.emoji.icons['calendar']} **Desde:** <t:${Math.round(server.createdTimestamp / 1000)}:F>`)
            .addFields([
                { name: `${this.client.emoji.icons['role']} Cargos:`, value: `\`\`\`${server.roles.cache.size - 1}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['emoji']} Emojis:`, value: `\`\`\`${server.emojis.cache.size}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['sticker']} Stickers:`, value: `\`\`\`${server?.stickers?.cache?.size || '0'}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['members']} Membros:`, value: `\`\`\`${server.memberCount}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['integration']} BOTS:`, value: `\`\`\`${members.filter(m => m.user.bot).size}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['owner']} ${owner.username}:`, value: `\`\`\`${server.ownerID}\`\`\``, inline: false },
                { name: `${this.client.emoji.icons['id']} Server ID:`, value: `\`\`\`${server.id}\`\`\``, inline: false },
            ]),
            embedchannels = new MessageEmbed()
            .setTitle(`${badges[this.client.utils.guildBadge(guild)]}${guild.name}    ${localeEmoji(server.preferredLocale)}`)
                .setColor('#fefefe')
                .setThumbnail(server.iconURL({ dynamic: true }))
                .addFields([
                    { name: `${this.client.emoji.channels['text']} Texto:`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'text').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['voice']} Voz:`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'voice').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['stage']} Stages:`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'stage').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['news']} Anuncios:`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'news').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['store']} Lojas:`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'store').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['thread']} Threads:`, value: `\`\`\`${server.channels.cache.filter(c => c.type === 'public_thread' || c.type === 'private_thread' || c.type === 'news_thread').size}\`\`\``, inline: true },
                    { name: `${this.client.emoji.channels['rules']} Regras:`, value: `${server.rulesChannel || 'Nenhum'}`, inline: true },
                    { name: `${this.client.emoji.channels['voice']} AFK:`, value: `${server.afkChannel || 'Nenhum'}`, inline: true },
                ]),
            embedroles = new MessageEmbed()
            .setTitle(`${badges[this.client.utils.guildBadge(guild)]}${guild.name}    ${localeEmoji(server.preferredLocale)}`)
            .setColor('#fefefe')
            .setThumbnail(server.iconURL({ dynamic: true }))
            .addFields([
                { name: `${this.client.emoji.icons['role']} Total:`, value: `\`\`\`${server.roles.cache.size - 1}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['mod']} Mods:`, value: `\`\`\`${server.roles.cache.array().filter(c => c.permissions.toArray().hasAny(this.client.MODPERMS)).length}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['members']} Comuns:`, value: `\`\`\`${(server.roles.cache.size - 1) - (server.roles.cache.array().filter(c => c.permissions.toArray().hasAny(this.client.MODPERMS)).length)}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['activity']} Cargos:`, value: this.client.utils.trimArray(server.roles.cache.sort((a, b) => b.position - a.position).array().slice(0, -1), 20).join('\n')}
            ])
            ,
            chan = new MessageButton().setEmoji('841742417514332213').setStyle('SECONDARY').setCustomID('channels').setLabel('CANAIS'),
            role = new MessageButton().setEmoji('841519139184705556').setStyle('SECONDARY').setCustomID('roles').setLabel('CARGOS'),
            back = new MessageButton().setEmoji('841742417783029822').setStyle('PRIMARY').setCustomID('back'),
            home = new MessageActionRow().addComponents([chan, role]),
            menu = new MessageActionRow().addComponents([back]);

        if (server.channels.cache.filter(c => (c.type === 'public_thread' || c.type === 'private_thread' || c.type === 'news_thread') && !c.archived).size > 0) {
            let threads = server.channels.cache.filter(c => c.type === 'public_thread' || c.type === 'private_thread' || c.type === 'news_thread'),
            putext = threads.filter(t => t.type === 'public_thread' && !guild.channels.forge(t.parentID).nsfw).size,
            prtext = threads.filter(t => t.type === 'private_thread').size,
            nsftext = threads.filter(t => t.type === 'public_thread' && guild.channels.forge(t.parentID).nsfw).size,
            punews = threads.filter(t => t.type === 'news_thread' && !guild.channels.forge(t.parentID).nsfw && !!channel.permissionOverwrites.filter(r => r.id === guild.roles.everyone.id ).first()?.deny.toArray().includes('VIEW_CHANNEL') === false).size,
            prnews = threads.filter(t => t.type === 'news_thread' && !!channel.permissionOverwrites.filter(r => r.id === guild.roles.everyone.id ).first()?.deny.toArray().includes('VIEW_CHANNEL')).size,
            nsfnews = threads.filter(t => t.type === 'news_thread' && guild.channels.forge(t.parentID).nsfw).size,
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
            if (interaction.user.id !== author.id) return interaction.reply({ content: 'Apenas o autor pode interagir!', ephemeral: true })
            interaction.deferUpdate()
            "back" === interaction.customID
                ? sent.nmEdit({ embeds: [embed], components: [home] })
                : "channels" === interaction.customID 
                ? sent.nmEdit({ embeds: [embedchannels], components: [menu] })
                : "roles" === interaction.customID && sent.nmEdit({ embeds: [embedroles], components: [menu] })
                
        })
        col.on('end', () => {
            sent.nmEdit({embeds: [embed], components: []})
        })
    }
}