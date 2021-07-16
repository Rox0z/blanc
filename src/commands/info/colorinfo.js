const Command = require('../../structures/command.js'),
    { resolveImage } = require("canvas-constructor"),
    Canvas = require('../../extend/ExtendedCanvasC'),
    chroma = require('chroma-js'),
    svgcode = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 640 640" style="enable-background:new 0 0 640 640;" xml:space="preserve"><style type="text/css">
   .st0{fill:%color%;}
   .st1{fill:%colorsatur4%;}
   .st2{fill:%colorsatur3%;}
   .st3{fill:%colorsatur2%;}
   .st4{fill:%colorsatur1%;}
   .st5{fill:%colordesatur1%;}
   .st6{fill:%colordesatur2%;}
   .st7{fill:%colordesatur3%;}
   .st8{fill:%colordesatur4%;}
   .st9{fill:%colorlight1%;}
   .st10{fill:%colorlight2%;}
   .st11{fill:%colorlight3%;}
   .st12{fill:%white%;}
   .st13{fill:%colordark1%;}
   .st14{fill:%colordark2%;}
   .st15{fill:%colordark3%;}
   .st16{fill:%black%;}
   .st17{fill:%coloranalog1%;}
   .st18{fill:%coloranalog2%;}
   .st19{fill:%colortriadic1%;}
   .st20{fill:%colortriadic2%;}
   .st21{fill:%colorcomplementary%;}
   </style>
   <g><rect x="0" y="50" class="st0" width="64" height="128"/><rect x="64" y="114" class="st1" width="64" height="64"/><rect x="128" y="114" class="st2" width="64" height="64"/><rect x="192" y="114" class="st3" width="64" height="64"/><rect x="256" y="114" class="st4" width="64" height="64"/><rect x="64" y="50" class="st5" width="64" height="64"/><rect x="128" y="50" class="st6" width="64" height="64"/><rect x="192" y="50" class="st7" width="64" height="64"/><rect x="256" y="50" class="st8" width="64" height="64"/>   </g><g><rect x="0" y="201.2" class="st0" width="64" height="128"/><rect x="64" y="265.2" class="st9" width="64" height="64"/><rect x="128" y="265.2" class="st10" width="64" height="64"/><rect x="192" y="265.2" class="st11" width="64" height="64"/><rect x="256" y="265.2" class="st12" width="64" height="64"/><rect x="64" y="201.2" class="st13" width="64" height="64"/><rect x="128" y="201.2" class="st14" width="64" height="64"/><rect x="192" y="201.2" class="st15" width="64" height="64"/><rect x="256" y="201.2" class="st16" width="64" height="64"/>   </g><g><g><rect y="352.1" class="st17" width="64" height="64"/></g><g><rect x="64" y="352.1" class="st0" width="64" height="64"/></g><g><rect x="128" y="352.1" class="st18" width="64" height="64"/></g></g><g><g><rect x="1" y="439.1" class="st19" width="64" height="64"/></g><g><rect x="65" y="439.1" class="st0" width="64" height="64"/></g><g><rect x="129" y="439.1" class="st20" width="64" height="64"/></g></g><g><g><rect y="526" class="st0" width="64" height="64"/></g><g><rect x="64" y="526" class="st21" width="64" height="64"/></g></g><path class="st0" d="M542.2,422.7c-0.2-0.4-0.4-0.8-0.6-1.2c0,0,0,0,0-0.1c-11-19.5-35.8-26.3-55.2-15.2c-5.9,3.4-10.9,8.1-14.4,13.9c-11.8-19-36.7-24.9-55.7-13.1c-5.8,3.6-10.5,8.5-13.9,14.4c0,0,0,0,0,0.1c-0.2,0.4-0.4,0.8-0.6,1.2c-10.7,20.4-32.4,34.7-57.7,35.8c8.9,26,34.6,44.8,64.9,44.8c28.6,0,53-16.7,63.1-40.3c10.2,23.7,34.6,40.3,63.1,40.3c30.3,0,56-18.8,64.9-44.8C574.6,457.3,552.9,443,542.2,422.7z"/>
   </svg>`

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
            .replace(/%black%/gi, chroma(color).alpha(chroma(color).get('rgba.a')).hex())
            .replace(/%white%/gi, chroma(color).alpha(chroma(color).get('rgba.a')).hex())
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
            .replace(/%colorsatur1%/gi, chroma.scale([color, chroma(color).set('hsv.s',1).hex()])(1).hex())
            .replace(/%colorsatur2%/gi, chroma.scale([color, chroma(color).set('hsv.s',1).hex()])(.75).hex())
            .replace(/%colorsatur3%/gi, chroma.scale([color, chroma(color).set('hsv.s',1).hex()])(.5).hex())
            .replace(/%colorsatur4%/gi, chroma.scale([color, chroma(color).set('hsv.s',1).hex()])(.25).hex())
            .replace(/%colordesatur1%/gi, chroma.scale([color, chroma(color).desaturate(10).alpha(chroma(color).get('rgba.a')).hex()])(.25).hex())
            .replace(/%colordesatur2%/gi, chroma.scale([color, chroma(color).desaturate(10).alpha(chroma(color).get('rgba.a')).hex()])(.5).hex())
            .replace(/%colordesatur3%/gi, chroma.scale([color, chroma(color).desaturate(10).alpha(chroma(color).get('rgba.a')).hex()])(.75).hex())
            .replace(/%colordesatur4%/gi, chroma.scale([color, chroma(color).desaturate(10).alpha(chroma(color).get('rgba.a')).hex()])(1).hex())
            .replace(/%colorcomplementary%/gi, chroma(16777215 - chroma(color).num()).alpha(chroma(color).get('rgba.a')).hex())
            , 'binary')
        let image = await resolveImage(buffer).catch(e => e)
        let canvas = new Canvas(640, 640)
            .printImage(image, 0, 0)
            .toBuffer()

        message.nmReply({ files: [this.client.utils.attach(canvas, 'svgoutput.png')] })
    }
}