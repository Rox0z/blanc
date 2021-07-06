module.exports = class Event {
    constructor(client, name, options ={}){
        const {
            description = "A nice event",
            event = name,
            once = false,
            emitter
        } = options;

        this.id = name
        this.name = event
        this.description = description
        this.type = once ? 'once' : 'on'
        this.emitter = (typeof emitter === 'string' ? client[emitter] : emitter) || client
        this.client = client
    }

    async run(...args){
        throw new Error(`Event ${this.name} doesn't provide a run method.`)
    }
}