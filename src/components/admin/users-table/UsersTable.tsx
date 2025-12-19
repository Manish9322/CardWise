
'use client';

import * as React from 'react';
import {
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
import { useDeleteUserMutation } from '@/utils/services/api';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


interface UsersTableProps {
  data: User[];
}

export function UsersTable({ data }: UsersTableProps) {
  const { toast } = useToast();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    email: false,
    phone: false,
  });
  const [rowSelection, setRowSelection] = React.useState({});
  
  const [activeModal, setActiveModal] = React.useState<'form' | 'view' | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const [userToDelete, setUserToDelete] = React.useState<string | null>(null);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

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

  const handleDelete = (userId: string) => {
    setUserToDelete(userId);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete).unwrap();
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user.",
      });
    } finally {
      setUserToDelete(null);
    }
  };

  const columns = React.useMemo(() => getColumns({ handleOpenForm, handleOpenView, handleDelete }), [handleOpenForm, handleOpenView, handleDelete]);

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
      <UsersTableToolbar table={table} handleOpenForm={handleOpenForm}/>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="whitespace-nowrap">
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
                      <TableCell key={cell.id} className="whitespace-nowrap">
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
      </div>
      <UsersTablePagination table={table} />
      <UserFormModal
        isOpen={activeModal === 'form'}
        onOpenChange={handleCloseModals}
        user={selectedUser}
      />
      {selectedUser && (
         <ViewUserModal
            isOpen={activeModal === 'view'}
            onOpenChange={handleCloseModals}
            user={selectedUser}
        />
      )}
       <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              user and all their associated questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Yes, delete user'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
