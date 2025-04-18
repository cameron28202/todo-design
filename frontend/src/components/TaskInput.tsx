"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface TaskInputProps {
  placeholder?: string;
  onSubmit: (description: string) => void;
}

export default function TaskInput({ 
  placeholder = "Enter a new task...", 
  onSubmit 
}: TaskInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-2 w-full">
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button 
        onClick={handleSubmit}
        disabled={!value.trim()}
      >
        Add
      </Button>
    </div>
  );
}