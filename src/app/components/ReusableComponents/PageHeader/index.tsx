import React from "react";
import PurpleIcon from "../PurpleIcon";
import { Search } from "lucide-react";
import { Input } from "../../ui/input";

type Props = {
    leftIcon?: React.ReactNode;
    mainIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    heading?: string;
    placeholder?: string;
    children?: React.ReactNode;
}

const PageHeader = ({leftIcon,mainIcon,rightIcon,heading,placeholder,children}:Props) => {
    
    return (
        <div className="w-full flex flex-col gap-8">
            <div className="flex items-center justify-between w-full sm:justify-between gap-8 flex-wrap">
              <p className="text-primary text-4xl font-semibold">{heading}</p>  
              <div className="relative md:mr-28">
                <PurpleIcon
                className="absolute -left-4 -top-3 -z-10 -rotate-45 py-3">
                    {leftIcon}
                </PurpleIcon>

                <PurpleIcon className="z-10 backdrop-blur">
{mainIcon}
                </PurpleIcon>

                <PurpleIcon className="absolute -right-4 -top-3 -z-10 rotate-45 py-3">
{rightIcon}
                </PurpleIcon>
                
              </div>
            </div>

            <div className="w-full flex flex-wrap gap-6 items-center justify-between">
                <div className="w-full md:max-w-3/4 relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"/>
                <Input 
                placeholder={placeholder || 'Search'}
                type="text"
                className="pl-10 rounded-md"
                />
                </div>
                
            </div>
         
        </div>
    )
}
export default PageHeader