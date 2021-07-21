const Command = require('../../structures/command.js'),
    { MessageEmbed } = require('discord.js-light');
    channelType = {
        "text": "841517547588550676",
        "private_text": "841517614765310012",
        "nsfw_text": "841517710583529503",
        "news": "841517829886705725",
        "private_news": "841517899700502545",
        "nsfw_news": "843230764543377518",
        "voice": "841517737582919710",
        "private_voice": "841517773205405770",
        "stage": "841517983595364363",
        "private_stage": "841518036548845578",
        "rules": "841517958126764052",
        "store": "861456501238530078",
        "public_thread": "841517829886705725",
        "private_thread": "841517899700502545",
        "nsfw_thread": "843230764543377518",
        "public_news_thread": "841517829886705725",
        "private_news_thread": "841517899700502545",
        "nsfw_news_thread": "843230764543377518",
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
            .setAuthor(`${ichannel.name}`, `https://cdn.discordapp.com/emojis/${channelType[this.client.utils.channelType(ichannel)]}.png`)
            .setColor('#fefefe')
            .setDescription(`${this.client.emoji.icons['calendar']} ${this.client.locale(lang, 'CREATED')} <t:${Math.round(ichannel.createdTimestamp / 1000)}:f>`)
            .addFields([
                { name: `${this.client.emoji.icons['id']} ID:`, value: `\`\`\`${ichannel.id}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['cross']} NSFW:`, value: `\`\`\`${ichannel.nsfw ? this.client.locale(lang, 'YES') : this.client.locale(lang, 'NO')}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['activity']} ${this.client.locale(lang, 'TOPIC')}`, value: `\`\`\`${ichannel.topic ? channel.topic : this.client.locale(lang, 'NONE')}\`\`\``, inline: false },
            ])
        message.nmReply({ embeds: [embed] })
    }
}