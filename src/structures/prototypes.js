const { Message, MessagePayload, MessageEmbed } = require('discord.js-light')

module.exports = class Prototypes {
    static init() {

        Message.prototype.nmReply = async function (options) {
            let data;
            if (options instanceof MessagePayload) {
                options.allowedMentions = { repliedUser: false }
                data = options;
            } else {
                data = MessagePayload.create(this, options, {
                    allowedMentions: { repliedUser: false },
                    reply: {
                        messageReference: this,
                        failIfNotExists: options?.failIfNotExists ?? true,
                    },
                });
            }
            return this.channel.send(data);
        }
        Message.prototype.nmEdit = function (options) {
            typeof options === 'object'
                ? options.allowedMentions = { repliedUser: false }
                : options = { content: options, allowedMentions: { repliedUser: false } }
            return this.channel.messages.edit(this, options);
        }
        Array.prototype.chunk = function (chunkSize) {
            this.forEach((e, i) => this.splice(i, 0, this.splice(i, chunkSize)));
            return this;
        }
        Array.prototype.hasAny = function (array) {
            return this.some(r => array.indexOf(r) >= 0)
        }
    }
}