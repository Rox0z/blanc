const { MessageEmbed, MessageSelectMenu, MessageActionRow, InteractionCollector, MessageButton } = require('discord.js')
const Command = require('../../structures/command.js')

module.exports = class HelpCommand extends Command {
    constructor(...args) {
        super(...args, {
            title: { pt: "Ajuda", en: "Help" },
            aliases: ['ajuda', 'commands', 'comandos'],
            description: { pt: "Mostra um menu para ver a descrição de cada comando.", en: "Shows a menu to see all commands description." },
            category: 'Info',
            usage: { pt: "ajuda [nomeDoComando]", en: "help [commandName]" }
        })
    }
    async run({ message, prefix, author, lang }) {

        let commands = this.client.isOwner(author) ? this.client.commands.map(cmd => cmd = { label: cmd.title[lang] ? cmd.title[lang] : cmd.title['pt'] || cmd.title, value: cmd.name, description: cmd.category, emoji: cmd.emoji }) : this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd = { label: cmd.title[lang] ? cmd.title[lang] : cmd.title['pt'] || cmd.title, value: cmd.name, description: cmd.category, emoji: cmd.emoji })
        const strings = this.client.locale(lang, "HELP_COMMAND")
        let chunks = commands.chunk(23)
        if (commands.length > 25) {
            chunks.forEach(list => list.push(...[{
                label: strings.NEXT_PAGE,
                value: 'next',
                description: 'Menu',
                emoji: '866759922896470076'
            }, {
                label: strings.PREVIOUS_PAGE,
                value: 'previous',
                description: 'Menu',
                emoji: '866759884417662976'
            },]))
        } else {
            chunks = [commands]
        }
        let page = 0,
        currentEmbed,
        currentButton;
        
        const embed = new MessageEmbed()
            .setTitle(strings.EMBED_TITLE.toUpperCase())
            .setThumbnail(this.client.user.displayAvatarURL({ size: 512 }))
            .setDescription(strings.EMBED_DESCRIPTION)
            .addField(strings.EMBED_FIELD_LABELS, strings.EMBED_LABELS, true)
            .addField(strings.EMBED_FIELD_QUANTITY, `\`\`\`${commands.length}\`\`\``, true)
            .addField(strings.EMBED_FIELD_CATEGORIES, `\`\`\`md\n* ${[...new Set(commands.map(cmd => cmd = cmd.description))].join('\n* ')}\`\`\``, false),
            selector = new MessageSelectMenu().setCustomId('help').setPlaceholder(strings.EMBED_TITLE).addOptions(chunks[page]),
            del = new MessageButton().setEmoji('841519603640827914').setStyle('SECONDARY').setCustomId('delete'),
            back = new MessageButton().setEmoji('841742417783029822').setStyle('PRIMARY').setCustomId('back'),
            sele = new MessageActionRow().addComponents([selector]),
            home = new MessageActionRow().addComponents([del]),
            menu = new MessageActionRow().addComponents([back]);

        let sent = await message.nmReply({ embeds: [embed], components: [sele, home] })
        const col = new InteractionCollector(this.client, {message: sent,  time: 3e5 })

        col.on('collect', async (interaction) => {
            if (interaction.user.id !== author.id) return interaction.reply({ content: this.client.locale(lang, 'ERROR_AUTHOR_ONLY'), ephemeral: true })
            if (interaction.customId === 'help') {
                interaction.deferUpdate()
                if (interaction.values[0] === 'next' || interaction.values[0] === 'previous') {
                    currentEmbed = sent.embeds[0]
                    currentButton = sent.embeds[0].title === embed.title ? home : menu
                    if (interaction.values[0] === 'next') {
                        ++page
                        sent.nmEdit({ embeds: [currentEmbed], components: [new MessageActionRow().addComponents([new MessageSelectMenu().setCustomId('help').setPlaceholder(strings.EMBED_TITLE).addOptions(chunks[(chunks.length + (page % chunks.length)) % chunks.length])]), currentButton] })
                    } else if (interaction.values[0] === 'previous') {
                        --page
                        sent.nmEdit({ embeds: [currentEmbed], components: [new MessageActionRow().addComponents([new MessageSelectMenu().setCustomId('help').setPlaceholder(strings.EMBED_TITLE).addOptions(chunks[(chunks.length + (page % chunks.length)) % chunks.length])]), currentButton] })
                    }

                } else {
                    let command = this.client.commands.filter(cmd => cmd.name === interaction.values[0]).first()
                    command.aliases.includes(command.name) ? null : command.aliases.push(command.name)
                    sent.nmEdit({
                        embeds: [new MessageEmbed()
                            .setTitle(`${command.title[lang] ? command.title[lang] : command.title['pt'] || command.title} | ${strings.EMBED_SUBTITLE}`)
                            .setDescription(`\`\`\`${command.description[lang] ? command.description[lang] : command.description['pt'] || command.description}\`\`\``)
                            .addField(strings.EMBED_FIELD_ALIASES, `\`${command.aliases.join('\` \`')}\``)
                            .addField(strings.EMBED_FIELD_USAGE, `\`${prefix}${command.usage[lang] ? command.usage[lang] : command.usage['pt'] || command.usage}\``)
                            .addField(strings.EMBED_FIELD_PERMISSIONS, `\`${command.neededPermissions.length > 0 ? command.neededPermissions.join('\` \`') : `${this.client.locale(lang, "NONE")}`}\``)
                            .setAuthor(command.category, `https://cdn.discordapp.com/emojis/${command.emoji}.png`)
                        ], components: [new MessageActionRow().addComponents([new MessageSelectMenu().setCustomId('help').setPlaceholder(strings.EMBED_TITLE).addOptions(chunks[(chunks.length + (page % chunks.length)) % chunks.length])]), menu]
                    })
                }
            } else if (interaction.customId === 'back') {
                interaction.deferUpdate()
                sent.nmEdit({ embeds: [embed], components: [sele, home] })
            } else if (interaction.customId === 'delete') {
                interaction.deferUpdate()
                col.stop()
            }
        })
        col.on('end', () => {
            sent.nmEdit({ embeds: [embed], components: [] })
        })

    }
}