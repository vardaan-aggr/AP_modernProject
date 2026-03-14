import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Demo users for authentication (no DB required)
const demoUsers = [
  {
    id: "1",
    userId: "2024602",
    name: "Vardaan Aggarwal",
    email: "student@univ.edu",
    role: "STUDENT",
    passwordHash: bcrypt.hashSync("student123", 10),
  },
  {
    id: "3",
    userId: "F001",
    name: "Dr. Rajesh Kumar",
    email: "instructor@univ.edu",
    role: "INSTRUCTOR",
    passwordHash: bcrypt.hashSync("instructor123", 10),
  },
  {
    id: "5",
    userId: "A001",
    name: "Admin User",
    email: "admin@univ.edu",
    role: "ADMIN",
    passwordHash: bcrypt.hashSync("admin123", 10),
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = demoUsers.find(
          (u) => u.email === credentials.email
        );

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!passwordMatch) return null;

        return {
          id: user.id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.userId = (user as { userId?: string }).userId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { userId?: string }).userId = token.userId as string;
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
