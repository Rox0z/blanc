module.exports = class Command {
    constructor(client, name, options = {}) {
        const {
            aliases = [],
            channel = 'both',
            ownerOnly = false,
            typing = true,
            description = "A nice command",
            neededPermissions = [],
            category = 'Misc',
            cmdName = name,
            usage = name,
            title = name
        } = options;

        switch (category) {
            case 'Admin':
                this.emoji = '841518870958964736'
                break;
            case 'Info':
                this.emoji = '841518890340843551'
                break;
            case 'Moderation':
                this.emoji = '841519512678432778'
                break;
            case 'Casual':
                this.emoji = '841742417514332213'
                break;
            case 'Misc':
                this.emoji = '861011464860860427'
                break;
            case 'Owner':
                this.emoji = '841519550348132353'
                break;
            default:
                break;
        }
        this.title = title
        this.usage = usage
        this.neededPermissions = neededPermissions
        this.client = client
        this.name = cmdName
        this.aliases = aliases
        this.category = category
        this.description = description
        this.ownerOnly = ownerOnly
        this.typing = typing
        this.channel = channel

    }

    async run(message, args, guild, channel, author) {
        throw new Error(`Command ${this.name} doesn't provide a run method.`)
    }
}