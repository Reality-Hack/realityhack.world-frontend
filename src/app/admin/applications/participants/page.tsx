import HackerApplicationTable from "@/app/components/admin/applications/HackerApplicationTable";
import { getAllHackerApplications } from "@/app/api/application";

export default async function Participants() {

  const applications = await getAllHackerApplications();

  return (
    <HackerApplicationTable 
      applications={applications}
    />
  );
}
