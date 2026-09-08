'use client';
import { applicationOptions } from '@/app/api/application';
import {
  applicationsPartialUpdate,
  useApplicationsList,
} from '@/types/endpoints';
import { getUploadedFile } from '@/app/api/uploaded_files';
import { ExportButton, exportToCsv } from '@/app/utils/ExportUtils';
import CustomSelect from '@/components/CustomSelect';
import Table from '@/components/Table';
import {
  ApplicationDetail,
  ApplicationsListParticipationClass,
  ApplicationStatusEnum,
  PatchedApplicationRequest,
} from '@/types/models';
import Box from '@mui/material/Box';
import {
  ColumnDef,
  Row,
  RowSelectionState,
  createColumnHelper
} from '@tanstack/react-table';
import { formatDateTime } from '@/app/utils/dateUtils';
import { useSession } from '@/auth/client';
import { HTMLProps, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../Modal';
import ReviewPage from '../ReviewPage';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const APPLICATION_STATUS_OPTIONS: { label: string; value: ApplicationStatusEnum }[] = [
  {
    label: 'Accepted',
    value: ApplicationStatusEnum.A
  },
  {
    label: 'Waitlisted',
    value: ApplicationStatusEnum.W
  },
  {
    label: 'Declined',
    value: ApplicationStatusEnum.D
  }
];

const PARTICIPATION_CLASS_OPTIONS: { label: string; value: ApplicationsListParticipationClass }[] = [
  { label: 'Participant', value: ApplicationsListParticipationClass.P },
  { label: 'Mentor',      value: ApplicationsListParticipationClass.M },
  { label: 'Judge',       value: ApplicationsListParticipationClass.J },
];

export default function ApplicationTable() {
  const [dialogRow, setDialogRow] = useState<any | void>(undefined);
  const [options, setOptions] = useState<any>({});
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);
  const [selectedClasses, setSelectedClasses] = useState<ApplicationsListParticipationClass[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<ApplicationStatusEnum[]>([]);
  const { data: session } = useSession();
  const { isAdmin } = useAuth();

  const toggleClass = (value: ApplicationsListParticipationClass) => {
    setSelectedClasses(prev =>
      prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]
    );
  };

  const toggleStatus = (value: ApplicationStatusEnum) => {
    setSelectedStatuses(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
  };

  const {
    data: applications,
    isLoading: isLoadingApplications,
    mutate: revalidateApplications
  } = useApplicationsList({
    ...(selectedClasses.length > 0 && { participation_classes: selectedClasses }),
    ...(selectedStatuses.length > 0 && { statuses: selectedStatuses }),
  }, {
    swr: { enabled: !!session?.access_token },
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const options = await applicationOptions();
        setOptions(options);
      } finally {
        setIsOptionsLoading(false);
      }
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

  function transformApplications(apps: ApplicationDetail[], options: any): ApplicationDetail[] {
    const OMITTED_APPLICATION_FIELDS = new Set([
      'theme_essay',
      'theme_essay_follow_up',
      'theme_interest_track_one',
      'theme_interest_track_two',
      'theme_detail_one',
      'theme_detail_two',
      'theme_detail_three',
      'hardware_hack_interest',
      'questions_responses'
    ]);

    function extractThematicResponseValue(response: any): string {
      if (response.text_response) {
        return response.text_response;
      }
      if (response.selected_keys_snapshot && response.selected_keys_snapshot.length > 0) {
        const selectedChoices = response.selected_keys_snapshot.map((key: string) => {
          return response.choices_snapshot[key] || key;
        });
        return selectedChoices.join(', ');
      }
      return '';
    }

    const thematicQuestionsMap = new Map<string, string>();
    apps.forEach((app: any) => {
      if (app.question_responses && Array.isArray(app.question_responses)) {
        app.question_responses.forEach((response: any) => {
          if (!thematicQuestionsMap.has(response.question)) {
            thematicQuestionsMap.set(response.question, response.question_text_snapshot);
          }
        });
      }
    });

    const transformedApps = apps.map((app: any) => {
      const transformedApp = { ...app };
      // transformedApp.participation_class =

      Object.keys(transformedApp).forEach(key => {
        if (key === 'status' || OMITTED_APPLICATION_FIELDS.has(key)) {
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

      thematicQuestionsMap.forEach((questionText: string, questionId: string) => {
        const response = transformedApp.question_responses?.find(
          (r: any) => r.question === questionId
        );

        const columnKey = `Thematic: ${questionText}`;
        transformedApp[columnKey] = response ? extractThematicResponseValue(response) : '';
      });

      OMITTED_APPLICATION_FIELDS.forEach(field => {
        delete transformedApp[field];
      });

      return transformedApp;
    });

    return transformedApps;
  }

  const transformedApplications = useMemo(() => {
    if (!applications) {
      return [];
    }

    return transformApplications(applications, options);
  }, [applications, options]);

  const onStatusChange = useCallback(
    (app: ApplicationDetail) => async (value: string) => {
      if (isLoadingApplications || !applications || !session?.access_token || !isAdmin) {
        toast.error('Loading applications...');
        return;
      }

      const status = value.length === 0 ? null : (value as ApplicationStatusEnum);
      const payload: PatchedApplicationRequest = { status };

      try {
        await revalidateApplications(
          async currentApplications => {
            if (!currentApplications) {
              return [];
            }

            await applicationsPartialUpdate(app.id ?? '', payload, {
              headers: {
                Authorization: `Bearer ${session.access_token}`,
              },
            });

            return currentApplications;
          },
          {
            optimisticData: currentApplications =>
              (currentApplications ?? []).map(currentApplication =>
                currentApplication.id === app.id
                  ? { ...currentApplication, status }
                  : currentApplication
              ),
            rollbackOnError: true,
            populateCache: false,
            revalidate: true,
          }
        );
      } catch (error) {
        console.log(error)
        toast.error(error instanceof Error ? error.message : String(error));
      }
    },
    [applications, isAdmin, isLoadingApplications, revalidateApplications, session?.access_token]
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

  const columnHelper = createColumnHelper<ApplicationDetail>();
  const columns = useMemo<ColumnDef<ApplicationDetail, any>[]>(
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
      columnHelper.accessor('participation_class', {
        header: () => 'Participation Class',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('status', {
        header: () => 'Status',
        cell: info => (
          <Box sx={{ minWidth: 120 }}>
            <CustomSelect
              label="Select a status"
              options={APPLICATION_STATUS_OPTIONS}
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
        cell: info => formatDateTime(info.getValue())
      }),
      columnHelper.accessor('updated_at', {
        header: () => 'Updated On',
        cell: info => formatDateTime(info.getValue())
      }),
      columnHelper.accessor('id', {
        header: () => 'id',
        cell: info => info.getValue()
      })
    ],
    [columnHelper, onStatusChange, toggleOverlayAndPassData]
  );

  type ReducedApplicationStats = {
    acceptedCount: number;
    waitlistedCount: number;
    deniedCount: number;
    totalCount: number;
    percentage: number;
  };
  const reducedApplicationStats = (): ReducedApplicationStats => {
    if (!applications) return { acceptedCount: 0, totalCount: 0, percentage: 0, waitlistedCount: 0, deniedCount: 0 };

    const acceptedCount = applications.filter(
      app => app?.status === ApplicationStatusEnum.A
    ).length;
    const deniedCount = applications.filter(
      app => app?.status === ApplicationStatusEnum.D
    ).length;
    const waitlistedCount = applications.filter(
      app => app?.status === ApplicationStatusEnum.W
    ).length;
    const totalCount = applications.length;
    const percentage =
      totalCount > 0 ? (acceptedCount / totalCount) * 100 : 0;
    return { acceptedCount, waitlistedCount, deniedCount, totalCount, percentage };
  };
  const { acceptedCount, waitlistedCount, deniedCount, totalCount, percentage } = reducedApplicationStats();

  return (
    <>
      <div className="flex flex-row flex-wrap justify-center gap-2 mb-4">
        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Total applications
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            { totalCount }
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Accepted
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            { acceptedCount }
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Waitlisted
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            { waitlistedCount }
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Rejected
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            { deniedCount }
          </span>
        </div>

        <div className="flex flex-col items-center px-4 py-2 w-36 h-[72px] bg-white rounded-md shadow border border-black border-opacity-5">
          <span className="text-sm font-normal text-black text-opacity-90 whitespace-nowrap">
            Accepted rate
          </span>
          <span className="text-2xl font-semibold text-black text-opacity-90">
            {percentage.toFixed(acceptedCount / totalCount)}%
          </span>
        </div>
      </div>

      <div className="mb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ExportButton
            onExport={() => exportToCsv(transformedApplications, 'applications.csv')}
          >
            Export CSV
          </ExportButton>

          <fieldset className="flex items-center gap-2 mb-4 px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm">
            <legend className="text-xs text-gray-500 px-1">
              Participation class{selectedClasses.length === 0 && ' (all)'}
            </legend>
            {PARTICIPATION_CLASS_OPTIONS.map(({ label, value }) => (
              <label key={value} className="flex items-center gap-1.5 cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  checked={selectedClasses.includes(value)}
                  onChange={() => toggleClass(value)}
                  className="cursor-pointer accent-[#1677FF]"
                />
                {label}
              </label>
            ))}
          </fieldset>
          <fieldset className="flex items-center gap-2 mb-4 px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm">
            <legend className="text-xs text-gray-500 px-1">
              Status{selectedClasses.length === 0 && ' (all)'}
            </legend>
            {APPLICATION_STATUS_OPTIONS.map(({ label, value }) => (
              <label key={value} className="flex items-center gap-1.5 cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(value)}
                  onChange={() => toggleStatus(value)}
                  className="cursor-pointer accent-[#1677FF]"
                />
                {label}
              </label>
            ))}
          </fieldset>
        </div>
      </div>
      <div className="z-50 px-6 py-6 overflow-y-scroll bg-[#FCFCFC] border-gray-300 rounded-2xl">
        <div className="h-[430px] overflow-y-scroll z-50 rounded-l border border-[#EEEEEE]">
          <Table
            data={transformedApplications ?? []}
            columns={columns}
            search={true}
            pagination={true}
            loading={isLoadingApplications || isOptionsLoading}
            getRowId={(row, index) => row.id ?? `missing-id-${index}`}
          />
        </div>
      </div>
      {isOverlayVisible && (
        <ReviewModal
          toggleOverlay={toggleOverlay}
          item={dialogRow}
        />
      )}
    </>
  );
}

type ReviewModalProps = {
  toggleOverlay: () => void;
  item: Row<ApplicationDetail>;
};

function ReviewModal({ item, toggleOverlay }: ReviewModalProps) {
  const applicationData = item.original;
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
