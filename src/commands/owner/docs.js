const Command = require('../../structures/command.js'),
    fetch = require('node-fetch'),
    { MessageButton, MessageComponentInteractionCollector, MessageActionRow, MessageEmbed } = require('discord.js-light')

module.exports = class DocsCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['doc'],
            description: 'Send a embed with the reference searched.',
            category: 'Owner',
            ownerOnly: true,
            usage: 'docs <...query>',
            title: 'Docs'
        })
    }
    async run({ message, args, guild, channel, author }) {
        const url = `https://djsdocs.sorta.moe/v2/embed?src=master&q=${encodeURIComponent(...args)}`,
            fetchedDoc = await fetch(url),
            embed = await fetchedDoc.json()

        if (!embed || embed.error) return message.nmReply(`"${args[0]}" couldn't be located within the discord.js documentation (<https://discord.js.org/>).`)

        if (embed.fields && embed.fields[2]) embed.fields[2].value = embed.fields[2].value.split(' ').length > 50 ? this.client.utils.trimArray(embed.fields[2].value.split(' '), 50).join(' ') : embed.fields[2].value
        embed.color = 1
        embed.author.icon_url = 'https://cdn.discordapp.com/icons/222078108977594368/2d5777275b5f56e42a131898ab061204.webp?size=128'
        const button = new MessageButton().setEmoji('841519603640827914').setStyle('SECONDARY').setCustomID('del')
        const row = new MessageActionRow().addComponents([button])

        let sent = await message.nmReply({ embeds: [embed], components: [row] })
        let col = new MessageComponentInteractionCollector(sent)

        col.on("collect", async (interaction) => {
            if (interaction.user.id !== author.id) return interaction.reply({ content: 'Apenas o autor pode interagir!', ephemeral: true })
            interaction.deferUpdate()
            if ("del" === interaction.customID) sent.delete()
        })
    }
}