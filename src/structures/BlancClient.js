
const { Client: Client, Collection: Collection, User, Guild, Channel, Role } = require("discord.js"),
    Util = require("./ClientUtils"),
    Tasks = require("./agendaTasks"),
    ImgGenerator = require("./ImageGenerators"),
    Embedder = require("./Embedder"),
    Logger = require("./Logger"),
    Agenda = require("agenda"),
    { Database } = require("quickmongo");


/**
* The Blanc framework client.
* Creates the handlers and sets them up.
* @param {BlancOptions} [options={}] - Options for the client.
* @param {ClientOptions} [clientOptions] - Options for Discord JS Light client.
* If not specified, the previous options parameter is used instead.
*/
class BlancClient extends Client {
    constructor(options = {}, clientOptions) {
        super(clientOptions || options);
        this.validate(options);
        this.commands = new Collection();
        this.events = new Collection();
        this.aliases = new Collection();
        this.prefixes = new Collection();
        this.locales = new Collection();
        this.utils = new Util(this);
        this.logger = new Logger(this);
        this.embedder = new Embedder(this);
        this.gen = new ImgGenerator(this);
        this.agenda = new Agenda({ db: { address: process.env.MONGOURI, options: { useUnifiedTopology: true } } })
        this.guildConfig = new Database(process.env.MONGOURI, 'Guild_Config')
        //this.lang = require('./lang')

        new Tasks(this, this.agenda)

        const { ownerID = "" } = options,
            { defaultPrefix = "!" } = options,
            { token = "" } = options;

        /**
        * The ID of the owner(s).
        * @type {Snowflake|Snowflake[]}
        */
        this.ownerID = ownerID;
        this.defaultPrefix = defaultPrefix;
        this.token = token;
    }
    /**
    * Checks if a user is the owner of this bot.
    * @param {UserResolvable} user - User to check.
    * @returns {boolean}
    */
    isOwner(user) {
        const id = this.users.resolveId(user);
        return Array.isArray(this.ownerID) ? this.ownerID.includes(id) : id === this.ownerID;
    }
    canUse(neededPerms, userPerms) {
        return !neededPerms.map(perm => userPerms.includes(perm)).filter(e => e == 0).length > 0
    }
    /**
    * Initialize the Client
    */
    async init() {
        this.utils.loadCommands(), this.utils.loadEvents(), this.login(this.token), await this.agenda.start();
    }
    validate(options) {
        if ("object" !== typeof options) throw new TypeError("Options must be a type of Object.");
        if ("string" !== typeof options.defaultPrefix) throw new TypeError("Prefix must be a type of String.");
        if (!options.token) throw new Error("You must provide a token for the Client.");
        options.ownerID || console.log("Alert! You didn't provide a owner ID, some options may not function as supposed.");
        options.defaultPrefix || console.log('Alert! You didn\'t provide a default prefix, so the prefix will be "!".');
    }
    get emoji() {
        return {
            channels: {
                text: "<:text:841517547588550676>",
                textlock: "<:textlock:841517614765310012>",
                textnsfw: "<:textnsfw:841517710583529503>",
                voice: "<:voice:841517737582919710>",
                voicelock: "<:voicelock:841517773205405770>",
                stage: "<:stage:841517983595364363>",
                stagelock: '<:stagelock:841518036548845578>',
                rules: '<:rules:841517958126764052>',
                news: '<:news:841517829886705725>',
                newslock: '<:newslock:841517899700502545>',
                newsnsfw: '<:newsnsfw:843230764543377518>',
                lock: '<:lock:841518092261261312>',
                dm: '<:DM:841742418138759228>',
                store: '<:store:861456501238530078>',
                thread: '<:thread:860982806955687946>',
                privatethread: '<:privatethread:860983134102093834>',
                threadnsfw: '<:threadnsfw:860982935385014293>',
                newsthread: '<:newsthread:860982877859348480>',
                newsprivatethread: '<:newsprivatethread:860983287139794964>',
                newsthreadnsfw: '<:newsthreadnsfw:860983038376673290>',
                startn: '<:startn:861260508475818024>',
                midn: '<:midn:861260398577844224>',
                mid: '<:mid:861260485588680764>',
                end: '<:end:861260527137325077>',
                start: '<:start:861260448020037632>',
                midend: '<:midend:861468813802340363>',
                startend: '<:startend:861468814181269525>',
            },
            guildBadges: {
                VERIFIED: "<:verifiedg:841518169100124180>",
                PARTNERED: "<:newpartnerb:841518387481935932>",
                lvl0: "<:lvl0:861000947953958943>",
                lvl1: "<:lvl1:861001000026636288>",
                lvl2: "<:lvl2:861001047648370698>",
                lvl3: "<:lvl3:861001066106322975>",
                "": ""
            },
            icons: {
                plus: "<:plus:841517251684728872>",
                discovery: "<:discovery:841517378495709215>",
                members: "<:members:841519105554644992>",
                info: "<:info:841518890340843551>",
                help: "<:help:841518756676632616>",
                id: "<:id:841519241643032576>",
                webhook: "<:webhook:841532353075478528>",
                stats: "<:stats:841532352286556190>",
                role: "<:role:841519139184705556>",
                mod: "<:mod:841519512678432778>",
                gift: "<:gift:841518542519795725>",
                bell: "<:bell:841518591723700244>",
                cog: "<:cog:841518870958964736>",
                addreaction: "<:addreaction:841519379631570955>",
                adduser: "<:adduser:841519445226160129>",
                gif: "<:gif:841519400598503444>",
                mail: "<:mail:841518723822256128>",
                link: "<:link:841519222303752203>",
                pin: "<:pin:841518627295461376>",
                slash: "<:slash:841519978397040640>",
                tv: "<:tv:841742417514332213>",
                globe: "<:globe:861011464860860427>",
                integration: "<:integration:861002080445267979>",
                science: "<:science:841742418067718146>",
                reply: "<:reply:841742417783029822>",
                calendar: "<:calendar:861254918413352980>",
                music: "<:music:841742417580785704>",
                gaming: "<:gaming:841742417413537863>",
                education: "<:education:841742418067718145>",
                dots: "<:dots:841742417173807134>",
                activity: "<:activity:841742410337091594>",
                graycheck: "<:graycheck:841742416557506560>",
                greencheck: "<:greencheck:841742417303961622>",
                cross: "<:cross:843163689179283499>",
                magglass: "<:magglass:843163906960130048>",
                inventory: "<:inventory:856986679595368498>",
                folder: "<:folder:860982546811715595>",
                sticker: "<:sticker:862541164036096040>",
                stickerfail: "<:stickerfail:862540966422642698>",
                pencil: "<:pencil:860982643498418226>",
                emoji: "<:emoji:860982347309645844>",
                boost: "<:boost:860982716799778826>",
                mic: "<:mic:841518810144964618>",
                muted: "<:muted:841519038974656522>",
                headphone: "<:headphone:841518843322040360>",
                deafen: "<:deafen:841519063283925002>",
                ping: "<:ping:841742416877060127>",
                screenshare: "<:screenshare:841742417593237534>",
                cam: "<:cam:841742416569434123>",
                upload: "<:upload:841742416737992744>",
                reload: "<:reload:841742417698226208>",
                clock: "<:clock:841742417983569951>",
                line: "<:line:841534959332360192>",
                nline: "<:nline:843943265068777482>",
                vline: "<:vline:843939386843463731>",
                delete: "<:delete:841519603640827914>",
                owner: "<:owner:841519550348132353>",
                systemstaff: "<:systemstaff:843939518322573383>",
                tts:  "<:tts:841519276333465631>",
                baloon:  "<:baloon:864666558387191811>",
                DMicon:  "<:DMicon:864666661910609920>",
                next: "<:next:866759922896470076>",
                previous: "<:previous:866759884417662976>",
            },
            status: {
                online: "<:online:841519636562444318>",
                idle: "<:idle:841519679227166720>",
                dnd: "<:dnd:841519655894253578>",
                offline: "<:offline:841519729733664768>",
                streaming: "<:streaming:841519837276012554>",
                mobile: "<:mobile:841519757559857163>",
            },
            badges: {
                certifiedmod: "<:certifiedmod:860987940619419689>",
                staff: "<:staff:860988140520996915>",
                partnerowner: "<:partnerowner:860987855136620554>",
                nitro: "<:nitro:860987893665366026>",
                hypersquad: "<:hypersquad:860987814585040896>",
                earlysupp: "<:earlysupp:860989780950908988>",
                dev: "<:dev:841742418017386567>",
                bughunter2: "<:bughunter2:860987742137614366>",
                bughunter1: "<:bughunter1:857729908096630824>",
                brilliance: "<:brilliance:860988038011682816>",
                bravery: "<:bravery:860988066373304370>",
                balance: "<:balance:860988090506805268>",
                bot: "<:bot:841742415260811304>",
                verifiedbot: "<:verifiedbot:841742417702551632>",
                m1: "<:m1:855648881076862996>",
                m2: "<:m2:855649006959722516>",
                m3: "<:m3:855649103709732925>",
                m6: "<:m6:855649218369945600>",
                m9: "<:m9:855649354157129728>",
                m12: "<:m12:855649566095048704>",
                m15: "<:m15:855649682521063425>",
                m18: "<:m18:855649834940760074>",
                m24: "<:m24:855649947528331274>",

            },
            social: {
                youtube: "<:youtube:843940167366475806>",
                twitter: "<:twitter:843940180930855002>",
                twitch: "<:twitch:843940198001803365>",
                steam: "<:steam:843940238107475978>",
                spotify: "<:spotify:843940256880263178>",
                instagram: "<:instagram:843940290523430924>",
                github: "<:github:843940106326638623>",
                facebook: "<:facebook:843940153130221629>",
                battlenet: "<:battlenet:843940127704481803>",
                fbgg: "<:fbgg:861015765326364702>",

            }
        }
    }
    get MODPERMS() {
        return [
            'ADMINISTRATOR',
            'KICK_MEMBERS',
            'BAN_MEMBERS',
            'MANAGE_CHANNELS',
            'MANAGE_GUILD',
            'VIEW_AUDIT_LOG',
            'MANAGE_MESSAGES',
            'VIEW_GUILD_INSIGHTS',
            'MUTE_MEMBERS',
            'DEAFEN_MEMBERS',
            'MOVE_MEMBERS',
            'MANAGE_ROLES',
            'MANAGE_THREADS'
        ]
    }
    /**
     * 
     * @param {String} locale The language to request the string.
     * @param {String} text The string name.
     * @param {Object=} [options = {}] The string options to replace placeholders
     * @param {User} options.user The the specfied user.
     * @param {User} options.author The author of the message.
     * @param {Channel} options.channel The the specfied channel.
     * @param {Guild} options.guild The the specfied guild.
     * @param {Role} options.role The the specfied guild.
     * @param {Array<String>} options.custom Replace the index 0 string to the index 1.
     * @returns String.
     */
    locale(locale, text, options = {}) {
        if (!text) throw new TypeError("You must specify the string.")
        if (!locale) throw new TypeError("You must specify the locale.")
        let string = require(`../locale/${locale}.json`)[text] ? require(`../locale/${locale}.json`)[text] : require(`../locale/pt.json`)[text] || '**!!Text error!!**'
        if (options) {
            if (options.user) {
                string = string
                    .replace(/%user%/gi, options.user)
                    .replace(/%@user%/gi, options.user)
                    .replace(/%user(\.name)?%/gi, options.user.username)
                    .replace(/%userTag%/gi, `${options.user.tag}`)
                    .replace(/%user\.id%/gi, options.user.id)
                    .replace(/%user\.discrim%/gi, options.user.discriminator)
                    .replace(/%user\.avatar%/gi, options.user.displayAvatarURL({ dynamic: true, size: 512 }))
            }
            if (options.author) {
                string = string
                    .replace(/%author%/gi, options.author)
                    .replace(/%@author%/gi, options.author)
                    .replace(/%author(\.name)?%/gi, options.author.username)
                    .replace(/%authorTag%/gi, `${options.author.tag}`)
                    .replace(/%author\.id%/gi, options.author.id)
                    .replace(/%author\.discrim%/gi, options.author.discriminator)
                    .replace(/%author\.avatar%/gi, options.author.displayAvatarURL({ dynamic: true, size: 512 }))
            }
            if (options.channel) {
                string = string
                    .replace(/%channel%/gi, options.channel)
                    .replace(/%#channel%/gi, options.channel)
                    .replace(/%channel(\.name)?%/gi, options.channel.name)
                    .replace(/%channel\.id%/gi, options.channel.id)
            }
            if (options.guild) {
                string = string
                    .replace(/%guild%/gi, options.guild.name)
                    .replace(/%guild\.members%/gi, options.guild.memberCount)
                    .replace(/%guild(\.name)?%/gi, options.guild.name)
                    .replace(/%guild\.id%/gi, options.guild.id)
                    .replace(/%guild\.icon%/gi, options.guild.iconURL({ dynamic: true, size: 512 }))
            }
            if (options.role) {
                string = string
                    .replace(/%role%/gi, options.role)
                    .replace(/%role(\.name)?%/gi, options.role.name)
                    .replace(/%role\.id%/gi, options.role.id)
            }
            if (options.custom) {
                string = string
                    .replace(new RegExp(`%${options.custom[0]}%`, 'gi'), options.custom[1])
            }
        }
        return string
    }
}
module.exports = BlancClient;
