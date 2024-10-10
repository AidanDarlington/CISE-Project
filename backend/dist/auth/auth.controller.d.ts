import { AuthService } from './auth.service';
import { Role } from './role.enum';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(body: {
        email: string;
        password: string;
    }): Promise<{
        email: string;
        role: Role;
    }>;
    signUp(body: {
        email: string;
        password: string;
        role: Role;
    }): Promise<{
        email: string;
        role: Role;
    }>;
}
