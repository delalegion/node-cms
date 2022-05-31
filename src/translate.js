const path = require('path');

class Translate {
    constructor(locale = 'pl') {
        this.locale = locale;
    }
    import() {
        return require(path.join(__dirname + '/locales/' + this.locale + '.json'));
    }
    t(val) {
        let imp = this.import();
        const values = val.split('.');
        let array = [];
        values.forEach(e => {
            array.push('[\'' + e + '\']');
        })
        array.forEach(e => {
            return imp + e;
        })
    }
}

module.exports = Translate;