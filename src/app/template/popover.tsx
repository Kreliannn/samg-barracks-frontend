"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
 

export function PopoverDemo() {

  const [open, setOpen] = useState(false);

    
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
            <Button className="flex items-center gap-2 "  onClick={() => setOpen(true)}>
                Open
            </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>   
           Description
          </DialogDescription>
        </DialogHeader>

    
        <div className=" gap-6 mb-6">
         

        </div>

        <DialogFooter>
          <Button type="submit">  Click  </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
