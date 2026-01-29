import { serve } from "bun";
import index from "./index.html";

const server = serve({
  // Port spécifique pour le frontend patient
  port: 3001,

  async fetch(req) {
    const url = new URL(req.url);

    // API endpoints
    if (url.pathname.startsWith("/api/hello")) {
      if (req.method === "GET") {
        return Response.json({ message: "Hello, world!" });
      }
    }

    // Try to serve static files first
    let filePath = url.pathname;
    if (filePath.endsWith("/")) filePath += "index.html";

    try {
      const file = Bun.file(filePath.slice(1)); // remove leading slash
      if (await file.exists()) return new Response(file);

      // If file not found and it's a navigation request (not JS/CSS/Image), serve index.html
      /* 
         We assume that if the path doesn't look like a file extension, it's a route.
         Or more simply, if we accept text/html.
      */
      if (!filePath.match(/\.[^/]+$/)) {
        return new Response(Bun.file("index.html"));
      }

      return new Response("Not Found", { status: 404 });
    } catch (e) {
      return new Response("Internal Server Error", { status: 500 });
    }
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`Listening on http://localhost:${server.port}`);
