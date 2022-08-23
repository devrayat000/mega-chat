import fetch from "node-fetch";

if (!global.fetch) {
  (global.fetch as any) = fetch;
}
