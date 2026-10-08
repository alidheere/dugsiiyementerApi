
import React, { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { Loader } from 'lucide-react';

import api from '../../lib/api/apiClient';


import { extractErrorMesage } from '../../util/errUtiuls';


const TASK_STATUSES = [
  {
    value: 'pending',
    label: 'Pending',
  },
  {
    value: 'in progress',
    label: 'In Progress',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
];


const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'pending',
  dueDate: '',
};


const TaskForm = ({
  task,
  open = true,
  onOpenChange,
  onEditingTask,
}) => {

  const [validationError, setValidationError] = useState(null);

  const [formValues, setFormValues] = useState(EMPTY_FORM);

  const queryClient = useQueryClient();



  // LOAD TASK DATA


  useEffect(() => {

    if (task) {

      setFormValues({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',

        dueDate: task.dueDate
          ? new Date(task.dueDate)
              .toISOString()
              .split('T')[0]
          : '',
      });

    } else {

      setFormValues(EMPTY_FORM);
    }

    setValidationError(null);

  }, [task, open]);


  // INPUT CHANGE


  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
  };




  const handleStatusChange = (value) => {

    setFormValues((prev) => ({
      ...prev,
      status: value,
    }));
  };


//  cancel handler  
  const handleCancel = () => {

    setValidationError(null);

    onOpenChange?.(false);
  };


// create task mutation
  const createTaskMutation = useMutation({

    mutationFn: async (taskData) => {

      const response = await api.post(
        '/tasks',
        taskData
      );

      return response.data;
    },

    onSuccess: () => {

     console.log('Task created successfully');

      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });

      setFormValues(EMPTY_FORM);

      onOpenChange?.(false);
    },

    onError: (error) => {

      console.error(
        'Error creating task:',
        error
      );

    },
  });


//  update task mutation
  const updateTaskMutation = useMutation({

    mutationFn: async (taskData) => {

      const response = await api.put(
        `/tasks/${task._id}`,
        taskData
      );

      return response.data;
    },

    onSuccess: () => {

      console.log('Task updated successfully');

      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });

      setFormValues(EMPTY_FORM);

      onOpenChange?.(false);
    },

    onError: (error) => {

  console.error(
        'Error updating task:',
        error
      );

   
    },
  });

// submit handler
  const handleSubmit = (e) => {

    e.preventDefault();

    setValidationError(null);


    // Validate title
    if (!formValues.title.trim()) {

      setValidationError(
        'Title is required'
      );

      console.error(
        'Title is required'
      );

      return;
    }


    // Prepare task data
    const taskData = {

      title: formValues.title.trim(),

      description:
        formValues.description.trim() || '',

      status: formValues.status,

      dueDate: formValues.dueDate
        ? new Date(
            formValues.dueDate
          ).toISOString()
        : null,
    };


    // UPDATE
    if (task) {

      updateTaskMutation.mutate(
        taskData
      );

    }

    // CREATE
    else {

      createTaskMutation.mutate(
        taskData
      );
    }
  };


 

  const isLoading =
    createTaskMutation.isPending ||
    updateTaskMutation.isPending;


  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent className="sm:max-w-[500px]">

        {/* HEADER */}
        <DialogHeader>

          <DialogTitle className="text-lg font-semibold">

            {task
              ? 'Edit Task'
              : 'Create New Task'}

          </DialogTitle>


          <DialogDescription className="text-sm text-muted-foreground">

            {task
              ? 'Update the task details below.'
              : 'Fill in the details below to create a new task.'}

          </DialogDescription>

        </DialogHeader>


        {/* VALIDATION ERROR */}
        {validationError && (

          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">

            {validationError}

          </div>

        )}


        {/* FORM */}
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >

          {/* TITLE */}
          <div className="space-y-2">

            <Label htmlFor="title">
              Title *
            </Label>

            <Input
              id="title"
              name="title"
              type="text"
              value={formValues.title}
              onChange={handleInputChange}
              placeholder="Enter task title"
              disabled={isLoading}
            />

          </div>


          {/* DESCRIPTION */}
          <div className="space-y-2">

            <Label htmlFor="description">
              Description
            </Label>

            <Textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleInputChange}
              placeholder="Enter task description"
              disabled={isLoading}
            />

          </div>


          {/* STATUS */}
          <div className="space-y-2">

            <Label htmlFor="status">
              Status
            </Label>

            <Select
              value={formValues.status}
              onValueChange={handleStatusChange}
              disabled={isLoading}
            >

              <SelectTrigger
                id="status"
                className="w-full"
              >

                <SelectValue placeholder="Select status" />

              </SelectTrigger>


              <SelectContent>

                <SelectGroup>

                  {TASK_STATUSES.map(
                    (status) => (

                      <SelectItem
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </SelectItem>

                    )
                  )}

                </SelectGroup>

              </SelectContent>

            </Select>

          </div>


          {/* DUE DATE */}
          <div className="space-y-2">

            <Label htmlFor="dueDate">
              Due Date
            </Label>

            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formValues.dueDate}
              onChange={handleInputChange}
              disabled={isLoading}
            />

          </div>


          {/* FOOTER */}
          <DialogFooter className="flex justify-end space-x-2">

            {/* CANCEL */}
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>


            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={isLoading}
            >

              {isLoading ? (

                <span className="flex items-center gap-2">

                  <Loader className="h-4 w-4 animate-spin" />

                  {task
                    ? 'Updating...'
                    : 'Creating...'}

                </span>

              ) : (

                task
                  ? 'Update Task'
                  : 'Create Task'

              )}

            </Button>

          </DialogFooter>

        </form>

      </DialogContent>

    </Dialog>
  );
};


export default TaskForm;
