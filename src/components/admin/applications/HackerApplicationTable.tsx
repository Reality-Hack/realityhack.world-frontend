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
import ReviewPage from '../ReviewPage';
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
        />
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
