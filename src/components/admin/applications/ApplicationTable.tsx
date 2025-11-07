'use client';
import {
  updateApplication,
  applicationOptions
} from '@/app/api/application';
import { useApplicationsList } from '@/types/endpoints';
import { getUploadedFile } from '@/app/api/uploaded_files';
import { ExportButton, exportToCsv } from '@/app/utils/ExportUtils';
import CustomSelect from '@/components/CustomSelect';
import Table from '@/components/Table';
import { status } from '@/types/types';
import { Application } from '@/types/models';
import Box from '@mui/material/Box';
import { ColumnDef, Row, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from '../../Modal';
import ReviewPage from '../ReviewPage';
import { toast } from 'sonner';
import Loader from '@/components/Loader';

interface ApplicationTableProps {
  type: string;
}

const ApplicationStatusOptions: {
  label: string;
  value: status;
}[] = [
  {
    label: 'Accepted In Person',
    value: status.accepted_in_person
  },
  {
    label: 'Accepted Online',
    value: status.accepted_online
  },
  {
    label: 'Waitlist In Person',
    value: status.waitlist_in_person
  },
  {
    label: 'Waitlist Online',
    value: status.waitlist_online
  },
  {
    label: 'Declined',
    value: status.declined
  }
];

export default function ApplicationTable({ type }: ApplicationTableProps) {
  const [dialogRow, setDialogRow] = useState<any | void>(undefined);
  const [options, setOptions] = useState<any>({});
  const [transformedApplications, setTransformedApplications] = useState<Application[]>([]);
  const { data: session } = useSession();
  const isAdmin = session && session.roles?.includes('admin');
  const [dataTransformFinished, setDataTransformFinished] = useState(false);

  const { 
    data: applications, 
    isLoading: isLoadingApplications,
    mutate: revalidateApplications
  } = useApplicationsList({}, {
    swr: { enabled: !!session?.access_token },
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  useEffect(() => {
    const getData = async () => {
      const options = await applicationOptions();
      setOptions(options);
    };
    getData();
  }, []);

  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const toggleOverlay = () => {
    setOverlayVisible(prev => !prev);
  };
  const toggleOverlayAndPassData = useCallback((row: any) => {
    toggleOverlay();
    setDialogRow(row);
  }, []);

  useEffect(() => {
    if (applications) {
      const transformedApps = transformApplications(applications, options);
      setTransformedApplications(transformedApps);
      setDataTransformFinished(true);
    }
  }, [applications, options]);

  function transformApplications(apps: Application[], options: any): Application[] {
    setDataTransformFinished(false);
    const transformedApps = apps.map((app: any) => {
      const transformedApp = { ...app };

      Object.keys(transformedApp).forEach(key => {
        if (key === 'status') {
          return;
        }

        if (options.actions?.POST[key]?.choices) {
          if (transformedApp[key]?.length < 1) {
            transformedApp[key] = '';
          }
          const choices = options.actions.POST[key].choices;
          if (Array.isArray(transformedApp[key])) {
            const mappedValues = transformedApp[key].map((value: any) => {
              const choice = choices.find((c: any) => c.value === value);
              return choice ? choice.display_name : '';
            });
            transformedApp[key] = mappedValues.join(', ');
          } else {
            const choice = choices.find(
              (c: any) => c.value === transformedApp[key]
            );
            transformedApp[key] = choice ? choice.display_name : null;
          }
        }
      });

      return transformedApp;
    });
    setDataTransformFinished(true);
    return transformedApps;
  }

  const onStatusChange = useCallback(
    (app: Application) => (value: string) => {
      if (isLoadingApplications || !applications) {
        toast.error('Loading applications...');
        return;
      }
      let status: status | null = value as status;
      if (status.length === 0) {
        status = null;
      }
      let appId = applications.findIndex((a: Application) => a.id === app.id);

      if (appId >= 0 && session?.access_token && isAdmin) {
        setDataTransformFinished(false);
        updateApplication(app?.id ?? '', { status }, session.access_token)
          .then(response => {
            if (!response) {
              toast.error('Failed to update application');
              return;
            }
            revalidateApplications();
            setTransformedApplications(transformedApplications.map((a: Application) => a.id === app.id ? response : a));
          })
          .finally(() => {
            setDataTransformFinished(true);
          });
      }
    },
    [applications, isAdmin, session]
  );

  const getResume = useCallback(
    (resumeId: string) => () => {
      if (session?.access_token && isAdmin) {
        getUploadedFile(resumeId, session.access_token).then(response => {
          if (!response) {
            throw Error('failed to get file');
          }
          window.open(response.file, '_blank')?.focus();
        });
      }
    },
    [isAdmin, session]
  );

  const columnHelper = createColumnHelper<Application>();
  const columns = useMemo<ColumnDef<Application, any>[]>(
    () => [
      columnHelper.accessor('first_name', {
        header: () => 'First Name',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('last_name', {
        header: () => 'Last Name',
        cell: info => info.getValue()
      }),
      columnHelper.display({
        id: 'view',
        header: () => 'View Full App',
        cell: props => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40
            }}
          >
            <button
              className="bg-gray-300 dark:bg-gray-700 rounded-[6px] leading-5 text-xs py-0.5 px-2"
              onClick={() => {
                toggleOverlayAndPassData(props.row);
              }}
            >
              Open App
            </button>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: () => 'Email',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('status', {
        header: () => 'Status',
        cell: info => (
          <Box sx={{ minWidth: 120 }}>
            <CustomSelect
              label="Select a status"
              options={ApplicationStatusOptions}
              value={info.getValue()}
              onChange={onStatusChange(info.row.original)}
            />
          </Box>
        )
      }),
      columnHelper.accessor('portfolio', {
        header: () => 'Portfolio Link',
        cell: info => (
          <a
            target="_blank"
            href={info.getValue()}
            className="text-blue-600 visited:text-purple-600"
          >
            {info.getValue()}
          </a>
        )
      }),
      columnHelper.accessor('resume', {
        header: () => 'Resume',
        cell: info => (
          <a
            onClick={getResume(info.getValue())}
            className="text-blue-600 cursor-pointer visited:text-purple-600"
          >
            Resume
          </a>
        )
      }),
      ...(type === 'P'
        ? [
            columnHelper.accessor('current_city', {
              header: () => 'City',
              cell: info => info.getValue()
            }),
            columnHelper.accessor('current_country', {
              header: () => 'Country',
              cell: info => info.getValue()
            }),
            columnHelper.accessor('nationality', {
              header: () => 'Nationality',
              cell: info => info.getValue()
            }),
            columnHelper.accessor('age_group', {
              header: () => 'Age',
              cell: info => info.getValue()
            })
          ]
        : []),
      columnHelper.accessor('submitted_at', {
        header: () => 'Submitted On',
        cell: info =>
          DateTime.fromISO(info.getValue()).toLocaleString(
            DateTime.DATETIME_SHORT
          )
      }),
      columnHelper.accessor('updated_at', {
        header: () => 'Updated On',
        cell: info =>
          DateTime.fromISO(info.getValue()).toLocaleString(
            DateTime.DATETIME_SHORT
          )
      }),
      columnHelper.accessor('id', {
        header: () => 'id',
        cell: info => info.getValue()
      })
    ],
    [columnHelper, onStatusChange, toggleOverlayAndPassData, type] // type is included in the dependency array
  );

  if (isLoadingApplications) {
    return <Loader />;
  }

  return (
    <>
      <div className="flex flex-row flex-wrap justify-center gap-2 mb-4">
        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Total applications
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            {applications?.length ?? 0}
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Accepted
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            {
              applications?.filter(app => {
                return app?.status === 'AO' || app?.status === 'AI';
              }).length
            }
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Waitlisted
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            {
              applications?.filter(app => {
                return app?.status === 'WO' || app?.status === 'WI';
              }).length
            }
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Rejected
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            {
              applications?.filter(app => {
                return app?.status === 'D';
              }).length
            }
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Accepted rate
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            {(() => {
              const acceptedCount = applications?.filter(
                app => app?.status === 'AO' || app?.status === 'AI'
              ).length;
              const totalCount = applications?.length ?? 0;
              const percentage =
                totalCount > 0 ? (acceptedCount ?? 0 / totalCount) * 100 : 0;
              return `${percentage.toFixed(1)}%`;
            })()}
          </span>
        </div>
      </div>

      <ExportButton
        onExport={() => exportToCsv(applications, 'applications.csv')}
      >
        Export CSV
      </ExportButton>
      <div className="z-50 px-6 py-6 overflow-y-scroll bg-[#FCFCFC] border-gray-300 rounded-2xl">
        <div className="h-[430px] overflow-y-scroll z-50 rounded-l border border-[#EEEEEE]">
          <Table
            data={transformedApplications ?? []}
            columns={columns}
            search={true}
            pagination={true}
            loading={isLoadingApplications || !dataTransformFinished}
          />
        </div>
      </div>
      {isOverlayVisible && (
        <ReviewModal
          toggleOverlay={toggleOverlay}
          item={dialogRow}
          data={transformedApplications ?? []}
        />
      )}
    </>
  );
}

type ReviewModalProps = {
  toggleOverlay: () => void;
  item: Row<Application>;
  data: Application[];
};

function ReviewModal({ item, data, toggleOverlay }: ReviewModalProps) {
  const applicationData = data[item.id as any];
  return (
    <div>
      <Modal toggleOverlay={toggleOverlay}>
        {
          <div>
            <ReviewPage allInfo={applicationData} />
          </div>
        }
      </Modal>
    </div>
  );
}
