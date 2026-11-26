export interface IClass {
    id: number;
    name: string;
    section: string;
    academic_year: string;
    teacher_id: number | null;
    created_at: Date;
    updated_at: Date;
}

// Create Class
export interface ICreateClass {
    name: string;
    section: string;
    academic_year: string;
    teacher_id?: number | null | undefined;
}

// Update Class
export interface IUpdateClass {
    name?: string | undefined;
    section?: string | undefined;
    academic_year?: string | undefined;
    teacher_id?: number | null | undefined;
}