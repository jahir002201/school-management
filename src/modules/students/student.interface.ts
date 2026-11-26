export interface IStudent {
    id: number;
    user_id: number;
    admission_no: string;
    date_of_birth: string | null;
    guardian_name: string | null;
    guardian_phone: string | null;
    created_at: Date;
    updated_at: Date;
}

// Create Student
export interface ICreateStudent {
    user_id: number;
    admission_no: string;
    date_of_birth?: string | null | undefined;
    guardian_name?: string | null | undefined;
    guardian_phone?: string | null | undefined;
}

// Update Student
export interface IUpdateStudent {
    admission_no?: string | undefined;
    date_of_birth?: string | null | undefined;
    guardian_name?: string | null | undefined;
    guardian_phone?: string | null | undefined;
}