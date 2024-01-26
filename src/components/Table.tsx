'use client';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import LinearProgress from '@mui/material/LinearProgress';
import {
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useState } from 'react';
import DebouncedInput from './DebouncedInput';

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: Row<T>) => void;
  search?: boolean;
  pagination?: boolean;
  loading?: boolean;
  getRowId?: (originalRow: T, index: number, parent?: Row<T>) => string;
  defaultSorting?: SortingState;
  rowSelection?: any;
  setRowSelection?: (rowSelection: any) => void;
}

/**
 * REALITYHACK Component
 *
 * Ported over from realityhack.world repo
 * Component for rendering data in a table form using react-table
 * Docs explaining react-table found here https://tanstack.com/table/v8/docs/guide/overview
 * Used https://tailwindcomponents.com/component/customers-table for table styling
 * @props data input data of type T
 * @props columns column definitions built using createColumnHelper<T>, see react-table docs for more info
 * @props onRowClick perform an action on row click, passes in the row that was selected
 * @props search boolean to render search input, only searches local data
 * @props pagination boolean to render pagination menu, paginates local data
 * @props loading boolean to determine if a loading indicator should be shown
 * @props getRowId
 * @props defaultSorting SortingState to set initial sorting to, must use an existing column id https://github.com/TanStack/table/discussions/5091
 * @props rowSelection expected to be row selection state for row selection i.e. const [rowSelection, setRowSelection] = useState({});
 *  if not passed in, will not render selection. See https://tanstack.com/table/v8/docs/examples/react/row-selection for example
 * @props setRowSelection expected set state function for rowSelection. Must include rowSelection
 * @returns a table rendered with tailwind css using react-table
 */
export default function Table<T>({
  data,
  columns,
  onRowClick,
  search,
  pagination,
  loading,
  defaultSorting,
  getRowId,
  rowSelection,
  setRowSelection
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting ?? []);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection
    },
    enableRowSelection: !!rowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(pagination && { getPaginationRowModel: getPaginationRowModel() }),
    onGlobalFilterChange: setGlobalFilter,
    getRowId: getRowId,
    debugTable: false,
    autoResetPageIndex: false
  });

  return (
    <div className="">
      {search && (
        <>
          <div className="p-2 text-gray-600 dark:text-gray-400 dark:border-borderDark bg-[#FDFDFD] dark:bg-backgroundDark w-full">
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              className="p-2 text-sm border border-block w-[340px] h-2 rounded"
              placeholder="Search..."
            />
            {globalFilter && (
              <button
                className="ml-2 text-sm text-gray-400 hover:text-gray-500"
                onClick={() => setGlobalFilter('')}
              >
                Clear
              </button>
            )}
          </div>
        </>
      )}
      {loading && <LinearProgress />}
      <div className="relative overflow-x-auto">
        <table className="relative overflow-x-auto dark:bg-contentDark dark:bg-border-borderDark">
          <thead className="text-sm text-gray-600 dark:text-gray-400 font-interMedium h-11 bg-[#FDFDFD] dark:bg-backgroundDark sticky top-[-1px] z-10 border-[#EEEEEE]">
            <>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      className="first:border-l-0 my-auto border border-[#EEEEEE] bg-[#FDFDFD] whitespace-nowrap dark:border-borderDark"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <span
                          className="flex flex-row px-4 text-left cursor-pointer"
                          {...{
                            onClick: header.column.getToggleSortingHandler()
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                                aria-hidden="true"
                              />
                            )
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </>
          </thead>
          <tbody className="text-sm transition-all divide-y divide-gray-100 dark:divide-borderDark text-textPrimary dark:bg-contentDark dark:text-gray-300">
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className={
                  'last:border-b-0 bg-white dark:bg-contentDark hover:bg-[#FAFCFF] min-w-[200px] hover:bg-opacity-70 dark:hover:bg-[#242424]' +
                  (!!onRowClick ? ' hover:cursor-pointer' : '')
                }
                onClick={() => {
                  if (!!onRowClick) {
                    onRowClick(row);
                  }
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    className="first:border-l-0 px-4 py-1 border border-[#EEEEEE] dark:border-borderDark w-auto whitespace-nowrap"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="z-50 border-t-[0.5px] border-[#EEEEEE] sticky bottom-0 left-0 w-full h-11 flex flex-row items-center justify-start gap-2 px-4 py-4 text-sm text-gray-600 dark:border-borderDark dark:text-gray-400 font-interMedium bg-[#FDFDFD] dark:bg-backgroundDark">
          <div className="flex gap-[6px]">
            <span className="flex flex-row items-center gap-1">
              <select
                className="dark:bg-[#242424] py-1 rounded border dark:border-borderDark text-sm"
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[10, 25, 50, 75, 100].map(pageSize => (
                  <option
                    key={pageSize}
                    value={pageSize}
                    className="text-sm dark:bg-[#242424]"
                  >
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </span>
          </div>
          <div className="ml-4 flex gap-[6px]">
            <button
              className="p-1 border rounded content shadow-none hover:bg-[#FAFCFF] hover:bg-opacity-70 dark:hover:bg-[#242424]"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="p-1 border rounded content shadow-none hover:bg-[#FAFCFF] hover:bg-opacity-70 dark:hover:bg-[#242424]"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className="p-1 border rounded content shadow-none hover:bg-[#FAFCFF] hover:bg-opacity-70 dark:hover:bg-[#242424]"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="p-1 border rounded content shadow-none hover:bg-[#FAFCFF] hover:bg-opacity-70 dark:hover:bg-[#242424]"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span className="flex items-center gap-1 text-sm">
              <div className="text-sm">Page</div>
              <strong className="text-sm">
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
