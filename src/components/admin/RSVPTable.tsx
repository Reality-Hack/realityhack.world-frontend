'use client';
import {
  applicationOptions,
  getAllHackerApplications,
  updateApplication
} from '@/app/api/application';
import { getUploadedFile } from '@/app/api/uploaded_files';
import CustomSelect from '@/components/CustomSelect';
import Table from '@/components/Table';
import { Application, status } from '@/types/types';
import { getAllRSVPs, rsvpOptions } from '@/app/api/rsvp';
import Box from '@mui/material/Box';
import { ColumnDef, Row, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from '../Modal';
import { ExportButton, exportToCsv } from '@/app/utils/ExportUtils';

interface ApplicationTableProps {
  type: string;
}

export default function ApplicationTable({ type }: ApplicationTableProps) {
  const [dialogRow, setDialogRow] = useState<any | void>(undefined);
  const [RSVP, setRSVP] = useState<any>([]);
  const [options, setOptions] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const isAdmin = session && session.roles?.includes('admin');

  useEffect(() => {
    const getData = async () => {
      const options = await rsvpOptions(RSVP);
      setOptions(options);
    };
    getData();
  }, []);

  useEffect(() => {
    if (session?.access_token && isAdmin) {
      setLoading(true);
      getAllRSVPs(session.access_token)
        .then(apps => {
          const filteredApps = apps.filter((app: any) => {
            if (type === 'P') {
              return (
                app.participation_class === 'P' ||
                typeof app.participation_class === 'undefined'
              );
            } else {
              return app.participation_class === type;
            }
          });

          const transformedApps = transformApplications(filteredApps, options);
          setRSVP(transformedApps);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [session, options]);

  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const toggleOverlay = () => {
    setOverlayVisible(prev => !prev);
  };
  const toggleOverlayAndPassData = useCallback((row: any) => {
    toggleOverlay();
    setDialogRow(row);
  }, []);

  function transformApplications(apps: any, options: any) {
    return apps.map((app: any) => {
      const transformedApp = { ...app };

      Object.keys(transformedApp).forEach(key => {
        if (key === 'status') {
          return;
        }

        if (options.actions?.POST[key]?.choices) {
          const currentValue = transformedApp[key]?.[0];
          const choice = options.actions.POST[key].choices.find(
            (c: any) => c.value === currentValue
          );
          transformedApp[key] = choice ? choice.display_name : null;
        }
      });

      return transformedApp;
    });
  }

  const onStatusChange = useCallback(
    (app: Application) => (value: string) => {
      let status: status | null = value as status;
      if (status.length === 0) {
        status = null;
      }
      let appId = RSVP.findIndex((a: Application) => a.id === app.id);

      if (appId >= 0 && session?.access_token && isAdmin) {
        setLoading(true);
        updateApplication(app.id, { status }, session.access_token)
          .then(response => {
            if (!response) {
              throw Error('application not saved');
            }
            let newApps = RSVP.slice();
            console.log('newApps: ', newApps);
            newApps[appId] = response;
            setRSVP(newApps);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    },
    [RSVP, isAdmin, session]
  );

  const columnHelper = createColumnHelper<any>();
  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      columnHelper.accessor('first_name', {
        header: () => 'First Name',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('last_name', {
        header: () => 'Last Name',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('email', {
        header: () => 'Email',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('shirt_size', {
        header: () => 'Shirt Size',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('communications_platform_username', {
        header: () => 'Discord Username',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('personal_phone_number', {
        header: () => 'Phone Number',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('us_visa_support_is_required', {
        header: () => 'Visa Support',
        cell: info => (info.getValue() === true ? 'Yes' : 'No')
      }),
      columnHelper.accessor('emergency_contact_name', {
        header: () => 'Emergency Contact',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('emergency_contact_phone_number', {
        header: () => 'Emergency Contact Phone Number',
        cell: info => info.getValue()
      }),
      ...(type === 'P'
        ? [
            columnHelper.accessor('special_track_snapdragon_spaces_interest', {
              header: () => 'Snapdragon Spaces Interest',
              cell: info => info.getValue()
            }),
            columnHelper.accessor(
              'special_track_future_constructors_interest',
              {
                header: () => 'Future Constructors Interest',
                cell: info => info.getValue()
              }
            )
          ]
        : []),
      columnHelper.accessor('id', {
        header: () => 'id',
        cell: info => info.getValue()
      })
    ],
    [columnHelper, onStatusChange, toggleOverlayAndPassData, type]
  );

  return (
    <>
      <div className="flex flex-row flex-wrap justify-center gap-2 mb-4">
        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Total RSVPs
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            {RSVP.length}
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Future Constructors
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            {
              RSVP.filter((app: any) => {
                return (
                  app?.special_track_future_constructors_interest === 'Yes'
                );
              }).length
            }
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Snapdragon Spaces
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            {
              RSVP.filter((app: any) => {
                return app?.special_track_snapdragon_spaces_interest === 'Yes';
              }).length
            }
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-4">
        <span className="mb-4 text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
          T Shirts Sizes
        </span>
        <div className="flex flex-row flex-wrap justify-center gap-2 mb-4">
          <div className="flex flex-col items-center px-4 py-2 w-20 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
            <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
              S
            </span>
            <span className="text-lg font-semibold text-black text-opacity-90">
              {
                RSVP.filter((app: any) => {
                  return app?.shirt_size === 'S';
                }).length
              }
            </span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 w-20 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
            <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
              M
            </span>
            <span className="text-lg font-semibold text-black text-opacity-90">
              {
                RSVP.filter((app: any) => {
                  return app?.shirt_size === 'M';
                }).length
              }
            </span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 w-20 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
            <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
              L
            </span>
            <span className="text-lg font-semibold text-black text-opacity-90">
              {
                RSVP.filter((app: any) => {
                  return app?.shirt_size === 'L';
                }).length
              }
            </span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 w-20 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
            <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
              XL
            </span>
            <span className="text-lg font-semibold text-black text-opacity-90">
              {
                RSVP.filter((app: any) => {
                  return app?.shirt_size === 'XL';
                }).length
              }
            </span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 w-20 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
            <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
              XXL
            </span>
            <span className="text-lg font-semibold text-black text-opacity-90">
              {
                RSVP.filter((app: any) => {
                  return app?.shirt_size === 'XL';
                }).length
              }
            </span>
          </div>
        </div>
      </div>

      <ExportButton onExport={() => exportToCsv(setRSVP, 'applications.csv')}>
        Export CSV
      </ExportButton>
      <div className="z-50 px-6 py-6 overflow-y-scroll bg-[#FCFCFC] border-gray-300 rounded-2xl">
        <div className="h-[629px] overflow-y-scroll z-50 rounded-l border border-[#EEEEEE]">
          <Table
            data={RSVP}
            columns={columns}
            search={true}
            pagination={true}
            loading={loading}
          />
        </div>
      </div>
      {isOverlayVisible && (
        <ReviewModal
          toggleOverlay={toggleOverlay}
          item={dialogRow}
          data={RSVP}
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
        {<div>{/* <ReviewPage allInfo={i} /> */}</div>}
      </Modal>
    </div>
  );
}
