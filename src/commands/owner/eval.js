const Command = require('../../structures/command.js')
const codeInBlock = /```(?:js)?\s(.+[^\\])```$/is;
const { MessageEmbed } = require('discord.js')
const REGEXPESC = /[-/\\^$*+?.()|[\]{}]/g;
const zws = String.fromCharCode(8203);

module.exports = class EvalCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['evaluate', 'ev'],
            description: 'Evaluate code',
            ownerOnly: true,
            category: 'Owner',
            usage: 'evaluate <code> [--silent]',
            title: 'Evaluate'
        })
    }
    async run({ message, args, guild, channel, author, lang, prefix }) {
        const regExpEsc = (str) => {
            return str.replace(REGEXPESC, '\\$&');
        }
        const clean = (text) => { return text.replace(new RegExp(regExpEsc(this.client.token), 'gi'), '「ｒｅｄａｃｔｅｄ」').replace(/`/g, `\`${zws}`).replace(/@/g, `@${zws}`); }
        let code = message.content,
            silent = false
        if (codeInBlock.test(code)) { code = code.match(codeInBlock)[1]; }
        if (!!code.match(/--silent/gmi)) { code = code.replace(/--silent/gmi, '').trim(); silent = true }
        if (code.includes("await")) { code = `async () => {${code}}`; } else { code = `() => {${code}}`; }
        let out = null
        try { out = await eval(code)(); } catch (err) {
            out = {
                method: err.method || null,
                path: err.path || null,
                code: err.code || null,
                httpStatus: err.httpStatus || null,
                name: err.name || null,
                message: err.message || null
            };
        }
        let classe = "void";
        if (out !== undefined && out !== null) { classe = out.constructor.name; }
        let type = typeof out
        if (typeof out !== "string") out = require("util").inspect(out);
        out = clean(out)
        if (!silent) {
            let embed = new MessageEmbed()
                .setTitle(`Evaluate`)
                .setDescription(
                    `Output ↓` +
                    `\`\`\`js\n${`${out}`.length > 0 ? `${out}` : "void"}`.slice(0, 1800) +
                    `\n\`\`\``
                )
                .addFields([
                    { name: 'Class', value: `\`\`\`yml\n${classe}\`\`\``, inline: true },
                    { name: 'Type', value: `\`\`\`ts\n${type}\`\`\``, inline: true }
                ])

            if (out.length > 1800 || code.includes('JSON.stringify')) {
                var attach = this.client.utils.attach(Buffer.from(out, 'utf-8'), 'output.js')
                message.nmReply({ files: [attach], allowedMentions: { repliedUser: false } })
            }
            message.nmReply({ embeds: [embed], allowedMentions: { repliedUser: false } })
        }
        return

    }
}