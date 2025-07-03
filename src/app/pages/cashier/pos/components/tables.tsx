import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { CashierSideBar } from '@/components/ui/cashierSidebar';
import useTableStore from '@/app/store/table.store';

const tables = Array.from({ length: 15 }, (_, i) => `Table ${i + 1}`);

const TableGrid = () => {
    const { setTable } = useTableStore()
  return (
    <div className="">
    <SidebarProvider>
      <CashierSideBar />
      <div className="h-dvh w-full flex bg-stone-50">
        <div className='w-5/6 m-auto '>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 p-4 w-full h-full">
                {tables.map((table, index) => (
                    <div
                    key={index}
                    className="bg-white hover:bg-stone-600 hover:text-white shadow-lg rounded-2xl flex items-center justify-center h-32 text-lg font-semibold text-gray-800"
                    onClick={() => setTable(table)}
                    >
                    {table}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </SidebarProvider>
  </div>
   
  );
};

export default TableGrid;
