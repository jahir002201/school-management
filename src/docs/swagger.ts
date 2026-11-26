const swaggerSpec = {
    openapi: "3.0.0",

    info: {
        title: "School Management System API",
        version: "1.0.0",
        description:
            "REST API documentation for School Management System"
    },

    servers: [
        {
            url: "http://localhost:5000",
            description: "Local Development Server"
        }
    ],

    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Enter your JWT token"
            }
        }
    },

    security: [
        {
            bearerAuth: []
        }
    ],

    
paths: {
    "/api/v1/auth/register": {
        post: {
            tags: ["Authentication"],
            summary: "Register a new user",
            security: [],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["name", "email", "password"],
                            properties: {
                                name: {
                                    type: "string",
                                    example: "Rahim Uddin"
                                },
                                email: {
                                    type: "string",
                                    format: "email",
                                    example: "rahim@gmail.com"
                                },
                                password: {
                                    type: "string",
                                    example: "password123"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "201": {
                    description: "User registered successfully"
                },
                "400": {
                    description: "Validation failed"
                },
                "409": {
                    description: "Email already exists"
                }
            }
        }
    },

    "/api/v1/auth/login": {
        post: {
            tags: ["Authentication"],
            summary: "Login user",
            security: [],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "password"],
                            properties: {
                                email: {
                                    type: "string",
                                    example: "rahim@gmail.com"
                                },
                                password: {
                                    type: "string",
                                    example: "password123"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                "200": {
                    description: "Login successful"
                },
                "400": {
                    description: "Validation failed"
                },
                "401": {
                    description: "Invalid email or password"
                },
                "403": {
                    description: "Account is inactive"
                }
            }
        }
    },

    "/api/v1/auth/me": {
        get: {
            tags: ["Authentication"],
            summary: "Get logged-in user",
            responses: {
                "200": {
                    description: "User profile fetched successfully"
                },
                "401": {
                    description: "Unauthorized"
                }
            }
        }
    },

    "/api/v1/auth/admin-test": {
        get: {
            tags: ["Authentication"],
            summary: "Admin only test endpoint",
            description: "Accessible only to authenticated admins.",
            responses: {
                "200": {
                    description: "Welcome Admin"
                },
                "401": {
                    description: "Unauthorized"
                },
                "403": {
                    description: "Forbidden - Admin access required"
                }
            }
        }
    },


"/api/v1/users": {
    get: {
        tags: ["Users"],
        summary: "Get all users",
        description: "Retrieve paginated users. Admin only.",
        parameters: [
            {
                name: "page",
                in: "query",
                schema: {
                    type: "integer",
                    default: 1
                }
            },
            {
                name: "limit",
                in: "query",
                schema: {
                    type: "integer",
                    default: 10,
                    maximum: 100
                }
            }
        ],
        responses: {
            "200": {
                description: "Users retrieved successfully"
            },
            "401": {
                description: "Unauthorized"
            },
            "403": {
                description: "Admin access required"
            }
        }
    }
},

"/api/v1/users/{id}": {
    get: {
        tags: ["Users"],
        summary: "Get user by ID",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: {
                    type: "integer"
                }
            }
        ],
        responses: {
            "200": {
                description: "User retrieved successfully"
            },
            "400": {
                description: "Invalid user ID"
            },
            "404": {
                description: "User not found"
            }
        }
    },

    patch: {
        tags: ["Users"],
        summary: "Update user",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: {
                    type: "integer"
                }
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                example: "Rahim Uddin"
                            },
                            email: {
                                type: "string",
                                format: "email",
                                example: "rahim@gmail.com"
                            },
                            role: {
                                type: "string",
                                enum: ["admin", "teacher", "student"]
                            },
                            is_active: {
                                type: "boolean",
                                example: true
                            }
                        }
                    }
                }
            }
        },
        responses: {
            "200": {
                description: "User updated successfully"
            },
            "400": {
                description: "Invalid request"
            },
            "404": {
                description: "User not found"
            },
            "409": {
                description: "Duplicate email"
            }
        }
    },

    delete: {
        tags: ["Users"],
        summary: "Soft delete user",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: {
                    type: "integer"
                }
            }
        ],
        responses: {
            "200": {
                description: "User deleted successfully"
            },
            "404": {
                description: "User not found"
            }
        }
    }
},

"/api/v1/users/{id}/status": {
    patch: {
        tags: ["Users"],
        summary: "Update user status",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: {
                    type: "integer"
                }
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            is_active: {
                                type: "boolean",
                                example: false
                            }
                        },
                        required: ["is_active"]
                    }
                }
            }
        },
        responses: {
            "200": {
                description: "User status updated successfully"
            },
            "400": {
                description: "Invalid status"
            },
            "404": {
                description: "User not found"
            }
        }
    }
},

