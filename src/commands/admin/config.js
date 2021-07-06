const { MessageEmbed, MessageButton, MessageActionRow, MessageComponentInteractionCollector } = require('discord.js-light')
const Command = require('../../structures/command.js')

module.exports = class ConfigCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['configurar', 'cfg', 'configuration', 'configure'],
            description: 'Comando de configuração do BOT para o servidor.',
            category: 'Admin',
            channel: 'text',
            neededPermissions: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
            usage: 'config <categoria> <função>',
            title: 'Configuration'
        })
    }
    async run({ message, args, guild, channel, author }) {
        const menu = new MessageEmbed()
            .setAuthor('Menu de configuração', "https://cdn.discordapp.com/emojis/841518870958964736.png")
            .setTitle('Lista de argumentos:')
            .setDescription('>>> Use no formato `config <categoria> <função>`\nUtilize os botões para detalhes das categorias.')
            .addFields([
                { name: 'Prefix', value: '```md\n* default\n* set <prefix>\n\u200B\n\u200B```', inline: true },
                { name: 'Mute', value: '```md\n* create\n* set <muteRole roleID>\n* get\n* disable```', inline: true },
                { name: '\u200B', value: '\u200B', inline: 0 },
                { name: 'Logs', value: '```md\n* create\n* set <logCH channelID>\n* disable```', inline: true },
                { name: 'ModLogs', value: '```md\n* create\n* set <logCH channelID>\n* disable```', inline: true },
            ]),
            prefixMenu = new MessageEmbed()
                .setAuthor('Menu de configuração', "https://cdn.discordapp.com/emojis/841519978397040640.png")
                .setTitle('Configurações de Prefix:')
                .setDescription('>>> Use no formato `config <categoria> <função>`\nUtilize os botões para detalhes.')
                .addFields([
                    { name: "Default", value: "```ini\n[ Reseta o prefix do BOT neste servidor ]```", inline: 0 },
                    { name: "Set", value: "```ini\n[ Declare um novo prefix do BOT neste servidor ]```", inline: 0 },
                ]),
            muteMenu = new MessageEmbed()
                .setAuthor('Menu de configuração', "https://cdn.discordapp.com/emojis/841519038974656522.png")
                .setTitle('Configurações de Mute:')
                .setDescription('>>> Use no formato `config <categoria> <função>`\nUtilize os botões para detalhes.')
                .addFields([
                    { name: "Create", value: "```ini\n[ Cria um cargo mute e define como padrão ]```", inline: 0 },
                    { name: "Set", value: "```ini\n[ Declare um cargo mute neste servidor ]```", inline: 0 },
                    { name: "Get", value: '```ini\n[ O Bot irá procurar um cargo que tenha o nome "mute" ]```', inline: 0 },
                    { name: "Disable", value: "```ini\n[ Desabilita o comando mute no servidor ]```", inline: 0 },
                ]),
            logsMenu = new MessageEmbed()
                .setAuthor('Menu de configuração', "https://cdn.discordapp.com/emojis/841742410337091594.png")
                .setTitle('Configurações de Prefix:')
                .setDescription('>>> Use no formato `config <categoria> <função>`\nUtilize os botões para detalhes.')
                .addFields([
                    { name: "Create", value: "```ini\n[ Cria um canal de logs para uso ]```", inline: 0 },
                    { name: "Set", value: "```ini\n[ Declare um canal de logs neste servidor ]```", inline: 0 },
                    { name: "Disable", value: "```ini\n[ Desabilita os logs no servidor ]```", inline: 0 },
                ]),
            modlogsMenu = new MessageEmbed()
                .setAuthor('Menu de configuração', "https://cdn.discordapp.com/emojis/841519512678432778.png")
                .setTitle('Configurações de Prefix:')
                .setDescription('>>> Use no formato `config <categoria> <função>`\nUtilize os botões para detalhes.')
                .addFields([
                    { name: "Create", value: "```ini\n[ Cria um canal de logs de moderação para uso ]```", inline: 0 },
                    { name: "Set", value: "```ini\n[ Declare um canal de logs de moderação neste servidor ]```", inline: 0 },
                    { name: "Disable", value: "```ini\n[ Desabilita os logs de moderação no servidor ]```", inline: 0 },
                ])
        let color = 'SECONDARY',
            logs = new MessageButton().setCustomID('logs').setLabel('LOGS').setStyle(color).setEmoji('841742410337091594'),
            mlog = new MessageButton().setCustomID('mlog').setLabel('MOD LOGS').setStyle(color).setEmoji('841519512678432778'),
            pref = new MessageButton().setCustomID('pref').setLabel('PREFIX').setStyle(color).setEmoji('841519978397040640'),
            mute = new MessageButton().setCustomID('mute').setLabel('MUTE').setStyle(color).setEmoji('841519038974656522'),
            volt = new MessageButton().setCustomID('back').setStyle('PRIMARY').setEmoji('841742417783029822'),
            home = new MessageActionRow().addComponents([pref, mute, logs, mlog]),
            back = new MessageActionRow().addComponents([volt])

        switch (args[0]?.toLowerCase()) {
            case 'logs':
                switch (args[1]) {
                    case 'create':
                        if (typeof await this.client.guildConfig.get(`${guild.id}.logsChannel`) === 'string') return message.nmReply(`Já possuo um canal configurado, para criar um novo por favor desabilite antes com \`${await this.client.guildConfig.get(`${guild.id}.guildPrefix`)}config logs disable\``)
                        let logchannel = await guild.channels.create('Server-logs', { type: 'text', permissionOverwrites: [{ id: guild.roles.everyone, deny: 'VIEW_CHANNEL' }] }).catch(() => null)
                        if (!logchannel) return message.nmReply('Algo deu errado!')
                        await this.client.guildConfig.set(`${guild.id}.logsChannel`, logchannel.id), message.nmReply(`Canal criado, <#${logchannel.id}>`)
                        break;
                    case 'set':
                        if (args[2]) {
                            logchannel = await this.client.utils.resolveChannel(guild, args[2])
                            if (!logchannel) return message.nmReply('Canal inválido!')
                            await this.client.guildConfig.set(`${guild.id}.logsChannel`, logchannel.id), message.nmReply(`Canal escolhido, ${logchannel}`)
                        }
                        else {
                            let filter = (m) => m.author.id === author.id;
                            message.nmReply(`Escolha um canal:`)
                            let col = channel.createMessageCollector({ filter, time: 60000, max: 1 })
                            col.on('collect', async (msg) => {
                                let logchannel = await this.client.utils.resolveChannel(guild, `${msg.content.trim().split(/ +/g)[0]}`)
                                if (!logchannel) return message.nmReply('Canal inválido!')
                                await this.client.guildConfig.set(`${guild.id}.logsChannel`, logchannel.id), message.nmReply(`Canal escolhido, ${logchannel}`)
                            })
                        }
                        break;
                    case 'disable':
                        await this.client.guildConfig.set(`${guild.id}.logsChannel`, null), message.nmReply('Logs de servidor desativado.')
                        break;
                    default:
                        message.nmReply({ embeds: [logsMenu.setDescription('> Use no formato `config <categoria> <função>`')] })
                        break;
                }
                break;
            case 'modlogs':
                switch (args[1]) {
                    case 'create':
                        if (typeof await this.client.guildConfig.get(`${guild.id}.modLogsChannel`) === 'string') return message.nmReply(`Já possuo um canal configurado, para criar um novo por favor desabilite antes com \`${await this.client.guildConfig.get(`${guild.id}.guildPrefix`)}config logs disable\``)
                        let modlogchannel = await guild.channels.create('moderation-logs', { type: 'text', permissionOverwrites: [{ id: guild.roles.everyone, deny: 'VIEW_CHANNEL' }] })
                        if (!modlogchannel) return message.nmReply('Algo deu errado!')
                        await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, modlogchannel.id), message.nmReply(`Canal criado, ${modlogchannel}`)
                        break;
                    case 'set':
                        if (args[2]) {
                            let modlogchannel = await this.client.utils.resolveChannel(guild, args[2])
                            if (!modlogchannel) return message.nmReply('Canal inválido!')
                            await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, modlogchannel.id), message.nmReply(`Canal escolhido, ${modlogchannel}`)
                        }
                        else {
                            let filter = (m) => m.author.id === author.id;
                            message.nmReply(`Escolha um canal:`)
                            let col = channel.createMessageCollector({ filter, time: 60000, max: 1 })
                            col.on('collect', async (msg) => {
                                let modlogchannel = await this.client.utils.resolveChannel(guild, `${msg.content.trim().split(/ +/g)[0]}`)
                                if (!modlogchannel) return message.nmReply('Canal inválido!')
                                await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, modlogchannel.id), message.nmReply(`Canal escolhido, ${modlogchannel}`)
                            })
                        }
                        break;
                    case 'disable':
                        await this.client.guildConfig.set(`${guild.id}.modLogsChannel`, null), message.nmReply('Logs de moderação desativado.')
                        break;
                    default:
                        message.nmReply({ embeds: [modlogsMenu.setDescription('> Use no formato `config <categoria> <função>`')] })
                        break;
                }
                break;
            case 'prefix':
                switch (args[1]) {
                    case 'default':
                        await this.client.guildConfig.set(`${guild.id}.guildPrefix`, this.client.defaultPrefix), message.nmReply(`Prefix resetado para \`${this.client.defaultPrefix}\``)
                        break;
                    case 'set':
                        if (args[2]) {

                            await this.client.guildConfig.set(`${guild.id}.guildPrefix`, args[2]), message.nmReply(`Novo prefix escolhido, \`${args[2]}\``)
                        }
                        else {
                            let filter = (m) => m.author.id === author.id;
                            message.nmReply(`Escolha um prefix:`)
                            let col = channel.createMessageCollector({ filter, time: 60000, max: 1 })
                            col.on('collect', async (msg) => {
                                if (!msg.content) return message.nmReply(`Envie um prefixo válido!`)
                                let newprefix = `${msg.content.trim().split(/ +/g)[0]}`
                                await this.client.guildConfig.set(`${guild.id}.guildPrefix`, newprefix), message.nmReply(`Novo prefix escolhido, \`${newprefix}\``)
                            })
                        }
                        break;
                    default:
                        message.nmReply({ embeds: [prefixMenu.setDescription('> Use no formato `config <categoria> <função>`')] })
                        break;
                }
                break;
            case 'mute':
                switch (args[1]) {
                    case 'create':
                        if (typeof await this.client.guildConfig.get(`${guild.id}.muteRole`) === 'string') return message.nmReply(`Já possuo um cargo mute configurado, para criar um novo por favor desabilite antes com \`${await this.client.guildConfig.get(`${guild.id}.guildPrefix`)}config mute disable\``)
                        let muterole = await guild.roles.create({ name: 'muted', mentionable: false, color: '#202050', reason: 'Create mute role.', permissions: ['VIEW_CHANNELS'] });
                        if (!muterole) return message.nmReply('Algo deu errado!')
                        await this.client.guildConfig.set(`${guild.id}.muteRole`, muterole.id), message.nmReply(`Cargo criado, ${muterole}.\nPor favor agora configure o cargo para posição necessária e ajuste o cargo.`);
                        break;
                    case 'get':
                        if (typeof await this.client.guildConfig.get(`${guild.id}.muteRole`) === 'string') return message.nmReply(`Já possuo um cargo mute configurado, para procurar um novo por favor desabilite antes com \`${await this.client.guildConfig.get(`${guild.id}.guildPrefix`)}config mute disable\``)
                        let muter = this.client.utils.resolveRole(`mute`, guild.roles.cache);
                        if (!muter) return message.nmReply('Não encontrado!')
                        await this.client.guildConfig.set(`${guild.id}.muteRole`, muter.id), message.nmReply(`Cargo encontrado, ${muter}`);
                        break;
                    case 'set':
                        if (args[2]) {
                            let muterole = this.client.utils.resolveRole(`${args[2]}`, guild.roles.cache, false, true)
                            if (!muterole) return message.nmReply('Cargo inválido!')
                            await this.client.guildConfig.set(`${guild.id}.muteRole`, muterole.id), message.nmReply(`Novo cargo mute escolhido, ${muterole}`)
                        }
                        else {
                            let filter = (m) => m.author.id === author.id;
                            message.nmReply(`Escolha um cargo:`)
                            let col = channel.createMessageCollector({ filter, time: 60000, max: 1 })
                            col.on('collect', async (msg) => {
                                let muterole = this.client.utils.resolveRole(`${msg.content.trim().split(/ +/g)[0]}`, guild.roles.cache, false, true)
                                if (!muterole) return message.nmReply('Cargo inválido!')
                                await this.client.guildConfig.set(`${guild.id}.muteRole`, muterole.id), message.nmReply(`Novo cargo mute escolhido, ${muterole}`)
                            })
                        }
                        break;
                    case 'disable':
                        await this.client.guildConfig.set(`${guild.id}.muteRole`, null), message.nmReply('Função mute desativado.')
                        break;
                    default:
                        message.nmReply({ embeds: [muteMenu.setDescription('> Use no formato `config <categoria> <função>`')] })
                        break;
                }
                break;
            default:
                let sent = await message.nmReply({ embeds: [menu], components: [home] })
                let collector = new MessageComponentInteractionCollector(sent, { time: 300000 })

                collector.on("collect", async (interaction) => {
                    if (interaction.user.id !== author.id) return interaction.reply({ content: 'Apenas o autor pode interagir!', ephemeral: true })
                    interaction.deferUpdate()
                    "back" === interaction.customID
                        ? sent.nmEdit({ embeds: [menu], components: [home] })
                        : "pref" === interaction.customID
                        ? sent.nmEdit({ embeds: [prefixMenu], components: [back] })
                        : "mute" === interaction.customID
                        ? sent.nmEdit({ embeds: [muteMenu], components: [back] })
                        : "logs" === interaction.customID
                        ? sent.nmEdit({ embeds: [logsMenu], components: [back] })
                        : "mlog" === interaction.customID && sent.nmEdit({ embeds: [modlogsMenu], components: [back] });
                })
                collector.on('end', async () => {
                    sent.nmEdit({ embeds: [menu.setDescription('> Use no formato `config <categoria> <função>`')], components: [] })
                })
                break;
        }
    }
}