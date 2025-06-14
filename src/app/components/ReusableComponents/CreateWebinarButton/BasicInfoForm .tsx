
import { useWebinarStore } from "@/store/useWebinarStore";
import React, { ChangeEvent } from "react";
import { types } from "util";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "../../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { Calendar1Icon, Clock, Upload } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../../ui/calendar";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";

type Props = {
    
}
export const BasicInfoForm = () => {
  const {formData, updateBasicInfoField, getStepValidationErrors}= useWebinarStore();
  const errors = getStepValidationErrors('basicInfo')
  
  const { webinarName , description, date, time, timeFormat} = formData.basicInfo

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target
    updateBasicInfoField(name as keyof typeof formData.basicInfo, value)
  }
    
  const handleDateChange = (newDate: Date|undefined)=>{
    updateBasicInfoField('date', newDate)
    if(newDate){
      const today = new Date()
      today.setHours(0,0,0,0)
      if(newDate<today){
        console.log("Date should be in the future")
        toast.error('Date should be in the future')
        // updateBasicInfoField('date', undefined)
      }
    }
  }
 

  function handleUploadVideo(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

  function handleTimeFormatChange(value: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label
        htmlFor="webinarName"
        className={errors.webinarName?'text-red-400': ''}

        
        >Webinar Name <span className="text-red-400">*</span></Label>
        <Input
        id="webinarName"
        name="webinarName"
        value={webinarName|| ''}
        onChange={handleChange}
        className={cn(
          '!bg-background/50 border border-input',
          errors.webinarName && 'border-red-400 focus-visible:border-red-400'
        )}

        />
        {errors.webinarName&& (
          <p className="text-red-400 text-xs">{errors.webinarName}</p>
        )}
        




      </div>

      <div className="space-y-2">
        <Label
        htmlFor="description"
        className={errors.description?'text-red-400': ''}
        >Description</Label>
        <Textarea
        id="description"
        name="description"
        value={description|| ''}
        onChange={handleChange}
        className={cn(
          '!bg-background/50 border border-input',
          errors.description && 'border-red-400 focus-visible:border-red-400'
        )}
        />
        {errors.description&& (
          <p className="text-red-400 text-xs">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
          htmlFor="date"
          className={errors.date?'text-red-400': ''}
          >Date <span className="text-red-400">*</span></Label>
          <Popover> 
            <PopoverTrigger asChild>
            {/* <Input
            id="date"
            name="date"
            type="date"
            
            onChange={handleChange}
            className={cn(
              '!bg-background/50 border border-input',
              errors.date && 'border-red-400 focus-visible:border-red-400'
            )}
            /> */}
            
           
              <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal !bg-background/50 border border-input',
                !date && 'text-gray-500',
                errors.date && 'text-red-400 focus-visible:bg-red-400',
                
              )}

              >
                <Calendar1Icon className="border-red-400 focus-visible:ring-red-400"/>
              {date?format(date,'PPP'):'Select Date'}
              </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 !bg-background/50 border border-input">
                <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
                className="bg-background"
                disabled={(date)=>{
                  const today = new Date()
                  return date.getTime() < today.getTime()
                }}
                  />
              </PopoverContent>
          </Popover>
          {errors.date&& (
            <p className="text-red-400 text-xs">{errors.date}</p>
          )}
         
        </div>

        <div className="space-y-2">
          <Label
          htmlFor="time"
          className={errors.time?'text-red-400': ''}
          >Webinar Time <span className="text-red-400">*</span>
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-foreground"/>
              <Input
              name="time"
              value={time}
              onChange={handleChange}
              placeholder="12:00 AM"
              className={cn(
                '!bg-background/50 border border-input',
                errors.time && 'border-red-400 focus-visible:border-red-400'
              )}
              
              />
            </div>

            <Select
            value={timeFormat || 'AM'}
            onValueChange={handleTimeFormatChange}
          
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Time Format" />
              </SelectTrigger>
              <SelectContent className="!bg-background border border-input">
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          
          {errors.time&& (
            <p className="text-red-400 text-xs">{errors.time}</p>
          )}
        </div>
        
      </div>

      <div className="flex gap-2 items-center text-sm text-gray-400 mt-4">
        <div className="flex item-center">
          <Upload className="h-4 w-4 mr-2"/>
         
          Uplaoding a video makes this webinar prerecorded.

        </div>

        <Button
        variant="outline"
        className="ml-auto realtive border-input hover:bg-background "
        
        >
          Upload Video
          <Input
          className="absolute inset-0 opacity-0 cursor-pointer"
          type="file"
          accept="video/*"
          onChange={handleUploadVideo}
          />
        </Button>

      </div>
      
    </div>
  );
};

export default BasicInfoForm;
