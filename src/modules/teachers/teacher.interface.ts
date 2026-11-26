export interface ITeacher {
    id: number;
    user_id: number;
    employee_no: string;
    qualification: string | null;
    hire_date: string | null;
    created_at: Date;
    updated_at: Date;
}

// Create Teacher
export interface ICreateTeacher {
    user_id: number;
    employee_no: string;
    qualification?: string | null | undefined;
    hire_date?: string | null | undefined;
}

// Update Teacher
export interface IUpdateTeacher {
    employee_no?: string | undefined;
    qualification?: string | null | undefined;
    hire_date?: string | null | undefined;
}