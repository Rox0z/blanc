const { Canvas } = require("canvas-constructor"),
    { fillTextWithTwemoji } = require("node-canvas-with-twemoji-and-discord-emoji");
class BlancCanvas extends Canvas {
    constructor(t, e, i) {
        super(t, e, i);
    }
    async printEmojiText(t, e, i, ...a) {
        if (a > 0) {
            for (var s, n = t.split(" "), o = [], r = n[0], h = i, l = 1; l < n.length; l++) {
                var c = n[l];
                this.context.measureText(r.replace(/(<:|<a:)((\w{1,64}:\d{17,18})|(\w{1,64}))(>)/, "00") + " " + c.replace(/(<:|<a:)((\w{1,64}:\d{17,18})|(\w{1,64}))(>)/, "00")).width < a ? (r += " " + c) : (o.push(r), (r = c));
            }
            o.push(r);
            for (let t = 0; t < o.length; t++) {
                (s = o[t]), await fillTextWithTwemoji(this.context, s, e, h), (h += this.textFontHeight + 0.3 * this.textFontHeight);
            }
            return this;
        }
        return await fillTextWithTwemoji(this.context, t, e, i), this;
    }
    imageSmoothing(bool = true){
        this.context.imageSmoothingEnabled = bool
        return this
    }
}
module.exports = BlancCanvas;

/*
const { Canvas } = require('canvas-constructor')
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji-and-discord-emoji');

class BlancCanvas extends Canvas {
    constructor(width, height, type) {
        super(width, height, type)
    }
    async printEmojiText(text, x, y, ...maxWidth) {
        if (maxWidth > 0) {
            var words = text.split(" "), lines = [], currentLine = words[0], Y = y, text0;

            for (var i = 1; i < words.length; i++) {
                var word = words[i];
                var width = this.context.measureText(currentLine.replace(/(<:|<a:)((\w{1,64}:\d{17,18})|(\w{1,64}))(>)/, '00') + " " + word.replace(/(<:|<a:)((\w{1,64}:\d{17,18})|(\w{1,64}))(>)/, '00')).width;
                if (width < maxWidth) currentLine += " " + word;
                else {

                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            for (let n = 0; n < lines.length; n++) {
                text0 = lines[n]
                await fillTextWithTwemoji(this.context, text0, x, Y)
                let addline = this.textFontHeight + (this.textFontHeight * .1)
                Y += (addline)
            }
            return this
        } else {
            await fillTextWithTwemoji(this.context, text, x, y)
            return this
        }


    }
}

module.exports = BlancCanvas
*/