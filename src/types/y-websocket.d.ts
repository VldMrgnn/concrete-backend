// y-websocket-utils.d.ts
declare module 'y-websocket/bin/utils' {
  import { WebSocket } from 'ws';
  import { IncomingMessage } from 'http';
  import { Doc } from 'yjs';

  interface WSSharedDoc extends Doc {
    name: string;
    conns: Map<any, Set<number>>;
    awareness: any;
    whenInitialized: Promise<void>;
  }

  export function setupWSConnection(
    conn: WebSocket,
    req: IncomingMessage,
    options: { docName?: string; gc?: boolean }
  ): void;

  export function getYDoc(docname: string, gc?: boolean): WSSharedDoc;
}