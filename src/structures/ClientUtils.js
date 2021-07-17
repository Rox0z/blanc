const path = require('path'),
    { promisify } = require('util'),
    glob = promisify(require('glob')),
    Command = require('./command.js'),
    Event = require('./event.js'),
    { Collection, MessageAttachment, MessageEmbed, Message } = require('discord.js'),
    fetch = require('node-fetch'),
    FLAGS = {
        DISCORD_EMPLOYEE: 1 << 0,
        DISCORD_CERTIFIED_MODERATOR: 1 << 18,
        PARTNERED_SERVER_OWNER: 1 << 1,
        HYPESQUAD_EVENTS: 1 << 2,
        HOUSE_BRAVERY: 1 << 6,
        HOUSE_BRILLIANCE: 1 << 7,
        HOUSE_BALANCE: 1 << 8,
        BUGHUNTER_LEVEL_1: 1 << 3,
        BUGHUNTER_LEVEL_2: 1 << 14,
        EARLY_VERIFIED_BOT_DEVELOPER: 1 << 17,
        EARLY_SUPPORTER: 1 << 9,
        TEAM_USER: 1 << 10,
        VERIFIED_BOT: 1 << 16,
    }

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
            DISCORD_CERTIFIED_MODERATOR: "https://cdn.discordapp.com/emojis/860987940619419689",
            DISCORD_EMPLOYEE: "https://cdn.discordapp.com/emojis/860988140520996915",
            PARTNERED_SERVER_OWNER: "https://cdn.discordapp.com/emojis/860987855136620554",
            HYPESQUAD_EVENTS: "https://cdn.discordapp.com/emojis/860987814585040896",
            BUGHUNTER_LEVEL_1: "https://cdn.discordapp.com/emojis/857729908096630824",
            HOUSE_BRAVERY: "https://cdn.discordapp.com/emojis/860988066373304370",
            HOUSE_BRILLIANCE: "https://cdn.discordapp.com/emojis/860988038011682816",
            HOUSE_BALANCE: "https://cdn.discordapp.com/emojis/860988090506805268",
            EARLY_SUPPORTER: "https://cdn.discordapp.com/emojis/860989780950908988",
            TEAM_USER: "https://cdn.discordapp.com/emojis/860988140520996915",
            SYSTEM: "https://cdn.discordapp.com/attachments/734485318169919539/837411222365405255/system.png",
            BUGHUNTER_LEVEL_2: "https://cdn.discordapp.com/emojis/860987742137614366",
            VERIFIED_BOT: "https://cdn.discordapp.com/emojis/841742417702551632",
            EARLY_VERIFIED_BOT_DEVELOPER: "https://cdn.discordapp.com/emojis/841742418017386567",
            NITRO: "https://cdn.discordapp.com/emojis/860987893665366026",
            BOT: "https://cdn.discordapp.com/emojis/841742415260811304",
            BOT_OWNER: "https://cdn.discordapp.com/emojis/837538081883553793",
            PARTNERED: "https://cdn.discordapp.com/emojis/841518387481935932",
            VERIFIED: "https://cdn.discordapp.com/emojis/841518169100124180",
            dnd: "https://cdn.discordapp.com/emojis/841519655894253578",
            idle: "https://cdn.discordapp.com/emojis/841519679227166720",
            online: "https://cdn.discordapp.com/emojis/841519636562444318",
            offline: "https://cdn.discordapp.com/emojis/841519729733664768",
            mobile: "https://cdn.discordapp.com/emojis/841519757559857163",
            streaming: "https://cdn.discordapp.com/emojis/841519837276012554",
            m1: "https://cdn.discordapp.com/emojis/855648881076862996.png",
            m2: "https://cdn.discordapp.com/emojis/855649006959722516.png",
            m3: "https://cdn.discordapp.com/emojis/855649103709732925.png",
            m6: "https://cdn.discordapp.com/emojis/855649218369945600.png",
            m9: "https://cdn.discordapp.com/emojis/855649354157129728.png",
            m12: "https://cdn.discordapp.com/emojis/855649566095048704.png",
            m15: "https://cdn.discordapp.com/emojis/855649682521063425.png",
            m18: "https://cdn.discordapp.com/emojis/855649834940760074.png",
            m24: "https://cdn.discordapp.com/emojis/855649947528331274.png",
        }
    }
    get badgesEmojis() {
        return {
            DISCORD_CERTIFIED_MODERATOR: "<:certifiedmod:860987940619419689>",
            DISCORD_EMPLOYEE: "<:staff:860988140520996915>",
            PARTNERED_SERVER_OWNER: "<:partnerowner:860987855136620554>",
            HYPESQUAD_EVENTS: "<:hypersquad:860987814585040896>",
            BUGHUNTER_LEVEL_1: "<:bughunter1:857729908096630824>",
            HOUSE_BRAVERY: "<:bravery:860988066373304370>",
            HOUSE_BRILLIANCE: "<:brilliance:860988038011682816>",
            HOUSE_BALANCE: "<:balance:860988090506805268>",
            EARLY_SUPPORTER: "<:earlysupp:860989780950908988>",
            TEAM_USER: "<:staff:860988140520996915>",
            BUGHUNTER_LEVEL_2: "<:bughunter2:860987742137614366>",
            VERIFIED_BOT: "<:verifiedbot:841742417702551632>",
            EARLY_VERIFIED_BOT_DEVELOPER: "<:dev:841742418017386567>",
            NITRO: "<:nitro:860987893665366026>",
            BOT: "<:bot:841742415260811304>",
            BOT_OWNER: "<:owner:841519550348132353>",
            m1: "<:m1:855648881076862996>",
            m2: "<:m2:855649006959722516>",
            m3: "<:m3:855649103709732925>",
            m6: "<:m6:855649218369945600>",
            m9: "<:m9:855649354157129728>",
            m12: "<:m12:855649566095048704>",
            m15: "<:m15:855649682521063425>",
            m18: "<:m18:855649834940760074>",
            m24: "<:m24:855649947528331274>",
        }
    }
    async imageToBase64(urlOrImage) {
        return await fetch(urlOrImage).then((response) => { return response.buffer() }).then((buffer) => { return buffer.toString('base64') })
    }
    /** Load & reload client commands
     * @returns {Void} void
     */
    async loadCommands() {
        return glob(`${this.directory}src/commands/**/*.js`).then((commads) => {
            for (const cmdFile of commads) {
                delete require.cache[cmdFile];
                const { name } = path.parse(cmdFile),
                    File = require(cmdFile);
                if (!this.isClass(File)) throw new TypeError(`Command ${name} doesn't export a class.`);
                const command = new File(this.client, name.toLowerCase());
                if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belongs in Commands directory.`);
                if ((this.client.commands.set(command.name, command), command.aliases.length)) for (const alias of command.aliases) this.client.aliases.set(alias, command.name);
            }
        });
    }
    /** Load client events
     * @returns {Void} void
     */
    async loadEvents() {
        return glob(`${this.directory}src/events/**/*.js`).then((events) => {
            for (const eventFile of events) {
                delete require.cache[eventFile];
                const { name } = path.parse(eventFile),
                    File = require(eventFile);
                if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class.`);
                const event = new File(this.client, name);
                if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belongs in Events directory.`);
                this.client.events.set(event.id, event);
                event.emitter[event.type](event.name, (...args) => event.run(...args))
            }
        });
    }
    async getBadges(user, guild = null) {
        let badges = Object.keys(FLAGS).filter(bit => user?.flags?.has(bit))
        await this.hasNitro(user, guild) && badges.push('NITRO')
        if (guild) {
            let member = await guild?.members?.fetch(user.id).catch(e => e)

            member && badges.push(this.premiumSince(member))
        }
        return badges.filter(bad => bad !== undefined).filter(bad => bad !== 'VERIFIED_BOT')
    }
    async hasNitro(user, guild = null) {
        if (!user) { throw new Error("No user was provided") }
        else if (!user.id || !user.presence) { throw new Error("No valid user was provided") }
        let member
        if (guild) {
            member = await guild?.members?.fetch(user.id).catch(e => e)
        }

        if (user.bot) return false;

        if (user?.avatar?.startsWith("a_")) return true;
        if (user?.flags && (user?.flags?.has("DISCORD_EMPLOYEE") || user?.flags?.has("PARTNERED_SERVER_OWNER"))) return true;
        if (user?.presence?.activities.filter(activity => activity?.emoji?.id).length > 0) return true;
        if (member?.premiumSinceTimestamp > 0) return true;

        return false;
    }
    /**
     * Resolves a user from a string, such as an ID, a name, or a mention.
     * @param {Message} message - Message of the command.
     * @param {string} text - Text to resolve.
     * @param {Object} options - Resolve options
     * @param {Object} [options.author = true] - Return author?
     * @returns {User}
     */
    async resolveUser(message, text = "null", options = {}) {
        let { author = true } = options
        if (!message) throw new TypeError("Message wasn't defined");
        text || (text = "null");
        let res,
            match = text.match(/<@!?(\d{17,19})>/);
        return (
            "DiscordAPIError" ===
            (res = match ? await this.client.users.fetch(match[1]).catch(() => null) : isNaN(text) ? (message.mentions.users.size > 0 ? message.mentions.users.first() : author ? message.author : null) : await this.client.users.fetch(text).catch((e) => e)).constructor.name &&
            (author ? res = message.author : res = null),
            this.client.users.cache.sweep((e) => e.id !== this.client.user.id),
            res
        );
    }
    async resolveChannel(guild, text = "null") {
        if (!guild) throw new TypeError("Guild wasn't defined");
        text || (text = "null");
        let res,
            match = text.match(/<#(\d{17,19})>/);
        return (
            "DiscordAPIError" ===
            (res = match ? await guild.channels.fetch(match[1], false).catch(() => null) : isNaN(text) ? null : await guild.channels.fetch(text, false).catch((e) => e))?.constructor.name &&
            (res = null),
            res
        );
    }
    async resolveMember(user, guild = null) {
        let member = await guild?.members?.fetch(user.id).catch(() => null)
        guild?.members?.cache.sweep((e) => e.user.id !== this.client.user.id)
        return member.user ? member : null
    }
    async resolveMemberInfo(id, guild = null) {
        let member = await this.client.api.guilds(guild.id).members(id).get().catch(() => null)
        return member ? member : null
    }
    resolveRole(text, roles, caseSensitive = false, wholeWord = false) {
        return roles.get(text) || roles.find(role => this.checkRole(text, role, caseSensitive, wholeWord));
    }
    checkRole(text, role, caseSensitive = false, wholeWord = false) {
        if (role.id === text) return true;

        const reg = /<@&(\d{17,19})>/;
        const match = text.match(reg);

        if (match && role.id === match[1]) return true;

        text = caseSensitive ? text : text.toLowerCase();
        const name = caseSensitive ? role.name : role.name.toLowerCase();

        if (!wholeWord) {
            return name.includes(text)
                || name.includes(text.replace(/^@/, ''));
        }

        return name === text
            || name === text.replace(/^@/, '');
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
    premiumSince(member) {
        let gem
        if (member.premiumSinceTimestamp) {
            let diff = Date.now() - member.premiumSinceTimestamp
            let mod = Math.floor(diff / 2629743000)
            switch (mod) {
                case 0: gem = `m1`; break;
                case 1: case 2: case 3: gem = `m${mod}`; break;
                case 4: case 5: gem = `m3`; break;
                case 6: case 7: case 8: gem = `m6`; break;
                case 9: case 10: case 11: gem = `m9`; break;
                case 12: case 13: case 14: gem = `m12`; break;
                case 15: case 16: case 17: gem = `m15`; break;
                case 18: case 19: case 20: case 21: case 22: case 23: gem = `m18`; break;
                default: gem = `m24`;
            }
        }
        return gem
    }
    guildBadge(guild) {
        if (guild.verified) return 'VERIFIED'
        else if (guild.partnered) return 'PARTNERED'
        else if (guild.premiumSubscriptionCount === 0) return ''
        else if (guild.premiumSubscriptionCount === 1) return 'lvl0'
        else if (guild.premiumSubscriptionCount < 15) return 'lvl1'
        else if (guild.premiumSubscriptionCount < 30) return 'lvl2'
        else if (guild.premiumSubscriptionCount >= 30) return 'lvl3'
    }
    /**
     * Resolves a custom emoji from a string, such as a name or a mention.
     * @param {string} text - Text to resolve.
     * @param {Collection<Snowflake, Emoji>} emojis - Collection of emojis to find in.
     * @param {boolean} [caseSensitive=false] - Makes finding by name case sensitive.
     * @param {boolean} [wholeWord=false] - Makes finding by name match full word only.
     * @returns {Emoji}
     */
    resolveEmoji(text, emojis = this.client.emojis.cache, caseSensitive = false, wholeWord = false) {
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
    resolveGuild(text, guilds, caseSensitive = true, wholeWord = true) {
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
    attach(file, name) {
        return new MessageAttachment(file, name);
    }
    progressBar(percent, options) {
        options = options || {};
        options.size = options.size || 10;
        options.dynamic = options.dynamic || "█";
        options.static = options.static || "░";

        var bar = new Array();

        for (let n = 0; n < options.size; n++) {
            !(percent < (n + 1) * Math.round(100 / options.size))
                ? bar.push(options.dynamic)
                : bar.push(options.static);
        }
        return bar.join("");
    }
    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    trimArray(arr, maxLen = 10) {
        if (arr.length > maxLen) {
            const len = arr.length - maxLen;
            arr = arr.slice(0, maxLen);
            arr.push(`${len} more...`);
        }
        return arr;
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

        async fakeProfile(message, user, bannerURL = null, background = '#18191c') {
        "white" === user ? ((background = "white"), (user = null))
            : "white" === bannerURL && ((background = "white"), (bannerURL = null))
        user?.match(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/)
            ? (bannerURL = user)
            : user?.match(/<a?:[a-zA-Z0-9_]+:(\d{17,19})>/) && (bannerURL = `https://cdn.discordapp.com/emojis/${user?.match(/<a?:[a-zA-Z0-9_]+:(\d{17,19})>/)[1]}.png?v=1`),

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
            big = !!this.banner,
            banner = null,
            botType = isbot ? this.user.flags.toArray().includes('VERIFIED_BOT') ? 'VERIFIED_BOT' : 'BOT' : null,
            bot = null,
            res = await extractColors(avatarURL),
            badges0 = await this.getBadges(this.user, message.channel.guild),
            badges1 = [];

        custom_status && ((emojiText = custom_status?.emoji?.id
            ? `<${custom_status?.emoji?.animated ? "a" : ""}:${custom_status?.emoji?.name}:${custom_status?.emoji?.id}>`
            : custom_status?.emoji?.name || ""), (customStatus = custom_status?.state || ""))

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
        for (let n = badges0.length; n > 7; n--) {
            badges1.push(badges0.pop())
        }
        badges0.reverse()
        badges1.reverse()
        for (let i = 0; i < badges0.length; i++) {
            let badge = await resolveImage(this.icons[badges0[i]])
            canvas.printImage(badge, canvas.width - 64 - (50 * i), height === 512 ? 128 + 30 : 256 + 30, 36, 36)
        }
        for (let i = 0; i < badges1.length; i++) {
            let badge = await resolveImage(this.icons[badges1[i]])
            canvas.printImage(badge, canvas.width - 64 - (50 * i), height === 512 ? 128 + 76 : 256 + 76, 36, 36)
        }
        return canvas.toBuffer()
    }
    */