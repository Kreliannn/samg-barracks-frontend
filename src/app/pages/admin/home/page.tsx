"use client";
import { CardTempalte } from "./components/cardTemplate";
import { CategoryPieChart } from "./components/categoryPieChart";
import { MonthlyChart } from "./components/montlyGraph";
import { WeeklyChart } from "./components/weeklyGraph";
import { YearlyBarChart } from "./components/yearlyGraph";
import { TodaySalesChart } from "./components/todaySalesChart";
import MenuBarChart from "./components/menuChart";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import axiosInstance from "@/app/utils/axios";
import LoadingState from "./components/loadingState";
import useUserStore from "@/app/store/user.store";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { errorAlert } from "@/app/utils/alert";
import {Button} from "@/components/ui/button";

interface dataType {
  totalTransaction : number;
  totalSales: number;
  totalTax: number;
  thisMonthSales: {
    date: string;
    sales: number;
  }[];
  thisWeekSales :{
    date: string;
    sales: number;
  }[];
  todaySales :{
    date: string;
    sales: number;
  }[];
  topCategory: {
    category: string;
    sold: number;
  }[];
  topMenu: {
    menu: string;
    sold: number;
    img: string;
  }[];
  yearlySales: {
    month: string;
    sales: number;
  }[];
}

export default function Home() {
  const [allBranch, setAllBranch] = useState<{ _id: string; branch: string }[]>(
    []
  );

  const [type, setType] = useState<"month" | "week" | "today">("month");

  const { user } = useUserStore();
  const [selectedBranch, setSelectedBranch] = useState("");

  // Fetch all branches
  const { data: branch } = useQuery({
    queryKey: ["branch"],
    queryFn: () => axiosInstance.get("/branch"),
  });

  useEffect(() => {
    if (branch?.data) setAllBranch(branch.data);
  }, [branch]);

  // Set selected branch from user (only once)
  useEffect(() => {
    if (user?.branch && !selectedBranch) {
      setSelectedBranch(user.branch);
    }
  }, [user, selectedBranch]);

  // Fetch analytics based on selectedBranch
  const { data, isFetching } = useQuery({
    queryKey: ["analytics", selectedBranch],
    queryFn: () => axiosInstance.get(`/order/sales/${selectedBranch}/${type}`),
    enabled: !!selectedBranch, // Wait until selectedBranch is set
  });

  const [analytics, setAnalytics] = useState<dataType | null>(null);

  useEffect(() => {
    if (data?.data) setAnalytics(data.data);
  }, [data]);


  const mutation = useMutation({
    mutationFn : () => axiosInstance.get(`/order/sales/${selectedBranch}/${type}`),
    onSuccess : (response) => {
      setAnalytics(response.data)
    }, onError : () => errorAlert("error accour")
  })


  const changeBranch = (value : string) => {
    setSelectedBranch(value)
    mutation.mutate()
  }

  const changeType = (value : "month" | "week" | "today") => {
    setType(value)
    mutation.mutate()
  }

  if (!analytics || isFetching) return <LoadingState />;

  return (
    <div className="w-full h-dvh space-y-6 p-4 ">

      
        <div className="w-full h-10 items-center top-0 left-0 flex justify-between">
          <h1 className="md:text-2xl text-lg font-bold text-green-700">
            {selectedBranch} Dashboard
          </h1>

          <div className="flex gap-2">
            <Button variant="outline"  className={`${type === "month" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() => changeType("month")}>Month</Button>
            <Button variant="outline"  className={`${type === "week" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() => changeType("week")}>Week</Button>
            <Button variant="outline"  className={`${type === "today" ? "bg-green-700 text-white hover:text-white hover:bg-green-600" : ""}`} onClick={() => changeType("today")}>Today</Button>

            {user?.branch == "Main Branch" && (
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="border px-3 py-2 rounded text-sm z-99">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent>
                  {allBranch?.map((item, index) => (
                    <SelectItem key={index} value={item.branch}>
                      {item.branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      
     

      <div className="grid md:grid-cols-3  grid-cols-1 gap-4">
        <div className="h-32  rounded">
          <CardTempalte hasPhp={true} title={"Total Sales"} value={analytics.totalSales} />
        </div>
        <div className="h-32  rounded">
          <CardTempalte hasPhp={false} title={"Total Transactions"} value={analytics.totalTransaction} />
        </div>
        <div className="h-32  rounded">
          <CardTempalte hasPhp={true} title={"Total Vat"} value={analytics.totalTax} />
        </div>
      </div>

      <div className="grid   md:grid-cols-4  grid-cols-1 gap-4">
        
        <div className="col-span-3 h-64  rounded">
          {type === "month" && (
            <MonthlyChart data={analytics.thisMonthSales} />
          )}
          {type === "week" && (
            <WeeklyChart data={analytics.thisWeekSales} />
          )}
          {type === "today" && (
            <TodaySalesChart data={analytics.todaySales} />
          )}
        </div>


        <div className="col-span-1 h-64  rounded hidden md:block">
          <CategoryPieChart data={analytics.topCategory} />
        </div>
      </div>

      <div className="col-span-1  h-92  md:hidden rounded">
          <CategoryPieChart data={analytics.topCategory} />
      </div>

      <div className="grid  md:grid-cols-4  grid-cols-1 gap-4">
        <div className="col-span-2 h-64  rounded">
          <YearlyBarChart data={analytics.yearlySales} />
        </div>
        <div className="col-span-2 h-64  rounded">
          <MenuBarChart data={analytics.topMenu} />
        </div>
      </div>
    </div>
  );
}
