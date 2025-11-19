import { VALIDATION_PATTERNS, VALIDATION_RULES, ERROR_MESSAGES, FILE_UPLOAD } from '@/constants';

/**
 * Validates an email address
 */
export function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return ERROR_MESSAGES.EMAIL_REQUIRED;
  }
  if (!VALIDATION_PATTERNS.EMAIL.test(email)) {
    return ERROR_MESSAGES.EMAIL_INVALID;
  }
  return undefined;
}

/**
 * Validates a phone number (digits only)
 */
export function validatePhone(phone: string): string | undefined {
  if (!phone.trim()) {
    return ERROR_MESSAGES.PHONE_REQUIRED;
  }
  if (!VALIDATION_PATTERNS.PHONE.test(phone)) {
    return ERROR_MESSAGES.PHONE_INVALID;
  }
  return undefined;
}

/**
 * Validates a name
 */
export function validateName(name: string): string | undefined {
  if (!name.trim()) {
    return ERROR_MESSAGES.NAME_REQUIRED;
  }
  if (name.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return ERROR_MESSAGES.NAME_MIN_LENGTH;
  }
  return undefined;
}

/**
 * Validates a password
 */
export function validatePassword(password: string): string | undefined {
  if (!password) {
    return ERROR_MESSAGES.PASSWORD_REQUIRED;
  }
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_MIN_LENGTH;
  }
  return undefined;
}

/**
 * Validates password confirmation
 */
export function validatePasswordConfirmation(password: string, confirmPassword: string): string | undefined {
  if (!confirmPassword) {
    return ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
  }
  if (password !== confirmPassword) {
    return ERROR_MESSAGES.PASSWORD_MISMATCH;
  }
  return undefined;
}

/**
 * Validates file size
 */
export function validateFileSize(file: File, maxSize: number = FILE_UPLOAD.MAX_SIZE): string | undefined {
  if (file.size > maxSize) {
    return ERROR_MESSAGES.FILE_TOO_LARGE;
  }
  return undefined;
}

/**
 * Validates file type
 */
export function validateFileType(file: File, allowedTypes: readonly string[] = FILE_UPLOAD.ALLOWED_TYPES): string | undefined {
  if (!file.type.startsWith('image/')) {
    return ERROR_MESSAGES.FILE_INVALID_TYPE;
  }
  return undefined;
}
