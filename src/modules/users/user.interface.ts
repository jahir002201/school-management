export type UserRole = "admin" | "teacher" | "student";

export interface IUser {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface IUpdateUser {
    name?: string | undefined;
    email?: string | undefined;
    role?: UserRole | undefined;
}

export interface IUpdateUserStatus {
    is_active: boolean;
}