import React from 'react'
import DashboardHeader from '../components/Dashboard/DashboardHeader'
import DashboardWelcome from '../components/Dashboard/DashboardWelcome'
import TaskForm from '../components/task/TaskForm'
import { useState } from 'react'
import TasksList from '../components/task/TasksList'
import { Loader } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api/apiClient'
const DashboardPage = ({}) => {
   const [showCreateForm, setShowCreateForm] = useState(false)
    const [onEditingTask, setEditingTask] = useState(null)
    const handleFormClose=()=>{
      setShowCreateForm (false)
      setEditingTask(null)
    }
    const handleCreateTaskClick=()=>{
      setShowCreateForm(true)
      setEditingTask(null)
    }

    const tasksquery = useQuery({
      queryKey: ['tasks'],
      queryFn: async () => {
        const response = await api.get('/tasks');
        return response.data;
      },

          retry: 1,
    });
  
    const handleEditTask=(task)=>{
      setEditingTask(task)
      setShowCreateForm(true)
    }
    const handleDeleteTask=(taskId)=>{
      // mutation to delete task
    }

    const handleStatusChange=(taskId, statusData)=>{
      //  todo mutation to update task status
    }


     if ( tasksquery.isLoading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <Loader className='animate-spin' />
            </div>
        )
    }
    if (tasksquery.isError) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <p className='text-destructive'>Error loading tasks</p>
            </div>
        )
    }
  return (
    <div className='min-h-screen bg-background'>
        {/* header page */}
        <DashboardHeader/>
        {/* main section */}
    <main className='max-w-7xl mx-auto  py-4 px-6 space-y-6'>
      {/* welcome section */}
      <DashboardWelcome
      showCreateForm={showCreateForm}
      onCreateTask={handleCreateTaskClick}

      />
      {/* taskas section */}
      <TasksList
      tasks={tasksquery.data || []}
      isLoading={tasksquery.isLoading}
      onEditingTask={handleEditTask}
   
      onStatusChange={handleStatusChange}
      />
    </main>
    {/* tasks dialog form */}
    <TaskForm 
    task={onEditingTask}
    open={showCreateForm|| !!onEditingTask}
    onOpenChange={handleFormClose}
    />
     </div>
  )
}

export default DashboardPage