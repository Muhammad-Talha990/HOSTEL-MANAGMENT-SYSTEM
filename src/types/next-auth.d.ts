import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string;
      role: "ADMIN" | "WARDEN" | "STUDENT";
    };
  }

  interface User {
    role: "ADMIN" | "WARDEN" | "STUDENT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "WARDEN" | "STUDENT";
  }
}
