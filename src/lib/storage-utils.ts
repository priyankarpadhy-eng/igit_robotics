import { s3Client, B2_BUCKET } from "./b2-client";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadFile = async (file: File, path: string) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const body = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: B2_BUCKET,
      Key: path,
      Body: body,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Construct the public URL (B2 public URLs typically follow a specific pattern)
    // Or use the s3 endpoint if it's public
    const publicUrl = `${process.env.B2_ENDPOINT}/${B2_BUCKET}/${path}`;
    
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file to B2:", error);
    throw error;
  }
};

export const getDownloadUrl = async (path: string, expiresIn: number = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: B2_BUCKET,
      Key: path,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error("Error getting download URL from B2:", error);
    throw error;
  }
};
