export type UploadResult = {
  url: string;
  key: string;
  fileId: string;
  mimeType?: string;
  size?: number;
};

export interface StorageProvider {
  upload(
    file: Buffer,
    fileName: string,
    mimeType?: string
  ): Promise<UploadResult>;

  delete(key: string): Promise<void>;
}