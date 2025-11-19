// Application Constants

// Default Location (Jakarta, Indonesia)
export const DEFAULT_LOCATION = {
  latitude: -6.2088,
  longitude: 106.8456
} as const;

// File Upload Configuration
export const FILE_UPLOAD = {
  MAX_SIZE: 1024 * 1024, // 1MB in bytes
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  MAX_SIZE_MB: 1
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  NOMINATIM_REVERSE: 'https://nominatim.openstreetmap.org/reverse'
} as const;

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\d+$/
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 3,
  PASSWORD_MIN_LENGTH: 6
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Name validation
  NAME_REQUIRED: 'Nama wajib diisi',
  NAME_MIN_LENGTH: `Nama minimal ${VALIDATION_RULES.NAME_MIN_LENGTH} karakter`,

  // Email validation
  EMAIL_REQUIRED: 'Email wajib diisi',
  EMAIL_INVALID: 'Format email tidak valid',

  // Phone validation
  PHONE_REQUIRED: 'Telepon wajib diisi',
  PHONE_INVALID: 'Telepon hanya boleh berisi angka',

  // Password validation
  PASSWORD_REQUIRED: 'Password wajib diisi',
  PASSWORD_MIN_LENGTH: `Password minimal ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} karakter`,
  PASSWORD_MISMATCH: 'Password tidak cocok',
  CONFIRM_PASSWORD_REQUIRED: 'Konfirmasi password wajib diisi',

  // File upload validation
  PHOTO_REQUIRED: 'Foto profil wajib diupload',
  FILE_TOO_LARGE: `Ukuran file maksimal ${FILE_UPLOAD.MAX_SIZE_MB}MB`,
  FILE_INVALID_TYPE: 'File harus berupa gambar',

  // Generic errors
  LOAD_CONTACTS_ERROR: 'Gagal memuat kontak'
} as const;
