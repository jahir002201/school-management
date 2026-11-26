export interface IEnrollment {
    id: number;
    student_id: number;
    class_id: number;
    created_at: Date;
}

// Create Enrollment
export interface ICreateEnrollment {
    student_id: number;
    class_id: number;
}

// Update Enrollment
export interface IUpdateEnrollment {
    class_id?: number | undefined;
}