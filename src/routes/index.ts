import express from "express";

import test from "../controllers/test";

const router = express.Router();

export type TRoute = {
  path: string;
  accesslevel: number[];
  controller: typeof router;
};

const routes: TRoute[] = [
  {
    path: "/health",
    accesslevel: [0],
    controller: test,
  },
  {
    path: "/sync",
    accesslevel: [0],
    controller: test,
  }
]

export default routes;