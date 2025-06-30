"use client";

import { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import AdminNavbar from "@/components/ui/adminNavbar";
import { backendUrl } from "@/app/utils/url";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export default function Home() {
  const branchName = localStorage.getItem("branch")
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");  // cashier or manager

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        branch: branchName,
        fullname,
        username,
        password,
        role,
      };
      await axios.post(backendUrl("register"), payload);
    },
    onSuccess: () => {
      alert("Employee added successfully!");
      setFullname("");
      setUsername("");
      setPassword("");
      setRole("");
    },
    onError : (err : { response : { data : string }}) => {
        console.log(err.response.data)      
    }
  });

  const handleSubmit = () => {
    if (!role) {
      alert("Please select a role.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="">
      <AdminNavbar />
      <h1 className="text-2xl font-bold mb-4">Add New Employee</h1>

      <div className="flex flex-col gap-4 max-w-sm">
     

        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        {/* Select for Role */}
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="border p-2 rounded">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cashier">Cashier</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
            Add employee
        </button>
      </div>
    </div>
  );
}
