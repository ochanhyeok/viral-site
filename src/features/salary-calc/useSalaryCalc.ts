import { useMemo } from 'react';

interface SalaryInput {
  annualSalary: number;
  dependents: number;
  children: number;
  nonTaxable: number;
  includeRetirement: boolean;
}

interface DeductionBreakdown {
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
}

interface SalaryResult {
  monthlySalary: number;
  monthlyNetSalary: number;
  annualNetSalary: number;
  totalDeduction: number;
  deductions: DeductionBreakdown;
}

const NATIONAL_PENSION_RATE = 0.045;
const NATIONAL_PENSION_CAP = 5900000;
const HEALTH_INSURANCE_RATE = 0.03545;
const LONG_TERM_CARE_RATE = 0.1295;
const EMPLOYMENT_INSURANCE_RATE = 0.009;

const SIMPLIFIED_TAX_TABLE: { minSalary: number; maxSalary: number; getTax: (salary: number, dependents: number) => number }[] = [
  {
    minSalary: 0,
    maxSalary: 1060000,
    getTax: () => 0,
  },
  {
    minSalary: 1060000,
    maxSalary: 1500000,
    getTax: (salary, dependents) => {
      const base = Math.floor((salary - 1060000) / 10000) * 980;
      return Math.max(0, base - getDependentDeduction(dependents));
    },
  },
  {
    minSalary: 1500000,
    maxSalary: 3000000,
    getTax: (salary, dependents) => {
      const base = 43120 + Math.floor((salary - 1500000) / 10000) * 1490;
      return Math.max(0, base - getDependentDeduction(dependents));
    },
  },
  {
    minSalary: 3000000,
    maxSalary: 4500000,
    getTax: (salary, dependents) => {
      const base = 266620 + Math.floor((salary - 3000000) / 10000) * 1990;
      return Math.max(0, base - getDependentDeduction(dependents));
    },
  },
  {
    minSalary: 4500000,
    maxSalary: 7000000,
    getTax: (salary, dependents) => {
      const base = 565120 + Math.floor((salary - 4500000) / 10000) * 2680;
      return Math.max(0, base - getDependentDeduction(dependents));
    },
  },
  {
    minSalary: 7000000,
    maxSalary: 8800000,
    getTax: (salary, dependents) => {
      const base = 1235120 + Math.floor((salary - 7000000) / 10000) * 3540;
      return Math.max(0, base - getDependentDeduction(dependents));
    },
  },
  {
    minSalary: 8800000,
    maxSalary: 14000000,
    getTax: (salary, dependents) => {
      const base = 1872320 + Math.floor((salary - 8800000) / 10000) * 4660;
      return Math.max(0, base - getDependentDeduction(dependents));
    },
  },
  {
    minSalary: 14000000,
    maxSalary: Infinity,
    getTax: (salary, dependents) => {
      const base = 4296320 + Math.floor((salary - 14000000) / 10000) * 5760;
      return Math.max(0, base - getDependentDeduction(dependents));
    },
  },
];

function getDependentDeduction(dependents: number): number {
  const deductions: Record<number, number> = {
    1: 0,
    2: 10000,
    3: 25000,
    4: 40000,
    5: 60000,
    6: 80000,
    7: 100000,
    8: 120000,
    9: 140000,
    10: 160000,
    11: 180000,
  };
  return deductions[Math.min(dependents, 11)] || 0;
}

function calculateSimplifiedIncomeTax(monthlySalary: number, dependents: number): number {
  const bracket = SIMPLIFIED_TAX_TABLE.find(
    (b) => monthlySalary >= b.minSalary && monthlySalary < b.maxSalary
  );
  if (!bracket) return 0;
  return Math.floor(bracket.getTax(monthlySalary, dependents) / 10) * 10;
}

export function useSalaryCalc(input: SalaryInput): SalaryResult | null {
  return useMemo(() => {
    if (input.annualSalary <= 0) return null;

    let annualSalary = input.annualSalary;
    if (input.includeRetirement) {
      annualSalary = Math.floor(annualSalary / 1.0833);
    }

    const monthlySalary = Math.floor(annualSalary / 12);
    const taxableMonthly = Math.max(0, monthlySalary - input.nonTaxable);

    const nationalPensionBase = Math.min(taxableMonthly, NATIONAL_PENSION_CAP);
    const nationalPension = Math.floor(nationalPensionBase * NATIONAL_PENSION_RATE);

    const healthInsurance = Math.floor(taxableMonthly * HEALTH_INSURANCE_RATE);
    const longTermCare = Math.floor(healthInsurance * LONG_TERM_CARE_RATE);
    const employmentInsurance = Math.floor(taxableMonthly * EMPLOYMENT_INSURANCE_RATE);

    const totalDependents = Math.max(1, input.dependents + input.children);
    const incomeTax = calculateSimplifiedIncomeTax(taxableMonthly, totalDependents);
    const localIncomeTax = Math.floor(incomeTax * 0.1);

    const deductions: DeductionBreakdown = {
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      incomeTax,
      localIncomeTax,
    };

    const totalDeduction = Object.values(deductions).reduce((a, b) => a + b, 0);
    const monthlyNetSalary = monthlySalary - totalDeduction;
    const annualNetSalary = monthlyNetSalary * 12;

    return {
      monthlySalary,
      monthlyNetSalary,
      annualNetSalary,
      totalDeduction,
      deductions,
    };
  }, [input]);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(Math.floor(amount));
}
