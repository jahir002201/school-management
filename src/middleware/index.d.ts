import type { Role } from "../types/index.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                role: Role;
            };
        }
    }
}

export {};