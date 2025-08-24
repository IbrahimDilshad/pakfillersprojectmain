
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

interface SalaryIncome {
    annualSalary?: number;
    taxDeducted?: number;
}

interface BusinessSubForm {
    withholdingOption?: 'all' | 'none' | 'some';
    revenueWithTax?: {
        revenueAmount?: number;
        taxDeducted?: number;
        taxRate?: string;
    };
    revenueWithoutTax?: {
        revenueAmount?: number;
    };
    directExpense?: number;
    indirectExpense?: number;
    totalAssets?: number;
    totalLiabilities?: number;
    totalCapital?: number;
    hasOtherAdjustableTaxes?: 'yes' | 'no';
    otherAdjustableTaxes?: {
        description?: string;
        taxDeducted?: number;
    }[];
}

interface FreelancerSubForm extends BusinessSubForm {
    incomeFromAbroad?: 'yes' | 'no';
    isPsebRegistered?: 'yes' | 'no';
}

interface ProfessionalSubForm extends BusinessSubForm {
    professionType?: string;
}

interface PensionIncome {
    amount?: number;
}

interface AgricultureIncome {
    amount?: number;
}

interface CommissionDetail {
    amount?: number;
    taxDeducted?: number;
    expense?: number;
}

interface CommissionIncome {
    lifeInsuranceAgent?: CommissionDetail;
    generalInsuranceAgent?: CommissionDetail;
    realEstateAgent?: CommissionDetail;
    servicesConsultancy?: CommissionDetail;
    otherCommissions?: CommissionDetail;
}

interface PartnershipIncome {
    name?: string;
    profit?: number;
    capital?: number;
}

interface RentPropertyDetail {
    purchaseCost?: number;
    saleValue?: number;
    location?: string;
}

interface RentPropertyIncome {
    rentReceived?: number;
    rentExpense?: string;
    tenantTaxDeduction?: 'yes' | 'no';
    taxDeductedAmount?: number;
    hasGainOnSale?: 'yes' | 'no';
    propertyType?: 'openPlot' | 'constructedPlot' | 'flat';
    openPlotHoldingPeriod?: string;
    openPlotDetails?: RentPropertyDetail;
    constructedPlotHoldingPeriod?: string;
    constructedPlotDetails?: RentPropertyDetail;
    flatHoldingPeriod?: string;
    flatDetails?: RentPropertyDetail;
}

interface BankDepositDetail {
    bankName?: string;
    accountNumber?: string;
    amount?: number;
    taxDeducted?: number;
}

interface GovtSchemeDetail {
    schemeType?: string;
    amount?: number;
    taxDeducted?: number;
}

interface BehboodDetail {
    amount?: number;
}

interface PensionerBenefitDetail {
    amount?: number;
}

interface SavingsProfitIncome {
    selectedSources?: Record<string, boolean>;
    bankDeposit?: BankDepositDetail[];
    govtScheme?: GovtSchemeDetail;
    behbood?: BehboodDetail;
    pensionerBenefit?: PensionerBenefitDetail;
}

interface DividendDetail {
    amount?: number;
    taxDeducted?: number;
}

interface CapitalGain {
    netCapitalGain?: number;
    cgtLiability?: number;
    taxDeducted?: number;
    costOfShares?: number;
}

interface Bonus {
    bonusValue?: number;
    taxDeducted?: number;
}

interface DividendGain {
    dividendFromPower?: DividendDetail;
    dividendFromOther?: DividendDetail;
    dividendFromNoTax?: DividendDetail;
    capitalGain?: CapitalGain;
    bonus?: Bonus;
}

interface OtherIncome {
    inflowType?: string;
    amount?: number;
    description?: string;
}


// Main Incomes object
interface Incomes {
    hasSalary?: boolean;
    salary?: SalaryIncome;
    hasBusiness?: boolean;
    business?: Record<string, boolean>; // For selected business types
    businessDetails?: Record<string, BusinessSubForm>; // For form data of each business type
    hasFreelancer?: boolean;
    freelancer?: FreelancerSubForm;
    hasProfessional?: boolean;
    professional?: ProfessionalSubForm;
    hasPension?: boolean;
    pension?: PensionIncome;
    hasAgriculture?: boolean;
    agriculture?: AgricultureIncome;
    hasCommission?: boolean;
    commission?: CommissionIncome;
    hasPartnership?: boolean;
    partnership?: PartnershipIncome[];
    hasRent?: boolean;
    rentAndProperty?: RentPropertyIncome;
    hasSavingsProfit?: boolean;
    savingsProfit?: SavingsProfitIncome;
    hasDividendGain?: boolean;
    dividendGain?: DividendGain;
    hasOther?: boolean;
    other?: OtherIncome[];
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

interface WrapUp {
    reconciliationChoice?: 'yes' | 'no';
    agreedToTerms?: boolean;
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
    wrapUp: WrapUp;
    documents: Documents;
}

interface PersonalTaxFilingContextType {
  formData: PersonalTaxFilingData;
  setFormData: Dispatch<SetStateAction<PersonalTaxFilingData>>;
}

const PersonalTaxFilingContext = createContext<PersonalTaxFilingContextType | undefined>(undefined);

const initialFormData: PersonalTaxFilingData = {
    personalInfo: {},
    incomes: {
        hasSalary: false,
    },
    taxCredit: {},
    deductions: { selectedCategories: {} },
    wealthStatement: {},
    expense: {},
    wrapUp: {},
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
