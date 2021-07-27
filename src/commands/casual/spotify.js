const Command = require('../../structures/command.js'),
    { MessageEmbed } = require('discord.js');

module.exports = class NameCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['spot', 'music'],
            description: { pt: 'Mostra um cover da musica tocada no Spotify do usuário.', en: 'Shows a cover image from user current Spotify music.' },
            category: 'Casual',
            channel: 'text',
            title: 'Spotify',
            usage: { pt: 'spotify [usuárioID|@usuário]', en: 'spotify [userID|@user]' },
        })
    }
    async run({ message, args, guild, channel, author, prefix, lang }) {
        const user = await this.client.utils.resolveUser(message, args[0])
        let spot = 'Not found'
        user.presence.activities.find((act) => {
            if (
                act.type == "LISTENING" &&
                act.name == "Spotify" &&
                act.assets !== null
            ) {

                spot = act;
            }
        });
        if (spot === 'Not found') {
            message.nmReply(this.client.locale(lang, 'ERROR_NOT_SPOTIFY'))
        } else {
            let image = await this.client.gen.spotifyCover(spot);
            const attachment = this.client.utils.attach(image, "spotify.png");
            const spotify = new MessageEmbed()
                .setAuthor(spot.details, "https://cdn.discordapp.com/emojis/843940256880263178.png", `https://open.spotify.com/track/${spot.syncId}`)
                .setColor("#1db954")
                .setImage("attachment://spotify.png");

            message.nmReply({ embeds: [spotify], files: [attachment] })
        }
    }
}