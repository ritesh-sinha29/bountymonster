import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

// This middleware runs on your server before allow-listing the upload
const handleAuth = async () => {
  console.log("UploadThing handleAuth called");
  try {
    const { userId } = await auth();
    console.log("UploadThing auth result:", { userId });
    if (!userId) {
      console.error("UploadThing: Unauthorized - No userId found");
      throw new UploadThingError("Unauthorized");
    }
    return { userId };
  } catch (error) {
    console.error("UploadThing auth error:", error);
    throw new UploadThingError("Internal Server Error during auth");
  }
};


export const ourFileRouter = {
  // Bounty cover image (1 file, max 4MB)
  bountyImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),

  // Quest submission proof (max 2 images, max 4MB each)
  submissionProof: f({ 
    image: { maxFileSize: "4MB", maxFileCount: 2 } 
  })

    .middleware(() => handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Proof upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

