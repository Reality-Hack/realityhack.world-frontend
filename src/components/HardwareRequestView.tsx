'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import Table from '@/components/Table';
import {
  hardware_request_status,
  hardware_requester,
} from '@/types/types';
import { HardwareWithType } from '@/types/types2'
import Box from '@mui/material/Box';
import CustomSelect from '@/components/CustomSelect';
import { hardwarerequestsPartialUpdate, hardwarerequestsDestroy, hardwaredevicesPartialUpdate } from '@/types/endpoints';
import { LinearProgress } from '@mui/material';
import { 
  HardwareRequestList,
  PatchedHardwareRequestRequest,
  HardwareRequestStatusEnum,
  PatchedHardwareDeviceRequest
} from '@/types/models';
import { toast } from 'sonner';
import { useHardwareContext } from '@/contexts/HardwareAdminContext';

type hardwareRequestStatusOption = {
  label: string;
  value: HardwareRequestStatusEnum;
}

const HardwareRequestStatusOptionsCheckedOut: hardwareRequestStatusOption = {
  label: 'Checked Out',
  value: HardwareRequestStatusEnum.C
}

const HardwareRequestStatusOptionsFull: hardwareRequestStatusOption[] = [
  {
    label: 'Pending',
    value: HardwareRequestStatusEnum.P
  },
  {
    label: 'Rejected',
    value: HardwareRequestStatusEnum.R
  },
];

const HardwareRequestStatusOptions: hardwareRequestStatusOption[] = [
  {
    label: 'Approved',
    value: HardwareRequestStatusEnum.A
  },
  HardwareRequestStatusOptionsCheckedOut,
  ...HardwareRequestStatusOptionsFull
];

type HardwareRequestTableRow = HardwareRequestList & {
  hardware_in_stock: number;
  hardware_total: number;
}

