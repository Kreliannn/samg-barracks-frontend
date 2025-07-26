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

export const CardTempalte = ({ title, value } : {  title : string, value : number }) => {


    return(
        <Card className="w-full h-full">
        <CardHeader>
          <CardDescription className="text-2xl text-emerald-800">{title}</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-emerald-600">
            ₱{value.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
       
      </Card>
    )
}