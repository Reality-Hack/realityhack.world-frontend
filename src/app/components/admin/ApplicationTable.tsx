"use client";
import { Application } from "@/types";
import { createColumnHelper, Row, ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Table from "@/app/components/Table";
import { DateTime } from "luxon";

type Props = {
  applications: Application[];
};

export default function ApplicationTable({ applications }: Props) {
  const [dialogRow, setDialogRow] = useState<any | void>(undefined);

  const columnHelper = createColumnHelper<Application>();
  const columns = useMemo<ColumnDef<Application, any>[]>(
    () => [
      columnHelper.accessor("id", {
        header: () => "ID",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("first_name", {
        header: () => "First Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("last_name", {
        header: () => "Last Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("portfolio", {
        header: () => "Portfolio Link",
        cell: (info) => <a href={info.getValue()}>{info.getValue()}</a>,
      }),
      columnHelper.accessor("resume", {
        header: () => "Resume",
        cell: (info) => <a href={info.getValue()}>Resume</a>,
      }),
      columnHelper.accessor("city", {
        header: () => "City",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("nationality", {
        header: () => "Nationality",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: () => "Status",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("submitted_at", {
        header: () => "Submitted On",
        cell: (info) =>
          DateTime.fromISO(info.getValue()).toLocaleString(
            DateTime.DATETIME_SHORT
          ),
      }),
      columnHelper.accessor("updated_at", {
        header: () => "Updated On",
        cell: (info) =>
          DateTime.fromISO(info.getValue()).toLocaleString(
            DateTime.DATETIME_SHORT
          ),
      }),
      columnHelper.display({
        id: "view",
        header: () => "View Full App",
        cell: (props) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <button
              className="bg-gray-300 dark:bg-gray-700 rounded-[6px] leading-5 text-xs py-0.5 px-2"
              onClick={() => {
                setDialogRow(props.row);
              }}
            >
              Open App
            </button>
          </div>
        ),
      }),
    ],
    [columnHelper]
  );

  return (
    <>
      <Table data={applications} columns={columns} />
      {/* TODO: Add dialog here */}
    </>
  );
}
