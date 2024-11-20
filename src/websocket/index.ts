import { Server } from 'http';
import WebSocket from 'ws';
import { setupWSConnection, getYDoc } from 'y-websocket/bin/utils';

const docs = new Map<string, any>();

const getYDocWrapper = (roomName: string): any => {
  if (!docs.has(roomName)) {
    const newDoc = getYDoc(roomName);
    docs.set(roomName, newDoc);
    console.log(`Created new Y.Doc for room: ${roomName}`);
  }
  return docs.get(roomName)!;
};

export function createWebSocketServer(server: Server): void {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (conn, req) => {
    console.log('WebSocket connection established');

    const urlParts = new URL(req.url || '', `http://${req.headers.host}`);
    const roomName = urlParts.pathname.slice(1);

    if (!roomName) {
      console.error('No room name provided in the URL');
      conn.close();
      return;
    }

    const doc = getYDocWrapper(roomName);

    setupWSConnection(conn, req, { docName: roomName });

    console.log(`Client connected to room: ${roomName}`);
  });

  setInterval(() => {
    console.log('Cleaning up empty YDocs...');
    docs.forEach((doc, roomName) => {
      if (doc.getMap('state').size === 0) {
        docs.delete(roomName);
        console.log(`Deleted empty room: ${roomName}`);
      }
    });
  }, 60000);

  console.log('WebSocket server is running');
}