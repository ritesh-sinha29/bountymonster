"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

/**
 * Deletes a file from UploadThing storage.
 * @param fileKey The unique key of the file to delete.
 */
export async function deleteUploadThingFile(fileKey: string) {
  try {
    if (!fileKey) return { success: false, error: "No file key provided" };
    
    await utapi.deleteFiles(fileKey);
    return { success: true };
  } catch (error) {
    console.error("Failed to delete file from UploadThing:", error);
    return { success: false, error: "Failed to delete file" };
  }
}
