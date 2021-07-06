const { MessageButton } = require('discord.js')
const { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageComponentInteractionCollector } = require('discord.js-light')
const Command = require('../../structures/command.js')

module.exports = class HelpCommand extends Command {
    constructor(...args) {
        super(...args, {
            title: 'Ajuda',
            aliases: ['ajuda', 'commands', 'comandos'],
            description: 'Mostra um menu para ver a descrição de cada comando.',
            category: 'Info',
            usage: 'help [commandName]'
        })
    }
    async run({ message, args, guild, channel, author }) {

        let commands = this.client.isOwner(author) ? this.client.commands.map(cmd => cmd = { label: cmd.title, value: cmd.name, description: cmd.category, emoji: cmd.emoji }) : this.client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd = { label: cmd.name, value: cmd.name, description: cmd.category, emoji: cmd.emoji })
        const embed = new MessageEmbed()
        .setTitle('COMANDOS')
        .setThumbnail(this.client.user.displayAvatarURL({size:512}))
        .setDescription('>>> Aqui você irá encontrar todos os comandos do BOT, para vê-los basta selecionar um comando no menu abaixo e esta página automaticamente irá mudar para a página do comando.')
        .addField('Legenda:', '\`\`\`m\n<arg> = Obrigatório\n[arg] = Opcional\n<...arg> = +Obrigatórias\n[...arg] = +Opcionais\`\`\`', true)
        .addField('Quantidade:', `\`\`\`${commands.length}\`\`\``, true)
        .addField('Categorias:', `\`\`\`md\n* ${[...new Set(commands.map(cmd => cmd = cmd.description))].join('\n* ')}\`\`\``, false),
            selector = new MessageSelectMenu().setCustomID('help').setPlaceholder('Comandos').addOptions(commands),
            del = new MessageButton().setEmoji('841519603640827914').setStyle('SECONDARY').setCustomID('delete'),
            back = new MessageButton().setEmoji('841742417783029822').setStyle('PRIMARY').setCustomID('back'),
            sele = new MessageActionRow().addComponents([selector]),
            home = new MessageActionRow().addComponents([del]),
            menu = new MessageActionRow().addComponents([back]);

        let sent = await message.nmReply({ embeds: [embed], components: [sele, home] })
        let prefix = await this.client.guildConfig.get(`${guild.id}.guildPrefix`)
        const col = new MessageComponentInteractionCollector(sent, { time: 3e5 })

        col.on('collect', async (interaction) => {
            if (interaction.user.id !== author.id) return interaction.reply({ content: 'Apenas o autor pode interagir!', ephemeral: true })
            if (interaction.customID === 'help') {
            interaction.deferUpdate()
            let command = this.client.commands.filter(cmd => cmd.name === interaction.values[0]).first()
            command.aliases.push(command.name)
            sent.nmEdit({ embeds: [new MessageEmbed()
                .setTitle(`${command.title} | Comando`)
                .setDescription(`\`\`\`${command.description}\`\`\``)
                .addField('Alíases:', `\`${command.aliases.join('\` \`')}\``)
                .addField('Uso:', `\`${prefix}${command.usage}\``)
                .addField('Permissões:', `\`${command.neededPermissions.length > 0 ? command.neededPermissions.join('\` \`') : '\`Nenhuma\`'}\``)
                .setAuthor(command.category, `https://cdn.discordapp.com/emojis/${command.emoji}.png`)
            ], components: [sele, menu] })
        } else if (interaction.customID === 'back') {
            interaction.deferUpdate()
            sent.nmEdit({embeds: [embed], components: [sele, home]})
        } else if (interaction.customID === 'delete') {
            interaction.deferUpdate()
            col.stop()
        }
        })
        col.on('end', () => {
            sent.nmEdit({embeds: [embed], components: []})
        })

    }
}