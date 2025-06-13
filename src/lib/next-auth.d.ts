import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'SUPER_ADMIN' | 'BRAND_USER';
      brand?: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: 'SUPER_ADMIN' | 'BRAND_USER';
    brand?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'SUPER_ADMIN' | 'BRAND_USER';
    brand?: string;
  }
} 