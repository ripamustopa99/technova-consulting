import { v2 as cloudinary } from 'cloudinary';

// Inisialisasi Cloudinary SDK menggunakan environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET,
});

/**
 * Mengambil public_id dari URL gambar Cloudinary
 * Contoh URL: https://res.cloudinary.com/cloudname/image/upload/v12345678/folder/image_name.jpg
 * Hasil extract: folder/image_name
 */
export function extractPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    const parts = url.split('/image/upload/');
    if (parts.length < 2) return null;

    const rightPart = parts[1];
    
    // Hapus version prefix jika ada (contoh: v1672531199/)
    const pathWithoutVersion = rightPart.replace(/^v\d+\//, '');

    // Hapus ekstensi file di bagian akhir (.png, .jpg, dll.)
    const lastDotIndex = pathWithoutVersion.lastIndexOf('.');
    if (lastDotIndex === -1) return pathWithoutVersion;

    return pathWithoutVersion.substring(0, lastDotIndex);
  } catch (error) {
    console.error('Gagal mengekstrak public_id dari URL Cloudinary:', error);
    return null;
  }
}

/**
 * Menghapus file fisik di Cloudinary berdasarkan public_id
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Gagal menghapus file dari Cloudinary:', error);
    return false;
  }
}

export { cloudinary };
