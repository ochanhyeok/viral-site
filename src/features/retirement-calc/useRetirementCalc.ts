import { useMemo } from 'react';
import { differenceInDays, differenceInYears, differenceInMonths } from 'date-fns';

interface RetirementInput {
  startDate: string;
  endDate: string;
  monthlySalaries: [number, number, number];
  annualBonus: number;
  unusedLeave: number;
}

interface RetirementResult {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  averageDailyWage: number;
  retirementPay: number;
  threeMonthWage: number;
  bonusAddition: number;
  leaveAddition: number;
  totalWageForCalc: number;
  daysForCalc: number;
}

export function useRetirementCalc(input: RetirementInput): RetirementResult | null {
  return useMemo(() => {
    if (!input.startDate || !input.endDate) return null;

    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (startDate >= endDate) return null;

    const totalDays = differenceInDays(endDate, startDate) + 1;

    if (totalDays < 365) return null;

    const years = differenceInYears(endDate, startDate);
    const tempDate = new Date(startDate);
    tempDate.setFullYear(tempDate.getFullYear() + years);
    const months = differenceInMonths(endDate, tempDate);
    tempDate.setMonth(tempDate.getMonth() + months);
    const days = differenceInDays(endDate, tempDate);

    const threeMonthWage = input.monthlySalaries.reduce((a, b) => a + b, 0);

    const bonusAddition = Math.floor((input.annualBonus / 12) * 3);

    const dailyWageForLeave = threeMonthWage / 91;
    const leaveAddition = Math.floor(dailyWageForLeave * input.unusedLeave);

    const totalWageForCalc = threeMonthWage + bonusAddition + leaveAddition;
    const daysForCalc = 91;

    const averageDailyWage = totalWageForCalc / daysForCalc;

    const retirementPay = Math.floor(averageDailyWage * 30 * (totalDays / 365));

    return {
      totalDays,
      years,
      months,
      days,
      averageDailyWage: Math.floor(averageDailyWage),
      retirementPay,
      threeMonthWage,
      bonusAddition,
      leaveAddition,
      totalWageForCalc,
      daysForCalc,
    };
  }, [input]);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(Math.floor(amount));
}