export default function HardwareRequestView({
  statusEditable = false,
  reasonEditable = false,
  deletable = false,
  onlyApproved = false,
  requester = null, // rename to requesterId
  userSelectedHardwareDevice = null,
  setCheckedOutTo = () => {}
}: {
  statusEditable?: boolean;
  reasonEditable?: boolean;
  deletable?: boolean;
  onlyApproved?: boolean;
  requester?: hardware_requester;
  userSelectedHardwareDevice?: HardwareWithType | null;
  setCheckedOutTo?: (
    newApp: HardwareRequestList | null
  ) => void;
}) {
  const { data: session } = useSession();
  const isAdmin = session && session.roles?.includes('admin');
  const [isUpdating, setIsUpdating] = useState(false);
  const { 
    hardwareRequests, 
    isLoadingHardwareRequests, 
    mutateHardwareRequests,
    mutateHardwareDevices,
    setHardwareRequestParams,
    hardwareDeviceTypeMap,
    hardwareDeviceMap,
  } = useHardwareContext();
  useEffect(() => {
    if (requester) {
      setHardwareRequestParams({
        requester__id: requester,
      });
    }
  }, [requester]);

  const tableData = useMemo(() => {
    if (!hardwareRequests) return [];
    if (!hardwareDeviceTypeMap) return hardwareRequests;

    return hardwareRequests?.map(req => ({
      ...req,
      hardware_in_stock: hardwareDeviceTypeMap[req.hardware]?.available || 0,
      hardware_total: hardwareDeviceTypeMap[req.hardware]?.total || 0
    }));
  }, [hardwareRequests, hardwareDeviceTypeMap]);
  
  const renderRowCheckoutButton = (
    hardwareRequest: HardwareRequestList,
  ) => {
    const isHardwareDeviceAvailable = userSelectedHardwareDevice?.checked_out_to == null;
    const isSameHardwareDevice = userSelectedHardwareDevice?.id && 
      hardwareRequest.hardware_device == userSelectedHardwareDevice.id;
    const isSameHardwareDeviceType = userSelectedHardwareDevice?.hardwareType?.id  && 
      userSelectedHardwareDevice.hardware == hardwareRequest.hardware;
    const isRequestApproved = hardwareRequest.status == HardwareRequestStatusEnum.A;
    const isDeviceCheckedOut = hardwareRequest.status == HardwareRequestStatusEnum.C;

    const isValidCheckout = isSameHardwareDeviceType && isHardwareDeviceAvailable && isRequestApproved;
    const isValidReturn = isDeviceCheckedOut && isSameHardwareDevice;
    const isValidRequest = isValidCheckout || isValidReturn;

    if (!isValidRequest) {
      return null;
    }
    
    const buttonColor = isValidCheckout ? 'bg-[#2FCC32]' : 'bg-[#CCAA2F]';

    const buttonText = isValidCheckout ? 'Check Out' : 'Return';
    const updateRequestBody: PatchedHardwareRequestRequest = {
      status: isValidCheckout ? hardware_request_status.checked_out : hardware_request_status.pending,
      hardware_device: isValidCheckout ? userSelectedHardwareDevice?.id : null,
    }
    if (!hardwareRequest.id || hardwareRequest.id == undefined) {
      toast.error('Hardware request ID is undefined');
      return null;
    }

    // TODO: update checked out to in parent component
    const handleClick = () => {
      patchHardwareRequest(hardwareRequest.id || '', updateRequestBody)
      const selectedDevicePayload:PatchedHardwareDeviceRequest = {
        checked_out_to: isValidCheckout ? hardwareRequest.id : null
      }
      hardwaredevicesPartialUpdate(userSelectedHardwareDevice?.id || '', 
        selectedDevicePayload,
        {
          headers: {
            'Authorization': `JWT ${session?.access_token}`
          }
        }
      )
    }

    return (
      <button
        className={`cursor-pointer text-white ${buttonColor} px-2 rounded-full disabled:opacity-50 transition-all flex-shrink self-end`}
        onClick={handleClick}
        disabled={isUpdating}
      >
        {buttonText}
      </button>
    )
  }

  const refreshHardwareData = () => {
    mutateHardwareRequests();
    mutateHardwareDevices();
  }

  const patchHardwareRequest = (hardwareRequestId: string, updateRequestBody: PatchedHardwareRequestRequest) => {
    if (hardwareRequestId.length == 0) {
      toast.error('Hardware request ID is empty');
      return null;
    }
    if (!session?.access_token) {
      toast.error('No access token');
      return null;
    }
    setIsUpdating(true);
    const accessToken = session.access_token;
    // TODO: can we optimistically update?
    hardwarerequestsPartialUpdate(hardwareRequestId, updateRequestBody, {
      headers: {
        'Authorization': `JWT ${accessToken}`
      }
    })
      .then(() => refreshHardwareData())
      .catch((error) => {
      console.error(error);
      toast.error(`Failed to update hardware request: ${error.message}`);
    }).finally(() => {
      setIsUpdating(false);
    });
  }

  const renderDeleteButton = (hardwareRequestId: string | null, status: HardwareRequestStatusEnum | null) => {
    if (hardwareRequestId == null) {
      return null;
    }
    if (status == HardwareRequestStatusEnum.C) {
      return null;
    }
    const handleDelete = () => {
      if (!session?.access_token) {
        toast.error('No access token');
        return null;
      }
      setIsUpdating(true);
      hardwarerequestsDestroy(hardwareRequestId, {
        headers: {
          'Authorization': `JWT ${session?.access_token}`
        }
      })
      .then(() => refreshHardwareData())
      .catch((error) => {
        console.error(error);
        toast.error(`Failed to delete hardware request: ${error.message}`);
      }).finally(() => {
        setIsUpdating(false);
      });
    }
    return (
      <button
        className="cursor-pointer text-white bg-[#CC2F34] px-2 rounded-full disabled:opacity-50 transition-all flex-shrink self-end"
        onClick={handleDelete}
        disabled={isUpdating}
      >
        {isUpdating ? 'Updating...' : 'Delete'}
      </button>
    )
  }

  const rowStatusOptions = (
    currentStatus: HardwareRequestStatusEnum, 
    requestedDeviceId: string
  ) => {
    if (!hardwareDeviceTypeMap) return [];
    if (currentStatus == HardwareRequestStatusEnum.C) {
      return [HardwareRequestStatusOptionsCheckedOut];
    }
    if (hardwareDeviceTypeMap?.[requestedDeviceId]?.available < 1) {
      return HardwareRequestStatusOptionsFull;
    }
    return HardwareRequestStatusOptions;
  }

  const columnHelper = createColumnHelper<HardwareRequestTableRow>();
  const columns: ColumnDef<HardwareRequestTableRow, any>[] = ((
    !isAdmin ? [] : [
      columnHelper.display({
      id: 'check out',
      header: () => '',
      cell: info =>
        renderRowCheckoutButton(info.row.original)
      })
    ]
    ) as ColumnDef<HardwareRequestTableRow, any>[]).concat(
      !deletable
        ? []
        : [
            columnHelper.display({
              id: 'delete',
              header: () => '',
              cell: info => 
                renderDeleteButton(info.row.original.id || null, info.row.original.status || null)
            })
          ]
    ).concat(
    [
    // excessively deep type instantiation
    // @ts-ignore
    columnHelper.accessor('team', {
      header: () => 'Team',
      cell: info => info.getValue()?.name
    }),
    columnHelper.accessor('requester', {
      header: () => 'Requested by',
      cell: info => `${info.getValue().first_name} ${info.getValue().last_name}`
    }),
    columnHelper.accessor('hardware', {
      header: () => 'Item',
      cell: info => hardwareDeviceTypeMap?.[info.getValue()]?.name
    }),
    columnHelper.accessor('reason', {
      header: () => 'Reason',
      cell: info =>
        !reasonEditable || !info.row.original.id ? (
          info.getValue()
        ) : (
          <ReasonEditor
            initial={info.getValue()}
            id={info.row.original.id}
            access_token={session?.access_token}
            mutateHardwareRequests={mutateHardwareRequests}
          ></ReasonEditor>
        )
    }),
    columnHelper.accessor('hardware_in_stock', {
      header: () => 'In Stock',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('hardware_total', {
      header: () => 'Total',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('hardware_device', {
      header: () => 'Hardware Device Assigned',
      cell: info =>
        info.getValue() == null
          ? null
          : hardwareDeviceMap?.[info.getValue()]?.serial?.slice(0, 12)?.concat('...')
    }),
    columnHelper.accessor('status', {
      header: () => 'Status',
      cell: info =>
        !statusEditable ? (
          Object.fromEntries(
            HardwareRequestStatusOptions.map(v => [v.value, v.label])
          )[info.getValue() as hardware_request_status]
        ) : (
          <Box sx={{ minWidth: 120 }}>
            <CustomSelect
              label="Select a status"
              options={rowStatusOptions(info.getValue(), info.row.original.hardware_device || '')}
              value={info.getValue()}
              disabled={isUpdating}
              onChange={(newStatus: string) => {
                if (isAdmin) {
                  const updateRequestBody: PatchedHardwareRequestRequest = {
                    status: newStatus as HardwareRequestStatusEnum
                  }
                  patchHardwareRequest(info.row.original.id || '', updateRequestBody)
                }
              }}
            />
          </Box>
        )
    })
  ]);

  return (
    <>
      <div className="z-50 px-6 py-6 overflow-y-scroll bg-[#FCFCFC] border-gray-300 rounded-2xl">
        <div className="overflow-y-scroll z-50 rounded-l border border-[#EEEEEE]">
          <Table
            data={tableData || []}
            columns={columns as ColumnDef<HardwareRequestList, any>[]}
            pagination={true}
            loading={isLoadingHardwareRequests}
            search={true}
          ></Table>
        </div>
      </div>
    </>
  );
}

function ReasonEditor({
  initial,
  id,
  access_token,
  mutateHardwareRequests
}: {
  initial: string;
  id: string;
  access_token: string | undefined;
  mutateHardwareRequests: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [initial_, setInitial] = useState(initial);
  const [value, setValue] = useState(initial);

  const submit = ((newReason: string) => {
    if (!access_token) return;
    setLoading(true);
    hardwarerequestsPartialUpdate(id, { reason: newReason}, {
      headers: {
        'Authorization': `JWT ${access_token}`
      }
    }).then(() => {
      setValue(newReason);
      setInitial(newReason);
      mutateHardwareRequests();
    })
    .catch((error) => {
      console.error(error);
      toast.error(`Failed to update hardware request: ${error.message}`);
    })
    .finally(() => {
      setLoading(false);
    });
  });

  return loading ? <LinearProgress /> : (
    <>
      {value == initial_ ? <input value={value} onChange={e => setValue(e.target.value)}></input>
      : <>
        <textarea value={value} onChange={e => setValue(e.target.value)} rows={4}></textarea>
        <div className="flex flex-row">          
          <button
            className="cursor-pointer text-white bg-[#493B8A] px-2 mx-2 rounded-full disabled:opacity-50 transition-all flex-shrink h-5 self-end"
            onClick={() => submit(value)}
          >
            Submit
          </button>
          <button
            className="cursor-pointer text-white bg-red-800 px-2 mx-2 rounded-full disabled:opacity-50 transition-all flex-shrink h-5 self-end"
            onClick={() => setValue(initial_)}
          >
            Cancel
          </button>
        </div>
      </>}
    </>
  );
}
