export interface IExam {
    id: number;
    class_id: number;
    subject_id: number;
    title: string;
    exam_date: string;
    total_marks: number;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateExam {
    class_id: number;
    subject_id: number;
    title: string;
    exam_date: string;
    total_marks: number;
}

export interface IUpdateExam {
    class_id?: number | undefined;
    subject_id?: number | undefined;
    title?: string | undefined;
    exam_date?: string | undefined;
    total_marks?: number | undefined;
}