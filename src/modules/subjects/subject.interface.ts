export interface ISubject {
    id: number;
    name: string;
    class_id: number;
    created_at: Date;
    updated_at: Date;
}

// Create Subject
export interface ICreateSubject {
    name: string;
    class_id: number;
}

// Update Subject
export interface IUpdateSubject {
    name?: string | undefined;
    class_id?: number | undefined;
}