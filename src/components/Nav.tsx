'use client';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, memo, useCallback } from 'react';
import Loader from './Loader';
import LogoutButton from './auth/LogoutButton';
import useNavigationAccess, { NavItem } from '@/hooks/useNavigationAccess';

interface NavItemComponentProps {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}

const NavItemComponent = memo(function NavItemComponent({
  item,
  isActive,
  collapsed,
  onNavigate
}: NavItemComponentProps) {
  return (
    <li
      className={`transition-all w-[156px] ml-6 h-11 ${isActive ? 'text-blue-600 font-medium' : ''}`}
    >
      <div>
        <Link
          href={item.href}
          className="h-14 flex flex-row items-center justify-start pr-4 py-2 transition-all duration-200 rounded-md"
          onClick={onNavigate}
        >
          <img
            src={item.icon}
            alt={item.title}
            className={`filter-svg mr-3 ${isActive ? 'filter-svg-active' : ''}`}
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
});

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
  const pathname = usePathname();

  const { user, isParticipant } = useAuth();

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

  const handleNavigate = useCallback(() => setNavOpen(false), [setNavOpen]);

  const renderTeamName = () => {
    if (!isParticipant) {
      return null;
    }
    if (user?.team) {
      return <span className="text-xs">{user.team.name}</span>;
    } else {
      return <span className="text-xs">No team joined</span>;
    }
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
                      <span className="text-white text-wrap">
                        {user?.first_name} {user?.last_name}
                      </span>
                      {renderTeamName()}
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
          {navItems.map((item: NavItem) => {
            const isActive = item.href === '/'
              ? pathname === item.href
              : pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <NavItemComponent
                key={item.href}
                item={item}
                isActive={!!isActive}
                collapsed={collapsed}
                onNavigate={handleNavigate}
              />
            );
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
