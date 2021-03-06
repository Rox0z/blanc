const { MessageEmbed, InteractionCollector, MessageButton, MessageActionRow } = require('discord.js')
const Command = require('../../structures/command.js')

module.exports = class ProofCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['prova'],
            description: { pt: 'Cria uma embed de prova e envia para o canal especificado.', en: 'Creates a proof embed and sends to a specified channel.' },
            category: 'Moderation',
            channel: 'text',
            neededPermissions: ['MANAGE_MESSAGES'],
            title: { pt: 'Provas', en: 'Proofs' },
            usage: { pt: 'prova <usuárioID|@usuáio> [...motivo]', en: 'proof <userID|@user> [...reason]' },
        })
    }
    async run({ message, args, guild, channel, author, prefix, lang }) {
        if (!args[0]) return message.nmReply(this.client.locale(lang, 'ERROR_NO_USER'))
        let user = await this.client.utils.resolveUser(message, args[0], { author: false, mention: false })
        if (!user) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_USER'))
        if (user.id === message.author.id) return message.channel.send(this.client.locale(lang, 'ERROR_SELFPROOF'))
        let proofLocale = { pt: 'Prova', en: 'Proof' },
            witnessLocale = { pt: 'Testemunha', en: 'Witness' },
            reason = args.slice(1).join(' ')

        const proofEmbed = new MessageEmbed()
            .setFooter(`${author.username}#${author.discriminator}`, author.displayAvatarURL({ dynamic: true, size: 128 }))
            .setTimestamp()
            .setTitle(proofLocale[lang])
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 }))
            .addFields([
                {
                    name: this.client.locale(lang, 'MEMBER'),
                    value: `${this.client.emoji.icons['members']}: \`${user.tag}\`\n${this.client.emoji.icons['id']}: \`${user.id}\``,
                    inline: false
                },
                {
                    name: this.client.locale(lang, 'MODERATOR'),
                    value: `${this.client.emoji.icons['mod']}: \`${author.tag}\`\n${this.client.emoji.icons['id']}: \`${author.id}\``,
                    inline: false
                },
                { name: `${this.client.emoji.icons['activity']} ${this.client.locale(lang, 'REASON')}`, value: `\`\`\`${reason.length > 0 ? reason : this.client.locale(lang, 'NO_REASON')}\`\`\``, inline: false }
            ])

        if (message?.attachments?.toJSON()[0]) {
            proofEmbed.setImage(message?.attachments?.toJSON()[0].proxyURL)
            let ch = await this.client.guildConfig.get(`${guild.id}.proofsChannel`)
            if (typeof ch === 'string') {
                let logchannel = await this.client.utils.resolveChannel(guild, ch)
                if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.proofsChannel`, null).catch(() => null)
                logchannel.send({ embeds: [proofEmbed] }).catch(() => channel.send(this.client.locale(lang, 'ERROR_CANNOT_PROOF')))
            }
        } else {
            const button = new MessageButton().setEmoji('841519445226160129').setCustomId('witness').setStyle('SECONDARY'),
                row = new MessageActionRow().addComponents([button])

            let sent = await channel.send({ content: this.client.locale(lang, 'PROOF_COMMAND_IMAGE_ASK'), components: [row] })

            let filter = (m) => m.author.id === author.id;
            let imgCollector = channel.createMessageCollector({ filter, time: 60000, max: 5 })
            let buttonCollector = new InteractionCollector(this.client, {message: sent, time: 60000 })
            imgCollector.on('collect', async (msg) => {
                if (msg.attachments.size === 0) return msg.delete(), channel.send(this.client.locale(lang, 'ERROR_INVALID_PROOF'))
                if (!msg.attachments.first().contentType.startsWith('image')) return msg.delete(), channel.send(this.client.locale(lang, 'ERROR_INVALID_PROOF'))
                sent.delete()
                imgCollector.stop()
                proofEmbed.setImage(msg.attachments.first().proxyURL)
                let ch = await this.client.guildConfig.get(`${guild.id}.proofsChannel`)
                if (typeof ch === 'string') {
                    let logchannel = await this.client.utils.resolveChannel(guild, ch)
                    if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.proofsChannel`, null).catch(() => null)
                    logchannel.send({ embeds: [proofEmbed] }).catch(() => channel.send(this.client.locale(lang, 'ERROR_CANNOT_PROOF')))
                }
            })
            buttonCollector.on('collect', async (interaction) => {
                if (interaction.user.id !== author.id) return interaction.reply({ content: this.client.locale(lang, 'ERROR_AUTHOR_ONLY'), ephemeral: true })
                interaction.deferUpdate()
                "witness" === interaction.customId && sent.delete();
                imgCollector.stop()
                proofEmbed.addField(proofLocale[lang], witnessLocale[lang], false)
                let ch = await this.client.guildConfig.get(`${guild.id}.proofsChannel`)
                if (typeof ch === 'string') {
                    let logchannel = await this.client.utils.resolveChannel(guild, ch)
                    if (!logchannel) return await this.client.guildConfig.set(`${guild.id}.proofsChannel`, null).catch(() => null)
                    logchannel.send({ embeds: [proofEmbed] }).catch(() => channel.send(this.client.locale(lang, 'ERROR_CANNOT_PROOF')))
                }
            })
        }
    }
}