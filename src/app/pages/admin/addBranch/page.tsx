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
    <div className="flex-1 p-6 bg-stone-50 min-h-screen"> 
      <div className="max-w-6xl mx-auto space-y-8 grid md:grid-cols-2 gap-5 grid-cols-1">
  
        {/* Add Branch Section */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-stone-800 mb-6 flex items-center gap-2">
            <Building className="h-6 w-6 text-emerald-600" />
            Add New Branch
          </h1>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
            {/* Branch Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Branch Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. Main Street"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
  
            {/* Fullname */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Admin Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
  
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Username
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
  
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
  
          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="mt-6 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition text-white text-sm font-medium px-6 py-2 rounded-md disabled:opacity-50"
          >
            {mutation.isPending ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-stone-800 mb-6">All Branches</h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-stone-800">
            {allBranch.length === 0 ? (
              <p className="col-span-full text-center text-sm text-stone-500">No branches available.</p>
            ) : (
              allBranch.map((branch) => (
                <div
                  key={branch._id}
                  className="bg-gradient-to-r from-green-700 to-green-800  hover:bg-green-800 text-white transition shadow-sm rounded-xl flex items-center justify-center h-28 text-base font-medium"
                >
                  {branch.branch}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
  
}