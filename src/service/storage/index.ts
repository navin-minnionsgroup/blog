import { ImageKitStorage } from "./imagekit.storage";

export const storage = new ImageKitStorage();

const result = await storage.upload(
  fileBuffer,
  "my-image.jpg",
  "image/jpeg"
);