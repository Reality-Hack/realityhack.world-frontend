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
              Check In User
            </span>
          </div>
        </Link>
        <Link href="/admin/applications/participants">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">
              Check Ins
            </span>
          </div>
        </Link>
        <Link href="/admin/rsvp/participants">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">RSVPs</span>
          </div>
        </Link>
        <Link href="/admin/users">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">Users</span>
          </div>
        </Link>
        <Link href="/admin/applications/participants">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <img
              src="/icons/dashboard/admin_applications.svg"
              alt="applications"
            />
            <span className="text-xl text-center text-[#40337F]">
              Applications
            </span>
          </div>
        </Link>
        <Link href="/admin/applications/participants">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">
              Hardware Requests
            </span>
          </div>
        </Link>
        <Link href="/admin/applications/participants">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">Judging</span>
          </div>
        </Link>
        <Link href="/admin/applications/participants">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">
              Mentors & Sponsors
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
