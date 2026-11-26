export interface IProfile {
    id: number;
    user_id: number;
    phone: string | null;
    address: string | null;
    avatar: string | null;
    created_at: Date;
    updated_at: Date;
}

// Update Profile
export interface IUpdateProfile {
    phone?: string | null | undefined;
    address?: string | null | undefined;
    avatar?: string | null | undefined;
}

// Change Password
export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
}