"/api/v1/profile/me": {
    get: {
        tags: ["Profile"],
        summary: "Get my profile",
        description: "Available to any authenticated user.",
        responses: {
            "200": { description: "Profile fetched successfully" },
            "401": { description: "Unauthorized" }
        }
    },
    patch: {
        tags: ["Profile"],
        summary: "Update my profile",
        description: "Available to any authenticated user.",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Profile fields to update. Follow the profile validation schema." }
                }
            }
        },
        responses: {
            "200": { description: "Profile updated successfully" },
            "400": { description: "Validation error" },
            "401": { description: "Unauthorized" }
        }
    }
},
"/api/v1/profile/me/password": {
    patch: {
        tags: ["Profile"],
        summary: "Change my password",
        description: "Available to any authenticated user.",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Password change data. Follow the password validation schema." }
                }
            }
        },
        responses: {
            "200": { description: "Password changed successfully" },
            "400": { description: "Invalid password data" },
            "401": { description: "Unauthorized" }
        }
    }
},

"/api/v1/students": {
    get: {
        tags: ["Students"],
        summary: "Get all students",
        parameters: [
            {
                name: "page",
                in: "query",
                schema: { type: "integer", default: 1 }
            },
            {
                name: "limit",
                in: "query",
                schema: { type: "integer", default: 10, maximum: 100 }
            }
        ],
        responses: {
            "200": { description: "Students retrieved successfully" },
            "401": { description: "Unauthorized" },
            "403": { description: "Admin access required" }
        }
    },
    post: {
        tags: ["Students"],
        summary: "Create a student",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        description: "Student information according to student validation schema",
                        additionalProperties: true
                    }
                }
            }
        },
        responses: {
            "201": { description: "Student created successfully" },
            "400": { description: "Validation failed" },
            "409": { description: "Duplicate student information" }
        }
    }
},

"/api/v1/students/{id}": {
    get: {
        tags: ["Students"],
        summary: "Get student by ID",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }
        ],
        responses: {
            "200": { description: "Student retrieved successfully" },
            "400": { description: "Invalid student ID" },
            "404": { description: "Student not found" }
        }
    },
    patch: {
        tags: ["Students"],
        summary: "Update student",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        description: "Student fields according to update validation schema",
                        additionalProperties: true
                    }
                }
            }
        },
        responses: {
            "200": { description: "Student updated successfully" },
            "400": { description: "Validation failed" },
            "404": { description: "Student not found" }
        }
    },
    delete: {
        tags: ["Students"],
        summary: "Delete student",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }
        ],
        responses: {
            "200": { description: "Student deleted successfully" },
            "404": { description: "Student not found" }
        }
    }
},

"/api/v1/subjects": {
    get: {
        tags: ["Subjects"],
        summary: "Get all subjects",
        parameters: [
            {
                name: "page",
                in: "query",
                schema: { type: "integer", default: 1 }
            },
            {
                name: "limit",
                in: "query",
                schema: { type: "integer", default: 10, maximum: 100 }
            }
        ],
        responses: {
            "200": { description: "Subjects retrieved successfully" },
            "401": { description: "Unauthorized" },
            "403": { description: "Admin access required" }
        }
    },
    post: {
        tags: ["Subjects"],
        summary: "Create a subject",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        description: "Subject information according to subject validation schema",
                        additionalProperties: true
                    }
                }
            }
        },
        responses: {
            "201": { description: "Subject created successfully" },
            "400": { description: "Validation failed" },
            "409": { description: "Duplicate subject" }
        }
    }
},

"/api/v1/subjects/{id}": {
    get: {
        tags: ["Subjects"],
        summary: "Get subject by ID",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }
        ],
        responses: {
            "200": { description: "Subject retrieved successfully" },
            "400": { description: "Invalid subject ID" },
            "404": { description: "Subject not found" }
        }
    },
    patch: {
        tags: ["Subjects"],
        summary: "Update subject",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        description: "Subject fields according to update validation schema",
                        additionalProperties: true
                    }
                }
            }
        },
        responses: {
            "200": { description: "Subject updated successfully" },
            "400": { description: "Validation failed" },
            "404": { description: "Subject not found" }
        }
    },
    delete: {
        tags: ["Subjects"],
        summary: "Delete subject",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }
        ],
        responses: {
            "200": { description: "Subject deleted successfully" },
            "404": { description: "Subject not found" }
        }
    }
},

