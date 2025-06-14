import { useWebinarStore } from "@/store/useWebinarStore";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Separator } from "@radix-ui/react-separator";
import { AlertCircle, ChevronRight, Loader2, Router } from "lucide-react";
import { Button } from "../../ui/button";
import { createWebinar } from "@/actions/webinar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";


// Define the type for a single step in the multi-step form
type Step = {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
};

// Define the props for the MultiStepForm component
type Props = {
  steps: Step[];
  onComplete: (id: string) => void;
};

const MultiStepForm = ({ steps, onComplete }: Props) => {
  // Destructure state and functions from the webinar store
  const { formData, validateStep, isSubmitting, setSubmitting, setModalOpen } =
    useWebinarStore();
    const router = useRouter()


  // State to manage the current step index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // State to keep track of completed steps
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  // State to store validation errors
  const [validationErrors, setValidationErrors] = useState<string | null>(null);

  // Get the current step based on the index
  const currentStep = steps[currentStepIndex];
  // Determine if it's the first step
  const isFirstStep = currentStepIndex === 0;
  // Determine if it's the last step
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleBack = ()=>{
    if(isFirstStep){
      setModalOpen(false)
    }else{
      setCurrentStepIndex(currentStepIndex - 1)
      setValidationErrors(null)
    }
  }

  const handleNext = async ()=>{
    
    setValidationErrors(null)
    const isValid = await validateStep(currentStep.id as keyof typeof formData)
    if(!isValid){
      setValidationErrors("Please fill all the fields")
      return
    }
    if(!completedSteps.includes(currentStep.id)){
      setCompletedSteps([...completedSteps, currentStep.id])
    }
    if(isLastStep){
      try {
        setSubmitting(true)
        const result = await createWebinar(formData)
        if(result.status === 200 && result.webinarId){
      toast.success("Webinar created successfully")
      onComplete(result.webinarId)
        }else{
          toast.error(result.message || "Failed to create webinar")
          setValidationErrors(result.message)
        }
        router.refresh()
        
      } catch (error) {
        console.log(error)
        console.error('Error creating webinar', error)
        toast.error("Failed to create webinar")
        setValidationErrors("Failed to create webinar")
        

        
        }finally{
          setSubmitting(false)
        }
    }else{
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  return (
    <div
      className="flex flex-col justify-center items-center
      bg-[#27272A]/20 border border-border rounded-3xl overflow-hidden max-auto backdrop-blur-[106px]"
    >
      <div className="flex items-center justify-start">
        <div className="w-full md:w-1/3 p-6">
          <div className="space-y-6">
            {steps.map((step, index) => {
              // Check if the step is completed
              const isCompleted = completedSteps.includes(step.id);
              // Check if the step is the current one
              const isCurrent = index === currentStepIndex;
              // Check if the step is a past one
              const isPast = index < currentStepIndex;

              return (
                <div key={step.id} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {/* Animated circle for step indicator */}
                      <motion.div
                        initial={false}
                        animate={{
                          backgroundColor:
                            isCurrent || isCompleted
                              ? "rgb(147,51,234)" // Purple for current/completed
                              : "rgb(31,41,55)", // Dark gray for incomplete
                        }}
                        style={{
                          transform:
                            isCurrent && !isCompleted
                              ? "scale(0.8)" // Slightly smaller for current
                              : "scale(1)", // Normal size otherwise
                        }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center w-8 h-8 rounded-full z-10"
                      >
                        <AnimatePresence mode="wait"></AnimatePresence>
                      </motion.div>

                      {/* Vertical line connecting steps, only for steps before the last one */}
                      {index < steps.length - 1 && (
                        <div className="absolute top-8 left-4 w-0.5 h-16 bg-gray-700 overflow-hidden">
                          <motion.div
                            initial={{
                              height: isPast || isCompleted ? "100%" : "0%",
                              backgroundColor: "rgb(147,51,234)",
                            }}
                            animate={{
                              height: isPast || isCompleted ? "100%" : "0%",
                              backgroundColor: "rgb(147,51,234)",
                            }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="w-full h-full"
                          />
                        </div>
                      )}
                    </div>

                    {/* Step title and description */}
                    <div className="pt-1">
                      <motion.h3
                        animate={{
                          color:
                            isCurrent || isCompleted
                              ? "rgb(255,255,255)" // White for current/completed
                              : "rgb(156,163,175)", // Gray for incomplete
                        }}
                        transition={{ duration: 0.3 }}
                        className="font-medium"
                      >
                        {step.title}
                      </motion.h3>

                      <p className="text-sm text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-1/2"
        />

        <div className="w-full md:w-2/3">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold">{currentStep.title}</h2>

                <p className="text-gray-400">{currentStep.description}</p>
              </div>

              {/* Render current step component */}

              {currentStep.component}

              {validationErrors && (
                <div
                  className="mt-4 p-3 bg-red-900/30 border
                  border-red-800 rounded-md flex items-start gap-2 text-red-300"
                >
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{validationErrors}</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full p-6 flex justify-between">
        <Button
          variant="outline"
          disabled={isSubmitting}
          onClick={handleBack}
          className={cn(
            `border-b-gray-700 text-white hover:bg-gray-800 *:
          `,
            isFirstStep && `opacity-50 cursor-not-allowed`,
          )}
        >
          {isFirstStep ? "Cancel" : "Back"}
        </Button>
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isLastStep ? (
            isSubmitting ? (
              <>
                <Loader2 className="animate-spin" />
                Creating
              </>
            ) : (
              'Complete'
            )
          ) : (
            'Next'
          )}
          {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default MultiStepForm;
