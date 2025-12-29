'use client';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect } from 'react';
import Loader from './Loader';
import LogoutButton from './auth/LogoutButton';
import useNavigationAccess, { NavItem } from '@/hooks/useNavigationAccess';

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
  const { session, status } = useAuth();
  const { navItems } = useNavigationAccess();

  const { user } = useAuth();

  useEffect(() => {
    if (
      status !== 'loading' &&
      session &&
      (session as any).error === 'RefreshAccessTokenError'
    ) {
      signOut({ callbackUrl: '/' });
    }
  }, [session, status]);

  const renderProfileImage = () => {
    if (user?.profile_image) {
      return (
        <img
          src={user?.profile_image.file}
          alt=""
          className="object-cover object-center w-10 h-10 rounded-full"
        />
      );
    } else {
      const initials = `${user?.first_name?.charAt(0)?.toUpperCase() ?? ''}${
        user?.last_name?.charAt(0)?.toUpperCase() ?? ''
      }`;

      return (
        <div className="flex items-center justify-center w-10 h-10 bg-gray-300 rounded-full">
          <span className="">{initials}</span>
        </div>
      );
    }
  };

  const renderNavItem = (item: NavItem) => {
    return (
      <li
        key={item.href}
        className={`transition-all w-[156px] ml-6 h-11`}
      >
        <div className="filter-svg">
          <Link
            href={item.href}
            className={`h-14 flex flex-row items-center justify-start pr-4 py-2 transition-all duration-200 rounded-md`}
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
                  <div className="flex items-center gap-2">
                    {renderProfileImage()}
                    <div className="flex flex-col">
                      <span className="text-white">
                        {user?.first_name} {user?.last_name}
                      </span>
                      {!!user?.team ? (
                        <span className="text-xs">{user.team.name}</span>
                      ) : (
                        <span className="text-xs">No team joined</span>
                      )}
                    </div>
                  </div>
                </span>{' '}
                <br />
                <LogoutButton
                  collapsed={collapsed}
                  className="bg-blue-500"
                />
              </div>
            )
          )}
        </div>
        <ul className="bg-gradient-to-b h-screen from-white to-neutral-50 border-r-[1px]">
          {navItems.map((item: NavItem) => renderNavItem(item))}

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
