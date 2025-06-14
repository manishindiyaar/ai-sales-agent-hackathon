"use server";

import { WebinarFormState } from "@/store/useWebinarStore";
import { onAuthenticateUser } from "./auth";
import { prismaClient } from "@/lib/prismaClient";
import { revalidatePath } from "next/cache";
import { CtaTypeEnum as PrismaCtaTypeEnum } from "@prisma/client";
import { CtaTypeEnum } from "@/lib/type";

// Helper function to convert frontend CTA type to Prisma CTA type
const toPrismaCtaType = (type: CtaTypeEnum | undefined): PrismaCtaTypeEnum => {
  switch (type) {
    case CtaTypeEnum.PURCHASE:
      return PrismaCtaTypeEnum.BUY_NOW;
    case CtaTypeEnum.REGISTRATION:
    case CtaTypeEnum.SIGNUP:
    case CtaTypeEnum.DOWNLOAD:
    case CtaTypeEnum.LEARN_MORE:
    case CtaTypeEnum.CTA:
    default:
      return PrismaCtaTypeEnum.BOOK_A_CALL;
  }
};

const combinedDateTime = (date: string, time: string, timeFormat: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const isPM = timeFormat.toLowerCase() === "pm";

  let combinedHours = hours;
  if (isPM && hours < 12) {
    combinedHours += 12;
  } else if (!isPM && hours === 12) {
    combinedHours = 0;
  }

  const result = new Date(date);
  result.setHours(combinedHours);
  result.setMinutes(minutes);

  return result;
};

export const createWebinar = async (formData: WebinarFormState) => {
  console.log("Starting webinar creation...");
  try {
    const user = await onAuthenticateUser();
    if (!user.user) {
      console.error("Unauthorized: No user found");
      return { status: 401, message: "Unauthorized" };
    }
    

    // subscription if we want to add
    // if(!user.user.subscription){
    //   return{status:402, message:'Subscription required'}
    // }
    //

    const presenterId = user.user.id;

    console.log("Form Data", formData, presenterId);

    if (!formData.basicInfo.webinarName) {
      return { status: 404, message: "Webinar name is required" };
    }
    if (!formData.basicInfo.date) {
      return { status: 404, message: "Webinar date is required" };
    }
    if (!formData.basicInfo.time) {
      return { status: 404, message: "webinar time is required" };
    }

    const webinarDateTime = combinedDateTime(
      formData.basicInfo.date.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
      formData.basicInfo.time,
      formData.basicInfo.timeFormat || "AM",
    );

    const now = new Date();

    if (webinarDateTime < now) {
      return {
        status: 400,
        message: "Webinar date and time should be in the future",
      };
    }

    console.log("Creating webinar with data:", {
      title: formData.basicInfo.webinarName,
      startTime: webinarDateTime,
      presenterId,
      tags: formData.cta.tags,
      ctaType: formData.cta.ctaType
    });

    const webinar = await prismaClient.webinar.create({
      data: {
        title: formData.basicInfo.webinarName,
        description: formData.basicInfo.description || '',
        startTime: webinarDateTime,
        tags: formData.cta.tags || [],
        ctaLabel: formData.cta.ctaLabel,
        ctaType: toPrismaCtaType(formData.cta.ctaType),
        aiAgentId: formData.cta.aiAgent || null,
        priceId: formData.cta.priceId || null,
        lockChat: formData.additionalInfo.lockChat || false,
        couponCode: formData.additionalInfo.couponCodeEnabled ?
          formData.additionalInfo.couponCode : null,
        couponEnabled: formData.additionalInfo.couponCodeEnabled || false,
        presenterId: presenterId,
      }
    });

    console.log("Webinar created successfully:", webinar.id);

    revalidatePath('/')
    return{
      status:200,
      message:'Webinar created successfully',
      webinarId:webinar.id,
      webinarLink:`/webinar/${webinar.id}`

    }

    console.log("Combined DateTime", combinedDateTime);

    

  } catch (error) {
    console.error("Error creating webinar:", error);
    return {
      status: 500,
      message: `Failed to create webinar: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
