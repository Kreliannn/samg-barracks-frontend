"use client";
import RequestItem from "./components/requestItem";

export default function Page() {



    
  return (
    <div className="h-dvh w-full grid grid-cols-2 p-5 gap-2">
      {/* First column */}
      <div className=" ">
        <RequestItem />
      </div>

      {/* Second column with 2 rows */}
      <div className="grid grid-rows-2 gap-[1%]">

        <div className="bg-green-100">

        </div>

        <div className="bg-yellow-100">

        </div>

      </div>
    </div>
  );
}
