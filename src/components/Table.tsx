'use client';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import {
  ColumnDef,
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
  search?: boolean;
  pagination?: boolean;
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
 * @props search boolean to render search input, only searches local data
 * @props pagination boolean to render pagination menu, paginates local data
 * @returns a table rendered with tailwind css using react-table
 */
export default function Table<T>({
  data,
  columns,
  search,
  pagination
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
      globalFilter
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(pagination && { getPaginationRowModel: getPaginationRowModel() }),
    onGlobalFilterChange: setGlobalFilter,
    debugTable: true
  });

  return (
    <>
      {search && (
        <>
          <div className="p-2 text-gray-600 dark:text-gray-400 dark:border-borderDark bg-slate-100 dark:bg-backgroundDark">
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              className="p-2 text-sm border border-block w-[328px] h-2 rounded"
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
      <table className="h-[58px] overflow-scroll table-auto dark:bg-contentDark dark:bg-border-borderDark">
        <thead className="text-sm text-gray-600 dark:text-gray-400 font-interMedium h-11 bg-slate-100 dark:bg-backgroundDark">
          <>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    className="my-auto p-2 whitespace-nowrap border-y-[1px] dark:border-borderDark"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className="flex flex-row pl-6 text-left cursor-pointer"
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
                      </div>
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
              className="bg-white dark:bg-contentDark hover:bg-[#FAFCFF] h-[58px] hover:bg-opacity-70 dark:hover:bg-[#242424]"
            >
              {row.getVisibleCells().map(cell => (
                <td
                  className="pl-8 first:pl-5 py-[6px] h-[58px] border-b-[1px] dark:border-borderDark"
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <div className="flex flex-row items-center justify-start w-auto gap-2 px-4 py-4 overflow-x-auto text-sm text-gray-600 dark:border-borderDark dark:text-gray-400 font-interMedium bg-slate-100 dark:bg-backgroundDark">
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
    </>
  );
}
