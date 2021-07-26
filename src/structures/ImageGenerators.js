const RegExpURL = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@: %_\+.~#?&\/\/=]*)/,
    RegExpEmoji = /<a?:[a-zA-Z0-9_]+:(\d {17, 19})>/,
    { resolveImage } = require("canvas-constructor"),
    ExtendedCanvas = require("../extend/ExtendedCanvasC"),
    { registerFont } = require('canvas'),
    { extractColors } = require("extract-colors"),
    moment = require("moment"),
    sharp = require("sharp");

registerFont("src/assets/fonts/Whitney_Regular.ttf", { family: "Whitney Regular" })
registerFont("src/assets/fonts/Whitney_Bold.ttf", { family: "Whitney Bold" })
registerFont("src/assets/fonts/Arial_Unicode.ttf", { family: "Arial Unicode" })
registerFont('src/assets/fonts/CircularSpotifyTxT-Black.ttf', { family: 'Circular Spotify' })
registerFont('src/assets/fonts/CircularSpotifyTxT-Light.ttf', { family: 'Circular Spotify L' })

let fitTextOnCanvas = (ccanvas, text, fontface, width, yPosition) => {
    const Canvas = require("canvas");
    const canvas = Canvas.createCanvas(512, 512);
    const ctx = canvas.getContext("2d");
    // start with a large font size
    var fontsize = 35;

    // lower the font size until the text fits the canvas
    do {
        fontsize--;
        ctx.font = "700 " + fontsize + "px " + fontface;
    } while (ctx.measureText(text).width > width);

    // draw the text
    ccanvas
        .setTextBaseline('middle')
        .setTextAlign('center')
        .setColor('white')
        .setTextFont("700 " + fontsize + "px " + fontface)
        .printText(
            text,
            width / 2,
            yPosition
        );
}
module.exports = class ImgGenerator {
    constructor(client) {
        this.client = client
    }
    async fakeProfile(message, user, bannerURL = null, background = '#18191c') {
        "white" === user ? ((background = "white"), (user = null)) : "white" === bannerURL && ((background = "white"), (bannerURL = null))
        user?.match(RegExpURL) ? (bannerURL = user)
            : user?.match(RegExpEmoji) && (bannerURL = `https: //cdn.discordapp.com/emojis/${user?.match(RegExpEmoji)[1]}.png?v=1`);
        this.user = await this.client.utils.resolveUser(message, user)
        let userinfo = await this.client.api.users(this.user.id).get()
        this.banner = userinfo.banner ? `https://cdn.discordapp.com/banners/${this.user.id}/${userinfo.banner}.png?size=512` : this.client.utils.getImage(message, bannerURL)
        let avatarURL = this.user.displayAvatarURL({ size: 512, dynamic: !0, format: 'png' }),
            name = this.user.username,
            discrim = this.user.discriminator,
            statusType = this.client.utils.getStatus(this.user),
            isbot = this.user.bot,
            custom_status = this.user.presence.activities.filter(act => act.type === 'CUSTOM_STATUS')[0],
            emojiText = '',
            customStatus = '',
            width = 640,
            height = 512,
            big = !!this.banner,
            banner = null,
            botType = isbot ? this.user.flags.toArray().includes('VERIFIED_BOT') ? 'VERIFIED_BOT' : 'BOT' : null,
            bot = null,
            res = await extractColors(avatarURL),
            badges0 = await this.client.utils.getBadges(this.user, message.channel.guild),
            badges1 = [];

        custom_status && ((emojiText = custom_status?.emoji?.id
            ? `<${custom_status?.emoji?.animated ? "a" : ""}:${custom_status?.emoji?.name}:${custom_status?.emoji?.id}>`
            : custom_status?.emoji?.name || ""), (customStatus = custom_status?.state || ""))
        let avatar = await resolveImage(avatarURL),
            status = await resolveImage(this.client.utils.icons[statusType])
        if (big) {
            height += 128;
            banner = await resolveImage(this.banner)
        }
        const canvas = new ExtendedCanvas(width, height)
            .createRoundedClip(0, 0, width, height, 10);
        if (banner) {
            canvas
                .setColor(res.sort((a, b) => b.area - a.area)[0].hex)
                .printRectangle(0, 0, width, height === 512 ? 128 : 256)
                .printImage(banner, 0, (128 - (width / (banner.width / banner.height)) / 2), width, width / (banner.width / banner.height))
        }
        else {
            canvas
                .setColor(res.sort((a, b) => b.area - a.area)[0].hex)
                .printRectangle(0, 0, width, height === 512 ? 128 : 256)
        };
        await canvas
            .setColor(background)
            .printRectangle(0, height === 512 ? 128 : 256, width, 384)
            .printCircle(135, height === 512 ? 128 : 256, 100)
            .printCircularImage(avatar, 135, height === 512 ? 128 : 256, 86)
            .printCircle(188.5, height === 512 ? 191.5 : 319.5, 27.5)
            .printImage(status, 171, height === 512 ? 174 : 302, 35, 35)
            .setColor('white')
            .setTextFont('43px Whitney Bold, Arial Unicode')
            .setTextBaseline('top').setColor(background === 'white' ? '#060607' : '#fff')
            .printEmojiText(name, 35, height === 512 ? 256 : 384);
        await canvas
            .setColor(background === 'white' ? '#4f5660' : '#b9bbbe')
            .printText('#' + discrim, canvas.measureText(name).width + 35, height === 512 ? 256 : 384)
            .setTextFont(`${customStatus?.length > 0 ? 38 : 80}px Arial Unicode`).printEmojiText(emojiText, 35, height === 512 ? 256 + 64 : 384 + 64);
        await canvas.setColor(background === 'white' ? '#2e3338' : '#fff')
            .setTextFont('30px Whitney Regular, Arial Unicode')
            .printEmojiText(`${emojiText?.length > 0 ? ' ' : ''}`.repeat(7) + customStatus, 35, height === 512 ? 256 + 64 + 8 : 384 + 64 + 8, 640 - 90);
        if (botType) {
            bot = await resolveImage(this.client.utils.icons[botType])
            canvas.printImage(bot,
                canvas.setTextFont('43px Whitney Bold, Arial Unicode').measureText(name).width + canvas.measureText('#' + discrim).width + (botType === 'VERIFIED_BOT' ? 50 : 35),
                (height === 512 ? 256 : 384) - 10, 80, 80)
        }
        for (let n = badges0.length; n > 7; n--) { badges1.push(badges0.pop()) }

        badges0.reverse()
        badges1.reverse()

        for (let i = 0; i < badges0.length; i++) {
            let badge = await resolveImage(this.client.utils.icons[badges0[i]])
            canvas.printImage(badge, canvas.width - 64 - (50 * i), height === 512 ? 128 + 30 : 256 + 30, 42, 42)
        }

        for (let i = 0; i < badges1.length; i++) {
            let badge = await resolveImage(this.client.utils.icons[badges1[i]])
            canvas.printImage(badge, canvas.width - 64 - (50 * i), height === 512 ? 128 + 76 : 256 + 76, 42, 42)
        }
        return canvas.toBuffer()
    }
    async spotifyCover(spot) {
        let progress = Math.round(
            (Math.abs(new Date() - new Date(spot.timestamps.start)) /
                Math.abs(new Date(spot.timestamps.end) - new Date(spot.timestamps.start))) *
            100
        );
        let cover = await resolveImage(`https://i.scdn.co/image/${spot.assets.largeImage.slice(8)}`);
        let bg = new ExtendedCanvas(512, 512)
            .printImage(cover, 0, 0, 512, 512)
            .toBuffer()

        bg = await sharp(bg)
            .blur(10)
            .linear(.6,0)
            .png()
            .toBuffer()

        bg = await resolveImage(bg)
        
        let canvas = new ExtendedCanvas(512, 512)
            .printImage(bg, 0, 0, 512, 512)
            .setStroke('#fff7')
            .setStrokeWidth(7.5)
            .printStrokeRectangle(112, 57.6, 288, 288)
            .printImage(cover, 112, 57.6, 288, 288)
            .setTextBaseline('middle')
            .setTextAlign('center')
            .setColor('white')
            .setTextFont('20px Circular Spotify L')
            .printText(spot.state.split('; ').join(', '), 256, 413)
            .setTextAlign('end')
            .printText(moment(Math.abs(new Date() - new Date(spot.timestamps.start))).format("mm:ss"), 86, 452)
            .setTextAlign('start')
            .printText(moment(Math.abs(new Date(spot.timestamps.end) - new Date(spot.timestamps.start))).format("mm:ss"), 423, 452)
            .setColor('#fff8')
            .printRectangle(96, 452, 320, 3)
            .setColor('#1db954')
            .printRectangle(96, 452, 320 / (100 / progress), 3);
        fitTextOnCanvas(canvas, spot.details, 'Circular Spotify', 512, 376)
        return canvas.toBuffer()
    };

}