const Command = require('../../structures/command.js'),
    { Calendar } = require('calendar'),
    months = {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3,
        "5": 4,
        "6": 5,
        "7": 6,
        "8": 7,
        "9": 8,
        "10": 9,
        "11": 10,
        "12": 11,
        "jan": 0,
        "fev": 1,
        "mar": 2,
        "abr": 3,
        "mai": 4,
        "jun": 5,
        "jul": 6,
        "ago": 7,
        "set": 8,
        "out": 9,
        "nov": 10,
        "dez": 11,
        "janeiro": 0,
        "fevereiro": 1,
        "março": 2,
        "marco": 2,
        "abril": 3,
        "maio": 4,
        "junho": 5,
        "julho": 6,
        "agosto": 7,
        "setembro": 8,
        "outubro": 9,
        "novembro": 10,
        "dezembro": 11,
        "january": 0,
        "february": 1,
        "march": 2,
        "april": 3,
        "may": 4,
        "june": 5,
        "july": 6,
        "august": 7,
        "september": 8,
        "october": 9,
        "november": 10,
        "december": 11,
        "feb": 1,
        "mar": 2,
        "apr": 3,
        "jun": 5,
        "jul": 6,
        "aug": 7,
        "sep": 8,
        "oct": 9,
        "nov": 10,
        "dec": 11,
    }

module.exports = class CalendarCommand extends Command {
    constructor(...args) {
        super(...args, {
            aliases: [],
            description: {pt: 'Mostra o calendario pedido.', en: 'Shows the requested calendar.'},
            category: 'Casual',
            ownerOnly: false,
            typing: true,
            channel: 'both',
            neededPermissions: [],
            title: {pt: 'Calendário', en: 'Calendar'},
            usage: {pt: 'calendario [mês] [ano]', en: 'calendar [month] [year]'},
        })
    }
    async run({message, args, guild, channel, author, prefix, lang}) {
        let now = new Date,
        month = now.getMonth(),
        year = now.getFullYear()

        if (args[0]){month = months[args[0].toLowerCase()]}
        if (args[1]) year = args[1]

        let cal = new Calendar(1)
        let calend = 'Se Te Qa Qi Sx Sa Do\n'+
        cal.monthDays(year, month)
        .map(week => week.map(day => day = day <= 9 ? ` ${day}` : day)
        .map(day => day = day === ' 0' ? '  ': day).join(' ')).join('\n')

        message.nmReply(`\`\`\`${calend}\`\`\``)
    }
}