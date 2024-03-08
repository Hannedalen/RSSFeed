import express, { Request, Response } from 'express';
import https from 'https';
import { parseString }from 'xml2js';
import { WebSocketServer } from 'ws';

const app = express();
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.status(200);
    res.send("Root of URL server");
})

function fetchAndConvertRSSFeed(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            })
            response.on('end', () => {
                parseString(data, { trim:true, explicitArray: false }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rss.channel.item);
                    }
                });
            });
        }).on('error', (err) => {
            reject(err);
        })
    })
}

const wss = new WebSocketServer({ server:app.listen(port) });

let lastFetchedData: any = null;

wss.on('connection', ws => {
    console.log("Client connected");
    if (lastFetchedData !== null) {
        ws.send(JSON.stringify(lastFetchedData));
    }   
});

const rssFeedUrl = 'https://www.vg.no/rss/feed/';


console.log(`WebSocket and HTTP server running on http://localhost:${port}`);

function broadcastDataToClients(data:any) {
    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(data))
        }
    });
}

async function fetchAndBroadcastRSSFeed() {
    try {
        const feedData = await fetchAndConvertRSSFeed(rssFeedUrl);
        lastFetchedData = feedData;
        broadcastDataToClients(feedData);
    } catch (error) {
        console.error("Feil ved henting eller parsing av RSS-feed:", error)
    }
}

fetchAndBroadcastRSSFeed();
setInterval(fetchAndBroadcastRSSFeed, 30000);
