const Command = require('../../structures/command.js'),
    { resolveImage } = require("canvas-constructor"),
    ExtendedCanvas = require("../../extend/ExtendedCanvasC"),
    fetch = require('node-fetch')

module.exports = class SVGCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['svg', 'topng'],
            description: { pt: "Converte um código SVG em uma imagem PNG.", en: "Convert a SVG code into a PNG image." },
            category: 'Casual',
            usage: { pt: "svg <código>", en: "svg <code>" },
            title: { pt: "SVG para PNG", en: "SVG to PNG" }
        })
    }
    async run({ message, args }) {
        const codeInBlock = /^```(?:svg)?\s(.+[^\\])```$/is;
        let code = args.join(' ')

        if (code !== null) {
            if (codeInBlock.test(code)) {
                code = code.replace(codeInBlock, "$1");
            }
            code = Buffer.from(code, 'binary').toString('base64')
        } else if (code === null && message.attachments) {
            code = await fetch(message.attachments.first().url)
                .then(r => r.text())
            code = Buffer.from(code, 'binary').toString('base64')
        }
        const buffer = Buffer.from(code, 'base64')
        message.nmReply(code)
        
        let image = await resolveImage(buffer).catch(e => e)
        if (!image.width) return message.reply({ content: '`ERROR`', allowedMentions: { repliedUser: false } })
        let canvas = new ExtendedCanvas(image.width, image.height)
            .printImage(image, 0, 0, image.width, image.height)
            .toBuffer()

        message.nmReply({ files: [this.client.utils.attach(canvas, 'svgoutput.png')] })
    }
}