'use client';
import HardwareRequestTable from '@/components/HardwareRequestTable/HardwareRequestTable';
import AdminHardwareRequestDialog from '@/components/admin/hardware/AdminHardwareRequestDialog';
import { useHardwareContext } from '@/contexts/HardwareContext';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

export default function HardwareRequests() {
  const { setHardwareRequestParams } = useHardwareContext();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setHardwareRequestParams({
      requester__id: undefined,
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setDialogOpen(true)}
        >
          Create Request
        </Button>
      </div>
      <HardwareRequestTable statusEditable={true} />
      <AdminHardwareRequestDialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
      />
    </div>
  );
}
