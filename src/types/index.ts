export const USER_ROLES = [
    "admin",
    "teacher",
    "student"
] as const;

export type Role = (typeof USER_ROLES)[number];

export interface AuthUser {
    id: number;
    email: string;
    role: Role;
}