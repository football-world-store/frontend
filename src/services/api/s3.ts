import axios from "axios";

import { HTTP_HEADER, REQUEST_TIMEOUT_MS } from "@/constants";

const s3Client = axios.create({
  timeout: REQUEST_TIMEOUT_MS,
});

export const s3PutObject = async (
  uploadUrl: string,
  file: File,
): Promise<void> => {
  await s3Client.put(uploadUrl, file, {
    headers: { [HTTP_HEADER.contentType]: file.type },
  });
};
