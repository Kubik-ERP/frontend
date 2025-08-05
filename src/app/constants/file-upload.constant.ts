/**
 * @description File upload constants for consistent file size limits across the application
 */

// File size limits in bytes
export const FILE_UPLOAD_LIMITS = {
  // Image uploads (profile photos, outlet images, etc.)
  IMAGE_MAX_SIZE: 2097152, // 2MB in bytes (2 * 1024 * 1024)

  // Document uploads (if needed in the future)
  DOCUMENT_MAX_SIZE: 5242880, // 5MB in bytes (5 * 1024 * 1024)

  // Video uploads (if needed in the future)
  VIDEO_MAX_SIZE: 52428800, // 50MB in bytes (50 * 1024 * 1024)
} as const;

// File size limits in human-readable format
export const FILE_UPLOAD_LIMITS_DISPLAY = {
  IMAGE_MAX_SIZE_MB: '2MB',
  DOCUMENT_MAX_SIZE_MB: '5MB',
  VIDEO_MAX_SIZE_MB: '50MB',
} as const;

// Accepted file types
export const ACCEPTED_FILE_TYPES = {
  IMAGES: 'image/*',
  IMAGES_SPECIFIC: '.jpg,.jpeg,.png,.gif,.webp',
  DOCUMENTS: '.pdf,.doc,.docx,.txt',
  SPREADSHEETS: '.xls,.xlsx,.csv',
} as const;

/**
 * @description Utility function to convert bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * @description Utility function to validate file size
 */
export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

/**
 * @description Utility function to get file extension
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};
