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
import { QuestionsTableToolbar } from './QuestionsTableToolbar';
import { QuestionsTablePagination } from './QuestionsTablePagination';
import { getColumns } from './columns';
import type { Card } from '@/lib/definitions';
import { QuestionFormModal } from './QuestionFormModal';
import { ViewQuestionModal } from './ViewQuestionModal';

interface QuestionsTableProps {
  data: Card[];
  initialFilters?: ColumnFiltersState;
  filterUsername?: string;
}

export function QuestionsTable({ data, initialFilters = [], filterUsername }: QuestionsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialFilters);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  const [activeModal, setActiveModal] = React.useState<'form' | 'view' | null>(null);
  const [selectedQuestion, setSelectedQuestion] = React.useState<Card | null>(null);

  const handleOpenForm = (question: Card | null = null) => {
    setSelectedQuestion(question);
    setActiveModal('form');
  };
  
  const handleOpenView = (question: Card) => {
    setSelectedQuestion(question);
    setActiveModal('view');
  };

  const handleCloseModals = () => {
    setActiveModal(null);
    setSelectedQuestion(null);
  }

  const columns = React.useMemo(() => getColumns({ handleOpenForm, handleOpenView }), []);

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
      <QuestionsTableToolbar table={table} handleOpenForm={handleOpenForm} filterUsername={filterUsername} />
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
      <QuestionsTablePagination table={table} />
      <QuestionFormModal
        isOpen={activeModal === 'form'}
        onOpenChange={(isOpen) => !isOpen && handleCloseModals()}
        question={selectedQuestion}
      />
      {selectedQuestion && (
         <ViewQuestionModal
            isOpen={activeModal === 'view'}
            onOpenChange={(isOpen) => !isOpen && handleCloseModals()}
            question={selectedQuestion}
        />
      )}
    </div>
  );
}