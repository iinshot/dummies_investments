from fastapi import APIRouter
from typing import Optional
from services.calculator import (
    CompoundInterestCalculator,
    Capitalization,
    InvestmentMethod,
    CalculatorResult,
    PeriodType,
)

router = APIRouter(prefix="/calculator", tags=["calculator"])
calculator = CompoundInterestCalculator()

@router.get("/", response_model=None)
async def calculate(
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
    return calculator.calculate(
        initial_amount=initial_amount,
        monthly_deposit=monthly_deposit,
        annual_rate=annual_rate,
        period=period,
        period_type=period_type,
        capitalization=capitalization,
        investment_method=investment_method,
        inflation=inflation,
        tax=tax,
    )