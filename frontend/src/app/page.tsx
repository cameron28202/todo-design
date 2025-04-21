"use client";

import TaskInput from "@/components/TaskInput";
import { useState, useEffect } from "react";
import { Trash2} from "lucide-react";
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
      try{
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
    try{
      const response = await fetch(`${API_URL}/api/tasks`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
      
      if(!response.ok){
        throw new Error('failed to add task bro.');
      }
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } 
    catch(error){
      console.error('error adding task:', error);
    }
  };

  // toggle task completion
  const toggleTaskCompletion = async (id: number, currentStatus: boolean) => {
    try{
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
      
      if(!response.ok){
        throw new Error('Failed to update task');
      }
    }
    catch(error){
      console.error('error updating task:', error);
    }
  };

  // delete a task
  const deleteTask = async (id: number) => {
    try{
      const previousTasks = [...tasks];
      setTasks(tasks.filter(task => task.id !== id));
      
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        // revert if API call fails
        setTasks(previousTasks);
        throw new Error('failed to delete that task bro');
      }
    }
    catch(error){
      console.error('error deleting task:', error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* background image and overlay */}
      <div className="absolute inset-0 z-0">
          <Image 
            src="/background.jpg" 
            alt="TAMU Formula Electric" 
            fill 
            style={{ objectFit: "cover", filter: "blur(2px)" }}
            priority
          />
          {/* maroon overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#500000] to-[#500000]/80 mix-blend-multiply"></div>
      </div>
      
      <h1 className="relative z-10 text-3xl font-bold text-white mb-6 text-center drop-shadow-lg">
        TAMU Formula Electric Team To-Do
      </h1>
      {/* content */}
      <div className="relative z-10 w-full max-w-md p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
        <TaskInput
          onSubmit={addTask}
        />
        
        {/* task list */}
        <div className="mt-4 space-y-2">
          {isLoading ? (

          <div className="flex justify-center items-center py-8">
            <Spinner size={32} className="text-[#500000]" />
          </div>

          ) : tasks.length === 0 ? (
            <p className="text-center text-gray-500 italic">No tasks yet. Add a task to get started!</p>
          ) : (
            tasks.map(task => (
              <div 
                key={task.id} 
                className="p-3 border border-gray-200 rounded bg-white flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id, task.completed)}
                    className="h-4 w-4 text-[#500000] rounded focus:ring-[#500000]"
                  />
                  <span className={task.completed ? "line-through text-gray-500" : ""}>
                    {task.description}
                  </span>
                </div>
                <button 
                  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" 
                  onClick={() => deleteTask(task.id)}
                  aria-label="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}