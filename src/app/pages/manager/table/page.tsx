"use client";
import { ManagerSideBar } from "@/components/ui/managerSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/app/utils/axios";
import {
    DndContext,
    useDraggable,
    useSensor,
    useSensors,
    PointerSensor,
  } from "@dnd-kit/core";
  import { useEffect, useState } from "react";
  import { Button } from "@/components/ui/button";
  import { useMutation } from "@tanstack/react-query";
  import { successAlert, errorAlert } from "@/app/utils/alert";
  import { X } from "lucide-react";
  
  type TableData = {
    table: string;
    x: number;
    y: number;
  };
  
  const DraggableTable = ({
    id,
    position,
    remove
  }: {
    id: string;
    position: { x: number; y: number };
    remove : (id  : string) => void
  }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id,
    });
  
    const style = {
      position: "absolute" as const,
      left: transform ? position.x + transform.x : position.x,
      top: transform ? position.y + transform.y : position.y,
      width: 100,
      height: 100,
      background: "whitesmoke",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "move",
    };
  
    return (
        <>
          
            <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="relative   shadow-lg rounded"  >
                <X onClick={() => remove(id)} className="absolute top-[-20px] left-[-20px] hover:text-red-500 "  onPointerDown={(e) => e.stopPropagation()} />
                {id}
            </div>
        </>      
    );
  };



export default function RestoLayout() {
    const [positions, setPositions] = useState<TableData[]>([]);
  
    const sensors = useSensors(useSensor(PointerSensor));

    const { data } = useQuery({
        queryKey: ["tables"],
        queryFn: () => axiosInstance.get("/branch/tables"),
        refetchInterval: 1000 * 60, 
    })

    const mutation = useMutation({
        mutationFn: (data: TableData[]) => axiosInstance.put("/branch/tables", { tables : data }),
        onSuccess: (response) => {
          successAlert("success")
        },
        onError: (err) => {
          errorAlert("error")
        },
      })
    

    useEffect(() => {
        if(data?.data) setPositions(data?.data)
    }, [data])

  
    useEffect(() => {
      const saved = localStorage.getItem("tablePositions");
      if (saved) setPositions(JSON.parse(saved));
    }, []);
  
    useEffect(() => {
      localStorage.setItem("tablePositions", JSON.stringify(positions));
    }, [positions]);
  
    const handleDragEnd = (event: any) => {
      const { delta, active } = event;
      const id = active.id;
  
      setPositions((prev) =>
        prev.map((item) =>
          item.table === id
            ? { ...item, x: item.x + delta.x, y: item.y + delta.y }
            : item
        )
      );
    };
    
    const addTable = () => {
      const newId = `Table #${positions.length + 1}`;
      const newTable: TableData = {
        table: newId,
        x: 50,
        y: 50,
      };
      setPositions((prev) => [...prev, newTable]);
    };

    const removeTable = (table :  string) => {
        setPositions((prev) => prev.filter((item) => item.table != table))
    }

    const saveChanges = () => { 
        if(!positions) errorAlert("empty table")
        mutation.mutate(positions)
    }
  
    return (
      <div style={{ width: "100%", height: "100vh", position: "relative" }}>

        <Button onClick={addTable}>Add Table</Button>
        <Button onClick={saveChanges}>save changes</Button>
       
  
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          {positions.map((item) => (
            <DraggableTable
              key={item.table}
              id={item.table}
              position={{ x: item.x, y: item.y }}
              remove={removeTable}
            />
          ))}
        </DndContext>
      </div>
    );
  }