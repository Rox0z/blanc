const { MessageEmbed, MessageButton, MessageActionRow, MessageComponentInteractionCollector } = require('discord.js-light')
const Command = require('../../structures/command.js')

module.exports = class ConfigCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['configurar', 'cfg', 'configuration', 'configure'],
            description: { pt: 'Comando de configuração do BOT para o servidor.', en: 'BOT server configuration command.' },
            category: 'Admin',
            channel: 'text',
            neededPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
            usage: { pt: "config <categoria> <função>", en: "config <category> <function>" },
            title: { pt: "Configuração", en: "Configuration" }
        })
    }
    async run({ message, args, guild, channel, author, prefix, lang }) {
        let embedauthor = this.client.locale(lang, 'CONFIG_COMMAND_EMBED_TITLE'),
            embedcatdesc = this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_DESCRIPTION', { custom: ['prefix', prefix] }),
            embedstaticdesc = this.client.locale(lang, 'CONFIG_COMMAND_STATIC_DESC', { custom: ['prefix', prefix] }),
            proofLocale = { pt: 'Prova', en: 'Proof' }
        const menu = new MessageEmbed()
            .setAuthor(embedauthor, "https://cdn.discordapp.com/emojis/841518870958964736.png")
            .setTitle(this.client.locale(lang, 'CONFIG_COMMAND_LIST_TITLE'))
            .setDescription(this.client.locale(lang, 'CONFIG_COMMAND_DEFAULT_DESC', { custom: ['prefix', prefix] }))
            .addFields([
                { name: 'Prefix', value: '```md\n* default\n* set <prefix>\n\u200B\n\u200B```', inline: true },
                { name: 'Mute', value: '```md\n* create\n* set <muteRole roleID>\n* get\n* disable```', inline: true },
                { name: '\u200B', value: '\u200B', inline: 0 },
                { name: 'Logs', value: '```md\n* create\n* set <logCH channelID>\n* disable```', inline: true },
                { name: 'ModLogs', value: '```md\n* create\n* set <logCH channelID>\n* disable```', inline: true },
                { name: proofLocale[lang], value: '```md\n* create\n* set <logCH channelID>\n* disable```', inline: false },
            ]),
            prefixMenu = new MessageEmbed()
                .setAuthor(embedauthor, "https://cdn.discordapp.com/emojis/841519978397040640.png")
                .setTitle(this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_TITLE', { custom: ['category', 'Prefix'] }))
                .setDescription(embedcatdesc)
                .addFields([
                    { name: "Default", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_PREFIX_DEFAULT'), inline: 0 },
                    { name: "Set", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_PREFIX_SET'), inline: 0 },
                ]),
            muteMenu = new MessageEmbed()
                .setAuthor(embedauthor, "https://cdn.discordapp.com/emojis/841519038974656522.png")
                .setTitle(this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_TITLE', { custom: ['category', 'Mute'] }))
                .setDescription(embedcatdesc)
                .addFields([
                    { name: "Create", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_MUTE_CREATE'), inline: 0 },
                    { name: "Set", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_MUTE_SET'), inline: 0 },
                    { name: "Get", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_MUTE_GET'), inline: 0 },
                    { name: "Disable", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_MUTE_DISABLE'), inline: 0 },
                ]),
            logsMenu = new MessageEmbed()
                .setAuthor(embedauthor, "https://cdn.discordapp.com/emojis/841742410337091594.png")
                .setTitle(this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_TITLE', { custom: ['category', 'Logs'] }))
                .setDescription(embedcatdesc)
                .addFields([
                    { name: "Create", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_LOGS_CREATE'), inline: 0 },
                    { name: "Set", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_LOGS_SET'), inline: 0 },
                    { name: "Disable", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_LOGS_DISABLE'), inline: 0 },
                ]),
            modlogsMenu = new MessageEmbed()
                .setAuthor(embedauthor, "https://cdn.discordapp.com/emojis/841519512678432778.png")
                .setTitle(this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_TITLE', { custom: ['category', 'ModLogs'] }))
                .setDescription(embedcatdesc)
                .addFields([
                    { name: "Create", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_MODLOGS_CREATE'), inline: 0 },
                    { name: "Set", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_MODLOGS_SET'), inline: 0 },
                    { name: "Disable", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_MODLOGS_DISABLE'), inline: 0 },
                ]),
            proofMenu = new MessageEmbed()
                .setAuthor(embedauthor, "https://cdn.discordapp.com/emojis/841519512678432778.png")
                .setTitle(this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_TITLE', { custom: ['category', `${proofLocale[lang]}s`] }))
                .setDescription(embedcatdesc)
                .addFields([
                    { name: "Create", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_PROOFS_CREATE'), inline: 0 },
                    { name: "Set", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_PROOFS_SET'), inline: 0 },
                    { name: "Disable", value: this.client.locale(lang, 'CONFIG_COMMAND_CATEGORY_FIELD_PROOFS_DISABLE'), inline: 0 },
                ]);
        let color = 'SECONDARY',
            logs = new MessageButton().setCustomID('logs').setLabel('LOGS').setStyle(color).setEmoji('841742410337091594'),
            mlog = new MessageButton().setCustomID('mlog').setLabel('MOD LOGS').setStyle(color).setEmoji('841519512678432778'),
            pref = new MessageButton().setCustomID('pref').setLabel('PREFIX').setStyle(color).setEmoji('841519978397040640'),
            mute = new MessageButton().setCustomID('mute').setLabel('MUTE').setStyle(color).setEmoji('841519038974656522'),
            prof = new MessageButton().setCustomID('proof').setLabel(proofLocale[lang].toUpperCase()).setStyle(color).setEmoji('860982546811715595'),
            volt = new MessageButton().setCustomID('back').setStyle('PRIMARY').setEmoji('841742417783029822'),
            home = new MessageActionRow().addComponents([pref, mute, logs, mlog, prof]),
            back = new MessageActionRow().addComponents([volt])

        switch (args[0]?.toLowerCase()) {
            case 'log':
            case 'logs':
                switch (args[1]) {
                    case 'create':
                        if (typeof await this.client.guildConfig.get(`${guild.id}.logsChannel`) === 'string') return message.nmReply(this.client.locale(lang, 'RESPONSES_ALREADY_CHANNEL', { custom: ['prefix', prefix] }))
                        let logchannel = await guild.channels.create('Server-logs', { type: 'text', permissionOverwrites: [{ id: guild.roles.everyone, deny: 'VIEW_CHANNEL' }] }).catch(() => null)
                        if (!logchannel) return message.nmReply(this.client.locale(lang, 'ERROR_UNKNOW'))
                        await this.client.guildConfig.set(`${guild.id}.logsChannel`, logchannel.id), message.nmReply(this.client.locale(lang, 'RESPONSES_CREATED_CHANNEL', { channel: logchannel }))
                        break;
                    case 'set':
                        if (args[2]) {
                            logchannel = await this.client.utils.resolveChannel(guild, args[2])
                            if (!logchannel) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_CHANNEL'))
                            await this.client.guildConfig.set(`${guild.id}.logsChannel`, logchannel.id), message.nmReply(this.client.locale(lang, 'RESPONSES_CHOSED_CHANNEL', { channel: logchannel }))
                        }
                        else {
                            let filter = (m) => m.author.id === author.id;
                            message.nmReply(this.client.locale(lang, 'CHOOSE_CHANNEL'))
                            let col = channel.createMessageCollector({ filter, time: 60000, max: 1 })
                            col.on('collect', async (msg) => {
                                let logchannel = await this.client.utils.resolveChannel(guild, `${msg.content.trim().split(/ +/g)[0]}`)
                                if (!logchannel) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_CHANNEL'))
                                await this.client.guildConfig.set(`${guild.id}.logsChannel`, logchannel.id), message.nmReply(this.client.locale(lang, 'RESPONSES_CHOSED_CHANNEL', { channel: logchannel }))
                            })
                        }
                        break;
                    case 'disable':
                        await this.client.guildConfig.set(`${guild.id}.logsChannel`, null), message.nmReply(this.client.locale(lang, 'RESPONSES_DISABLE', { custom: ['category', 'LOGS'] }))
                        break;
                    default:
                        message.nmReply({ embeds: [logsMenu.setDescription(embedstaticdesc)] })
                        break;
                }
                break;
            case 'modlog':
            case 'modlogs':
                switch (args[1]) {
                    case 'create':
                        if (typeof await this.client.guildConfig.get(`${guild.id}.modLogsChannel`) === 'string') return message.nmReply(this.client.locale(lang, 'RESPONSES_ALREADY_CHANNEL', { custom: ['prefix', prefix] }))
                        let modlogchannel = await guild.channels.create('moderation-logs', { type: 'text', permissionOverwrites: [{ id: guild.roles.everyone, deny: 'VIEW_CHANNEL' }] })
                        if (!modlogchannel) return message.nmReply(this.client.locale(lang, 'ERROR_UNKNOW'))
                        await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, modlogchannel.id), message.nmReply(this.client.locale(lang, 'RESPONSES_CREATED_CHANNEL', { channel: modlogchannel }))
                        break;
                    case 'set':
                        if (args[2]) {
                            let modlogchannel = await this.client.utils.resolveChannel(guild, args[2])
                            if (!modlogchannel) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_CHANNEL'))
                            await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, modlogchannel.id), message.nmReply(this.client.locale(lang, 'RESPONSES_CHOSED_CHANNEL', { channel: modlogchannel }))
                        }
                        else {
                            let filter = (m) => m.author.id === author.id;
                            message.nmReply(this.client.locale(lang, 'CHOOSE_CHANNEL'))
                            let col = channel.createMessageCollector({ filter, time: 60000, max: 1 })
                            col.on('collect', async (msg) => {
                                let modlogchannel = await this.client.utils.resolveChannel(guild, `${msg.content.trim().split(/ +/g)[0]}`)
                                if (!modlogchannel) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_CHANNEL'))
                                await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, modlogchannel.id), message.nmReply(this.client.locale(lang, 'RESPONSES_CHOSED_CHANNEL', { channel: modlogchannel }))
                            })
                        }
                        break;
                    case 'disable':
                        await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, null), message.nmReply(this.client.locale(lang, 'RESPONSES_DISABLE', { custom: ['category', 'MODLOGS'] }))
                        break;
                    default:
                        message.nmReply({ embeds: [modlogsMenu.setDescription(embedstaticdesc)] })
                        break;
                }
                break;
            case 'prefix':
                switch (args[1]) {
                    case 'default':
                        await this.client.guildConfig.set(`${guild.id}.guildPrefix`, this.client.defaultPrefix), message.nmReply(this.client.locale(lang, 'RESPONSES_RESET_PREFIX', { custom: ['prefix', this.client.defaultPrefix] }))
                        this.client.prefixes.set(guild.id, this.client.defaultPrefix)
                        break;
                    case 'set':
                        if (args[2]) {
                            await this.client.guildConfig.set(`${guild.id}.guildPrefix`, args[2]), message.nmReply(this.client.locale(lang, 'RESPONSES_CHOSED_PREFIX', { custom: ['prefix', args[2]] }))
                            this.client.prefixes.set(guild.id, args[2])
                        }
                        else {
                            let filter = (m) => m.author.id === author.id;
                            message.nmReply(this.client.locale(lang, 'CHOOSE_PREFIX'))
                            let col = channel.createMessageCollector({ filter, time: 60000, max: 1 })
                            col.on('collect', async (msg) => {
                                if (!msg.content) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_PREFIX'))
                                let newprefix = `${msg.content.trim().split(/ +/g)[0]}`
                                await this.client.guildConfig.set(`${guild.id}.guildPrefix`, newprefix), message.nmReply(this.client.locale(lang, 'RESPONSES_CHOSED_PREFIX', { custom: ['prefix', newprefix] }))
                                this.client.prefixes.set(guild.id, newprefix)
                            })
                        }
                        break;
                    default:
                        message.nmReply({ embeds: [prefixMenu.setDescription(embedstaticdesc)] })
                        break;
                }
                break;
            case 'mute':
                switch (args[1]) {
                    case 'create':
                        if (typeof await this.client.guildConfig.get(`${guild.id}.muteRole`) === 'string') return message.nmReply(this.client.locale(lang, 'RESPONSES_ALREADY_ROLE', { custom: ['prefix', prefix] }))
                        let muterole = await guild.roles.create({ name: 'muted', mentionable: false, color: '#202050', reason: 'Create mute role.', permissions: ['VIEW_CHANNELS'] });
                        if (!muterole) return message.nmReply(this.client.locale(lang, 'ERROR_UNKNOW'))
                        await this.client.guildConfig.set(`${guild.id}.muteRole`, muterole.id), message.nmReply(this.client.locale(lang, 'RESPONSES_NEW_ROLE', { role: muterole }))
                        break;
                    case 'get':
                        if (typeof await this.client.guildConfig.get(`${guild.id}.muteRole`) === 'string') return message.nmReply(this.client.locale(lang, 'RESPONSES_ALREADY_ROLE', { custom: ['prefix', prefix] }))
                        let muter = this.client.utils.resolveRole(`mute`, guild.roles.cache);
                        if (!muter) return message.nmReply(this.client.locale(lang, 'ERROR_NOT_FOUND'))
                        await this.client.guildConfig.set(`${guild.id}.muteRole`, muter.id), message.nmReply(this.client.locale(lang, 'RESPONSES_FOUND_ROLE', { role: muter }))
                        break;
                    case 'set':
                        if (args[2]) {
                            let muterole = this.client.utils.resolveRole(`${args[2]}`, guild.roles.cache, false, true)
                            if (!muterole) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_ROLE'))
                            await this.client.guildConfig.set(`${guild.id}.muteRole`, muterole.id), message.nmReply(this.client.locale(lang, 'RESPONSES_CHOSED_ROLE', { role: muterole }))
                        }
                        else {
                            let filter = (m) => m.author.id === author.id;
                            message.nmReply(this.client.locale(lang, 'CHOOSE_ROLE'))
                            let col = channel.createMessageCollector({ filter, time: 60000, max: 1 })
                            col.on('collect', async (msg) => {
                                let muterole = this.client.utils.resolveRole(`${msg.content.trim().split(/ +/g)[0]}`, guild.roles.cache, false, true)
                                if (!muterole) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_ROLE'))
                                await this.client.guildConfig.set(`${guild.id}.muteRole`, muterole.id), message.nmReply(this.client.locale(lang, 'RESPONSES_CHOSED_ROLE', { role: muterole }))
                            })
                        }
                        break;
                    case 'disable':
                        await this.client.guildConfig.set(`${guild.id}.muteRole`, null), message.nmReply(this.client.locale(lang, 'RESPONSES_DISABLE', { custom: ['category', 'MUTE'] }))
                        break;
                    default:
                        message.nmReply({ embeds: [muteMenu.setDescription(embedstaticdesc)] })
                        break;
                }
                break;
            case 'proof':
            case 'prova':
                switch (args[1]) {
                    case 'create':
                        if (typeof await this.client.guildConfig.get(`${guild.id}.proofsChannel`) === 'string') return message.nmReply(this.client.locale(lang, 'RESPONSES_ALREADY_CHANNEL', { custom: ['prefix', prefix] }))
                        let proofchannel = await guild.channels.create(`${proofLocale[lang]}s`, { type: 'text', permissionOverwrites: [{ id: guild.roles.everyone, deny: 'VIEW_CHANNEL' }] }).catch(() => null)
                        if (!proofchannel) return message.nmReply(this.client.locale(lang, 'ERROR_UNKNOW'))
                        await this.client.guildConfig.set(`${guild.id}.proofsChannel`, proofchannel.id), message.nmReply(this.client.locale(lang, 'RESPONSES_CREATED_CHANNEL', { channel: proofchannel }))
                        break;
                    case 'set':
                        if (args[2]) {
                            let proofchannel = await this.client.utils.resolveChannel(guild, args[2])
                            if (!proofchannel) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_CHANNEL'))
                            await this.client.guildConfig.set(`${guild.id}.proofsChannel`, proofchannel.id), message.nmReply(this.client.locale(lang, 'RESPONSES_CHOSED_CHANNEL', { channel: proofchannel }))
                        }
                        else {
                            let filter = (m) => m.author.id === author.id;
                            message.nmReply(this.client.locale(lang, 'CHOOSE_CHANNEL'))
                            let col = channel.createMessageCollector({ filter, time: 60000, max: 1 })
                            col.on('collect', async (msg) => {
                                let proofchannel = await this.client.utils.resolveChannel(guild, `${msg.content.trim().split(/ +/g)[0]}`)
                                if (!proofchannel) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_CHANNEL'))
                                await this.client.guildConfig.set(`${guild.id}.proofsChannel`, proofchannel.id), message.nmReply(this.client.locale(lang, 'RESPONSES_CHOSED_CHANNEL', { channel: proofchannel }))
                            })
                        }
                        break;
                    case 'disable':
                        await this.client.guildConfig.set(`${guild.id}.proofsChannel`, null), message.nmReply(this.client.locale(lang, 'RESPONSES_DISABLE', { custom: ['category', proofLocale[lang].toUpperCase()] }))
                        break;
                    default:
                        message.nmReply({ embeds: [proofMenu.setDescription(embedstaticdesc)] })
                        break;
                }
                break;
            default:
                let sent = await message.nmReply({ embeds: [menu], components: [home] })
                let collector = new MessageComponentInteractionCollector(sent, { time: 300000 })

                collector.on("collect", async (interaction) => {
                    if (interaction.user.id !== author.id) return interaction.reply({ content: this.client.locale(lang, 'ERROR_AUTHOR_ONLY'), ephemeral: true })
                    interaction.deferUpdate()
                    "back" === interaction.customID
                        ? sent.nmEdit({ embeds: [menu], components: [home] })
                        : "pref" === interaction.customID
                        ? sent.nmEdit({ embeds: [prefixMenu], components: [back] })
                        : "mute" === interaction.customID
                        ? sent.nmEdit({ embeds: [muteMenu], components: [back] })
                        : "logs" === interaction.customID
                        ? sent.nmEdit({ embeds: [logsMenu], components: [back] })
                        : "proof" === interaction.customID
                        ? sent.nmEdit({ embeds: [proofMenu], components: [back] })
                        : "mlog" === interaction.customID && sent.nmEdit({ embeds: [modlogsMenu], components: [back] });
                })
                collector.on('end', async () => {
                    sent.nmEdit({ embeds: [menu.setDescription(embedstaticdesc)], components: [] })
                })
                break;
        }
    }
}