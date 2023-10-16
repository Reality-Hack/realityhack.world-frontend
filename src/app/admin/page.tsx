import type { NextPage } from "next";
import Link from "next/link";

const Dashboard: NextPage = ({}: any) => {
  return (
    <div className="h-screen">
      <h1 className="mb-5 text-2xl font-bold text-center text">Admin Panel</h1>
      <div className="ml-10 ">
        <Link href="/admin/applications/participants">
          <span className="text-xl text-center">Review Applications</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
