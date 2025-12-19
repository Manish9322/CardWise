'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import type { User } from '@/lib/definitions';
import { useUpdateUserMutation } from '@/utils/services/api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type GetColumnsProps = {
  handleOpenForm: (user: User) => void;
  handleOpenView: (user: User) => void;
  handleDelete: (userId: string) => void;
}

export const getColumns = ({ handleOpenForm, handleOpenView, handleDelete }: GetColumnsProps): ColumnDef<User>[] => {
  
  const StatusToggle = ({ row }: { row: any }) => {
    const { toast } = useToast();
    const [updateUser] = useUpdateUserMutation();
    const user = row.original;
    const [isActive, setIsActive] = React.useState(user.status === 'active');

    const handleToggle = async (checked: boolean) => {
      const newStatus = checked ? 'active' : 'inactive';
      setIsActive(checked);
      
      try {
        await updateUser({
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          status: newStatus,
        }).unwrap();
        toast({
          title: 'Accessibility Updated',
          description: `User ${newStatus === 'active' ? 'can now' : 'cannot'} add questions.`,
        });
      } catch (error) {
        setIsActive(!checked); // Revert on error
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update status.',
        });
      }
    };
    
    return <Switch checked={isActive} onCheckedChange={handleToggle} aria-label="Toggle user status" />;
  }

  const ActionsCell = ({ row }: { row: any }) => {
    const user = row.original as User;
    
    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleOpenView(user)}>
            Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenForm(user)}>
            Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => handleDelete(user.id)}
            >
            Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
    );
  };
  
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'username',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Username
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
      enableHiding: true,
    },
    {
        accessorKey: 'phone',
        header: 'Phone Number',
        enableHiding: true,
    },
    {
        accessorKey: 'questionsAdded',
        header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              >
                Questions
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
        },
        cell: ({ row }) => {
          const router = useRouter();
          const user = row.original;
          const questionsCount = row.getValue('questionsAdded') as number;
          
          if (!questionsCount || questionsCount === 0) {
            return <div className="text-center w-full">0</div>;
          }
          
          return (
            <div className="text-center w-full">
                <Button
                variant="link"
                className="p-0 h-auto font-normal text-primary hover:underline"
                onClick={() => router.push(`/admin/manage-questions?userId=${user.id}&username=${encodeURIComponent(user.username)}`)}
                >
                {questionsCount}
                </Button>
            </div>
          );
        },
    },
    {
        accessorKey: 'status',
        header: 'Accessibility',
        cell: ({ row }) => <StatusToggle row={row} />,
        filterFn: (row, id, value) => {
            if (!value) return true;
            return value === row.getValue(id);
        },
    },
    {
      id: 'actions',
      cell: ActionsCell,
    },
  ];
}
