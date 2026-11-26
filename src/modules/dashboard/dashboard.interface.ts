export interface IDashboardStats {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalSubjects: number;
    totalEnrollments: number;
    totalExams: number;
    totalResults: number;
}

export interface IAttendanceSummary {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
}

export interface IRecentStudent {
    id: number;
    name: string;
    email: string;
    admission_no: string;
    created_at: Date;
}

export interface IRecentTeacher {
    id: number;
    name: string;
    email: string;
    employee_no: string;
    created_at: Date;
}

export interface IRecentExam {
    id: number;
    title: string;
    exam_date: string;
    total_marks: number;
    class_name: string;
    subject_name: string;
}

export interface IRecentResult {
    id: number;
    student_name: string;
    exam_title: string;
    marks_obtained: number;
    total_marks: number;
    grade: string | null;
}