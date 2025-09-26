import type { NextPage } from 'next';
import Link from 'next/link';

const Dashboard: NextPage = ({}: any) => {
  return (
    <div className="h-screen">
      <h1 className="mt-6 mb-5 ml-6 text-3xl text">Admin Dashboard</h1>
      <div className="flex flex-wrap justify-center gap-6 ml-6 mt-14">
        <Link href="/admin/checkin">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">
              Check In
            </span>
          </div>
        </Link>
        <Link href="/admin/rsvp/participants">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">
              Attendees
            </span>
          </div>
        </Link>
        <Link href="/admin/applications/participants">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">
              Applications
            </span>
          </div>
        </Link>
        <Link href="/admin/teams">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">
              Teams
            </span>
          </div>
        </Link>
        <Link href="/admin/hardware">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">
              Hardware
            </span>
          </div>
        </Link>
        <Link href="/admin/markdown">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">
              Markdown editor
            </span>
          </div>
        </Link>
        <Link href="/admin/workshops">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">
              Workshop check in
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
