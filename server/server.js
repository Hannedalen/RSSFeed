"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const xml2js_1 = require("xml2js");
const ws_1 = require("ws");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.status(200);
    res.send("Root of URL server");
});
function fetchAndConvertRSSFeed(url) {
    return new Promise((resolve, reject) => {
        https_1.default.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                (0, xml2js_1.parseString)(data, { trim: true, explicitArray: false }, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result.rss.channel.item);
                    }
                });
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}
const wss = new ws_1.WebSocketServer({ server: app.listen(port) });
let lastFetchedData = null;
wss.on('connection', ws => {
    console.log("Client connected");
    if (lastFetchedData !== null) {
        ws.send(JSON.stringify(lastFetchedData));
    }
});
const rssFeedUrl = 'https://www.vg.no/rss/feed/';
console.log(`WebSocket and HTTP server running on http://localhost:${port}`);
function broadcastDataToClients(data) {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}
function fetchAndBroadcastRSSFeed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const feedData = yield fetchAndConvertRSSFeed(rssFeedUrl);
            lastFetchedData = feedData;
            broadcastDataToClients(feedData);
        }
        catch (error) {
            console.error("Feil ved henting eller parsing av RSS-feed:", error);
        }
    });
}
fetchAndBroadcastRSSFeed();
setInterval(fetchAndBroadcastRSSFeed, 30000);
