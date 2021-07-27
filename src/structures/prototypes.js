const { Message, MessagePayload, User, Presence, Base } = require('discord.js')

module.exports = class Prototypes {
    static init(client) {
        this.client = client
        
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
            let a = [...this]
            a.forEach((e, i) => a.splice(i, 0, a.splice(i, chunkSize)));
            return a;
        }
        Array.prototype.hasAny = function (array) {
            return this.some(r => array.indexOf(r) >= 0)
        }
        Object.defineProperty(User.prototype, "presence", {
            get: function presence() {
                for (const guild of this.client.guilds.cache.values()) {
                    if (guild.presences.cache.has(this.id)) return guild.presences.cache.get(this.id);
                }
                return new Presence(this.client, { user: { id: this.id } });
            }
        });
    }
}