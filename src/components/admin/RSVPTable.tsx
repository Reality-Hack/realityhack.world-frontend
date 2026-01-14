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
import { useEventrsvpsList } from '@/types/endpoints';
import { EventRsvp, EventrsvpsListParticipationClass, ShirtSizeEnum } from '@/types/models';
import Loader from '@/components/Loader';
import { useRSVPStats, ShirtSizeLabel, SHIRT_SIZE_MAP } from '@/hooks/useRSVPStats';
import { buildChoiceMap } from '@/app/utils/buildChoiceMap';

interface RsvpTableProps {
  type: EventrsvpsListParticipationClass | undefined;
}

export default function RsvpTable({ type }: RsvpTableProps) {
  const { data: session } = useSession();

  const {
    data: eventRsvps,
    isLoading: isLoadingEventRsvps,
    mutate: revalidateEventRsvps
  } = useEventrsvpsList({
    participation_class: type
  }, {
    swr: { enabled: !!session?.access_token },
    request: {
      headers: {
        'Authorization': `JWT ${session?.access_token}`
      }
    }
  });

  const [options, setOptions] = useState<any>({});
  useEffect(() => {
    const getData = async () => {
      const options = await rsvpOptions({});
      setOptions(options);
    };
    getData();
  }, []);

  const choiceMaps = useMemo(() => ({
    participationRole: buildChoiceMap(options, 'participation_role'),
    shirtSize: buildChoiceMap(options, 'shirt_size'),
    dietaryRestrictions: buildChoiceMap(options, 'dietary_restrictions'),
    dietaryAllergies: buildChoiceMap(options, 'dietary_allergies'),
    participationClass: buildChoiceMap(options, 'participation_class'),
  }), [options]);

  console.log(choiceMaps);

  const { 
    total, 
    shirtSizes, 
    specialInterestTrackOneCounts, 
    specialInterestTrackTwoCounts,
  } = useRSVPStats();

  const mappedEventRsvps = useMemo(() => {
    if (!eventRsvps) return [];
  return eventRsvps
    .map((rsvp: EventRsvp) => {
      const { 
        application, 
        attendee, 
        event,
        app_in_store,
        currently_build_for_xr,
        currently_use_xr,
        non_xr_talents,
        ar_vr_ap_in_store,
        participation_role,
        shirt_size,
        dietary_restrictions,
        dietary_allergies,
        participation_class,
        ...rsvpData 
      } = rsvp;
      return {
        first_name: rsvp.application?.first_name,
        last_name: rsvp.application?.last_name,
        email: rsvp.application?.email,
        ...rsvpData,
        shirt_size: shirt_size ? choiceMaps.shirtSize[shirt_size] : null,
        participation_role: participation_role ? choiceMaps.participationRole[participation_role] : null,
        dietary_restrictions: dietary_restrictions?.map((restriction: string) => choiceMaps.dietaryRestrictions[restriction]).join(', '),
        dietary_allergies: dietary_allergies?.map((allergy: string) => choiceMaps.dietaryAllergies[allergy]).join(', '),
        participation_class: participation_class ? choiceMaps.participationClass[participation_class] : null,
      }
    })

  }, [eventRsvps]);

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
      columnHelper.accessor('communication_platform_username', {
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
            columnHelper.accessor('special_interest_track_one', {
              header: () => 'Founders Lab Interest',
              cell: info => (info.getValue() === true ? 'Yes' : 'No')
            }),
            columnHelper.accessor(
              'special_interest_track_two',
              {
                header: () => 'Future Constructors Interest',
                cell: info => (info.getValue() === true ? 'Yes' : 'No')
              }
            )
          ]
        : []),
      columnHelper.accessor('under_18_by_date', {
        header: () => 'Under 18 By Date',
        cell: info => (info.getValue() === true ? 'Yes' : 'No')
      }),
      columnHelper.accessor('id', {
        header: () => 'id',
        cell: info => info.getValue()
      })
    ],
    [columnHelper, type]
  );

  return (
    <>
      <div className="flex flex-row flex-wrap justify-center gap-2 mb-4">
        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Total RSVPs
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            {total}
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Founders Lab Interest
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            { specialInterestTrackOneCounts }
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Hardware Hack
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            { specialInterestTrackTwoCounts }
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
              { shirtSizes[ShirtSizeLabel.S] }
            </span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 w-20 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
            <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
              M
            </span>
            <span className="text-lg font-semibold text-black text-opacity-90">
              { shirtSizes[ShirtSizeLabel.M] }
            </span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 w-20 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
            <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
              L
            </span>
            <span className="text-lg font-semibold text-black text-opacity-90">
              { shirtSizes[ShirtSizeLabel.L] }
            </span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 w-20 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
            <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
              XL
            </span>
            <span className="text-lg font-semibold text-black text-opacity-90">
              { shirtSizes[ShirtSizeLabel.XL] }
            </span>
          </div>
          <div className="flex flex-col items-center px-4 py-2 w-20 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
            <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
              XXL
            </span>
            <span className="text-lg font-semibold text-black text-opacity-90">
              { shirtSizes[ShirtSizeLabel.XXL] }
            </span>
          </div>
        </div>
      </div>

      <ExportButton onExport={() => exportToCsv(mappedEventRsvps || [], 'rsvps.csv')} disabled={isLoadingEventRsvps}>
        Export CSV
      </ExportButton>
      <div className="z-50 px-6 py-6 overflow-y-scroll bg-[#FCFCFC] border-gray-300 rounded-2xl">
        {eventRsvps && !isLoadingEventRsvps ? (
          <div className="h-1/2 overflow-y-scroll z-50 rounded-l border border-[#EEEEEE]">
            <Table
              data={mappedEventRsvps}
              columns={columns}
              search={true}
              pagination={true}
              loading={isLoadingEventRsvps}
            />
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}
