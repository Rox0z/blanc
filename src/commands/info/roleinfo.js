const { MessageEmbed } = require('discord.js-light'),
    Command = require('../../structures/command.js'),
    { resolveImage } = require("canvas-constructor"),
    Canvas = require('../../extend/ExtendedCanvasC'),
    chroma = require('chroma-js'),
    svgcode = `<svg class="shield-1-PEa-" aria-hidden="false" width="128" height="128" viewBox="0 0 20 23"><g fill="none" fill-rule="evenodd"><path fill="%color%" d="M19.487 5.126L10.487 0.126C10.184 -0.042 9.81798 -0.042 9.51498 0.126L0.514977 5.126C0.197977 5.302 0.000976562 5.636 0.000976562 5.999C0.000976562 6.693 0.114977 22.999 10.001 22.999C19.887 22.999 20.001 6.693 20.001 5.999C20.001 5.636 19.804 5.302 19.487 5.126ZM10.001 5.999C11.382 5.999 12.501 7.118 12.501 8.499C12.501 9.88 11.382 10.999 10.001 10.999C8.61998 10.999 7.50098 9.88 7.50098 8.499C7.50098 7.118 8.61998 5.999 10.001 5.999ZM6.25098 16C6.25098 13.699 7.69998 12.25 10.001 12.25C12.302 12.25 13.751 13.699 13.751 16H6.25098Z"></path></g></svg>`

module.exports = class RoleInfoCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ['ri', 'role', 'cargo'],
            description: { pt: 'Mostra as informações do cargo especificado.', en: 'Shows the information about the specified role.' },
            category: 'Info',
            channel: 'text',
            neededPermissions: [],
            title: { pt: 'Informação de Cargo', en: 'Role Info' },
            usage: { pt: 'roleinfo <cargoID|@cargo>', en: 'roleinfo <roleID|@role>' },
        })
    }
    async run({ message, args, guild, channel, author, prefix, lang }) {
        if (!args[0]) return message.nmReply(this.client.locale(lang, 'CHOOSE_ROLE').replace(/:/gi, '!'))
        let role
        try { role = this.client.utils.resolveRole(args[0], guild.roles.cache) } catch { return message.nmReply(this.client.locale(lang, 'ERROR_UNKNOWN')) }
        if (!role) return message.nmReply(this.client.locale(lang, 'ERROR_NOT_FOUND'))
        let { color } = role
        if (color === 0) color = 12172222
        //const buffer = Buffer.from(svgcode.replace(/%color%/gi, require('chroma-js')(color).hex()), 'base64')
        let buffer = Buffer.from(svgcode.replace(/%color%/gi, chroma(color).hex()), 'binary')//.toString('base64')
        let image = await resolveImage(buffer).catch(e => e)
        let canvas = new Canvas(128, 128)
            .printImage(image, 0, 0, 128, 128)
            .toBuffer()
        let mem
        let rolesCount = (mem = await guild.members.fetch(false), mem.filter(m => m.roles.cache.has(role.id))).size
        const embed = new MessageEmbed()
            .setAuthor(role.name, 'attachment://role.png')
            .setColor(color)
            .setDescription(`${this.client.emoji.icons['calendar']} ${this.client.locale(lang, 'CREATED')} <t:${Math.round(role.createdTimestamp/1000)}:f>`)
            .addFields([
                { name: `${this.client.emoji.icons['members']} ${this.client.locale(lang, 'SERVERINFO_COMMAND_FIELDS').MEMBERS}`, value: `\`\`\`${rolesCount}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['integration']} ${this.client.locale(lang, 'INTEGRATION')}`, value: `\`\`\`${role.managed ? this.client.locale(lang, 'YES') : this.client.locale(lang, 'NO')}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['pencil']} ${this.client.locale(lang, 'COLOR')}`, value: `\`\`\`${chroma(role.color).hex()}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['pin']} ${this.client.locale(lang, 'HOISTED')}`, value: `\`\`\`${role.hoist ? this.client.locale(lang, 'YES') : this.client.locale(lang, 'NO')}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['DMicon']} ${this.client.locale(lang, 'MENTIONABLE')}`, value: `\`\`\`${role.mentionable ? this.client.locale(lang, 'YES') : this.client.locale(lang, 'NO')}\`\`\``, inline: true },
                { name: `${this.client.emoji.icons['id']} ID:`, value: `\`\`\`${role.id}\`\`\``, inline: false },
                { name: `${this.client.emoji.icons['education']} ${this.client.locale(lang, 'PERMISSIONS')}`, value: `\`\`\`${role.permissions.toArray().length === 0 ? this.client.locale(lang, 'NONE') : role.permissions.toArray().join(', ')}\`\`\``, inline: false },

            ])
            //.setThumbnail('attachment://role.png')

        message.nmReply({ embeds: [embed], files: [this.client.utils.attach(canvas, 'role.png')] })
    }
}