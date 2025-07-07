"use client";
import { CardTempalte } from "./components/cardTemplate";
import { CategoryPieChart } from "./components/categoryPieChart";
import { MonthlyChart } from "./components/montlyGraph";
import { YearlyBarChart } from "./components/yearlyGraph";
import MenuBarChart from "./components/menuChart";

export default function Home() {
  return (
    <div className="w-full h-dvh space-y-6 p-4">
      {/* First row: 1 row 4 boxes */}
      <div className="grid grid-cols-4 gap-4">
        <div className="h-32 bg-gray-100 rounded" >
            <CardTempalte  title={"Total Sales"} value={12000}/>
        </div>
        <div className="h-32 bg-gray-100 rounded" >
            <CardTempalte  title={"July Sales"} value={5000}/>
        </div>
        <div className="h-32 bg-gray-100 rounded" >
            <CardTempalte  title={"Product Sold"} value={48}/>
        </div>
        <div className="h-32 bg-gray-100 rounded" >
            <CardTempalte  title={"Branch"} value={3}/>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 h-64 bg-gray-100 rounded" >
          <MonthlyChart />
        </div>

        <div className="col-span-1 h-64 bg-gray-100 rounded" >
          <CategoryPieChart />
        </div>
      </div>
      {/* Third row: 1 row 3 cols (2 long, 1 half width) */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2 h-64 bg-gray-100 rounded" >
          <YearlyBarChart />  
        </div>
        <div className="col-span-2 h-64 bg-gray-100 rounded" >
          <MenuBarChart />  
        </div>
      </div>
    </div>
  );
}

