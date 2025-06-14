'use client'

import { useWebinarStore } from "@/store/useWebinarStore";
import React from 'react';
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Input } from "../../ui/input";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";


type Props = {}

const AdditionalInfoStep = (props: Props)=>{
    const {formData, updateAdditionalInfoField, getStepValidationErrors} = useWebinarStore()
    const {lockChat , couponCode, couponCodeEnabled} = formData.additionalInfo
    
    const handleToggleLockChat = (checked: boolean)=>{
        updateAdditionalInfoField('lockChat', checked)
    }
    const handleToggleCoupon = (checked: boolean)=>{
        updateAdditionalInfoField('couponCodeEnabled', checked)
    }
    const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const {name, value} = e.target
        updateAdditionalInfoField(name as keyof typeof formData.additionalInfo, value)
    }
    const errors = getStepValidationErrors('additionalInfo')
    return(
        <div>
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <Label
                    htmlFor="lock-chat"
                    className="text-base font-medium"
                    >Lock Chat</Label>
                </div>
                <p className="text-sm text-muted-foreground">Turn it on to make chat visible to your users at all time</p>
            </div>
            <Switch
            id="loack-chat"
            checked={lockChat||false}
            onCheckedChange={handleToggleLockChat}
            
            />
            
            
            
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <Label
                    htmlFor="couponEnabled"
                    className="text-base font-medium"
                    >Coupon Code <span className="text-red-400">*</span></Label>
                    <p className="text-sm text-gray-400">Turn it on to enable coupon code</p>
                </div>
            </div>
            <Switch
            id="couponEnabled"
            checked={couponCodeEnabled||false}
            onCheckedChange={handleToggleCoupon}
            />
        </div>

        {couponCodeEnabled && (
            <div className="space-y-2">
                <Input
                id="coupon-code"
                name="couponCode"
                value={couponCode||''}
                onChange={handleCouponCodeChange}
                placeholder="Enter coupon code"
                className={cn(
                    '!bg-background/50 border border-input',
                    errors.couponCode && 'border-red-400 focus-visible:border-red-400'
                )}
                />

                {errors.couponCode && (
                    <p className="text-sm text-red-400">{errors.couponCode}</p>
                )}
                <div className="flex items-start gap-2 text-sm text-gray-400 mt-2">
                    <Info className="h-4 w-4 mt-0.5"/>
                    <p>Enter a coupon code to apply a discount to your users</p>
                </div>
            </div>
        )}

        </div>  
        
    )
}

export default AdditionalInfoStep ;