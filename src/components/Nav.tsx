'use client';
import { useEffect, Dispatch, SetStateAction } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { menuItems } from '@/app/utils/menuItems';
import Loader from './Loader';
import useFeatureFlags from '../hooks/useFeaureFlags';

async function keycloakSessionLogOut(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'GET' });
  } catch (err) {
    console.error(err);
  }
}

interface NavProps {
  navOpen: boolean;
  setNavOpen: Dispatch<SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export default function Nav({
  navOpen,
  setNavOpen,
  collapsed,
  setCollapsed
}: NavProps) {
  const { data: session, status } = useSession();
  const isAdmin = session && (session as any).roles?.includes('admin');
  const { isFeatureEnabled, areFeatureFlagsDefined } = useFeatureFlags();

  useEffect(() => {
    if (
      status !== 'loading' &&
      session &&
      (session as any).error === 'RefreshAccessTokenError'
    ) {
      signOut({ callbackUrl: '/' });
    }
  }, [session, status]);

  return (
    <>
      <div
        className={`${
          collapsed ? 'w-[250px] ' : 'w-[80px]'
        } transition-all relative`}
      >
        <div className="h-[165px] bg-gradient-to-br from-blue-400 to-blue-600 rounded-tr-[4px] backdrop-blur-sm">
          {status === 'loading' ? (
            <Loader />
          ) : (
            session && (
              <div
                className={`text-white justify-center flex flex-col px-6 py-8 ${
                  collapsed ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span
                  className={`whitespace-nowrap transition-all ${
                    collapsed ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Logged in as <br />
                  {session?.user?.email}
                </span>{' '}
                <br />
                <button
                  className="w-20 px-2 py-1 font-bold text-white border rounded border-gray-50"
                  onClick={() => {
                    keycloakSessionLogOut().then(() =>
                      signOut({ callbackUrl: '/' })
                    );
                  }}
                >
                  <span
                    className={`whitespace-nowrap transition-all ${
                      collapsed ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    Log out
                  </span>
                </button>
              </div>
            )
          )}
        </div>
        <ul className="bg-gradient-to-b h-screen from-white to-neutral-50 border-r-[1px]">
          {menuItems.map((item, index) => {
            const shouldRenderItem =
              (item.href !== '/admin' || isAdmin) &&
              isFeatureEnabled(item.href);

            if (shouldRenderItem) {
              return (
                <li
                  key={item.href}
                  className={`transition-all w-[156px] ${
                    collapsed ? 'ml-6' : 'ml-6'
                  } h-11`}
                >
                  <div className="filter-svg">
                    <Link
                      href={item.href}
                      className={`h-14 flex flex-row items-center justify-start pr-4 ${
                        index === 0 ? 'py-2' : 'py-2'
                      } transition-all duration-200 rounded-md`}
                      onClick={() => setNavOpen(false)}
                    >
                      <img
                        src={item.icon}
                        alt={`${item.title}`}
                        className="mr-3"
                      />
                      <span
                        className={`text-sm whitespace-nowrap transition-all ${
                          collapsed ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        {item.title}
                      </span>
                    </Link>
                  </div>
                </li>
              );
            }
            return null;
          })}

          {!navOpen && (
            <div className="filter-svg">
              <li
                className={`cursor-pointer w-14 transition-all my-8 ${
                  collapsed ? 'ml-3' : 'ml-2'
                } h-11`}
                onClick={() => setCollapsed(!collapsed)}
              >
                <img
                  src={`${
                    collapsed
                      ? `/icons/dashboard/chevron-left.svg`
                      : `/icons/dashboard/chevron-right.svg`
                  }`}
                  alt="arrow left icon"
                  className="ml-4"
                />
              </li>
            </div>
          )}
        </ul>
      </div>
    </>
  );
}
