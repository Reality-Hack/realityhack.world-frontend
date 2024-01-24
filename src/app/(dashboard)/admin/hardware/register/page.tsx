'use client';
import { getAllHardware, getHardwareCategories } from '@/app/api/hardware';
import HardwareEditor from '@/components/admin/hardware/HardwareEditor';
import { Hardware, HardwareTag } from '@/types/types';
import { LinearProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Register() {
  const [hardware, setHardware] = useState<Hardware[] | null>(null);
  const [hardwareCategories, setHardwareCategories] = useState<
    HardwareTag[] | null
  >(null);
  const { data: session } = useSession();
  useEffect(() => {
    if (session)
      (async () => {
        const hardware = await getAllHardware(session.access_token);
        const hardwareCategories: HardwareTag[] = await getHardwareCategories(
          session.access_token
        );
        setHardwareCategories(hardwareCategories);
        setHardware(
          hardware.map((hardware: any) => ({
            ...hardware,
            tags: hardwareCategories.filter(tag =>
              hardware.tags.includes(tag.value)
            )
          }))
        );
      })();
  }, [session]);
  return (
    <>
      {hardware == null || hardwareCategories == null ? (
        <LinearProgress />
      ) : (
        <HardwareEditor
          hardware={hardware}
          hardwareCategories={hardwareCategories}
        ></HardwareEditor>
      )}
    </>
  );
}

// import { authOptions } from '@/app/api/auth/[...nextauth]/route';
// import { getAllHardware } from "@/app/api/hardware";
// import HardwareEditor from "@/components/admin/hardware/HardwareEditor";
// import { getServerSession } from "next-auth";

// export default async function Register() {
//     const session: any = await getServerSession(authOptions);
//     const hardware = await getAllHardware(session.accessToken);
//     return <HardwareEditor hardware={hardware}></HardwareEditor>
// }
