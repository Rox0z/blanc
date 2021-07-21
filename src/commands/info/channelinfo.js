const Command = require('../../structures/command.js'),
    { MessageEmbed } = require('discord.js-light'),
    channelType = {
        "text": "text",
        "private_text": "textlock",
        "nsfw_text": "textnsfw",
        "news": "news",
        "private_news": "newslock",
        "nsfw_news": "newsnsfw",
        "voice": "voice",
        "private_voice": "voicelock",
        "stage": "stage",
        "private_stage": "stagelock",
        "rules": "rules",
        "store": "store",
        "public_thread": "thread",
        "private_thread": "privatethread",
        "nsfw_thread": "threadnsfw",
        "public_news_thread": "newsthread",
        "private_news_thread": "newsprivatethread",
        "nsfw_news_thread": "newsthreadnsfw",
    }
module.exports = class ChannelInfoCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['canalinfo', 'ci', 'channel', 'canal'],
            description: {pt: 'Mostra a informação do canal.', en: 'Shows the channel information.'},
            category: 'Info',
            channel: 'text',
            title: {pt: 'Informção do Canal', en: 'Channel Info'},
            usage: {pt: 'canalinfo [canalID|#canal]', en: 'channelinfo [channelID|#channel]'},
        })
    }
    async run({message, args, guild, channel, author, prefix, lang}) {
        let ichannel
        if (args[0]) try { ichannel = await this.client.utils.resolveChannel(guild, args[0]) } catch { return message.nmReply(this.client.locale(lang, 'ERROR_UNKNOWN')) }
        if (!args[0]) ichannel = channel
        const embed = new MessageEmbed()
            .setTitle(`${this.client.emoji.icons[channelType[this.client.utils.channelType(ichannel)]]} ${ichannel.name}`)
            .setColor('#fefefe')
            .setDescription(`${this.client.emoji.icons['calendar']} ${this.client.locale(lang, 'CREATED')} <t:${Math.round(ichannel.createdTimestamp / 1000)}:f>`)
            .addFields([
                { name: `${this.client.emoji.icons['id']} ID:`, value: `\`\`\`${ichannel.id}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['cross']} NSFW:`, value: `\`\`\`${this.client.utils.channelType(ichannel).includes('nsfw') ? this.client.locale(lang, 'YES') : this.client.locale(lang, 'NO')}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['activity']} ${this.client.locale(lang, 'TOPIC')}`, value: `\`\`\`${ichannel.topic ? channel.topic : this.client.locale(lang, 'NONE')}\`\`\``, inline: false },
            ])
        message.nmReply({ embeds: [embed] })
    }
}