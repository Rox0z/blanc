const path = require('path'),
    { promisify } = require('util'),
    glob = promisify(require('glob')),
    Command = require('./command.js'),
    { Collection, MessageAttachment, MessageEmbed, Message } = require('discord.js'),
    { resolveImage } = require("canvas-constructor"),
    ExtendedCanvas = require("../extend/ExtendedCanvasC"),
    { extractColors } = require("extract-colors")

const fetch = require('node-fetch')
const { registerFont } = require('canvas')

registerFont("src/assets/fonts/Whitney Regular.ttf", { family: "Whitney Regular" })
registerFont("src/assets/fonts/Whitney Bold.ttf", { family: "Whitney Bold" })

module.exports = class Util {
    constructor(client) {
        this.client = client
    }

    isClass(input) {
        return typeof input === 'function' &&
            typeof input.prototype === 'object' &&
            input.toString().substring(0, 5) === 'class'
    }
    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`
    }
    get icons() {
        return {
            VERIFIED_MODERATOR: "https://cdn.discordapp.com/emojis/845058090402709514",
            DISCORD_EMPLOYEE: "https://cdn.discordapp.com/emojis/841742418189615135",
            DISCORD_PARTNER: "https://cdn.discordapp.com/emojis/841742418265374751",
            HYPESQUAD_EVENTS: "https://cdn.discordapp.com/emojis/841742418440355860",
            BUGHUNTER_LEVEL_1: "https://cdn.discordapp.com/emojis/841742417782374441",
            HOUSE_BRAVERY: "https://cdn.discordapp.com/emojis/841742415446147072",
            HOUSE_BRILLIANCE: "https://cdn.discordapp.com/emojis/841742418159599616",
            HOUSE_BALANCE: "https://cdn.discordapp.com/emojis/841742414770077696",
            EARLY_SUPPORTER: "https://cdn.discordapp.com/emojis/841742418164318218",
            TEAM_USER: "https://cdn.discordapp.com/emojis/841742418265374751",
            SYSTEM: "https://cdn.discordapp.com/attachments/734485318169919539/837411222365405255/system.png",
            BUGHUNTER_LEVEL_2: "https://cdn.discordapp.com/emojis/841742418315444254",
            VERIFIED_BOT: "https://cdn.discordapp.com/emojis/841742417702551632",
            EARLY_VERIFIED_DEVELOPER: "https://cdn.discordapp.com/emojis/841742418017386567",
            NITRO: "https://cdn.discordapp.com/emojis/841742418256986172",
            BOT: "https://cdn.discordapp.com/emojis/841742415260811304",
            BOT_OWNER: "https://cdn.discordapp.com/emojis/837538081883553793",
            PARTNERED: "https://cdn.discordapp.com/emojis/841518387481935932",
            VERIFIED: "https://cdn.discordapp.com/emojis/841518169100124180",
            dnd: "https://cdn.discordapp.com/emojis/841519655894253578",
            idle: "https://cdn.discordapp.com/emojis/841519679227166720",
            online: "https://cdn.discordapp.com/emojis/841519636562444318",
            offline: "https://cdn.discordapp.com/emojis/841519729733664768",
            mobile: "https://cdn.discordapp.com/emojis/841519757559857163",
            streaming: "https://cdn.discordapp.com/emojis/841519837276012554"
        }
    }
    async loadCommands() {
        return glob(`${this.directory}src/commands/**/*.js`).then((commads) => {
            for (const cmdFile of commads) {
                delete require.cache[cmdFile];
                const { name } = path.parse(cmdFile),
                    File = require(cmdFile);
                if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
                const command = new File(this.client, name.toLowerCase());
                if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belongs in Commands.`);
                if ((this.client.commands.set(command.name, command), command.aliases.length)) for (const alias of command.aliases) this.client.aliases.set(alias, command.name);
            }
        });
    }
    /**
     * Resolves a user from a string, such as an ID, a name, or a mention.
     * @param {Message} message - Message of the command.
     * @param {string} text - Text to resolve.
     * @returns {User}
     */
    async resolveUser(message, text = "null") {
        if (!message) throw new TypeError("Message wasn't defined");
        text || (text = "null");
        let res,
            match = text.match(/<@!?(\d{17,19})>/);
        return (
            "DiscordAPIError" ===
            (res = match ? await this.client.users.fetch(match[1]).catch((e) => e) : isNaN(text) ? (message.mentions.users.size > 0 ? message.mentions.users.first() : message.author) : await this.client.users.fetch(text).catch((e) => e)).constructor.name &&
            (res = message.author),
            this.client.users.cache.sweep((e) => e.id !== this.client.user.id),
            res
        );
    }
    /**
     * //Message: Message => get image from attach
     * //Text: String => get image from emoji or URL
     * TODO Gen: Boolean => generate image from text
     * TODO Last: Boolean => get the last image from the last 10 messages in the channel
     * TODO Reply: Message => get the image from the replied message
     *
     * Search the context for a image
     * @param {Message} message 
     * @param {String} text 
     */
    getImage(message, text = "null") {
        if (!message) throw new TypeError("Message wasn't defined");
        text ? null == text && (text = "null") : (text = "null");
        let res,
            isEmoji = text.match(/<a?:[a-zA-Z0-9_]+:(\d{17,19})>/),
            isURL = text.match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/),
            isAttch = message?.attachments.size > 0;
        return isURL ? (res = text) : isAttch ? (res = message.attachments.first().url) : isEmoji && (res = `https://cdn.discordapp.com/emojis/${isEmoji[1]}.png?v=1`), res;
    }
    getStatus(user) {
        return user.presence.activities.map((acv) => "STREAMING" === acv.type).includes(!0)
            ? "streaming"
            : user.presence.clientStatus
            ? user.presence.clientStatus.mobile && "online" == user.presence.clientStatus.mobile
                ? "online" //mobile
                : user.presence.status
            : user.presence.status
            ? user.presence.status
            : "offline";
    };
    /**
     * Resolves a custom emoji from a string, such as a name or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, Emoji>} emojis - Collection of emojis to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Emoji}
     */
    resolveEmoji(text, emojis, caseSensitive = false, wholeWord = false) {
        return emojis.get(text) || emojis.find(emoji => this.checkEmoji(text, emoji, caseSensitive, wholeWord));
    }
    /**
     * Checks if a string could be referring to a emoji.
     * @param {string} text - Text to check.
     * @param {Emoji} emoji - Emoji to check.
     * @param {boolean} [caseSensitive=false] - Makes checking by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes checking by name match full word only.
     * @returns {boolean}
     */
    checkEmoji(text, emoji, caseSensitive = false, wholeWord = false) {
        if (emoji.id === text) return true;

        const reg = /<a?:[a-zA-Z0-9_]+:(\d{17,19})>/;
        const match = text.match(reg);

        if (match && emoji.id === match[1]) return true;

        text = caseSensitive ? text : text.toLowerCase();
        const name = caseSensitive ? emoji.name : emoji.name.toLowerCase();

        if (!wholeWord) {
            return name.includes(text)
                || name.includes(text.replace(/:/, ''));
        }

        return name === text
            || name === text.replace(/:/, '');
    }
    /**
         * Resolves a guild from a string, such as an ID or a name.
         * @param {string} text - Text to resolve.
         * @param {Collection<Snowflake, Guild>} guilds - Collection of guilds to find in.
         * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
         * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
         * @returns {Guild}
         */
    resolveGuild(text, guilds, caseSensitive = false, wholeWord = false) {
        return guilds.get(text) || guilds.find(guild => this.checkGuild(text, guild, caseSensitive, wholeWord));
    }
    /**
     * Checks if a string could be referring to a guild.
     * @param {string} text - Text to check.
     * @param {Guild} guild - Guild to check.
     * @param {boolean} [caseSensitive=false] - Makes checking by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes checking by name match full word only.
     * @returns {boolean}
     */
    checkGuild(text, guild, caseSensitive = false, wholeWord = false) {
        if (guild.id === text) return true;

        text = caseSensitive ? text : text.toLowerCase();
        const name = caseSensitive ? guild.name : guild.name.toLowerCase();

        if (!wholeWord) return name.includes(text);
        return name === text;
    }
    /**
     * Makes a MessageEmbed.
     * @param {Object} [data] - Embed data.
     * @returns {MessageEmbed}
     */
    embed(data) {
        return new MessageEmbed(data);
    }
    /**
     * Makes a MessageAttachment.
     * @param {BufferResolvable|Stream} file - The file.
     * @param {string} [name] - The filename.
     * @returns {MessageAttachment}
     */
    attachment(file, name) {
        return new MessageAttachment(file, name);
    }
    async imageToBase64(urlOrImage) {
        return await fetch(urlOrImage).then((response) => { return response.buffer() }).then((buffer) => { return buffer.toString('base64') })
    }
    async fakeProfile(message, user, bannerURL = null, background = '#18191c') {

        if (user === 'white') { background = 'white', user = null }
        else if (bannerURL === 'white') { background = 'white', bannerURL = null }
        user?.match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/) ? bannerURL = user : user?.match(/<a?:[a-zA-Z0-9_]+:(\d{17,19})>/) ? bannerURL = `https://cdn.discordapp.com/emojis/${user?.match(/<a?:[a-zA-Z0-9_]+:(\d{17,19})>/)[1]}.png?v=1` : null
        this.user = await this.resolveUser(message, user)
        this.banner = this.getImage(message, bannerURL)

        let avatarURL = this.user.displayAvatarURL({ size: 512, dynamic: true, format: 'png' }),
            name = this.user.username,
            discrim = this.user.discriminator,
            statusType = this.getStatus(this.user),
            isbot = this.user.bot,
            custom_status = this.user.presence.activities.filter(act => act.type === 'CUSTOM_STATUS')[0],
            emojiText = '',
            customStatus = '',
            width = 640,
            height = 512,
            big = !!this.banner
        banner = null,
            botType = isbot ? this.user.flags.toArray().includes('VERIFIED_BOT') ? 'VERIFIED_BOT' : 'BOT' : null,
            bot = null,
            res = await extractColors(avatarURL)

        if (custom_status) {
            emojiText = custom_status?.emoji?.id ? `<${custom_status?.emoji?.animated ? 'a' : ''}:${custom_status?.emoji?.name}:${custom_status?.emoji?.id}>` : custom_status?.emoji?.name || ''
            customStatus = custom_status?.state || ''
        }

        let avatar = await resolveImage(avatarURL),
            status = await resolveImage(this.icons[statusType])

        if (big) { height += 128; banner = await resolveImage(this.banner) }

        const canvas = new ExtendedCanvas(width, height).createRoundedClip(0, 0, width, height, 10);

        if (banner) { canvas.setColor(res.sort((a, b) => b.area - a.area)[0].hex).printRectangle(0, 0, width, height === 512 ? 128 : 256).printImage(banner, 0, (128 - (width / (banner.width / banner.height)) / 2), width, width / (banner.width / banner.height)) }
        else { canvas.setColor(res.sort((a, b) => b.area - a.area)[0].hex).printRectangle(0, 0, width, height === 512 ? 128 : 256) };

        await canvas
            .setColor(background)
            .printRectangle(0, height === 512 ? 128 : 256, width, 384)
            .printCircle(135, height === 512 ? 128 : 256, 100)
            .printCircularImage(avatar, 135, height === 512 ? 128 : 256, 86)
            .printCircle(188.5, height === 512 ? 191.5 : 319.5, 27.5)
            .printImage(status, 171, height === 512 ? 174 : 302, 35, 35)
            .setColor('white')
            .setTextFont('43px Whitney Bold, arial unicode ms')
            .setTextBaseline('top')
            .setColor(background === 'white' ? '#060607' : '#fff')
            .printEmojiText(name, 35, height === 512 ? 256 : 384);
        await canvas
            .setColor(background === 'white' ? '#4f5660' : '#b9bbbe')
            .printText('#' + discrim, canvas.measureText(name).width + 35, height === 512 ? 256 : 384)
            .setTextFont(`${customStatus?.length > 0 ? 38 : 80}px arial unicode ms`)
            .printEmojiText(emojiText, 35, height === 512 ? 256 + 64 : 384 + 64);
        await canvas
            .setColor(background === 'white' ? '#2e3338' : '#fff')
            .setTextFont('30px Whitney Regular, arial unicode ms')
            .printEmojiText(`${emojiText?.length > 0 ? ' ' : ''}`.repeat(7) + customStatus, 35, height === 512 ? 256 + 64 + 8 : 384 + 64 + 8, 640 - 90);
        if (botType) {
            bot = await resolveImage(this.icons[botType])
            canvas.printImage(bot, canvas.setTextFont('43px Whitney Bold, arial unicode ms').measureText(name).width + canvas.measureText('#' + discrim).width + (botType === 'VERIFIED_BOT' ? 50 : 35), (height === 512 ? 256 : 384) - 10, 80, 80);
        }
        return canvas.toBuffer()
    }
}
/*
async resolveUser(message, text = 'null') {
        if (!message) throw new TypeError('Message wasn\'t defined')
        if (!text) text = 'null'
        let result,
            regExp = /<@!?(\d{17,19})>/,
            match = text.match(regExp);

        if (match) { result = await this.client.users.fetch(match[1]).catch(err => err) }
        else if (!isNaN(text)) { result = await this.client.users.fetch(text).catch(err => err) }
        else if (message.mentions.users.size > 0) { result = message.mentions.users.first() }
        else { result = message.author }
        if (result.constructor.name === 'DiscordAPIError') { result = message.author }
        this.client.users.cache.sweep(user => user.id !== this.client.user.id)
        return result
    }
    */