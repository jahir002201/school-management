export interface IResult {
    id: number;
    exam_id: number;
    student_id: number;
    marks_obtained: number;
    grade: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateResult {
    exam_id: number;
    student_id: number;
    marks_obtained: number;
    grade?: string | null | undefined;
}

export interface IUpdateResult {
    marks_obtained?: number | undefined;
    grade?: string | null | undefined;
}