
"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Types based on your documentation
interface PersonalInfo {
    fullName?: string;
    email?: string;
    cnic?: string;
    phoneNumber?: string;
}

interface SalaryIncome {
    annualSalary?: number;
    taxDeducted?: number;
}

interface Incomes {
    salary?: SalaryIncome;
    // other income types like business, property, etc. can be added here
}

interface Deductions {
    zakat?: number;
    donations?: number;
    educationAllowance?: number;
    pensionFund?: number;
    hasTaxCredits?: boolean;
}

interface WealthStatement {
    properties?: number;
    bankAccounts?: number;
    vehicles?: number;
    cash?: number;
    otherAssets?: number;
    liabilities?: number;
}

interface Documents {
    salaryCertificate?: File | null;
    taxChallan?: File | null;
    otherDocuments?: File[] | null;
}

// Main form data structure
interface PersonalTaxFilingData {
    personalInfo: PersonalInfo;
    incomes: Incomes;
    deductions: Deductions;
    wealthStatement: WealthStatement;
    documents: Documents;
}

interface PersonalTaxFilingContextType {
  formData: PersonalTaxFilingData;
  setFormData: Dispatch<SetStateAction<PersonalTaxFilingData>>;
}

const PersonalTaxFilingContext = createContext<PersonalTaxFilingContextType | undefined>(undefined);

const initialFormData: PersonalTaxFilingData = {
    personalInfo: {},
    incomes: {},
    deductions: {},
    wealthStatement: {},
    documents: {},
};

export function PersonalTaxFilingProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<PersonalTaxFilingData>(initialFormData);

  return (
    <PersonalTaxFilingContext.Provider value={{ formData, setFormData }}>
      {children}
    </PersonalTaxFilingContext.Provider>
  );
}

export function usePersonalTaxFiling() {
  const context = useContext(PersonalTaxFilingContext);
  if (context === undefined) {
    throw new Error('usePersonalTaxFiling must be used within a PersonalTaxFilingProvider');
  }
  return context;
}
