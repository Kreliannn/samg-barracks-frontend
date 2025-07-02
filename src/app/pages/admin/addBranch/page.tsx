"use client";

import { useState } from "react";
import axiosInstance from "@/app/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { backendUrl } from "@/app/utils/url";
import { AdminSideBar } from "@/components/ui/adminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  const [branchName, setBranchName] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        branch: branchName,
        fullname,
        username,
        password,
        role: "admin",  
      };
      await axiosInstance.post("/branch", payload);
    },
    onSuccess: () => {
      alert("Branch created successfully!");
      setBranchName("");
      setFullname("");
      setUsername("");
      setPassword("");
    },
    onError : (err : { response : { data : string }}) => {
        console.log(err.response.data)      
    }
  });

  const handleSubmit = () => {
    if(!branchName || !fullname || !username || !password) return alert("empty field")
    mutation.mutate();
  };

  return (
    <div className="">
        <SidebarProvider>
          <AdminSideBar />
            <h1 className="text-2xl font-bold mb-4">Add New Branch (Admin)</h1>

            <div className="flex flex-col gap-4 max-w-sm">
              <input
                type="text"
                placeholder="Branch Name"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="border p-2 rounded"
              />

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

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                  Add Branch
              </button>
            </div>
        </SidebarProvider>
 
     
    </div>
  );
}
