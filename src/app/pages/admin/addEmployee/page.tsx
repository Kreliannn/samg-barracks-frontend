"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { backendUrl } from "@/app/utils/url";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { AdminSideBar } from "@/components/ui/adminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import useUserStore from "@/app/store/user.store";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAccountInterface, AccountInterface } from "@/app/types/employee.type";
import { AxiosResponse } from "axios";
import { errorAlert, successAlert } from "@/app/utils/alert";

export default function Home() {

  const {user} = useUserStore()
  
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");  
  const [employee, setEmployee] = useState<getAccountInterface[]>([])


  const { data } = useQuery({
    queryKey: ["account"],
    queryFn: () => axiosInstance.get("/account")
  })

  useEffect(() => {
      if(data?.data) setEmployee(data?.data)
  }, [data])


  const mutation = useMutation({
    mutationFn: async (data : AccountInterface) => axiosInstance.post("/register", data),
    onSuccess: (response : AxiosResponse<getAccountInterface[]>) => {
      setEmployee(response.data)
      successAlert("Employee added successfully!");
      setFullname("");
      setUsername("");
      setPassword("");
      setRole("");
    },
    onError : (err : { response : { data : string }}) => {
        errorAlert(err.response.data)      
    }
  });

  const handleSubmit = () => {
    if (!role || !user?.branch || !username || !password || !fullname) {
      errorAlert("empty");
      return;
    }
    const account = {
      branch: user.branch,
      fullname,
      username,
      password,
      role,
    };
    mutation.mutate(account);
  };

 
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* Employee Form */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-lg p-6 md:w-1/2 space-y-5">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-emerald-800 dark:text-stone-100">Add New Employee</h1>
          <p className="text-sm text-stone-500">Fill in the details to add a new staff member.</p>
        </div>
  
        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="border border-stone-300 focus:ring-2 focus:ring-emerald-500 px-4 py-2 rounded-lg w-full text-sm outline-none"
        />
  
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-stone-300 focus:ring-2 focus:ring-emerald-500 px-4 py-2 rounded-lg w-full text-sm outline-none"
        />
  
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-stone-300 focus:ring-2 focus:ring-emerald-500 px-4 py-2 rounded-lg w-full text-sm outline-none"
        />
  
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="border border-stone-300 px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cashier">Cashier</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>
  
        <Button
          onClick={handleSubmit}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-semibold"
        >
          Add Employee
        </Button>
      </div>
  
      {/* Employee List Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-lg p-6 md:w-1/2">
        <h2 className="text-xl font-semibold mb-4 text-emerald-800 dark:text-stone-100">Employee List</h2>
  
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-left">Username</TableHead>
              <TableHead className="text-left">Role</TableHead>
              <TableHead className="text-left">Branch</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employee?.map((emp) => (
              <TableRow key={emp._id} className="hover:bg-stone-100 dark:hover:bg-stone-800">
                <TableCell>{emp.fullname}</TableCell>
                <TableCell>{emp.username}</TableCell>
                <TableCell className="capitalize">{emp.role}</TableCell>
                <TableCell>{emp.branch}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
  
        {employee.length === 0 && (
          <p className="text-center text-sm text-stone-500 mt-4">No employees found.</p>
        )}
      </div>
    </div>
  )

}
