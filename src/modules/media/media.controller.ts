import { Request, Response } from "express";
import ImageKit from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

export async function getUploadAuthController(
  req: Request,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const authParams =
    imagekit.helper.getAuthenticationParameters();

  return res.json({
    ...authParams,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
}