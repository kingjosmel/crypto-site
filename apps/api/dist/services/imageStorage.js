import { randomUUID } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const contentTypes = ["image/jpeg", "image/png", "image/webp"];
export class S3ImageStorage {
    bucket;
    publicBaseUrl;
    client;
    constructor(bucket, publicBaseUrl, client) {
        this.bucket = bucket;
        this.publicBaseUrl = publicBaseUrl;
        this.client = client ?? new S3Client({
            region: process.env.S3_REGION ?? "us-east-1",
            endpoint: process.env.S3_ENDPOINT,
            forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
            credentials: process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY ? { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY } : undefined
        });
    }
    async createUpload(contentType, fileName) {
        const extension = fileName.toLowerCase().split(".").pop() ?? "bin";
        const key = `catalog/${randomUUID()}.${extension}`;
        const command = new PutObjectCommand({ Bucket: this.bucket, Key: key, ContentType: contentType });
        const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 600 });
        return { key, uploadUrl, publicUrl: `${this.publicBaseUrl.replace(/\/$/, "")}/${key}` };
    }
}
export function isImageContentType(value) {
    return contentTypes.includes(value);
}
