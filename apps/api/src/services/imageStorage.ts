import { randomUUID } from "node:crypto";

const contentTypes = ["image/jpeg", "image/png", "image/webp"] as const;
type ImageContentType = typeof contentTypes[number];

export type ImageStorage = {
  createUpload(contentType: ImageContentType, fileName: string): Promise<{ key: string; uploadUrl: string; publicUrl: string }>;
};

// Clean local/direct image storage without AWS S3 dependencies
export class LocalImageStorage implements ImageStorage {
  constructor(private readonly publicBaseUrl: string = "/images") {}

  async createUpload(contentType: ImageContentType, fileName: string) {
    const extension = fileName.toLowerCase().split(".").pop() ?? "jpg";
    const key = `catalog/${randomUUID()}.${extension}`;
    return {
      key,
      uploadUrl: `/api/uploads/${key}`,
      publicUrl: `${this.publicBaseUrl.replace(/\/$/, "")}/${key}`
    };
  }
}

export function isImageContentType(value: string): value is ImageContentType {
  return (contentTypes as readonly string[]).includes(value);
}
