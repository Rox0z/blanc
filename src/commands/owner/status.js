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
        let secondaryPercentage = Math.round((process.memoryUsage().heapTotal / 512e6) * 100)
        await message.nmReply({
            content:
                `\`\`\`md
#Process memory allocated:   ${byteSize(process.memoryUsage().heapTotal)}
#Process memory used:        ${byteSize(process.memoryUsage().heapUsed)}
<Percent: [${this.client.utils.progressBar(percent, { size: 20, secondaryPercentage })}] ${percent}% / ${secondaryPercentage}%\`\`\``
        });
    }
};
