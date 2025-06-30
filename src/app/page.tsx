"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { backendUrl } from "./utils/url";
import { useRouter } from "next/navigation";
import useUserStore from "./store/user.store";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useUserStore()

  const router = useRouter()

  const mutation = useMutation({
    mutationFn : (data : {username : string, password : string}) => axios.post(backendUrl("login"), data),
    onSuccess : (res) => {
      const { fullname, role, branch,token } = res.data
      setUser({ fullname, role, branch})
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      switch(role)
      {
        case "admin":
          router.push("/pages/admin/home")
        case "manager":
          router.push("/pages/manager/home")
      }
  
    
    },
    onError : (err : { response : { data : string }}) => {
      console.log(err.response.data)      
    }
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, password})
   
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

