import { getAllApplications } from "@/app/api/application";
import ApplicationTable from "@/app/components/admin/ApplicationTable";

export default async function Applications() {

  const applications = await getAllApplications();

  return (
    <main>
      <h1 className="text-4xl text-center">Applications</h1>
      <ApplicationTable 
        applications={applications}
      />
    </main>
  );
}
