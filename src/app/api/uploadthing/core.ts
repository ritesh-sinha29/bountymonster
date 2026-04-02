import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// This middleware runs on your server before allow-listing the upload
const handleAuth = () => {
  // Replace this with real auth logic (Clerk, etc.)
  // const user = await currentUser();
  // if (!user) throw new UploadThingError("Unauthorized");
  // return { userId: user.id };
  return { userId: "test_user" }; 
};

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  bountyImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
