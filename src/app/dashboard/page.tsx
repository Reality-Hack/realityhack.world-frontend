'use client';
import type { NextPage } from 'next';
import { useState } from 'react';
import Loader from '@/components/Loader';

const Dashboard: NextPage = ({}: any) => {
  const [loading, setLoading] = useState(false);
  // const { data: session } = useSession()

  // useEffect(() => {
  //   if (!session) {
  //     signIn("keycloak")
  //   } else {
  //     setLoading(false)
  //   }
  // }, [session])

  return loading ? (
    <Loader />
  ) : (
    <div className="h-screen p-6">
      <h1 className="mb-5 text-2xl font-bold text-center text">Home</h1>
    </div>
  );
};

export default Dashboard;
