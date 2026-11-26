export type AttendanceStatus =
    | "present"
    | "absent"
    | "late"
    | "excused";

export interface IAttendance {
    id: number;
    student_id: number;
    class_id: number;
    attendance_date: string;
    status: AttendanceStatus;
    created_at: Date;
    updated_at: Date;
}

export interface ICreateAttendance {
    student_id: number;
    class_id: number;
    attendance_date: string;
    status: AttendanceStatus;
}

export interface IUpdateAttendance {
    attendance_date?: string | undefined;
    status?: AttendanceStatus | undefined;
}