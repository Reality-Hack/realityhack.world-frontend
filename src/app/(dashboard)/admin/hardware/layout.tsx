'use client';
import { SetDynamicRoute } from '../../../utils/setDynamicRoute';
import { Tab } from '../../../../components/Tab';
import { usePathname } from 'next/navigation';

export default function Hardware({ children }: { children: any }) {
  const pathname = usePathname();
  return (
    <main>
      <SetDynamicRoute />
      <h1 className="text-4xl">
        {pathname == '/admin/hardware/request'
          ? 'Hardware requests'
          : pathname == '/admin/hardware/register'
          ? 'Register new hardware'
          : 'Hardware checkout'}
      </h1>
      <div className="py-4">
        <div className="pb-2">
          <Tab
            href="/admin/hardware/requests"
            isSelected={pathname == '/admin/hardware/requests'}
            title="All requests"
          ></Tab>
          <Tab
            href="/admin/hardware/checkout"
            isSelected={pathname == '/admin/hardware/checkout'}
            title="Checkout"
          ></Tab>
          <Tab
            href="/admin/hardware/register"
            isSelected={pathname == '/admin/hardware/register'}
            title="Register new hardware"
          ></Tab>
        </div>
      </div>
      {children}
    </main>
  );
}
