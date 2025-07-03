"use client";
import { useEffect, useState } from "react";
import { Building, User, Lock, UserCheck, Plus } from "lucide-react";
import { AdminSideBar } from "@/components/ui/adminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useMutation } from "@tanstack/react-query";
import { AccountInterface } from "@/app/types/employee.type";
import axiosInstance from "@/app/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { errorAlert, successAlert } from "@/app/utils/alert";



export default function Home() {
  const [branchName, setBranchName] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [allBranch, setAllBranch] = useState<{_id : string, branch : string}[]>([])

  const { data } = useQuery({
    queryKey: ["branch"],
    queryFn: () => axiosInstance.get("/branch")
  })

  useEffect(() => {
      if(data?.data) setAllBranch(data?.data)
  }, [data])

  console.log(allBranch)

  const mutation = useMutation({
    mutationFn: (data : AccountInterface) => axiosInstance.post("/branch", data),
    onSuccess: (response) => {
      successAlert("Branch created successfully!");
      setAllBranch(response.data)
      setBranchName("");
      setFullname("");
      setUsername("");
      setPassword("");
    },
    onError: (err) => {
      console.log(err);
      errorAlert("Error creating branch");
    }
  });

  const handleSubmit = () => {
    if (!branchName || !fullname || !username || !password) {
      return errorAlert("Please fill all fields");
    }
    const account = {
      branch: branchName,
      role : "admin",
      fullname,
      username,
      password,
    };
    mutation.mutate(account);
  };

  return (

        
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            
            {/* Add Branch Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Building className="h-6 w-6" />
                Add New Branch
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Branch Name"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-stone-500 focus:border-stone-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={mutation.isPending}
                className="mt-6 bg-stone-600 text-white px-6 py-2 rounded-md hover:bg-stone-700 disabled:opacity-50 flex items-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Branch
                  </>
                )}
              </button>
            </div>

            {/* All Branches Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 ">All Branches</h2>
              
              {/* Empty state - you can replace this with your branch list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-12 text-gray-700">
                {allBranch.map((branch) => (
                  <div
                    key={branch._id}
                    className="border rounded-xl shadow-sm flex items-center justify-center h-32 text-lg font-semibold bg-white hover:shadow-md transition"
                  >
                    {branch.branch}
                  </div>
                ))}
              </div>

             
            </div>

          </div>
        </div>
 
  );
}