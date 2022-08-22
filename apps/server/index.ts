import ws from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import fetch from "node-fetch";

import { appRouter, createContext } from "nano-chat";

if (!global.fetch) {
  (global.fetch as any) = fetch;
}

const wss = new ws.Server({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createContext as any,
});

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log("✅ WebSocket Server listening on ws://localhost:3001");

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
