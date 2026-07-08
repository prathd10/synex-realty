import { upload } from '@imagekit/javascript';

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

async function getAuthParams() {
  const res = await fetch('/api/imagekit-auth');
  if (!res.ok) throw new Error('Could not get upload authentication from the server.');
  return res.json();
}

export async function uploadFile(file, { folder = '/synex-realty', onProgress } = {}) {
  const { token, expire, signature } = await getAuthParams();
  const response = await upload({
    file,
    fileName: file.name,
    token,
    expire,
    signature,
    publicKey,
    folder,
    onProgress,
  });
  return response.url;
}

export async function uploadFiles(files, options) {
  return Promise.all(Array.from(files).map((file) => uploadFile(file, options)));
}
