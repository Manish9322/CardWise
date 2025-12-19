
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
import type { Card } from '@/lib/definitions';
import { useUpdateQuestionMutation, useDeleteQuestionMutation } from '@/utils/services/api';
import { useToast } from '@/hooks/use-toast';

type GetColumnsProps = {
  handleOpenForm: (question: Card) => void;
  handleOpenView: (question: Card) => void;
}

export const getColumns = ({ handleOpenForm, handleOpenView }: GetColumnsProps): ColumnDef<Card>[] => {
  
  const StatusToggle = ({ row }: { row: any }) => {
    const { toast } = useToast();
    const [updateQuestion] = useUpdateQuestionMutation();
    const card = row.original;
    const [isActive, setIsActive] = React.useState(card.status === 'active');

    const handleToggle = async (checked: boolean) => {
      const newStatus = checked ? 'active' : 'inactive';
      setIsActive(checked);
      
      try {
        await updateQuestion({
          id: card.id,
          question: card.question,
          answer: card.answer,
          status: newStatus,
        }).unwrap();
        toast({
          title: 'Status Updated',
          description: `Question status set to ${newStatus}.`,
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
    
    return <Switch checked={isActive} onCheckedChange={handleToggle} aria-label="Toggle card status" />;
  }

  const ActionsCell = ({ row }: { row: any }) => {
    const card = row.original as Card;
    const { toast } = useToast();
    const [deleteQuestion] = useDeleteQuestionMutation();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            await deleteQuestion(card.id).unwrap();
            toast({
                title: "Success",
                description: "Question deleted successfully.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete question.",
            });
        }
    };

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
            <DropdownMenuItem onClick={() => handleOpenView(card)}>
            Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenForm(card)}>
            Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleDelete}
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
      accessorKey: 'question',
      header: 'Question',
      cell: ({ row }) => <div className="truncate max-w-[200px] sm:max-w-xs">{row.getValue('question')}</div>,
    },
    {
      accessorKey: 'answer',
      header: 'Answer',
      cell: ({ row }) => <div className="truncate max-w-xs">{row.getValue('answer')}</div>,
      enableHiding: true,
    },
     {
      accessorKey: 'username',
      header: 'Added By',
      cell: ({ row }) => {
        const username = row.getValue('username') as string;
        return <div className="truncate max-w-[100px]">{username || 'Unknown'}</div>;
      },
       enableHiding: true,
    },
    {
        accessorKey: 'status',
        header: 'Visibility',
        cell: ({ row }) => <StatusToggle row={row} />,
        filterFn: (row, id, value) => {
            if (value === 'all') return true;
            return value === row.getValue(id);
        },
    },
    {
      id: 'actions',
      cell: ActionsCell,
    },
  ];
}
