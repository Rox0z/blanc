const Command = require("../../structures/command.js");
const byteSize = require("byte-size");

module.exports = class StatusCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["memory"],
            description: "Show current BOT memory usage.",
            category: "Owner",
            ownerOnly: true,
            usage: 'status',
            title: 'Status'
        });
    }
    async run({ message }) {
        let percent = Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
        await message.nmReply({
            content:
                `\`\`\`md
#Process memory allocated:   ${byteSize(process.memoryUsage().heapTotal, { units: "iec" })}
#Process memory used:        ${byteSize(process.memoryUsage().heapUsed, { units: "iec" })}
<Percent: [${this.client.utils.progressBar(percent, { size: 16, dynamic: '▮', fixed: '▯' })}] ${percent}%\`\`\``
        });
    }
};
