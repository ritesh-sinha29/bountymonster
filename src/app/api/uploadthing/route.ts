import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Export routes for Next.js app router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
