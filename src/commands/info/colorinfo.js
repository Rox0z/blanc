const Command = require('../../structures/command.js'),
    { resolveImage } = require("canvas-constructor"),
    Canvas = require('../../extend/ExtendedCanvasC'),
    chroma = require('chroma-js'),
    svgcode = `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 320"><defs><style>
    .cls-1{fill:%color%;}    
    .cls-2{fill:%colordark1%;}
    .cls-3{fill:%colordark2%;}
    .cls-4{fill:%colordark3%;}    
    .cls-5{fill:%colorlight1%;}
    .cls-6{fill:%colorlight2%;}
    .cls-7{fill:%colorlight3%;}
    .cls-8{fill:#ffffff;}
    .cls-9{fill:%coloranalog1%;}
    .cls-10{fill:%coloranalog2%;}
    .cls-11{fill:%colortriadic1%;}
    .cls-12{fill:%colortriadic2%;}
    .cls-13{fill:%colorcomplementary%;}
    </style></defs><path class="cls-1" d="M417.61,36c-.15-.3-.3-.6-.46-.89,0,0,0,0,0-.05A29.74,29.74,0,0,0,366,34.1a29.74,29.74,0,0,0-51.13.91s0,0,0,.05c-.16.29-.31.59-.46.89-7.86,15-23.79,25.47-42.39,26.32,6.52,19.07,25.38,32.86,47.63,32.86,21,0,38.91-12.24,46.37-29.62,7.46,17.38,25.41,29.62,46.37,29.62,22.25,0,41.11-13.79,47.63-32.86C441.4,61.42,425.47,50.93,417.61,36Z" transform="translate(-20 -20)"/><rect class="cls-1" width="64" height="64"/><rect class="cls-2" y="64" width="64" height="64"/><rect class="cls-3" y="128" width="64" height="64"/><rect class="cls-4" y="192" width="64" height="64"/><rect y="256" width="64" height="64"/><rect class="cls-1" x="94" width="64" height="64"/><rect class="cls-5" x="94" y="64" width="64" height="64"/><rect class="cls-6" x="94" y="128" width="64" height="64"/><rect class="cls-7" x="94" y="192" width="64" height="64"/><rect class="cls-8" x="94" y="256" width="64" height="64"/><rect class="cls-9" x="188" y="128" width="64" height="64"/><rect class="cls-1" x="188" y="192" width="64" height="64"/><rect class="cls-10" x="188" y="256" width="64" height="64"/><rect class="cls-11" x="282" y="128" width="64" height="64"/><rect class="cls-1" x="282" y="192" width="64" height="64"/><rect class="cls-12" x="282" y="256" width="64" height="64"/><rect class="cls-1" x="376" y="192" width="64" height="64"/><rect class="cls-13" x="376" y="256" width="64" height="64"/></svg>`

module.exports = class ColorinfoCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['cor', 'color'],
            description: { pt: 'Mostra a informação da cor.', en: 'Shows information about any color.' },
            category: 'Info',
            neededPermissions: [],
            title: { pt: 'Informação de cor', en: 'Color Info' },
            usage: { pt: 'cor <hex|decimal>', en: 'color <hex|decimal>' },
        })
    }
    async run({ message, args, guild, channel, author, prefix, lang }) {
        if (!chroma.valid(args[0])) return message.nmReply(this.client.locale(lang, 'ERROR_INVALID_COLOR'))
        let color = chroma(args[0]).hex()
        let buffer = Buffer.from(svgcode
            .replace(/%color%/gi, chroma(color).hex())
            .replace(/%colordark1%/gi, chroma.scale([color, chroma(color).darken(100)])(.25).hex())
            .replace(/%colordark2%/gi, chroma.scale([color, chroma(color).darken(100)])(.5).hex())
            .replace(/%colordark3%/gi, chroma.scale([color, chroma(color).darken(100)])(.75).hex())
            .replace(/%colorlight1%/gi, chroma.scale([color, chroma(color).brighten(100)])(.25).hex())
            .replace(/%colorlight2%/gi, chroma.scale([color, chroma(color).brighten(100)])(.5).hex())
            .replace(/%colorlight3%/gi, chroma.scale([color, chroma(color).brighten(100)])(.75).hex())
            .replace(/%coloranalog1%/gi, chroma(color).set('hsl.h', `${(chroma(color).get('hsl.h') + 30) % 360}`))
            .replace(/%coloranalog2%/gi, chroma(color).set('hsl.h', `${(chroma(color).get('hsl.h') - 30) % 360}`))
            .replace(/%colortriadic1%/gi, chroma(color).set('hsl.h', `${(chroma(color).get('hsl.h') + 120) % 360}`))
            .replace(/%colortriadic2%/gi, chroma(color).set('hsl.h', `${(chroma(color).get('hsl.h') - 120) % 360}`))
            .replace(/%colorcomplementary%/gi, chroma(16777215 - chroma(color).num()).alpha(chroma(color).get('rgba.a')).hex())
            , 'binary')
        let image = await resolveImage(buffer).catch(e => e)
        let canvas = new Canvas(440, 320)
            .printImage(image, 0, 0, 440, 320)
            .toBuffer()

        message.nmReply({ files: [this.client.utils.attach(canvas, 'svgoutput.png')] })
    }
}