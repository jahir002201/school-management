import pool from "./index.js";

const migrate = async () => {
    try {

        // 1. Users Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'student'
                    CHECK (role IN ('admin', 'teacher', 'student')),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Profiles Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL
                    REFERENCES users(id) ON DELETE CASCADE,
                phone VARCHAR(20),
                address TEXT,
                avatar TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);


        // Add updated_at column to profiles table if it doesn't exist
        await pool.query(`
            ALTER TABLE profiles
            ADD COLUMN IF NOT EXISTS updated_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        // 3. Students Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL
                    REFERENCES users(id) ON DELETE CASCADE,
                admission_no VARCHAR(50) UNIQUE NOT NULL,
                date_of_birth DATE,
                guardian_name VARCHAR(100),
                guardian_phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Add updated_at column to students table if it doesn't exist
        await pool.query(`
            ALTER TABLE students
            ADD COLUMN IF NOT EXISTS updated_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS updated_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        // 4. Teachers Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS teachers (
                id SERIAL PRIMARY KEY,
                user_id INTEGER UNIQUE NOT NULL
                    REFERENCES users(id) ON DELETE CASCADE,
                employee_no VARCHAR(50) UNIQUE NOT NULL,
                qualification VARCHAR(150),
                hire_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Add updated_at column to teachers table if it doesn't exist
        await pool.query(`
            ALTER TABLE teachers
            ADD COLUMN IF NOT EXISTS updated_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        // 5. Classes Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS classes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(50) NOT NULL,
                section VARCHAR(20),
                academic_year VARCHAR(20) NOT NULL,
                teacher_id INTEGER REFERENCES teachers(id)
                    ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(name, section, academic_year)
            );
        `);

        // Add updated_at column to classes table if it doesn't exist
        await pool.query(`
            ALTER TABLE classes
            ADD COLUMN IF NOT EXISTS created_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS updated_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        // 6. Subjects Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS subjects (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                class_id INTEGER NOT NULL
                    REFERENCES classes(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(name, class_id)
            );
        `);

        // Add updated_at column to subjects table if it doesn't exist
        await pool.query(`
            ALTER TABLE subjects
            ADD COLUMN IF NOT EXISTS updated_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        // 7. Enrollments Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS enrollments (
                id SERIAL PRIMARY KEY,
                student_id INTEGER NOT NULL
                    REFERENCES students(id) ON DELETE CASCADE,
                class_id INTEGER NOT NULL
                    REFERENCES classes(id) ON DELETE CASCADE,
                enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(student_id, class_id)
            );
        `);

        // Add updated_at column to enrollments table if it doesn't exist
        await pool.query(`
            ALTER TABLE enrollments
            ADD COLUMN IF NOT EXISTS created_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ADD COLUMN IF NOT EXISTS updated_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        // 8. Attendance Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS attendance (
                id SERIAL PRIMARY KEY,
                student_id INTEGER NOT NULL
                    REFERENCES students(id) ON DELETE CASCADE,
                class_id INTEGER NOT NULL
                    REFERENCES classes(id) ON DELETE CASCADE,
                attendance_date DATE NOT NULL,
                status VARCHAR(20) NOT NULL
                    CHECK (status IN ('present', 'absent', 'late', 'excused')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(student_id, class_id, attendance_date)
            );
        `);

        // Add updated_at column to attendance table if it doesn't exist
        await pool.query(`
            ALTER TABLE attendance
            ADD COLUMN IF NOT EXISTS updated_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        // 9. Exams Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS exams (
                id SERIAL PRIMARY KEY,
                class_id INTEGER NOT NULL
                    REFERENCES classes(id) ON DELETE CASCADE,
                subject_id INTEGER NOT NULL
                    REFERENCES subjects(id) ON DELETE CASCADE,
                title VARCHAR(100) NOT NULL,
                exam_date DATE,
                total_marks NUMERIC(8,2) NOT NULL
                    CHECK (total_marks > 0),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Add updated_at column to exams table if it doesn't exist
        await pool.query(`
            ALTER TABLE exams
            ADD COLUMN IF NOT EXISTS updated_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        // 10. Results Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS results (
                id SERIAL PRIMARY KEY,
                exam_id INTEGER NOT NULL
                    REFERENCES exams(id) ON DELETE CASCADE,
                student_id INTEGER NOT NULL
                    REFERENCES students(id) ON DELETE CASCADE,
                marks_obtained NUMERIC(8,2) NOT NULL
                    CHECK (marks_obtained >= 0),
                grade VARCHAR(5),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(exam_id, student_id)
            );
        `);
        
        // Add updated_at column to results table if it doesn't exist
        await pool.query(`
            ALTER TABLE results
            ADD COLUMN IF NOT EXISTS updated_at
            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        `);

        console.log("All database tables created successfully!");

    } catch (error) {
        console.error("Database Migration Failed:", error);
        throw error;
    }
};

export default migrate;