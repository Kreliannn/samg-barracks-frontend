import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Badge } from "@/components/ui/badge"

export const CardTempalte = ({ title, value , hasPhp} : {  title : string, value : number , hasPhp : boolean}) => {


    return(
        <Card className="w-full h-full">
        <CardHeader>
          <CardDescription className="text-2xl text-emerald-800">{title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-emerald-600">
          {hasPhp && "₱"} {value.toLocaleString()}
          </CardTitle>
          <CardAction>
           
          </CardAction>
        </CardHeader>
       
      </Card>
    )
}