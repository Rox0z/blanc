'use strict';

var regex = new RegExp('^((?:\\d+)?\\.?\\d+) *(' + [
  'milisegundos?',
  'milliseconds?',
  'msecs?',
  'ms',
  'segundos?',
  'seconds?',
  'secs?',
  's',
  'minutes?',
  'minutos?',
  'mins?',
  'm',
  'hours?',
  'horas?',
  'hrs?',
  'h',
  'days?',
  'dias?',
  'd',
  'weeks?',
  'semanas?',
  'smns?',
  'wks?',
  'w',
  'years?',
  'anos?',
  'a',
  'yrs?',
  'y'
].join('|') + ')?$', 'i');

var second = 1000
  , minute = second * 60
  , hour = minute * 60
  , day = hour * 24
  , week = day * 7
  , year = day * 365;
/**
 * Parse a time string and return the number value of it.
 *
 * @param {String} ms Time string.
 * @returns {Number}
 * @api private
 */
module.exports = function millisecond(ms) {
  var type = typeof ms
    , amount
    , match;

  if ('number' === type) return ms;
  else if ('string' !== type || '0' === ms || !ms) return 0;
  else if (+ms) return +ms;

  //
  // We are vulnerable to the regular expression denial of service (ReDoS).
  // In order to mitigate this we don't parse the input string if it is too long.
  // See https://nodesecurity.io/advisories/46.
  //
  if (ms.length > 10000 || !(match = regex.exec(ms))) return 0;

  amount = parseFloat(match[1]);

  switch (match[2].toLowerCase()) {
    case 'anos':
    case 'ano':
    case 'a':
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return amount * year;

    case 'semanas':
    case 'semana':
    case 'smns':
    case 'smn':
    case 'weeks':
    case 'week':
    case 'wks':
    case 'wk':
    case 'w':
      return amount * week;

    case 'dias':
    case 'dia':
    case 'days':
    case 'day':
    case 'd':
      return amount * day;

    case 'horas':
    case 'hora':
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return amount * hour;

    case 'minutos':
    case 'minuto':
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return amount * minute;

    case 'segundos':
    case 'segundo':
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return amount * second;

    default:
      return amount;
  }
};
