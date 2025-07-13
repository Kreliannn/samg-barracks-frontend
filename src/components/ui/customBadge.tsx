import { Badge } from "./badge";

export const CustomBadge = ({status} : {status : string}) => {
    switch(status){
        case "pending":
            return <Badge className="bg-violet-500 shadow"> {status} </Badge>
        break;

        case "to ship":
            return <Badge className="bg-blue-500 shadow"> {status} </Badge>
        break;

        case "completed":
            return <Badge className="bg-green-500 shadow"> {status} </Badge>
        break;

        case "rejected":
            return <Badge className="bg-red-500 shadow"> {status} </Badge>
        break;

        default:
            return null
    }
}