"/api/v1/teachers": {
    get: {
        tags: ["Teachers"],
        summary: "Get all teachers",
        parameters: [
            {
                name: "page",
                in: "query",
                schema: { type: "integer", default: 1 }
            },
            {
                name: "limit",
                in: "query",
                schema: { type: "integer", default: 10, maximum: 100 }
            }
        ],
        responses: {
            "200": { description: "Teachers retrieved successfully" },
            "401": { description: "Unauthorized" },
            "403": { description: "Admin access required" }
        }
    },
    post: {
        tags: ["Teachers"],
        summary: "Create a teacher",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        description: "Teacher information according to teacher validation schema",
                        additionalProperties: true
                    }
                }
            }
        },
        responses: {
            "201": { description: "Teacher created successfully" },
            "400": { description: "Validation failed" },
            "409": { description: "Duplicate teacher information" }
        }
    }
},

"/api/v1/teachers/{id}": {
    get: {
        tags: ["Teachers"],
        summary: "Get teacher by ID",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }
        ],
        responses: {
            "200": { description: "Teacher retrieved successfully" },
            "400": { description: "Invalid teacher ID" },
            "404": { description: "Teacher not found" }
        }
    },
    patch: {
        tags: ["Teachers"],
        summary: "Update teacher",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        description: "Teacher fields according to update validation schema",
                        additionalProperties: true
                    }
                }
            }
        },
        responses: {
            "200": { description: "Teacher updated successfully" },
            "400": { description: "Validation failed" },
            "404": { description: "Teacher not found" }
        }
    },
    delete: {
        tags: ["Teachers"],
        summary: "Delete teacher",
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "integer" }
            }
        ],
        responses: {
            "200": { description: "Teacher deleted successfully" },
            "404": { description: "Teacher not found" }
        }
    }
},


"/api/v1/attendance": {
    get: {
        tags: ["Attendance"],
        summary: "Get all attendance records",
        description: "Admin only. Supports pagination.",
        parameters: [
            { in: "query", name: "page", schema: { type: "integer", default: 1 } },
            { in: "query", name: "limit", schema: { type: "integer", default: 10 } }
        ],
        responses: {
            "200": { description: "Attendance records retrieved successfully" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden" }
        }
    },
    post: {
        tags: ["Attendance"],
        summary: "Create attendance record",
        description: "Admin only.",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Attendance data. Follow the attendance validation schema." }
                }
            }
        },
        responses: {
            "201": { description: "Attendance record created successfully" },
            "400": { description: "Validation error" },
            "401": { description: "Unauthorized" }
        }
    }
},
"/api/v1/attendance/{id}": {
    get: {
        tags: ["Attendance"],
        summary: "Get attendance by ID",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
            "200": { description: "Attendance record retrieved successfully" },
            "404": { description: "Attendance record not found" }
        }
    },
    patch: {
        tags: ["Attendance"],
        summary: "Update attendance",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Attendance fields to update." }
                }
            }
        },
        responses: {
            "200": { description: "Attendance updated successfully" },
            "400": { description: "Validation error" },
            "404": { description: "Attendance record not found" }
        }
    },
    delete: {
        tags: ["Attendance"],
        summary: "Delete attendance",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
            "200": { description: "Attendance deleted successfully" },
            "404": { description: "Attendance record not found" }
        }
    }
},

"/api/v1/classes": {
    get: {
        tags: ["Classes"],
        summary: "Get all classes",
        description: "Admin only. Supports pagination.",
        parameters: [
            { in: "query", name: "page", schema: { type: "integer", default: 1 } },
            { in: "query", name: "limit", schema: { type: "integer", default: 10 } }
        ],
        responses: {
            "200": { description: "Classes retrieved successfully" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden" }
        }
    },
    post: {
        tags: ["Classes"],
        summary: "Create class",
        description: "Admin only.",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Class data. Follow the class validation schema." }
                }
            }
        },
        responses: {
            "201": { description: "Class created successfully" },
            "400": { description: "Validation error" },
            "409": { description: "Duplicate class" }
        }
    }
},
"/api/v1/classes/{id}": {
    get: {
        tags: ["Classes"],
        summary: "Get class by ID",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
            "200": { description: "Class retrieved successfully" },
            "404": { description: "Class not found" }
        }
    },
    patch: {
        tags: ["Classes"],
        summary: "Update class",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Class fields to update." }
                }
            }
        },
        responses: {
            "200": { description: "Class updated successfully" },
            "400": { description: "Validation error" },
            "404": { description: "Class not found" }
        }
    },
    delete: {
        tags: ["Classes"],
        summary: "Delete class",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
            "200": { description: "Class deleted successfully" },
            "404": { description: "Class not found" }
        }
    }
},

