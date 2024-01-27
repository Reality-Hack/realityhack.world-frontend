'use client';
import {
  getHardwareRequests,
  patchHardwareRequest,
  deleteHardwareRequest,
  getAllHardware,
  getHardwareDevice,
  updateHardwareDevice
} from '@/app/api/hardware';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import Table from '@/components/Table';
import {
  Hardware,
  HardwareDevice,
  HardwareRequestBrief,
  HardwareRequest,
  hardware_request_status,
  hardware_requester
} from '@/types/types';
import Box from '@mui/material/Box';
import CustomSelect from '@/components/CustomSelect';
import { TextInput } from './Inputs';
import { LinearProgress } from '@mui/material';

const HardwareRequestStatusOptions: {
  label: string;
  value: hardware_request_status;
}[] = [
  {
    label: 'Pending',
    value: hardware_request_status.pending
  },
  {
    label: 'Approved',
    value: hardware_request_status.approved
  },
  {
    label: 'Rejected',
    value: hardware_request_status.rejected
  },
  {
    label: 'Checked Out',
    value: hardware_request_status.checked_out
  }
];
const HardwareRequestStatusOptionsDisplay = HardwareRequestStatusOptions.slice(
  0,
  3
);
const HardwareRequestStatusOptionsCheckedOut =
  HardwareRequestStatusOptions.slice(3);
const HardwareRequestStatusOptionsFull = [
  HardwareRequestStatusOptions[0],
  HardwareRequestStatusOptions[2]
];

