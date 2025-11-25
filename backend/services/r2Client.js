import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_BASE_URL,
  R2_POSTER_FOLDER
} = process.env;

const POSTER_FOLDER = (R2_POSTER_FOLDER || 'PosterPhotos').replace(/^\//, '').replace(/\/$/, '');

// R2 faollashtirilganligini tekshirish
export const isR2Configured = Boolean(
  R2_ACCOUNT_ID &&
  R2_ACCESS_KEY_ID &&
  R2_SECRET_ACCESS_KEY &&
  R2_BUCKET_NAME
);

if (isR2Configured) {
  console.log(`✅ Cloudflare R2: enabled (bucket: ${R2_BUCKET_NAME}, folder: ${POSTER_FOLDER})`);
} else {
  console.warn('⚠️ Cloudflare R2 konfiguratsiyasi to‘liq emas. Posterlar MongoDB’da saqlanadi.');
}

let s3Client = null;

const getS3Client = () => {
  if (!isR2Configured) {
    return null;
  }

  if (!s3Client) {
    s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
      }
    });
  }

  return s3Client;
};

const getExtensionFromMime = (mime) => {
  if (!mime) return '';
  const map = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };
  return map[mime] || '';
};

const buildPublicUrl = (key) => {
  if (R2_PUBLIC_BASE_URL) {
    return `${R2_PUBLIC_BASE_URL.replace(/\/$/, '')}/${key.replace(/^\//, '')}`;
  }
  return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;
};

export const uploadPosterToR2 = async (movieId, buffer, contentType = 'image/jpeg') => {
  if (!isR2Configured || !buffer || !movieId) {
    return null;
  }

  const client = getS3Client();
  if (!client) {
    return null;
  }

  const extension = getExtensionFromMime(contentType);
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
  const key = `${POSTER_FOLDER}/${movieId}/${uniqueSuffix}${extension ? '.' + extension : ''}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType
  });

  await client.send(command);

  return {
    key,
    url: buildPublicUrl(key)
  };
};

