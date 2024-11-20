import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import session, { SessionData } from 'express-session';
import  routes  from './routes';
import { createWebSocketServer } from './websocket';

declare module 'express-session' {
  interface SessionData {
    accesslevel: number;
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.set("trust proxy", 1);

//
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }));


app.use(session({
  secret: 'your-secret-key', // Replace with your secret key
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 10 // Session expiration time in milliseconds
  }
}));


app.use(cors());
app.disable("x-powered-by");

routes.forEach((route) => {
  app.use(
    "/rest/api" + route.path,
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const userLevel = req.session?.accesslevel ? req.session.accesslevel : 0;
      if (route.accesslevel.some((x) => x === userLevel || userLevel > x)) {
        next();
      } else {
        return res.status(403).send(`Forbidden`);
      }
    },
    route.controller
  );
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// WebSocket server
createWebSocketServer(server);
