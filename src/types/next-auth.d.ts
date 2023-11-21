import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    roles: string[];
    access_token: string;
    id_token: string;
    error?: string;
  }

  interface Account {
    access_token: string;
    id_token: string;
    expires_at: number;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    decoded?: any;
    access_token: string;
    id_token: string;
    expires_at: number;
    refresh_token?: string;
    error?: string;
  }
}
