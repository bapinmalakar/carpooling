let moment = require('moment');
module.exports = {
    addHour: (obj) => { return (obj + 3600000) },
    subtractHour: (obj) => { return (obj - 3600000) }
}