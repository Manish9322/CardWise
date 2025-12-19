'use client';

import { Table } from '@tanstack/react-table';
import { PlusCircle, SlidersHorizontal, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface QuestionsTableToolbarProps<TData> {
  table: Table<TData>;
  handleOpenForm: () => void;
  filterUsername?: string;
}

export function QuestionsTableToolbar<TData>({
  table,
  handleOpenForm,
  filterUsername,
}: QuestionsTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex w-full flex-col md:flex-row md:items-center gap-2">
        <Input
          placeholder="Search questions..."
          value={(table.getColumn('question')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('question')?.setFilterValue(event.target.value)
          }
          className="h-9 w-full md:w-[150px] lg:w-[250px]"
        />
        <div className="flex flex-wrap items-center gap-2">
            {filterUsername && (
            <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 h-9">
                <span className="text-sm text-muted-foreground">User:</span>
                <span className="text-sm font-medium">{filterUsername}</span>
                <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => {
                    table.getColumn('username')?.setFilterValue(undefined);
                    window.history.replaceState({}, '', '/admin/manage-questions');
                }}
                >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </Button>
            </div>
            )}
            <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                <span className="sm:hidden">Filter</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
                <div className="grid gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium leading-none">Advanced Filters</h4>
                    <p className="text-sm text-muted-foreground">
                    Filter questions by visibility or user.
                    </p>
                </div>
                <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="status">Visibility</Label>
                        <Select
                            value={table.getColumn('status')?.getFilterValue() as string ?? 'all'}
                            onValueChange={value => {
                                if (value === 'all') {
                                    table.getColumn('status')?.setFilterValue(undefined);
                                } else {
                                    table.getColumn('status')?.setFilterValue(value);
                                }
                            }}
                        >
                            <SelectTrigger className="col-span-2 h-8">
                            <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="active">Visible</SelectItem>
                                <SelectItem value="inactive">Hidden</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label htmlFor="username">Added By</Label>
                        <Input
                            id="username"
                            placeholder="Username"
                            value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
                            onChange={(event) =>
                                table.getColumn('username')?.setFilterValue(event.target.value)
                            }
                            className="col-span-2 h-8"
                        />
                    </div>
                </div>
                </div>
            </PopoverContent>
            </Popover>
            {isFiltered && !filterUsername && (
            <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-9 px-2 lg:px-3"
            >
                Clear
                <X className="ml-2 h-4 w-4" />
            </Button>
            )}
        </div>
      </div>
      <div className="flex w-full md:w-auto items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-9 flex-1 md:flex-none">
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== 'undefined' && column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id.replace(/_/g, ' ')}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button size="sm" className="h-9 flex-1 md:flex-none" onClick={() => handleOpenForm()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Add Question</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
    </div>
  );
}
