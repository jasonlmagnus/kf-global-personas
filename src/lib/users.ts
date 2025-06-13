export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: 'SUPER_ADMIN' | 'BRAND_USER';
  brand?: string;
};

export const users: User[] = [
  {
    id: "1",
    email: "superadmin@example.com",
    role: "SUPER_ADMIN",
  },
  {
    id: "2",
    email: "kf@example.com",
    role: "BRAND_USER",
    brand: "korn-ferry",
  },
  {
    id: "3",
    email: "magnus@example.com",
    role: "BRAND_USER",
    brand: "magnus",
  },
]; 