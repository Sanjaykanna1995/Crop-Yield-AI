// backend/src/dto/user.dto.ts

export interface UpdateProfileDto {
  name: string;
  email: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

/* ============================= */
/* Validation Utilities */
/* ============================= */

export const validateUpdateProfile = (data: UpdateProfileDto) => {
  if (!data.name || data.name.trim().length < 3) {
    throw new Error("Name must be at least 3 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    throw new Error("Invalid email format");
  }
};

export const validateChangePassword = (data: ChangePasswordDto) => {
  if (!data.oldPassword) {
    throw new Error("Old password is required");
  }

  if (!data.newPassword || data.newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters");
  }

  if (data.oldPassword === data.newPassword) {
    throw new Error("New password must be different from old password");
  }
};