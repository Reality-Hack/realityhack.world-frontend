'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Nav() {
  const { data: session } = useSession();
  const isAdmin = session && (session as any).roles?.includes('admin');

  return (
    <ul className="mt-3">
      <li className="my-1">
        <Link className="hover:bg-[#3b3b3b]" href="/">
          Home
        </Link>
      </li>
      <li className="my-1">
        <Link className="hover:bg-[#3b3b3b]" href="/hardware">
          Hardware
        </Link>
      </li>
      <li className="my-1">
        <Link className="hover:bg-[#3b3b3b]" href="/teams">
          Teams
        </Link>
      </li>
      {isAdmin && (
        <li className="my-1">
          <Link className="hover:bg-[#3b3b3b]" href="/admin">
            Admin
          </Link>
        </li>
      )}
    </ul>
  );
}
