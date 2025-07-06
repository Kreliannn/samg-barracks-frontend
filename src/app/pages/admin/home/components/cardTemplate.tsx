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

export const CardTempalte = () => {


    return(
        <Card className="w-full h-full">
        <CardHeader>
          <CardDescription className="text-2xl">Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $1,250.00
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