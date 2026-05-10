from enum import Enum
from dataclasses import dataclass
from typing import Optional

class Capitalization(Enum):
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    YEARLY = "yearly"

class InvestmentMethod(Enum):
    RELIABLE = "reliable"
    MODERATE = "moderate"
    RISKY = "risky"

class PeriodType(Enum):
    YEARS = "years"
    MONTHS = "months"

METHOD_RATE_MULTIPLIER = {
    InvestmentMethod.RELIABLE: 0.8,
    InvestmentMethod.MODERATE: 1.0,
    InvestmentMethod.RISKY: 1.3,
}

CAPITALIZATION_PERIODS = {
    Capitalization.MONTHLY: 12,
    Capitalization.QUARTERLY: 4,
    Capitalization.YEARLY: 1,
}

@dataclass
class CalculatorResult:
    total_amount: float
    initial_deposit: float
    total_deposited: float
    interest_earned: float
    capital_growth_percent: float

class CompoundInterestCalculator:
    @staticmethod
    def calculate(
        initial_amount: float,
        monthly_deposit: float = 0,
        annual_rate: float = 0,
        period: int = 1,
        period_type: PeriodType = PeriodType.YEARS,
        capitalization: Capitalization = Capitalization.MONTHLY,
        investment_method: InvestmentMethod = InvestmentMethod.MODERATE,
        inflation: Optional[float] = None,
        tax: Optional[float] = None,
    ) -> CalculatorResult:
        adjusted_rate = annual_rate * METHOD_RATE_MULTIPLIER[investment_method] / 100
        total_months = period * 12 if period_type == PeriodType.YEARS else period
        periods_per_year = CAPITALIZATION_PERIODS[capitalization]
        rate_per_period = adjusted_rate / periods_per_year
        months_per_period = 12 // periods_per_year
        balance = initial_amount
        total_months_passed = 0

        while total_months_passed < total_months:
            months_in_this_period = min(months_per_period, total_months - total_months_passed)
            balance += monthly_deposit * months_in_this_period
            total_months_passed += months_in_this_period
            if months_in_this_period == months_per_period:
                balance *= (1 + rate_per_period)

        total_deposited = initial_amount + monthly_deposit * total_months
        interest_earned = balance - total_deposited

        if tax:
            tax_amount = interest_earned * (tax / 100)
            interest_earned -= tax_amount
            balance -= tax_amount

        if inflation:
            inflation_factor = (1 + inflation / 100) ** (total_months / 12)
            balance /= inflation_factor
            interest_earned = balance - total_deposited

        capital_growth_percent = ((balance - total_deposited) / total_deposited * 100) if total_deposited > 0 else 0

        return CalculatorResult(
            total_amount=round(balance, 2),
            initial_deposit=round(initial_amount, 2),
            total_deposited=round(total_deposited, 2),
            interest_earned=round(interest_earned, 2),
            capital_growth_percent=round(capital_growth_percent, 2)
        )