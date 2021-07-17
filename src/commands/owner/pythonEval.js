const Command = require('../../structures/command.js'),
    codeInBlock = /^```(?:py)?\s(.+[^\\])```$/is,
    Eval = require('open-eval'),
    { MessageEmbed } = require('discord.js'),
    ev = new Eval();
module.exports = class PythonEvalCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['pyev', 'pyeval'],
            description: "Evaluate python code externaly.",
            category: 'Owner',
            ownerOnly: true,
            channel: 'both',
            neededPermissions: [],
            title: "Python Eval",
            usage: "pyeval <code>",
        })
    }
    async run({ message, args, guild, channel, author, prefix, lang }) {
        if (codeInBlock.test(code)) { code = code.replace(codeInBlock, "$1"); }
        let code = args.join(' ');
        let data = await ev.eval("python3", code)
        let embed = new MessageEmbed()
            .setTitle(`Python - Evaluate`)
            .setDescription(
                `Output ↓` +
                `\`\`\`py\n${data.output.length > 0 ? data.output : "void"}`.slice(0, 2000) +
                `\n\`\`\``
            )
        message.nmReply({ embeds: [embed] })
    }
}