import {
  validateBasicInfo,
  ValidationErrors,
  validateCTA,
  validateAdditionalInfo,
  CtaTypeEnum,
} from "@/lib/type";
import { create } from "zustand";

export type WebinarFormState = {
  basicInfo: {
    webinarName?: string;
    description?: string;
    date?: Date;
    time?: string;
    timeFormat?: "AM" | "PM";
  };
  cta: {
    ctaLabel?: string;
    tags?: string[];
    ctaType?: CtaTypeEnum;
    aiAgent?: string;
    priceId?: string;
  };
  additionalInfo: {
    lockChat?: boolean;
    couponCode?: string;
    couponCodeEnabled?: boolean;
  };
};

type ValidationState = {
  basicInfo: {
    valid: boolean;
    errors: ValidationErrors;
  };
  cta: {
    valid: boolean;
    errors: ValidationErrors;
  };
  additionalInfo: {
    valid: boolean;
    errors: ValidationErrors;
  };
};

const initialState: WebinarFormState = {
  basicInfo: {
    webinarName: "",
    description: "",
    date: new Date(),
    time: "",
    timeFormat: "AM",
  },
  cta: {
    ctaLabel: "",
    tags: [],
    ctaType: CtaTypeEnum.CTA,
    aiAgent: "",
    priceId: "",
  },
  additionalInfo: {
    lockChat: false,
    couponCode: "",
    couponCodeEnabled: false,
  },
};

type WebinarStore = {
  isModalOpen: boolean;
  isComplete: boolean;
  isSubmitting: boolean;
  formData: WebinarFormState;
  validation: ValidationState;

  setModalOpen: (open: boolean) => void;
  setComplete: (complete: boolean) => void;
  setSubmitting: (submitting: boolean) => void;

  updateBasicInfoField: <K extends keyof WebinarFormState["basicInfo"]>(
    key: K,
    value: WebinarFormState["basicInfo"][K],
  ) => void;

  updateCtaField: <K extends keyof WebinarFormState["cta"]>(
    key: K,
    value: WebinarFormState["cta"][K],
  ) => void;

  updateAdditionalInfoField: <
    K extends keyof WebinarFormState["additionalInfo"],
  >(
    key: K,
    value: WebinarFormState["additionalInfo"][K],
  ) => void;

  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;

  validateStep: (stepId: keyof WebinarFormState) => boolean;
  getStepValidationErrors: (stepId: keyof WebinarFormState) => ValidationErrors;


  resetForm: () => void;
};

export const useWebinarStore = create<WebinarStore>((set, get) => ({
  isModalOpen: false,
  isComplete: false,
  isSubmitting: false,
  formData: initialState,
  validation: {
    basicInfo: {
      valid: true,
      errors: {},
    },
    cta: {
      valid: true,
      errors: {},
    },
    additionalInfo: {
      valid: true,
      errors: {},
    },
  },

  setModalOpen: (open: boolean) => set({ isModalOpen: open }),
  setComplete: (complete: boolean) => set({ isComplete: complete }),
  setSubmitting: (submitting: boolean) => set({ isSubmitting: submitting }),

  updateBasicInfoField: <K extends keyof WebinarFormState["basicInfo"]>(
    key: K,
    value: WebinarFormState["basicInfo"][K],
  ) => {
    set((state) => {
      const newBasicInfo = { ...state.formData.basicInfo, [key]: value };
      const validationResult = validateBasicInfo(newBasicInfo);
      return {
        formData: { ...state.formData, basicInfo: newBasicInfo },
        validation: { ...state.validation, basicInfo: validationResult },
      };
    });
  },

  updateCtaField: <K extends keyof WebinarFormState["cta"]>(
    key: K,
    value: WebinarFormState["cta"][K],
  ) => {
    set((state) => {
      const newCTA = { ...state.formData.cta, [key]: value };
      const validateResult = validateCTA(newCTA);
      return {
        formData: { ...state.formData, cta: newCTA },
        validation: { ...state.validation, cta: validateResult },
      };
    });
  },

  updateAdditionalInfoField: <
    K extends keyof WebinarFormState["additionalInfo"],
  >(
    key: K,
    value: WebinarFormState["additionalInfo"][K],
  ) => {
    set((state) => {
      const newAdditionalInfo = {
        ...state.formData.additionalInfo,
        [key]: value,
      };
      const validationResult = validateAdditionalInfo(newAdditionalInfo);
      return {
        formData: {
          ...state.formData,
          additionalInfo: newAdditionalInfo,
        },
        validation: {
          ...state.validation,
          additionalInfo: validationResult,
        },
      };
    });
  },

  validateStep: (stepId: keyof WebinarFormState) => {
    const { formData } = get();
    let validationResult;

    switch (stepId) {
      case "basicInfo":
        validationResult = validateBasicInfo(formData.basicInfo);
        break;
      case "cta":
        validationResult = validateCTA(formData.cta);
        break;
      case "additionalInfo":
        validationResult = validateAdditionalInfo(formData.additionalInfo);
        break;
    }

    set((state) => ({
      validation: { ...state.validation, [stepId]: validationResult },
    }));

    return validationResult.valid;
  },

  getStepValidationErrors: (stepId: keyof WebinarFormState) => {
    return get().validation[stepId].errors;
  },

  resetForm: () => {
    set({
      isModalOpen: false,
      isComplete: false,
      isSubmitting: false,
      formData: initialState,
      validation: {
        basicInfo: {
          valid: true,
          errors: {},
        },
        cta: {
          valid: true,
          errors: {},
        },
        additionalInfo: {
          valid: true,
          errors: {},
        },
      },
    });
  },
  addTag: (tag: string) => {
    set((state) => {
      const currentTags = state.formData.cta.tags || [];
      const newTags = [...currentTags, tag];
      const newCTA = { ...state.formData.cta, tags: newTags };
      const validationResult = validateCTA(newCTA);
      
      return {
        formData: { ...state.formData, cta: newCTA },
        validation: { ...state.validation, cta: validationResult }
      };
    });
  },

  removeTag: (tagToRemove: string) => {
    set((state) => {
      const currentTags = state.formData.cta.tags || [];
      const newTags = currentTags.filter((tag: string) => tag !== tagToRemove);
      const newCTA = { ...state.formData.cta, tags: newTags };
      const validationResult = validateCTA(newCTA);
      
      return {
        formData: { ...state.formData, cta: newCTA },
        validation: { ...state.validation, cta: validationResult }
      };
    });
  },


}));
