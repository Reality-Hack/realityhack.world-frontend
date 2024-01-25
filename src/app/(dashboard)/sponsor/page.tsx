import type { NextPage } from 'next';
import Link from 'next/link';

const Dashboard: NextPage = ({}: any) => {
  return (
    <div className="h-screen">
      <h1 className="mt-6 mb-5 ml-6 text-3xl text">Sponsor Dashboard</h1>
      <div className="flex flex-wrap justify-center gap-6 ml-6 mt-14">
        {/* <Link href="/sponsor/hardware">
          <div className="flex-col gap-2 w-[355px] h-56 bg-gradient-to-t from-[#DBF0FB] to-[#DBF0FB] rounded-[10px] shadow flex justify-center items-center">
            <span className="text-xl text-center text-[#40337F]">
              Register Hardware
            </span>
          </div>
        </Link> */}
      </div>
    </div>
  );
};

export default Dashboard;
