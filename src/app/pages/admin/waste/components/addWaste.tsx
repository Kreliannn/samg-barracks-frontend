import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect} from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/app/utils/axios"
import { useQuery, useMutation } from "@tanstack/react-query"
import { getIngredientsInterface } from "@/app/types/ingredient.type"
import { Textarea } from "@/components/ui/textarea";
import { errorAlert, successAlert } from "@/app/utils/alert"
import { wasteInterface } from "@/app/types/waste.type"
import useUserStore from "@/app/store/user.store"

export function ReasonTextarea() {
  return (
    <div className="w-full max-w-md">
      <Textarea placeholder="Enter reason here..." />
    </div>
  );
}


export function AddWaste({ refetch } : { refetch : () => void }) {

    const [open, setOpen] = useState(false)

    const { user } = useUserStore()

    const [item, setItem] = useState("")
    const [qty, setQty] = useState(0)
    const [price, setPrice] = useState(0)
    const [reason, setReason] = useState("")

    const [ingredientsData, setIngredientsData] = useState<getIngredientsInterface[]>([])

    const { data } = useQuery({
        queryKey: ["ingredients"],
        queryFn: () => axiosInstance.get("/ingredients")
    })

    useEffect(() => {
        if(data?.data) setIngredientsData(data?.data)
    }, [data])


    const mutation = useMutation({
        mutationFn: async (data : wasteInterface) => axiosInstance.post("/waste", data),
        onSuccess: (response) => {
          refetch()
          setOpen(false)
          setPrice(0)
          setQty(0)
          setItem("")
          setReason("")
          successAlert("waste record added")
        },
        onError : (err : { response : { data : string }}) => {
            errorAlert(err.response.data)      
        }
    });

    const selectIngridient = (id : string) => {
        ingredientsData.forEach((i) => {
            if(i._id == id){
                setItem(i.name)
                setPrice(i.price)
                setQty(1)
            }
        })
    }


    const addWastehandler = () => {
        if(!item || !price || !qty || !user || !reason) return errorAlert("EMPTY FIELD")
        mutation.mutate({
            item: item,
            qty : qty,
            branch: user.branch,
            date: new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Manila" }),
            price: price,
            cost: price * qty,
            reason: reason
        })
    }


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger  onClick={() => setOpen(true)}  asChild>
        <Button  className="text-white"> <Plus /> Add Record </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Waste</SheetTitle>
          <SheetDescription>
            Records
          </SheetDescription>
        </SheetHeader>

            <div className=" rounded-lg  shadow-sm w-full m-auto h-[800px] overflow-auto p-2 ">

                <Select  onValueChange={(value) => selectIngridient(value)}>
                    <SelectTrigger className="border px-3 py-2 rounded bg-white text-sm w-full">
                    <SelectValue placeholder="Select Ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                    {ingredientsData?.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                        {item.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>

                <div className="space-y-1 mt-4">
                    <label htmlFor="menu-name" className="text-sm font-medium text-gray-700">
                        Item Name
                    </label>
                    <Input
                        id="menu-name"
                        type="text"
                        placeholder="e.g., Chicken Wings"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <div className="space-y-1 mt-4">
                        <label htmlFor="menu-name" className="text-sm font-medium text-gray-700">
                            Price
                        </label>
                        <Input
                            id="menu-name"
                            type="number"
                            placeholder=""
                            value={price}
                            onChange={(e) =>setPrice(Number(e.target.value))}
                            min={1}
                        />
                    </div>

                    <div className="space-y-1 mt-4">
                        <label htmlFor="menu-name" className="text-sm font-medium text-gray-700">
                           Quantity
                        </label>
                        <Input
                            id="menu-name"
                            type="number"
                            placeholder=""
                            value={qty}
                            onChange={(e) =>setQty(Number(e.target.value))}
                            min={1}
                        />
                    </div>

                </div>

                <div className="w-full max-w-md mt-4 ">
                    <Textarea  value={reason} onChange={(e) => setReason (e.target.value)} placeholder="Enter reason here..." />
                </div>
          
            </div>

        
        <SheetFooter>
          <Button onClick={addWastehandler}>Add Record</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
