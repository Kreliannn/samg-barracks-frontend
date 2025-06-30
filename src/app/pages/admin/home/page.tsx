"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { backendUrl } from "@/app/utils/url";
import { useQuery } from "@tanstack/react-query";
import AdminNavbar from "@/components/ui/adminNavbar";

export default function Home() {
    
   const {data} = useQuery({
    queryKey : ["KRA"], 
    queryFn : () => axios.get(backendUrl("jwt"))
   })

   console.log(data?.data)

  return (
    <div className="">
      <AdminNavbar />
      <h1> welcome admin </h1>
    </div>
  );
}

