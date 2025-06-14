import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import React from "react";
import { useWebinarStore } from "@/store/useWebinarStore";
import { Button } from "../../ui/button";
import { PlusIcon } from "lucide-react";

import MultiStepForm from "./MultiStepForm";
import { useState } from "react";

import { BasicInfoForm } from "./BasicInfoForm ";
import { describe } from "node:test";
import CTAStep from "./CTAStep";
import AdditionalInfoForm from "./AdditionalInfoForm";

type Props = {};

const CreateWebinarButton = (props: Props) => {
  const { isModalOpen, setModalOpen, isComplete, setComplete } =
    useWebinarStore();
  const [webinarLink, setWebinarLink] = useState("");
  const steps = [
    {
      id: "basicInfo",
      title: "Basic Information",
      description: "Fill in the basic details of your webinar",
      component: <BasicInfoForm />,
    },
    {
      id:"cta",
      title:"CTA",
      describe:"Please provide the end-point for your customers through your webinar",
      component:<CTAStep
      // assistants={[]}
      // strip={[]}
      />
    },
    {
      id:"additionalInfo",
      title:"Additional Information",
      describe:"Please provide the additional information for your webinar",
      component:<AdditionalInfoForm/>,
    }
  ];

  const handleComplete = (id: string) => {
    setComplete(true);
    setWebinarLink(`${process.env.NEXT_PUBLIC_BASE_URL}/live-webinar/${id}`);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded-xl flex gap-2 items-center hover:cursor-pointer px-4 py-2 border border-border
          bg-primary/10 backdrop-blur-sm text-sm font-normal text-primary hover:bg-primary-20"
          onClick={() => setModalOpen(true)}
        >
          <PlusIcon /> Create Webinar
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] p-0 bg-transparent border-none">
        {isComplete ? (
          <div className="bg-muted text-primary rounded-lg overflow-hidden">
            <DialogTitle className="sr-only"></DialogTitle>
          </div>
        ) : (
          <div className="bg-muted text-primary rounded-lg overflow-hidden">
            <DialogTitle className="sr-only"></DialogTitle>

            {/* Dummy for chack modal */}
            {/* <div className="flex flex-col gap-4 p-4">
              <h2 className="text-xl font-semibold">Success</h2>
              <p className="text-sm text-muted-foreground">
                Your webinar has been created successfully.
              </p>
            </div> */}

            {/* SuccessStep */}
            <MultiStepForm steps={steps} onComplete={handleComplete} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateWebinarButton;
