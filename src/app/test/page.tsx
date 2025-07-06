"use client";

import {
  DndContext,
  useDraggable,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type TableData = {
  table: string;
  x: number;
  y: number;
};

const DraggableTable = ({
  id,
  position,
}: {
  id: string;
  position: { x: number; y: number };
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
    background: "#4ade80",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "move",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {id}
    </div>
  );
};

export default function RestoLayout() {
  const [positions, setPositions] = useState<TableData[]>([
    { table: "table1", x: 0, y: 0 },
    { table: "table2", x: 150, y: 150 },
  ]);

  const sensors = useSensors(useSensor(PointerSensor));

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
    const newId = `table${positions.length + 1}`;
    const newTable: TableData = {
      table: newId,
      x: 50,
      y: 50,
    };
    setPositions((prev) => [...prev, newTable]);
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Button onClick={addTable}>Add Table</Button>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {positions.map((item) => (
          <DraggableTable
            key={item.table}
            id={item.table}
            position={{ x: item.x, y: item.y }}
          />
        ))}
      </DndContext>
    </div>
  );
}
