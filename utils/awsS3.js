// const {
//   S3Client,
//   PutObjectCommand,
//   DeleteObjectCommand,
// } = require('@aws-sdk/client-s3');
// const multer = require('multer');
// const sharp = require('sharp');

// // Create an S3 client
// const s3 = new S3Client({
//   region: process.env.S3_BUCKET_REGION,
//   credentials: {
//     accessKeyId: process.env.S3_ACCESS_KEY,
//     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   },
// });

// // Configure Multer for file upload handling
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Upload file to S3 (Generalized for both profile pictures and resumes)
// const uploadFileToS3 = async (file, folderName) => {
//   const fileName = `${Date.now()}_${file.originalname}`;
//   const params = {
//     Bucket: 'hyvadata',
//     Key: `${folderName}${fileName}`,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//     ACL: 'public-read',
//   };

//   try {
//     const command = new PutObjectCommand(params);
//     await s3.send(command);
//     return `https://hyvadata.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${folderName}${fileName}`;
//   } catch (error) {
//     console.error('Error uploading file to S3:', error);
//     throw new Error('S3 Upload Failed');
//   }
// };

// // Function to delete file from S3
// const deleteFileFromS3 = async (fileUrl, folderName) => {
//   const fileName = fileUrl.split('/').pop(); // Extract file name from the URL

//   const params = {
//     Bucket: 'hyvadata',
//     Key: `${folderName}${fileName}`, // Full path in the bucket
//   };

//   try {
//     await s3.send(new DeleteObjectCommand(params)); // Use DeleteObjectCommand to delete the file
//     console.log(`Successfully deleted file: ${fileName}`);
//   } catch (error) {
//     console.error('Error deleting file from S3:', error);
//     throw new Error(`Failed to delete file from folder: ${folderName}`);
//   }
// };

// // Function to process and upload image in different sizes
// const processAndUploadImage = async (file, folderName, fullName) => {
//   try {
//     const baseFolder = `${folderName}${fullName}/`;
//     const sizes = [
//       { name: 'original', dimensions: null },
//       { name: 'thumbnail', dimensions: { width: 50, height: 50 } },
//       { name: 'small', dimensions: { width: 150, height: 150 } },
//       { name: 'medium', dimensions: { width: 300, height: 300 } },
//       { name: 'large', dimensions: { width: 600, height: 600 } },
//     ];

//     const uploadPromises = sizes.map(async (size) => {
//       const folderPath = `${baseFolder}${size.name}/`;
//       const fileName = `${file.originalname}`;

//       // Resize the image if dimensions are specified
//       const buffer =
//         size.dimensions !== null
//           ? await sharp(file.buffer).resize(size.dimensions).toBuffer()
//           : file.buffer;

//       // Upload to S3
//       const params = {
//         Bucket: 'hyvadata',
//         Key: `${folderPath}${fileName}`,
//         Body: buffer,
//         ContentType: file.mimetype,
//         ACL: 'public-read',
//       };
//       const command = new PutObjectCommand(params);
//       await s3.send(command);

//       return `https://hyvadata.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${folderPath}${fileName}`;
//     });

//     // Resolve all upload promises and return URLs
//     const urls = await Promise.all(uploadPromises);
//     return urls;
//   } catch (error) {
//     console.error('Error processing and uploading images:', error);
//     throw new Error('Image processing or upload failed');
//   }
// };

// module.exports = {
//   upload,
//   uploadFileToS3,
//   deleteFileFromS3,
//   processAndUploadImage,
// };








const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
const path = require('path');

// ======================================================
// SUPABASE CONFIG
// ======================================================

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const bucketName =
  process.env.SUPABASE_STORAGE_BUCKET ||
  process.env.SUPABASE_BUCKET ||
  'hyi-files';

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL is missing in .env');
}

if (!supabaseKey) {
  throw new Error(
    'SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY is missing in .env'
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);


// ======================================================
// MULTER CONFIG
// ======================================================

// Keep uploaded files in memory.
// Existing controller expects file.buffer.
const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',

      // Resume / documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          'Only JPG, JPEG, PNG, WEBP, PDF, DOC and DOCX files are allowed'
        )
      );
    }

    cb(null, true);
  },
});


