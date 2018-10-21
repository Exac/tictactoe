let os = require('os');

let interfaces = os.networkInterfaces();

const PROXYCONFIG = {
    "**/api/*": {
       "target" : "http://192.168.1.69:3000/",
    //    // "target": "http://192.168.1.69:3000/",
    //    // "target" : `http://${interfaces.Ethernet[1].address}:3000/`,
    //    // "target": `http://${os.hostname()}:3000`,
    //    // "target": `http://${server.address().address}:3000/`,
       "secure": "false",
       "changeOrigin": true
    }
};

module.exports = PROXYCONFIG;
