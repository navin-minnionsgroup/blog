import ImageKit from "@imagekit/nodejs";

import {
  StorageProvider,
  UploadResult,
} from "./storage.interface";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

export class ImageKitStorage implements StorageProvider {
  async upload(
    file: Buffer,
    fileName: string,
    mimeType?: string
  ): Promise<UploadResult> {
    const result = await imagekit.files.upload({
      file,
      fileName,
    });

    return {
      url: result.url!,
      key: result.filePath!,
      fileId: result.fileId!,
      mimeType,
      size: file.length,
    };
  }

  async delete(key: string): Promise<void> {
    // We'll implement this after upload is working.
    console.log("Delete:", key);
  }
}