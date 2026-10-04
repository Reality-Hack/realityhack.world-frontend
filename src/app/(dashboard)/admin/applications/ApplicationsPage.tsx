import ApplicationTable from '@/components/admin/applications/ApplicationTable';

export default function ApplicationsPage() {
  return (
    <div className="h-screen p-6 pt-8 pl-2">
      <h1 className="text-3xl">Applications</h1>
      <div className="py-4">
        <ApplicationTable />
      </div>
    </div>
  );
}
