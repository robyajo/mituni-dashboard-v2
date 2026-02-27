import { AuthOptions, User, Account, SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "@/lib/axios";
import { checkIsFrozen, recordFailure, resetLimit } from "@/lib/rate-limit";

// Extend the Session and User types to include our custom properties
declare module "next-auth" {
  interface Session {
    success: boolean;
    message: string;
    data: {
      user: {
        id: string | number;
        name: string;
        email: string;
        role: string;
        jk: string;
        verified: string;
        created_at: string;
        updated_at: string;
        logo_branch: string | null;
        outlet_id_active: string;
      };
      outlet_id_active: string;
      token: string;
    };
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    expiresInSecond: number;
    user?: {
      // Optional because we delete it
      id: string | number;
      name: string;
      email: string;
      role: string;
      jk: string;
      verified: string;
      created_at: string;
      updated_at: string;
      logo_branch: string | null;
      outlet_id_active: string;
    };
  }

  interface User {
    id: string | number;
    name: string;
    email: string;
    phone_number: string;
    email_verified_at: string | null;
    role: string;
    jk: string;
    created_at: string;
    updated_at: string;
    logo_branch: string | null;
    outlet_id_active: string;
    accessToken: string;
    tokenType: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    expiresInSecond: number;
    user: {
      id: string | number;
      name: string;
      email: string;
      phone_number: string;
      email_verified_at: string | null;
      role: string;
      jk: string;
      created_at: string;
      updated_at: string;
      logo_branch: string | null;
      outlet_id_active: string;
    };
  }
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 60 * 60, // 1 hour
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const email = credentials.email.trim();

        // Cek apakah akun sedang dibekukan
        const freezeStatus = checkIsFrozen(email);
        if (freezeStatus.frozen) {
          throw new Error(
            `Akun dibekukan karena terlalu banyak percobaan. Silakan coba lagi dalam ${freezeStatus.remaining} detik.`,
          );
        }

        try {
          const signinUrl = process.env.NEXT_PUBLIC_API_URL + "/api/login";

          const res = await axios.post(
            signinUrl,
            {
              email: email,
              password: credentials.password,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "x-mituni-key": process.env.NEXT_PUBLIC_MITUNI_API_KEY,
              },
            },
          );

          if (res.headers["content-type"]?.includes("application/json")) {
            const response = res.data;

            if (response.success === true && response.data?.user) {
              // Reset limit jika berhasil
              resetLimit(email);

              return {
                ...response.data.user,
                outlet_id_active: response.data.outlet_id_active,
                accessToken: response.data.token,
                tokenType: response.data.token_type ?? "Bearer",
              };
            } else if (response.status === "error" && response.errors) {
              // Catat kegagalan
              recordFailure(email);
              const errorMessage = response.errors.join(", ");
              throw new Error(`[${errorMessage}]`);
            } else {
              // Catat kegagalan
              recordFailure(email);
              throw new Error(response.message || "Authentication failed");
            }
          } else {
            throw new Error("Received invalid response from server");
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          // Catat kegagalan untuk error lainnya (seperti 401 Unauthorized dari axios)
          recordFailure(email);

          if (error.response?.data) {
            // Handle Axios error response
            const { message, errors } = error.response.data;
            if (errors && Array.isArray(errors)) {
              throw new Error(`[${errors.join(", ")}]`);
            }
            throw new Error(message || "Authentication failed");
          }
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      account: Account | null;
      user?: User | AdapterUser;
      trigger?: "update" | string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session?: any;
    }) {
      // Initial sign in
      if (user) {
        const typedUser = user as User;
        token.accessToken = typedUser.accessToken;
        token.outlet_id_active = typedUser.outlet_id_active;
        token.tokenType = typedUser.tokenType;
        // Store all user data in the token
        token.user = {
          id: typedUser.id,
          outlet_id_active: typedUser.outlet_id_active,
          name: typedUser.name,
          email: typedUser.email,
          phone_number: typedUser.phone_number,
          email_verified_at: typedUser.email_verified_at,
          role: typedUser.role,
          jk: typedUser.jk,
          created_at: typedUser.created_at,
          updated_at: typedUser.updated_at,
          logo_branch: typedUser.logo_branch,
        };
      }

      if (trigger === "update" && session?.user) {
        token.user = session.user;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      token: any;
      trigger?: "update" | string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newSession?: any;
    }) {
      // Send properties to the client, like an access_token from a provider.
      session.success = true;
      session.message = "Login berhasil";
      session.data = {
        user: token.user,
        outlet_id_active: token.outlet_id_active,
      };
      session.tokenType = token.tokenType;
      session.accessToken = token.accessToken;

      // The user object is already inside session.data, so we can remove the top-level one
      // to avoid confusion and align with the desired output format.
      // delete session.user;

      return session;
    },
    async signIn({
      user,
    }: {
      user: User | AdapterUser;
      account: Account | null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile?: any;
      email?: { verificationRequest?: boolean };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      credentials?: Record<string, any>;
    }) {
      if (user) return true;
      else return false;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // CUSTOM
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-in",
    error: "/errors/unauthorized",
  },
};
