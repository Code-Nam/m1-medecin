import { serve } from "bun";
import index from "./index.html";

const server = serve({
  // Port différent pour éviter les conflits (patient/front)
  port: 3002,
  routes: {
    "/": index,
    "/src/frontend.tsx": Bun.file("./src/frontend.tsx"),
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,

    console: true,
  },
});
