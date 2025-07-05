export function calculateIRR(cashFlows: number[]): number {
  // Simple IRR calculation using Newton-Raphson method
  if (cashFlows.length === 0) return 0;

  let rate = 0.1; // Initial guess
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let npvDerivative = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      const discountFactor = Math.pow(1 + rate, j);
      npv += cashFlows[j] / discountFactor;
      npvDerivative -= j * cashFlows[j] / (discountFactor * (1 + rate));
    }

    if (Math.abs(npv) < tolerance) {
      return rate * 100; // Return as percentage
    }

    if (Math.abs(npvDerivative) < tolerance) {
      break; // Avoid division by zero
    }

    rate = rate - npv / npvDerivative;
  }

  return rate * 100; // Return as percentage
}

export function calculateNPV(cashFlows: number[], discountRate: number): number {
  return cashFlows.reduce((npv, cashFlow, index) => {
    return npv + cashFlow / Math.pow(1 + discountRate, index);
  }, 0);
}

export function calculatePaybackPeriod(cashFlows: number[]): number {
  let cumulativeCashFlow = 0;
  
  for (let i = 0; i < cashFlows.length; i++) {
    cumulativeCashFlow += cashFlows[i];
    if (cumulativeCashFlow >= 0) {
      return i;
    }
  }
  
  return -1; // No payback period
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
