export interface Profile {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}