"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/app/utils/axios";
import { useQuery } from "@tanstack/react-query";

export interface getActivityInterface {
  _id: string;
  action: string;
  employee: string;
  date: string;
  time: string;
  role: string;
  branch: string;
}

export default function Home() {
  const [search, setSearch] = useState("");

  const [activities, setActivities] = useState<getActivityInterface[]>([]);

  const { data } = useQuery({
    queryKey: ["activities"],
    queryFn: () => axiosInstance.get("/branch/activities")
  })    

  useEffect(() => {
      if(data?.data) setActivities(data?.data)
  }, [data])



  const filtered = activities.filter(
    (a) =>
      a.employee.toLowerCase().includes(search.toLowerCase()) ||
      a.action.toLowerCase().includes(search.toLowerCase()) ||
      a.branch.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-4">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold">Recent Activities</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search activities..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.action}</TableCell>
                  <TableCell>{a.employee}</TableCell>
                  <TableCell>{a.role}</TableCell>
                  <TableCell>{a.branch}</TableCell>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No activities found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
