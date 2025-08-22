
"use client";

import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Types based on your documentation
interface PersonalInfo {
    fullName?: string;
    email?: string;
    cnic?: string;
    dateOfBirth?: Date;
    passport?: string;
    occupation?: string;
    phoneNumber?: string;
    nationality?: 'pakistani' | 'foreigner';
    residencyStatus?: 'resident' | 'non-resident';
    foreignerEmploymentStay?: 'yes' | 'no';
    foreignerThreeYearStay?: 'yes' | 'no';
}

interface Incomes {
    hasSalary?: boolean;
    hasBusiness?: boolean;
    hasSelfEmployed?: boolean;
    hasFreelancer?: boolean;
    hasProfessional?: boolean;
    hasPension?: boolean;
    hasAgriculture?: boolean;
    hasCommission?: boolean;
    hasServices?: boolean;
    hasPartnership?: boolean;
    hasRent?: boolean;
    hasSavingsProfit?: boolean;
    hasDividend?: boolean;
    hasGain?: boolean;
    hasOther?: boolean;
}

interface TaxCredit {
    qualifyForRebates?: 'yes' | 'no';
    hasDonations?: boolean;
    donationAmount?: number;
    hasTuitionFee?: boolean;
    numberOfChildren?: number;
    tuitionFeeAmount?: number;
}

interface Deductions {
    selectedCategories: Record<string, boolean>;
    bank?: {
        transactionType?: string;
        bankName?: string;
        accountNumber?: string;
        taxDeducted?: number;
    }[];
    vehicle?: {
        activity?: string;
        vehicleType?: string;
        registrationNumber?: string;
        taxDeduction?: number;
    }[];
     utility?: {
        utilityType?: string;
        consumerNumber?: string;
        taxDeduction?: number;
    }[];
    other?: {
        propertyPurchase?: boolean;
        propertySale?: boolean;
        functionsGatherings?: boolean;
        pensionWithdrawal?: boolean;
    }
}

interface WealthStatement {
    openingWealth?: number;
}

interface Expense {
    totalHouseholdExpense?: number;
}

interface Documents {
    salaryCertificate?: File | null;
    taxChallan?: File | null;
    otherDocuments?: File[] | null;
}

// Main form data structure
interface PersonalTaxFilingData {
    taxYear?: string;
    personalInfo: PersonalInfo;
    incomes: Incomes;
    taxCredit: TaxCredit;
    deductions: Deductions;
    wealthStatement: WealthStatement;
    expense: Expense;
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
    taxCredit: {},
    deductions: { selectedCategories: {} },
    wealthStatement: {},
    expense: {},
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
