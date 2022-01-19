const Command = require('../../structures/command.js'),
    codeInBlock = /[\s+]?```(?:py(?:thon)?)?[\s+]?(.+[^\\])```$/is,
    Eval = require('open-eval'),
    { MessageEmbed } = require('discord.js'),
    ev = new Eval();
module.exports = class PythonEvalCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['pyev', 'pyeval'],
            description: "Evaluate python code externaly.",
            category: 'Casual',
            channel: 'both',
            neededPermissions: [],
            title: "Python Eval",
            usage: "pyeval <code>",
        })
    }
    async run({ message, args, guild, channel, author, prefix, lang }) {
        let code = message.content;
        if (codeInBlock.test(code)) { code = code.match(codeInBlock)[1]; }
        let data = await ev.eval("python3", code)
        let embed = new MessageEmbed()
            .setTitle(`Python - Evaluate`)
            .setDescription(
                `Output ↓` +
                `\`\`\`py\n${data?.output?.length > 0 ? data.output : "void"}`.slice(0, 2000) +
                `\n\`\`\``
            )
        message.nmReply({ embeds: [embed] })
    }
}