"/api/v1/dashboard": {
    get: {
        tags: ["Dashboard"],
        summary: "Get dashboard statistics",
        description: "Admin only. Returns school management dashboard data.",
        responses: {
            "200": { description: "Dashboard data retrieved successfully" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden" }
        }
    }
},

"/api/v1/enrollments": {
    get: {
        tags: ["Enrollments"],
        summary: "Get all enrollments",
        description: "Admin only. Supports pagination.",
        parameters: [
            { in: "query", name: "page", schema: { type: "integer", default: 1 } },
            { in: "query", name: "limit", schema: { type: "integer", default: 10 } }
        ],
        responses: {
            "200": { description: "Enrollments retrieved successfully" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden" }
        }
    },
    post: {
        tags: ["Enrollments"],
        summary: "Create enrollment",
        description: "Admin only.",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Enrollment data. Follow the enrollment validation schema." }
                }
            }
        },
        responses: {
            "201": { description: "Enrollment created successfully" },
            "400": { description: "Validation error" },
            "409": { description: "Duplicate enrollment" }
        }
    }
},
"/api/v1/enrollments/{id}": {
    get: {
        tags: ["Enrollments"],
        summary: "Get enrollment by ID",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
            "200": { description: "Enrollment retrieved successfully" },
            "404": { description: "Enrollment not found" }
        }
    },
    patch: {
        tags: ["Enrollments"],
        summary: "Update enrollment",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Enrollment fields to update." }
                }
            }
        },
        responses: {
            "200": { description: "Enrollment updated successfully" },
            "400": { description: "Validation error" },
            "404": { description: "Enrollment not found" }
        }
    },
    delete: {
        tags: ["Enrollments"],
        summary: "Delete enrollment",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
            "200": { description: "Enrollment deleted successfully" },
            "404": { description: "Enrollment not found" }
        }
    }
},

"/api/v1/exams": {
    get: {
        tags: ["Exams"],
        summary: "Get all exams",
        description: "Admin only. Supports pagination.",
        parameters: [
            { in: "query", name: "page", schema: { type: "integer", default: 1 } },
            { in: "query", name: "limit", schema: { type: "integer", default: 10 } }
        ],
        responses: {
            "200": { description: "Exams retrieved successfully" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden" }
        }
    },
    post: {
        tags: ["Exams"],
        summary: "Create exam",
        description: "Admin only.",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Exam data. Follow the exam validation schema." }
                }
            }
        },
        responses: {
            "201": { description: "Exam created successfully" },
            "400": { description: "Validation error" }
        }
    }
},
"/api/v1/exams/{id}": {
    get: {
        tags: ["Exams"],
        summary: "Get exam by ID",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
            "200": { description: "Exam retrieved successfully" },
            "404": { description: "Exam not found" }
        }
    },
    patch: {
        tags: ["Exams"],
        summary: "Update exam",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Exam fields to update." }
                }
            }
        },
        responses: {
            "200": { description: "Exam updated successfully" },
            "400": { description: "Validation error" },
            "404": { description: "Exam not found" }
        }
    },
    delete: {
        tags: ["Exams"],
        summary: "Delete exam",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
            "200": { description: "Exam deleted successfully" },
            "404": { description: "Exam not found" }
        }
    }
},

"/api/v1/results": {
    get: {
        tags: ["Results"],
        summary: "Get all results",
        description: "Admin only. Supports pagination.",
        parameters: [
            { in: "query", name: "page", schema: { type: "integer", default: 1 } },
            { in: "query", name: "limit", schema: { type: "integer", default: 10 } }
        ],
        responses: {
            "200": { description: "Results retrieved successfully" },
            "401": { description: "Unauthorized" },
            "403": { description: "Forbidden" }
        }
    },
    post: {
        tags: ["Results"],
        summary: "Create result",
        description: "Admin only.",
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Result data. Follow the result validation schema." }
                }
            }
        },
        responses: {
            "201": { description: "Result created successfully" },
            "400": { description: "Validation error" },
            "409": { description: "Duplicate result" }
        }
    }
},
"/api/v1/results/{id}": {
    get: {
        tags: ["Results"],
        summary: "Get result by ID",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
            "200": { description: "Result retrieved successfully" },
            "404": { description: "Result not found" }
        }
    },
    patch: {
        tags: ["Results"],
        summary: "Update result",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        requestBody: {
            required: true,
            content: {
                "application/json": {
                    schema: { type: "object", description: "Result fields to update." }
                }
            }
        },
        responses: {
            "200": { description: "Result updated successfully" },
            "400": { description: "Validation error" },
            "404": { description: "Result not found" }
        }
    },
    delete: {
        tags: ["Results"],
        summary: "Delete result",
        parameters: [
            { in: "path", name: "id", required: true, schema: { type: "integer" } }
        ],
        responses: {
            "200": { description: "Result deleted successfully" },
            "404": { description: "Result not found" }
        }
    }
}

}

};

export default swaggerSpec;