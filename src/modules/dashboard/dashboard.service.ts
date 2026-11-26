import pool from "../../db/index.js";

// Get Dashboard Statistics
const getDashboardStats = async () => {
    const result = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM users WHERE is_active = TRUE) AS "totalUsers",

            (SELECT COUNT(*) FROM students) AS "totalStudents",

            (SELECT COUNT(*) FROM teachers) AS "totalTeachers",

            (SELECT COUNT(*) FROM classes) AS "totalClasses",

            (SELECT COUNT(*) FROM subjects) AS "totalSubjects",

            (SELECT COUNT(*) FROM enrollments) AS "totalEnrollments",

            (SELECT COUNT(*) FROM exams) AS "totalExams",

            (SELECT COUNT(*) FROM results) AS "totalResults"
    `);

    const data = result.rows[0];

    return {
        totalUsers: Number(data.totalUsers),
        totalStudents: Number(data.totalStudents),
        totalTeachers: Number(data.totalTeachers),
        totalClasses: Number(data.totalClasses),
        totalSubjects: Number(data.totalSubjects),
        totalEnrollments: Number(data.totalEnrollments),
        totalExams: Number(data.totalExams),
        totalResults: Number(data.totalResults)
    };
};

// Get Today's Attendance Summary
const getTodayAttendance = async () => {
    const result = await pool.query(`
        SELECT
            COUNT(*) FILTER (
                WHERE status = 'present'
            ) AS present,

            COUNT(*) FILTER (
                WHERE status = 'absent'
            ) AS absent,

            COUNT(*) FILTER (
                WHERE status = 'late'
            ) AS late,

            COUNT(*) FILTER (
                WHERE status = 'excused'
            ) AS excused,

            COUNT(*) AS total

        FROM attendance
        WHERE attendance_date = CURRENT_DATE
    `);

    const data = result.rows[0];

    return {
        present: Number(data.present),
        absent: Number(data.absent),
        late: Number(data.late),
        excused: Number(data.excused),
        total: Number(data.total)
    };
};

// Get Recent Students
const getRecentStudents = async () => {
    const result = await pool.query(`
        SELECT
            s.id,
            u.name,
            u.email,
            s.admission_no,
            s.created_at

        FROM students s

        JOIN users u
            ON s.user_id = u.id

        ORDER BY s.id DESC

        LIMIT 5
    `);

    return result.rows;
};

// Get Recent Teachers
const getRecentTeachers = async () => {
    const result = await pool.query(`
        SELECT
            t.id,
            u.name,
            u.email,
            t.employee_no,
            t.created_at

        FROM teachers t

        JOIN users u
            ON t.user_id = u.id

        ORDER BY t.id DESC

        LIMIT 5
    `);

    return result.rows;
};

// Get Recent Exams
const getRecentExams = async () => {
    const result = await pool.query(`
        SELECT
            e.id,
            e.title,
            e.exam_date,
            e.total_marks,
            c.name AS class_name,
            s.name AS subject_name

        FROM exams e

        JOIN classes c
            ON e.class_id = c.id

        JOIN subjects s
            ON e.subject_id = s.id

        ORDER BY e.id DESC

        LIMIT 5
    `);

    return result.rows;
};

// Get Recent Results
const getRecentResults = async () => {
    const result = await pool.query(`
        SELECT
            r.id,
            u.name AS student_name,
            e.title AS exam_title,
            r.marks_obtained,
            e.total_marks,
            r.grade

        FROM results r

        JOIN students s
            ON r.student_id = s.id

        JOIN users u
            ON s.user_id = u.id

        JOIN exams e
            ON r.exam_id = e.id

        ORDER BY r.id DESC

        LIMIT 5
    `);

    return result.rows;
};

// Get Complete Dashboard Data
const getDashboardData = async () => {
    const [
        stats,
        attendance,
        recentStudents,
        recentTeachers,
        recentExams,
        recentResults
    ] = await Promise.all([
        getDashboardStats(),
        getTodayAttendance(),
        getRecentStudents(),
        getRecentTeachers(),
        getRecentExams(),
        getRecentResults()
    ]);

    return {
        stats,
        attendance,
        recentStudents,
        recentTeachers,
        recentExams,
        recentResults
    };
};

// Export Dashboard Service
export const dashboardService = {
    getDashboardData
};