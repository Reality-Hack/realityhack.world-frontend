'use client';
import Table from '@/components/Table';
import { Application } from '@/types';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { ColumnDef, Row, createColumnHelper } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import Modal from '../../Modal';

type Props = {
  applications: Application[];
};

export default function HackerApplicationTable({ applications }: Props) {
  //data for state select component
  interface Option {
    value: string;
    label: string;
  }

  const options: Option[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' }
  ];

  const [selectedOption, setSelectedOption] = useState<string>('option1');
  const isDisabled: boolean = false; // Set to true to disable the Select

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value);
  };

  const [dialogRow, setDialogRow] = useState<any | void>(undefined);

  const columnHelper = createColumnHelper<Application>();
  const columns = useMemo<ColumnDef<Application, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: () => 'ID',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('first_name', {
        header: () => 'First Name',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('last_name', {
        header: () => 'Last Name',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('portfolio', {
        header: () => 'Portfolio Link',
        cell: info => (
          <a target="_blank" href={info.getValue()}>
            {info.getValue()}
          </a>
        )
      }),
      columnHelper.accessor('resume', {
        header: () => 'Resume',
        cell: info => (
          <a target="_blank" href={info.getValue()}>
            Resume
          </a>
        )
      }),
      columnHelper.accessor('city', {
        header: () => 'City',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('nationality', {
        header: () => 'Nationality',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('status', {
        header: () => 'Status',
        cell: info => (
          <CustomSelect
            label="Select an option"
            options={options}
            value={info.getValue()}
            onChange={handleSelectChange}
            disabled={isDisabled}
          />
        )
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
      })
    ],
    [columnHelper]
  );

  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const toggleOverlay = () => {
    setOverlayVisible(prev => !prev);
  };
  const toggleOverlayAndPassData = (row: any) => {
    console.log(row);
    toggleOverlay();
    setDialogRow(row);
  };

  return (
    <div>
      <div className="overflow-y-auto max-h-[480px] max-w-screen">
        <Table
          data={applications}
          columns={columns}
          search={true}
          pagination={true}
          toggleOverlay={toggleOverlayAndPassData}
        />
        {/* TODO: Add dialog here */}
      </div>
      {isOverlayVisible && (
        <ReviewModal
          toggleOverlay={toggleOverlay}
          item={dialogRow}
          data={applications}
        />
      )}
    </div>
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

function ReviewPage({ allInfo }: { allInfo: any }) {
  console.log(allInfo);
  const LabelAndValue = ({
    label,
    value = ''
  }: {
    label: String;
    value: String;
  }) => {
    return (
      <div>
        <div className="text-md">{label}</div>
        <div className="text-sm text-gray-500">{value}</div>
      </div>
    );
  };

  const Disclaimers = () => {
    return (
      <div className="flex flex-col gap-2 mb-4">
        <div>
          We encourage all participants to form new connections with cool
          creative people that they&apos;ve never worked with before.
        </div>
        <div>
          Please do not apply as a representative for a group, or plan to attend
          with the condition that your friends or co-workers are accepted.
        </div>
        <div>
          More information will be announced in the Rules as we get closers to
          the event.
        </div>
        <div className="border-t-2 border-gray-200 py-2">
          <div>
            Our participants are literally building the future by making their
            work available for further development.
          </div>
          <div>
            Therefore, all projects build during the hackathon will be released
            under an open source license (see{' '}
            <span className="text-blue-500 hover:cursor-pointer hover:underline">
              <a href="https://opensource.org" target="_blank">
                opensource.org
              </a>
            </span>
            )
          </div>
        </div>
      </div>
    );
  };

  const BasicInfoAndDem = () => {
    return (
      <div className="flex flex-col gap-2">
        <LabelAndValue label="Email Address" value="vinitamaloo68@gmail.com" />
        <LabelAndValue label="Full Name" value="vinitamaloo68@gmail.com" />
        <LabelAndValue
          label="What should we call you?"
          value="vinitamaloo68@gmail.com"
        />
        <LabelAndValue label="Pronouns to use" value="she/her" />
        <LabelAndValue
          label="Link to portfolio or personal website"
          value="vinitamaloo68@gmail.com"
        />
        <LabelAndValue
          label="Link to your LinkedIn"
          value="vinitamaloo68@gmail.com"
        />
        <LabelAndValue label="Resume" value="vinitamaloo68@gmail.com" />
      </div>
    );
  };

  const DEIInfoSection = () => {
    return (
      <div>
        <LabelAndValue
          label={'How would you describe your gender identity?'}
          value={'Cis man'}
        />
        <LabelAndValue
          label={'What race or ethnic group do you belong to?'}
          value={'Other'}
        />
        <LabelAndValue
          label={'Do you identify as a person with disability?'}
          value={'No'}
        />
      </div>
    );
  };

  const ExperienceAndInterestSection = ({
    studentOrPro
  }: {
    studentOrPro: String;
  }) => {
    return (
      <div>
        {/* Experience and Interest content */}
        <LabelAndValue
          label={
            'Select the option that best describes you. This option should best describe you now and not necessarily in relation to the XR industries. (Select one)'
          }
          value={'Student'}
        />
        <div>
          {studentOrPro == 'student' && (
            <div>
              <LabelAndValue
                label={'What is the name of your school?'}
                value={'MIT'}
              />
              <LabelAndValue
                label={
                  'If you are attending a higher education institution, what is your field of study?'
                }
                value={'quantum mechanics'}
              />
            </div>
          )}
          {studentOrPro == 'Pro' && (
            <div>
              <LabelAndValue
                label={'What is your current occupation?'}
                value={''}
              />
              <LabelAndValue
                label={'What company do you currently work for?'}
                value={''}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const ThematicSection = () => {
    return (
      <div>
        <LabelAndValue
          label={
            'Our theme for 2024 is “Connection”. From letting people embody avatars that they connect with or even giving people the ability to feel closer to friends and family at great distance, Connection can mean different things to different people. What does Connection mean to you?'
          }
          value={'Blank'}
        />
        <LabelAndValue
          label={
            'How do you think XR technologies can help us with “Connection”? (Long answer)'
          }
          value={'Blank'}
        />
      </div>
    );
  };

  const Closing = () => {
    return (
      <div>
        <LabelAndValue
          label={
            'How did you hear about Reality Hack? Select all that apply. (Optional)'
          }
          value={'A friend'}
        />
      </div>
    );
  };

  const RSVP = () => {
    return (
      <div>
        <LabelAndValue
          label={'What unisex t-shirt size do you wear?'}
          value={''}
        />
        <LabelAndValue
          label={
            'Discord will be our primary communications platform before and during the event. What is your Discord username?'
          }
          value={'e'}
        />
        <LabelAndValue
          label={'List any dietary restrictions you may have. (Optional)'}
          value={'d'}
        />
        <LabelAndValue
          label={
            'Tell us about any accommodations you may need in order to be able to attend our event. (Optional)'
          }
          value={'c'}
        />
        <LabelAndValue
          label={
            'A phone number we can reach you at during the MIT Reality Hack event:'
          }
          value={'b'}
        />
        <LabelAndValue
          label={'Please provide an emergency contact:'}
          value={'a'}
        />
        <LabelAndValue
          label={
            '(For those under 18, file upload) As you will be under 18 when the event starts on January 12, 2023, we require the completion of a Parental Consent and Release Form. Please download this form, complete it, and upload it here.'
          }
          value={'ues'}
        />
        <LabelAndValue
          label={
            'Do you require a letter of support for a US visa application?'
          }
          value={'Yes'}
        />
        <LabelAndValue
          label={
            'Please fill out the following information for your US visa application support letter. A member of our team will email you a letter to support your visa application.'
          }
          value={'Yes'}
        />
      </div>
    );
  };

  const sections = [
    { label: 'Disclaimers', component: <Disclaimers /> },
    { label: 'Basic Info and Demographics', component: <BasicInfoAndDem /> },
    {
      label: 'Diversity and Inclusion Information',
      component: <DEIInfoSection />
    },
    {
      label: 'Experience and Interest',
      component: <ExperienceAndInterestSection studentOrPro={'student'} />
    },
    { label: 'Thematic', component: <ThematicSection /> },
    { label: 'Closing', component: <Closing /> },
    { label: 'RSVP', component: <RSVP /> }
  ];

  return (
    <div className="flex flex-col gap-2 p-4 pt-8">
      {sections.map(section => (
        <div key={section.label} className="border-b-2 border-gray-400">
          <div className="text-xl font-bold">{section.label}</div>
          {section.component}
        </div>
      ))}
    </div>
  );
}

// components/CustomSelect.tsx

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  disabled: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  disabled
}) => {
  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        disabled={disabled}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
