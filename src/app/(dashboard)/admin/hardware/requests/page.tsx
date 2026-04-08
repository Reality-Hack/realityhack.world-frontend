import HardwareRequestTable from '@/components/HardwareRequestTable/HardwareRequestTable';
import AdminHardwareRequestDialog from '@/components/admin/hardware/AdminHardwareRequestDialog';
import { useHardwareContext } from '@/contexts/HardwareContext';
import { useEffect, useState } from 'react';
import AppButton from '@/components/common/AppButton';

export default function HardwareRequests() {
  const { setHardwareRequestParams } = useHardwareContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setHardwareRequestParams({
      requester__id: undefined,
    });
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex justify-end">
        <AppButton 
          onClick={() => setDialogOpen(true)}
        >
          Create Request
        </AppButton>
      </div>
      <HardwareRequestTable statusEditable={true} />
      <AdminHardwareRequestDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
      />
    </div>
  );
}
