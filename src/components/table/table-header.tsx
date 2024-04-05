import { ComponentProps } from "react";

interface TableHeaderProps extends ComponentProps<'th'>{

}
export function TableHeader(props : TableHeaderProps){
    return(
        <th className="py-3 px-4 tex-sm font-semibold text-left" {...props}/>
    )
}