"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { backendUrl } from "./utils/url";
import { useRouter } from "next/navigation";
import useUserStore from "./store/user.store";
import axiosInstance from "./utils/axios";
import { errorAlert } from "./utils/alert";
import { LoaderCircle, User, Lock, Eye, EyeOff } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false)

  const { setUser } = useUserStore();

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      axiosInstance.post("/login", data),
    onSuccess: (res) => {
      const { fullname, role, branch, token } = res.data;
      localStorage.setItem("token", token);
      setUser({ fullname, role, branch });
      router.push(`/pages/${role}/home`);
    },
    onError : () => {
      errorAlert("user not found")
      setIsLoading(false)
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, password });
    setIsLoading(true)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 shadow-lg bg-white rounded-lg overflow-hidden">
        {/* Left: Logo Image */}
        <div className="relative bg-gray-100 p-0 h-full w-full">
          <img
            src="/web/logo.jpg"
            alt="Logo"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        {/* Right: Login Form */}
        <div className="flex flex-col justify-center p-10">

        
          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-black uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="block w-full pl-10 pr-3 py-3 border-0 border-b-2 border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition-colors duration-200 text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-black uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="block w-full pl-10 pr-10 py-3 border-0 border-b-2 border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:border-black focus:ring-0 transition-colors duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400 hover:text-black transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400 hover:text-black transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 px-4 text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[0.98] active:scale-95"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <div className="h-px bg-gray-200 w-full mb-4"></div>
            <p className="text-xs text-gray-400">
              Secure login powered by your credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}