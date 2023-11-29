'use client';
import {
  getAllHackerApplications,
  updateApplication
} from '@/app/api/application';
import CustomSelect from '@/components/CustomSelect';
import Table from '@/components/Table';
import { Application, status } from '@/types/types';
import Box from '@mui/material/Box';
import { ColumnDef, Row, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from '../../Modal';
import ReviewPage from '../ReviewPage';

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

export default function HackerApplicationTable() {
  const [dialogRow, setDialogRow] = useState<any | void>(undefined);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const isAdmin = session && session.roles?.includes('admin');

  useEffect(() => {
    if (session?.access_token && isAdmin) {
      setLoading(true);
      getAllHackerApplications(session.access_token)
        .then(apps => {
          setApplications(apps);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const toggleOverlay = () => {
    setOverlayVisible(prev => !prev);
  };
  const toggleOverlayAndPassData = useCallback((row: any) => {
    toggleOverlay();
    setDialogRow(row);
  }, []);

  const onStatusChange = useCallback(
    (app: Application) => (value: string) => {
      let status: status | null = value as status;
      if (status.length === 0) {
        status = null;
      }
      let appId = applications.findIndex((a: Application) => a.id === app.id);

      if (appId >= 0 && session?.access_token && isAdmin) {
        setLoading(true);
        updateApplication(app.id, { status }, session.access_token)
          .then(response => {
            if (!response) {
              throw Error('application not saved');
            }
            let newApps = applications.slice();
            newApps[appId] = response;
            setApplications(newApps);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [applications, isAdmin, session]
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
            target="_blank"
            href={info.getValue()}
            className="text-blue-600 visited:text-purple-600"
          >
            Resume
          </a>
        )
      }),
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
      }),
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
      })
    ],
    [columnHelper, onStatusChange, toggleOverlayAndPassData]
  );

  return (
    <>
      <Table
        data={applications}
        columns={columns}
        search={true}
        pagination={true}
        loading={loading}
      />
      {isOverlayVisible && (
        <ReviewModal
          toggleOverlay={toggleOverlay}
          item={dialogRow}
          data={applications}
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
  const i = data[item.id as any];
  return (
    <div>
      <Modal toggleOverlay={toggleOverlay}>
        {
          <div>
            <ReviewPage allInfo={i} />
          </div>
        }
      </Modal>
    </div>
  );
}