// ======================================================
// HELPERS
// ======================================================

const cleanFolderName = (folderName = '') => {
  return folderName
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
};


const sanitizeFileName = (fileName = '') => {
  const extension = path.extname(fileName);

  const baseName = path
    .basename(fileName, extension)
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-');

  return `${baseName}${extension}`;
};


const generateUniqueFileName = (originalName) => {
  const safeName = sanitizeFileName(originalName);

  return `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
};


// ======================================================
// PUBLIC URL
// ======================================================

const getPublicUrl = (filePath) => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return data?.publicUrl || null;
};


// ======================================================
// UPLOAD NORMAL FILE
// ======================================================

// Keep old function name so controllers don't break.
const uploadFileToS3 = async (
  file,
  folderName = 'uploads/'
) => {
  try {
    if (!file) {
      throw new Error('File is required');
    }

    if (!file.buffer) {
      throw new Error(
        'File buffer missing. Multer memoryStorage is required.'
      );
    }

    const cleanFolder =
      cleanFolderName(folderName);

    const fileName =
      generateUniqueFileName(file.originalname);

    const filePath = cleanFolder
      ? `${cleanFolder}/${fileName}`
      : fileName;

    const { data, error } =
      await supabase.storage
        .from(bucketName)
        .upload(
          filePath,
          file.buffer,
          {
            contentType:
              file.mimetype ||
              'application/octet-stream',

            cacheControl: '3600',

            // unique filename means no overwrite required
            upsert: false,
          }
        );

    if (error) {
      console.error(
        'Supabase Storage upload error:',
        error
      );

      throw error;
    }

    const publicUrl =
      getPublicUrl(data.path);

    if (!publicUrl) {
      throw new Error(
        'Unable to generate Supabase public URL'
      );
    }

    console.log(
      '✅ Supabase upload successful:',
      publicUrl
    );

    return publicUrl;

  } catch (error) {
    console.error(
      '❌ Error uploading file to Supabase:',
      error
    );

    throw new Error(
      `Supabase Upload Failed: ${
        error?.message || 'Unknown error'
      }`
    );
  }
};


// ======================================================
// IMAGE PROCESSING + MULTIPLE SIZES
// ======================================================

// Same behavior as your old AWS implementation:
// [
//   original,
//   thumbnail,
//   small,
//   medium,
//   large
// ]
//
// This is important because your controller uses:
// profilePictureUrls?.[0]

const processAndUploadImage = async (
  file,
  folderName = 'jobseeker-profile/',
  fullName = 'user'
) => {
  try {
    if (!file) {
      return [];
    }

    if (!file.buffer) {
      throw new Error('Image buffer missing');
    }

    const cleanFolder =
      cleanFolderName(folderName);

    // Don't allow unsafe chars in folder name.
    const safeFullName = String(
      fullName || 'user'
    )
      .trim()
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-');

    const uniqueId =
      crypto.randomUUID();

    const extension =
      path.extname(file.originalname) ||
      '.jpg';

    const originalBaseName =
      path.basename(
        file.originalname,
        extension
      );

    const safeBaseName =
      originalBaseName
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .replace(/-+/g, '-');

    const finalFileName =
      `${Date.now()}-${uniqueId}-${safeBaseName}${extension}`;

    const baseFolder =
      `${cleanFolder}/${safeFullName}`;

    const sizes = [
      {
        name: 'original',
        dimensions: null,
      },
      {
        name: 'thumbnail',
        dimensions: {
          width: 50,
          height: 50,
        },
      },
      {
        name: 'small',
        dimensions: {
          width: 150,
          height: 150,
        },
      },
      {
        name: 'medium',
        dimensions: {
          width: 300,
          height: 300,
        },
      },
      {
        name: 'large',
        dimensions: {
          width: 600,
          height: 600,
        },
      },
    ];

    const uploadPromises =
      sizes.map(async size => {
        let buffer;

        if (size.dimensions) {
          buffer = await sharp(
            file.buffer
          )
            .resize({
              width:
                size.dimensions.width,

              height:
                size.dimensions.height,

              fit: 'cover',

              position: 'centre',

              withoutEnlargement: true,
            })
            .toBuffer();
        } else {
          buffer = file.buffer;
        }

        const storagePath =
          `${baseFolder}/${size.name}/${finalFileName}`;

        const { data, error } =
          await supabase.storage
            .from(bucketName)
            .upload(
              storagePath,
              buffer,
              {
                contentType:
                  file.mimetype ||
                  'image/jpeg',

                cacheControl:
                  '3600',

                upsert: false,
              }
            );

        if (error) {
          console.error(
            `Supabase ${size.name} upload error:`,
            error
          );

          throw error;
        }

        const publicUrl =
          getPublicUrl(data.path);

        if (!publicUrl) {
          throw new Error(
            `Unable to create URL for ${size.name}`
          );
        }

        return publicUrl;
      });

    const urls =
      await Promise.all(
        uploadPromises
      );

    console.log(
      '✅ Supabase image variants uploaded:',
      urls
    );

    return urls;

  } catch (error) {
    console.error(
      '❌ Error processing/uploading image:',
      error
    );

    throw new Error(
      `Image processing or upload failed: ${
        error?.message ||
        'Unknown error'
      }`
    );
  }
};


// ======================================================
// GET SUPABASE PATH FROM PUBLIC URL
// ======================================================

const getStoragePathFromUrl = (
  fileUrl
) => {
  try {
    if (!fileUrl) {
      return null;
    }

    const marker =
      `/storage/v1/object/public/${bucketName}/`;

    const index =
      fileUrl.indexOf(marker);

    if (index === -1) {
      return null;
    }

    let storagePath =
      fileUrl.substring(
        index + marker.length
      );

    // Remove query params if present.
    storagePath =
      storagePath.split('?')[0];

    return decodeURIComponent(
      storagePath
    );

  } catch (error) {
    console.error(
      'Unable to parse Supabase URL:',
      error
    );

    return null;
  }
};


// ======================================================
// DELETE FILE
// ======================================================

// Same old function name to avoid changing controller imports.
const deleteFileFromS3 = async (
  fileUrl,
  folderName = ''
) => {
  try {
    if (!fileUrl) {
      return;
    }

    const storagePath =
      getStoragePathFromUrl(
        fileUrl
      );

    /*
     * This may happen if MongoDB still contains
     * an old AWS S3 URL.
     *
     * Don't crash profile update because of that.
     */
    if (!storagePath) {
      console.warn(
        '⚠️ URL is not a Supabase Storage URL. Delete skipped:',
        fileUrl
      );

      return;
    }

    const { data, error } =
      await supabase.storage
        .from(bucketName)
        .remove([
          storagePath,
        ]);

    if (error) {
      console.error(
        'Supabase delete error:',
        error
      );

      throw error;
    }

    console.log(
      '✅ Successfully deleted Supabase file:',
      storagePath
    );

    return data;

  } catch (error) {
    console.error(
      '❌ Error deleting Supabase file:',
      error
    );

    throw new Error(
      `Supabase Delete Failed: ${
        error?.message ||
        'Unknown error'
      }`
    );
  }
};


// ======================================================
// OPTIONAL DELETE MULTIPLE IMAGE VARIANTS
// ======================================================

const deleteImageVariants = async (
  urls = []
) => {
  try {
    if (!Array.isArray(urls)) {
      return;
    }

    const paths = urls
      .map(url =>
        getStoragePathFromUrl(url)
      )
      .filter(Boolean);

    if (!paths.length) {
      return;
    }

    const { error } =
      await supabase.storage
        .from(bucketName)
        .remove(paths);

    if (error) {
      throw error;
    }

    console.log(
      '✅ Supabase image variants deleted'
    );

  } catch (error) {
    console.error(
      '❌ Error deleting image variants:',
      error
    );

    throw error;
  }
};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  upload,

  // Old function names preserved
  uploadFileToS3,
  deleteFileFromS3,
  processAndUploadImage,

  // Additional helpers
  deleteImageVariants,
  getStoragePathFromUrl,

  supabase,
};