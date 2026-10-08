
import React, { useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';



import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  Calendar,
  Edit2,
  Loader,
  MoreVertical,
  Trash,
} from 'lucide-react';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import api from '../../lib/api/apiClient';


const STATUS_CONFIG = {
  pending: {
    variant: 'secondary',
    label: 'Pending',
    color: 'text-yellow-600',
  },

  'in progress': {
    variant: 'default',
    label: 'In Progress',
    color: 'text-blue-600',
  },

  completed: {
    variant: 'outline',
    label: 'Completed',
    color: 'text-green-600',
  },
};


const TaskCard = ({
  task,


  isLoading = false,
onEditingTask,
}) => {

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const queryClient = useQueryClient();


  // STATUS CONFIG
  const statusConfig =
    STATUS_CONFIG[task?.status] || STATUS_CONFIG.pending;


  // FORMAT DATE
  const formatDate = (dateString) => {
    if (!dateString) return null;

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  // CHECK OVERDUE
  const isOverdue = (dueDate) => {
    if (!dueDate || task?.status === 'completed') {
      return false;
    }

    return new Date(dueDate) < new Date();
  };


  const dueDate = formatDate(task?.dueDate);
  const overdue = isOverdue(task?.dueDate);


  // DELETE MUTATION
  const deleteMutation = useMutation({

    mutationFn: async () => {
      const response = await api.delete(`/tasks/${task._id}`);

      return response.data;
    },

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });



      setShowDeleteDialog(false);
    },

    onError: (error) => {

      console.error('Error deleting task:', error);


    },
  });


  // CONFIRM DELETE
  const handleDeleteConfirm = () => {
    deleteMutation.mutate();
  };


  return (
    <>
      <Card className="w-full transition-shadow hover:shadow-md">

        <CardHeader className="pb-3">

          <div className="flex items-start justify-between">

            {/* TITLE */}
            <CardTitle className="text-lg leading-tight">
              {task?.title}
            </CardTitle>


            {/* STATUS + MENU */}
            <div className="flex items-center justify-between gap-2">

              <Badge
                variant={statusConfig.variant}
                className="shrink-0"
              >
                {statusConfig.label}
              </Badge>


              {/* DROPDOWN */}
              <DropdownMenu>

                <DropdownMenuTrigger asChild>

                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    className="h-8 w-8 p-0"
                  >
                    <span className="sr-only">
                      Open menu
                    </span>

                    <MoreVertical className="h-4 w-4" />
                  </Button>

                </DropdownMenuTrigger>


                <DropdownMenuContent align="end">

                  {/* EDIT */}
                  <DropdownMenuItem
                    onClick={() => onEditingTask(task)}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />

                    Edit
                  </DropdownMenuItem>


                  {/* DELETE */}
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash className="mr-2 h-4 w-4" />

                    Delete
                  </DropdownMenuItem>

                </DropdownMenuContent>

              </DropdownMenu>

            </div>

          </div>

        </CardHeader>


        <CardContent className="space-y-3">

          {/* DESCRIPTION */}
          {task?.description && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {task.description}
            </p>
          )}


          {/* DUE DATE */}
          {dueDate && (
            <div className="flex items-center gap-2">

              <Calendar className="h-4 w-4 text-muted-foreground" />

              <span className="text-sm text-muted-foreground">
                Due:
              </span>

              <Badge
                variant={overdue ? 'destructive' : 'outline'}
                className="text-xs"
              >
                {dueDate}

                {overdue && ' (Overdue)'}
              </Badge>

            </div>
          )}


          {/* STATUS INDICATOR */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">

            <span>
              Created: {formatDate(task?.createdAt)}
            </span>

            <span className={statusConfig.color}>
              {statusConfig.label}
            </span>

          </div>

        </CardContent>

      </Card>


      {/* DELETE DIALOG */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Are you sure?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently
              delete the task "{task?.title}".
            </AlertDialogDescription>

          </AlertDialogHeader>


          <AlertDialogFooter>

            {/* CANCEL */}
            <AlertDialogCancel
              disabled={deleteMutation.isPending}
            >
              Cancel
            </AlertDialogCancel>


            {/* DELETE */}
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >

              {deleteMutation.isPending ? (

                <span className="flex items-center gap-2">

                  <Loader className="h-4 w-4 animate-spin" />

                  Deleting...

                </span>

              ) : (
                'Delete'
              )}

            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </>
  );
};


export default TaskCard;
