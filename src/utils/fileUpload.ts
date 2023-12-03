import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import QRCode from "qrcode";
import { config } from "./config";

const s3Client = new S3Client({
  endpoint: config.spaceEndpoint,
  region: "sgp1",
  credentials: {
    accessKeyId: config.spaceAccessKeyId,
    secretAccessKey: config.spaceSecretAccessKey,
  },
});

export const fileUpload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "msquarefdc",
    acl: "public-read",
    key: (request, file, cb) => {
      cb(null, `foodie-pos/kyaw-zin-thet/${Date.now()}_${file.originalname}`);
    },
  }),
}).array("files", 1);

export const generateLinkForQRCode = (tableId: number) => {
  return `${config.orderAppUrl}?tableId=${tableId}`;
};

export const getQrCodeUrl = (tableId: number) => {
  return `https://msquarefdc.sgp1.cdn.digitaloceanspaces.com/foodie-pos/msquarefdc/qrcode/tableId-${tableId}.png`;
};

export const qrCodeImageUpload = async (tableId: number) => {
  try {
    const qrImageData = await QRCode.toDataURL(generateLinkForQRCode(tableId), {
      scale: 20,
    });
    const input = {
      Bucket: "msquarefdc",
      Key: `foodie-pos/msquarefdc/qrcode/tableId-${tableId}.png`,
      ACL: "public-read",
      Body: Buffer.from(
        qrImageData.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      ),
    };
    // @ts-ignore
    const command = new PutObjectCommand(input);
    await s3Client.send(command);
  } catch (err) {
    console.log(err);
  }
};

export const deleteOldMenuImage = async (assetUrl: string) => {
  try {
    const input = {
      Bucket: "msquarefdc",
      Key: assetUrl.split(".com/")[1],
    };
    const command = new DeleteObjectCommand(input);
    await s3Client.send(command);
  } catch (err) {
    console.error(err);
  }
};