export default function HardwareRequestView({
  statusEditable = false,
  reasonEditable = false,
  deletable = false,
  onlyApproved = false,
  requester = null,
  hardwareDevice = null,
  setCheckedOutTo = () => {}
}: {
  statusEditable?: boolean;
  reasonEditable?: boolean;
  deletable?: boolean;
  onlyApproved?: boolean;
  requester?: hardware_requester;
  hardwareDevice?: HardwareDevice | null;
  setCheckedOutTo?: (
    newApp: HardwareRequest | HardwareRequestBrief | null
  ) => void;
}) {
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [hardwareLoading, setHardwareLoading] = useState(true);
  const { data: session } = useSession();
  const isAdmin = session && session.roles?.includes('admin');
  const [requests, setRequests] = useState<HardwareRequestBrief[]>([]);
  const [hardware, setHardware] = useState<{ [k: string]: Hardware }>({});
  useEffect(() => {
    if (session?.access_token) {
      setHardwareLoading(true);
      getAllHardware(session.access_token)
        .then(hardware => {
          setHardware(
            Object.fromEntries(hardware.map((h: Hardware) => [h.id, h]))
          );
        })
        .finally(() => setHardwareLoading(false));
    }
  }, [session]);
  useEffect(() => {
    (async () => {
      if (session?.access_token) {
        setRequestsLoading(true);
        try {
          const requests = await getHardwareRequests(
            session.access_token,
            requester
          );
          const requestsWithDevice = await Promise.all(
            requests.map(async (r: any) => ({
              ...r,
              hardware_device:
                r.hardware_device == null
                  ? null
                  : await getHardwareDevice(session.access_token, {
                      id: r.hardware_device
                    })
            }))
          );
          setRequests(
            requestsWithDevice.filter(
              (r: HardwareRequestBrief) =>
                !onlyApproved || r.status == hardware_request_status.approved
            )
          );
          setRequestsLoading(false);
        } catch (e) {
          setRequestsLoading(false);
          throw e;
        }
      }
    })();
  }, [session, requester]);
  const columnHelper = createColumnHelper<HardwareRequestBrief>();
  const columns: ColumnDef<HardwareRequestBrief, any>[] = ((
      !isAdmin
        ? []
        : [
            columnHelper.display({
              id: 'check out',
              header: () => '',
              cell: info =>
                hardwareDevice == null ? null : info.row.original.status ==
                    hardware_request_status.approved &&
                  hardwareDevice.checked_out_to == null &&
                  info.row.original.hardware_device == null &&
                  info.row.original.hardware == hardwareDevice.hardware.id ? (
                  <button
                    className="cursor-pointer text-white bg-[#2FCC32] px-2 rounded-full disabled:opacity-50 transition-all flex-shrink self-end"
                    onClick={() => {
                      if (session?.access_token) {
                        setRequestsLoading(true);
                        (async () => {
                          const newApp: HardwareRequestBrief = await patchHardwareRequest(
                            session.access_token,
                            info.row.original.id,
                            {
                              status: hardware_request_status.checked_out,
                              hardware_device: hardwareDevice
                            }
                          )
                          const newRequests = [...requests];
                          newRequests[info.row.index].status = newApp.status;
                          if(typeof newApp.hardware_device === 'string' || newApp.hardware_device instanceof String) {
                            //@ts-ignore
                            const newDevice = await getHardwareDevice(session.access_token, {id: newApp.hardware_device});
                            const newRequests = [...requests];
                            newRequests[info.row.index].hardware_device = newDevice;
                          } else {
                            newRequests[info.row.index].hardware_device = newApp.hardware_device;
                          }
                          setRequests(newRequests);
                          setCheckedOutTo(newApp);
                        })().finally(() => setRequestsLoading(false));
                      }
                    }}
                  >
                    Check Out
                  </button>
                ) : info.row.original.status ==
                    hardware_request_status.checked_out &&
                  info.row.original.hardware_device?.id == hardwareDevice.id ? (
                  <button
                    className="cursor-pointer text-white bg-[#CCAA2F] px-2 rounded-full disabled:opacity-50 transition-all flex-shrink self-end"
                    onClick={() => {
                      if (session?.access_token) {
                        setRequestsLoading(true);
                        Promise.all([patchHardwareRequest(
                          session.access_token,
                          info.row.original.id,
                          {
                            id: info.row.original.id,
                            status: hardware_request_status.approved,
                            hardware_device: null
                          }
                        ),
                        updateHardwareDevice(session.access_token, {
                          id: hardwareDevice.id,
                          checked_out_to: null
                        })
                      ]).then(([newApp, newDevice]) => {
                            console.log("new app:", newApp)
                            console.log("new device:", newDevice)
                            if (
                              newApp.status != hardware_request_status.approved
                            ) {
                              return;
                            }
                            const newRequests = [...requests];
                            newRequests[info.row.index].status = hardware_request_status.approved;
                            newRequests[info.row.index].hardware_device = null;
                            setRequests(newRequests);
                            setCheckedOutTo(null);
                          })
                          .finally(() => {
                            setRequestsLoading(false);
                          });
                      }
                    }}
                  >
                    Return
                  </button>
                ) : null
            })
          ]
    ) as ColumnDef<HardwareRequestBrief, any>[]).concat(
      !deletable
        ? []
        : [
            columnHelper.display({
              id: 'delete',
              header: () => '',
              cell: info =>
                [
                  hardware_request_status.rejected,
                  hardware_request_status.checked_out
                ].includes(info.row.original.status) ? null : (
                  <button
                    className="cursor-pointer text-white bg-[#CC2F34] px-2 rounded-full disabled:opacity-50 transition-all flex-shrink self-end"
                    onClick={() => {
                      if (session?.access_token) {
                        setRequestsLoading(true);
                        deleteHardwareRequest(
                          session.access_token,
                          info.row.original.id
                        )
                          .then(() => {
                            if (
                              info.row.original.status ==
                              hardware_request_status.approved
                            ) {
                              hardware[
                                info.row.original.hardware
                              ].available += 1;
                            }
                            setRequests(
                              requests
                                .slice(0, info.row.index)
                                .concat(requests.slice(info.row.index + 1))
                            );
                          })
                          .finally(() => {
                            // TODO: .catch
                            setRequestsLoading(false);
                          });
                      }
                    }}
                  >
                    Delete
                  </button>
                )
            })
          ]
    ).concat(
    [
    // excessively deep type instantiation
    // @ts-ignore
    columnHelper.accessor('team', {
      header: () => 'Team',
      cell: info => info.getValue()
    }),
    columnHelper.accessor('requester', {
      header: () => 'Requested by',
      cell: info => `${info.getValue().first_name} ${info.getValue().last_name}`
    }),
    columnHelper.accessor('hardware', {
      header: () => 'Item',
      cell: info => hardware[info.getValue()]?.name
    }),
    columnHelper.accessor('reason', {
      header: () => 'Reason',
      cell: info =>
        !reasonEditable ? (
          info.getValue()
        ) : (
          <ReasonEditor
            initial={info.getValue()}
            id={info.row.original.id}
            access_token={session?.access_token}
          ></ReasonEditor>
        )
    }),
    columnHelper.accessor('hardware', {
      header: () => 'In Stock',
      cell: info => hardware[info.getValue()]?.available
    }),
    columnHelper.accessor('hardware', {
      header: () => 'Total',
      cell: info => hardware[info.getValue()]?.total
    }),
    columnHelper.accessor('hardware_device', {
      header: () => 'Hardware Device Assigned',
      cell: info =>
        info.getValue() == null
          ? null
          : info.getValue()?.serial?.slice(0, 12)?.concat('...')
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
              options={
                !hardware[info.row.original.hardware]
                  ? []
                  : info.getValue() == 'C'
                  ? HardwareRequestStatusOptionsCheckedOut
                  : hardware[info.row.original.hardware].available < 1
                  ? HardwareRequestStatusOptionsFull
                  : HardwareRequestStatusOptionsDisplay
              }
              value={info.getValue()}
              onChange={(newStatus: string) => {
                if (session?.access_token && isAdmin) {
                  setRequestsLoading(true);
                  setHardwareLoading(true);
                  const status = newStatus as hardware_request_status;
                  patchHardwareRequest(
                    session.access_token,
                    info.row.original.id,
                    {
                      status
                    }
                  )
                    .then((newApp: HardwareRequestBrief) => {
                      const newHardware = Object.fromEntries(
                        Object.entries(hardware)
                      );
                      if (newApp.status == hardware_request_status.approved) {
                        hardware[info.row.original.hardware].available -= 1;
                      } else if (
                        newApp.status == hardware_request_status.rejected &&
                        info.row.original.status ==
                          hardware_request_status.approved
                      ) {
                        hardware[info.row.original.hardware].available += 1;
                      }
                      const newRequests = [...requests];
                      newRequests[info.row.index].status = newApp.status;
                      newRequests[info.row.index].hardware_device =
                        newApp.hardware_device;
                      setRequests(newRequests);
                      setHardware(newHardware);
                    })
                    .finally(() => {
                      // TODO: .catch
                      setRequestsLoading(false);
                      setHardwareLoading(false);
                    });
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
            data={requests}
            columns={columns}
            pagination={true}
            loading={requestsLoading || hardwareLoading}
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
  access_token
}: {
  initial: string;
  id: string;
  access_token: string | undefined;
}) {
  const [loading, setLoading] = useState(false);
  const [initial_, setInitial] = useState(initial);
  const [value, setValue] = useState(initial);

  const submit = ((newReason: string) => {
    if (!access_token) return;
    setLoading(true);
    patchHardwareRequest(
      access_token,
      id,
      {
        reason: newReason
      }
    )
      .then((newApp: HardwareRequestBrief) => {
        setInitial(newApp.reason);
      })
      .finally(() => {
        // TODO: .catch
        setLoading(false);
      });
  });

  return loading ? <LinearProgress /> : (
    <>
      {value == initial_ ? <input value={value} onChange={e => setValue(e.target.value)}></input>
      : <>
        <textarea value={value} onChange={e => setValue(e.target.value)} rows={4}></textarea>
        <button
          className="cursor-pointer text-white bg-[#493B8A] px-2 mx-2 rounded-full disabled:opacity-50 transition-all flex-shrink h-5 self-end"
          onClick={() => submit(value)}
        >
          Submit
        </button>
      </>}
    </>
  );
}
