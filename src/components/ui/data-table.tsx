import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type RowData,
} from '@tanstack/react-table'
import { cn } from 'cn'
import { FlightOrbitLoader } from '#/components/ui/flight-orbit-loader'
import { useContentLoading } from '#/hooks/use-content-loading'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string
    cellClassName?: string
  }
}

export interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, unknown>[]
  getRowId?: (originalRow: TData, index: number) => string
  tableClassName?: string
  headerClassName?: string
  headerRowClassName?: string
  headClassName?: string
  bodyClassName?: string
  rowClassName?: string | ((row: Row<TData>) => string | undefined)
  cellClassName?: string
  empty?: React.ReactNode
  emptyCellClassName?: string
  /** Extra body rows rendered after the data rows, such as a totals row. */
  afterRows?: React.ReactNode
  /** Shows skeleton rows while content is loading. */
  isLoading?: boolean
  loadingRowCount?: number
}

export function DataTable<TData>({
  data,
  columns,
  getRowId,
  tableClassName,
  headerClassName,
  headerRowClassName,
  headClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
  empty,
  emptyCellClassName,
  afterRows,
  isLoading = false,
}: DataTableProps<TData>) {
  const isContentLoading = useContentLoading()
  const showSkeleton = isLoading || isContentLoading
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId,
  })

  const rows = table.getRowModel().rows

  return (
    <Table className={tableClassName}>
      <TableHeader className={headerClassName}>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className={headerRowClassName}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                className={cn(
                  headClassName,
                  header.column.columnDef.meta?.headerClassName,
                )}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className={bodyClassName}>
        {showSkeleton ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={table.getVisibleLeafColumns().length}
              className="py-10"
            >
              <div className="flex justify-center">
                <FlightOrbitLoader />
              </div>
            </TableCell>
          </TableRow>
        ) : rows.length === 0 && empty ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columns.length} className={emptyCellClassName}>
              {empty}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow
              key={row.id}
              className={
                typeof rowClassName === 'function'
                  ? rowClassName(row)
                  : rowClassName
              }
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn(
                    cellClassName,
                    cell.column.columnDef.meta?.cellClassName,
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
        {afterRows}
      </TableBody>
    </Table>
  )
}
