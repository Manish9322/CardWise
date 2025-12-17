'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UsersTableToolbar } from './UsersTableToolbar';
import { UsersTablePagination } from './UsersTablePagination';
import { getColumns } from './columns';
import type { User } from '@/lib/definitions';
import { UserFormModal } from './UserFormModal';
import { ViewUserModal } from './ViewUserModal';

interface UsersTableProps {
  data: User[];
}

export function UsersTable({ data }: UsersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  const [activeModal, setActiveModal] = React.useState<'form' | 'view' | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const handleOpenForm = (user: User | null = null) => {
    setSelectedUser(user);
    setActiveModal('form');
  };
  
  const handleOpenView = (user: User) => {
    setSelectedUser(user);
    setActiveModal('view');
  };

  const handleCloseModals = () => {
    setActiveModal(null);
    setSelectedUser(null);
  }

  const columns = React.useMemo(() => getColumns({ handleOpenForm, handleOpenView }), [handleOpenForm, handleOpenView]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-4">
      <UsersTableToolbar table={table} handleOpenForm={handleOpenForm} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <UsersTablePagination table={table} />
      <UserFormModal
        isOpen={activeModal === 'form'}
        onOpenChange={(isOpen) => !isOpen && handleCloseModals()}
        user={selectedUser}
      />
      {selectedUser && (
         <ViewUserModal
            isOpen={activeModal === 'view'}
            onOpenChange={(isOpen) => !isOpen && handleCloseModals()}
            user={selectedUser}
        />
      )}
    </div>
  );
}
