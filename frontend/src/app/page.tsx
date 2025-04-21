"use client";

import TaskInput from "@/components/TaskInput";
import { useState, useEffect } from "react";
import { Trash2, CheckCircle, Circle } from "lucide-react";
import { Spinner } from "@/components/Spinner";
import Image from "next/image";

const API_URL = 'https://todo-design.onrender.com';

export interface Task {
  id: number;
  description: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetch tasks when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/tasks`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        setTasks(data);
      }
      catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (description: string) => {
    if (!description.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } 
    catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // toggle task completion
  const toggleTaskCompletion = async (id: number, currentStatus: boolean) => {
    try {
      setTasks(
        tasks.map(task => 
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
      
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
    }
    catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // delete a task
  const deleteTask = async (id: number) => {
    try {
      const previousTasks = [...tasks];
      setTasks(tasks.filter(task => task.id !== id));
      
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        // revert if API call fails
        setTasks(previousTasks);
        throw new Error('Failed to delete task');
      }
    }
    catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // calculate the percentage complete
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  // if totalcount is greater than 0, then give calculate %. else 0%
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {/* Background image and overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image 
          src="/background.jpg" 
          alt="TAMU Formula Electric" 
          fill 
          quality={100} 
          style={{ objectFit: "cover" }}
          priority
        />
        {/* Maroon overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#500000]/90 to-[#500000]/70"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 w-full max-w-lg px-4 pb-8">
        <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg">
          Formula Electric
        </h1>
        <p className="text-white/80 text-center mt-2 drop-shadow">Team Task Manager</p>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg p-6 mx-4 bg-white backdrop-blur-sm rounded-xl shadow-xl mb-10">
        {/* progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{completedCount} of {totalCount} tasks complete!</span>
            <span>{percentComplete}%</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#500000] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
        </div>
      
        {/* Task input */}
        <div className="mb-6">
          <TaskInput 
            onSubmit={addTask}
          />
        </div>
        
        {/* Task list */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size={40} className="text-[#500000]" />
            </div>
          ): 
          
          tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tasks yet. Add a task to get started!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className={`p-4 border rounded-lg transition-all duration-200 ${
                  task.completed 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-gray-200 hover:border-[#500000]/30 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">


                  <button
                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                    className={`flex-shrink-0 transition-colors duration-200 ${
                      task.completed ? 'text-green-500 hover:text-green-600' : 'text-gray-300 hover:text-[#500000]'
                    }`}
                    aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  >
                    {task.completed ?
                     <CheckCircle size={22} />
                      : 
                      <Circle size={22} />}
                  </button>

                  <span className={`flex-grow ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.description}
                  </span>

                  <button 
                    className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors" 
                    onClick={() => deleteTask(task.id)}
                  >

                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="relative z-10 w-full max-w-lg text-center text-white/60 text-sm py-4">
        TAMU Formula Electric © {new Date().getFullYear()}
      </div>
    </div>
  );
}