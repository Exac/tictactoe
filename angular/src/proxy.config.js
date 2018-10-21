import * as os from 'os';
import server from 'server';

export default PROXYCONFIG = {
    "/api/*": {
        "target": "http://192.168.1.69:3000/",
        // "target": `http://${os.hostname()}:3000`,
        // "target": `http://${server.address().address}:3000/`,
        "secure": "false",
        "changeOrigin": true
    }
};



