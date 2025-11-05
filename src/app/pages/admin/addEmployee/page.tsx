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
import { EyeOff, Eye, Trash, Edit } from "lucide-react";
import { confirmAlert } from "@/app/utils/alert";

export default function Home() {

  const {user} = useUserStore()
  
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState({
      isAdmin : false,
      isCashier : false,
      isManager : false,
  },);  

  const [employee, setEmployee] = useState<getAccountInterface[]>([])

  const [showPassword, setShowPassword] = useState(false);

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
      setRole({
        isAdmin : false,
        isCashier : false,
        isManager : false,
      });
    },
    onError : (err : { response : { data : string }}) => {
        errorAlert(err.response.data)      
    }
  });


  const mutationDelete = useMutation({
    mutationFn: async (id : string) => axiosInstance.delete("/account/" + id),
    onSuccess: (response) => {
      setEmployee(response.data)
      successAlert("Employee deleted successfully!")
    },
    onError : (err : { response : { data : string }}) => {
        errorAlert(err.response.data)      
    }
  });


  const mutationUpdateRole = useMutation({
    mutationFn: async (data : {id : string, role : string}) => axiosInstance.patch("/account/role", data),
    onSuccess: (response) => {
      setEmployee(response.data)
      successAlert("Employee Role Updated successfully!")
    },
    onError : (err : { response : { data : string }}) => {
        errorAlert(err.response.data)      
    }
  });

  const handleSubmit = () => {
    if(!role.isAdmin && !role.isManager && !role.isCashier){
      errorAlert("role is required");
      return;
    }
    if (!user?.branch || !username || !password || !fullname) {
      errorAlert("empty filed");
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

  const removeEmployee = (id  :string) => {
    confirmAlert("you want to delete this account?", "delete", () => {
      mutationDelete.mutate(id)
    })
  }


  const toggleRole = (id : string, role : string) => {
    confirmAlert("you want to update role", "update", () => { 
      mutationUpdateRole.mutate({id, role})
    })
  }
 
  return (
    <div className="flex flex-col md:flex-row  w-full">
      {/* Employee Form */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-lg p-6 md:w-2/6 space-y-5 m-5 max-h-[350px]">
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

        <div className="flex gap-2">
          <div className="w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-stone-300 focus:ring-2 focus:ring-emerald-500 px-4 py-2 rounded-lg w-full text-sm outline-none"
            />

            <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-green-800  transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-green-800  transition-colors" />
                  )}
            </button>
          </div>
         

           <div className="flex gap-4 items-center justify-center ">
              <div
                onClick={() => setRole((prev) => ({...prev, isAdmin : !prev.isAdmin}))}
                className="flex flex-col items-center cursor-pointer select-none"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    role.isAdmin
                      ? "bg-green-500 border-green-600"
                      : "bg-gray-200 border-gray-400"
                  }`}
                ></div>
                <span className="text-xs mt-2"> Admin </span>
              </div>

              <div
                onClick={() => setRole((prev) => ({...prev, isManager : !prev.isManager}))}
                className="flex flex-col items-center cursor-pointer select-none"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    role.isManager
                      ? "bg-green-500 border-green-600"
                      : "bg-gray-200 border-gray-400"
                  }`}
                ></div>
                <span className="text-xs mt-2"> Manager </span>
              </div>

              <div
                onClick={() => setRole((prev) => ({...prev, isCashier : !prev.isCashier}))}
                className="flex flex-col items-center cursor-pointer select-none"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    role.isCashier
                      ? "bg-green-500 border-green-600"
                      : "bg-gray-200 border-gray-400"
                  }`}
                ></div>
                <span className="text-xs mt-2"> Cashier </span>
              </div>
          </div>

        </div>
  
  
        <Button
          onClick={handleSubmit}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-semibold"
        >
          Add Employee
        </Button>
      </div>
  
      {/* Employee List Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-lg p-6 md:w-4/6  m-5">
        <h2 className="text-xl font-semibold mb-4 text-emerald-800 dark:text-stone-100">Employee List</h2>
  
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-left">Username</TableHead>
              <TableHead className="text-left">Branch</TableHead>
              <TableHead className="text-left">Admin</TableHead>
              <TableHead className="text-left">Manager</TableHead>
              <TableHead className="text-left">Cashier</TableHead>
              <TableHead className="text-left">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employee?.map((emp) => (
              <TableRow key={emp._id} className="hover:bg-stone-100 dark:hover:bg-stone-800">
                <TableCell>{emp.fullname}</TableCell>
                <TableCell>{emp.username}</TableCell>
                <TableCell>{emp.branch}</TableCell>

                <TableCell>
                  <div className="flex justify-center items-center w-full">
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                        emp.role.isAdmin
                          ? "bg-green-500 border-green-600 hover:bg-red-500"
                          : "bg-gray-200 border-gray-400 hover:bg-green-100"
                      }`}
                      onClick = {() => toggleRole(emp._id, "admin")}
                    ></div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center items-center w-full">
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                        emp.role.isManager
                          ? "bg-green-500 border-green-600 hover:bg-red-500"
                          : "bg-gray-200 border-gray-400 hover:bg-green-100"
                      }`}
                      onClick = {() => toggleRole(emp._id, "manager")}
                    ></div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex justify-center items-center w-full">
                    <div
                      className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                        emp.role.isCashier
                          ? "bg-green-500 border-green-600 hover:bg-red-500"
                          : "bg-gray-200 border-gray-400 hover:bg-green-100"
                      }`}
                      onClick = {() => toggleRole(emp._id, "cashier")}
                    ></div>
                  </div>
                </TableCell>

                <TableCell>
                    <Button variant={"destructive"} size={"sm"} onClick={() => removeEmployee(emp._id)}> <Trash /> </Button>
                </TableCell>
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
