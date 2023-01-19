export const mustBeFloat = (value: string): string | undefined => {
  if (value && Number.isNaN(Number(value))) {
    return 'Must be a number'
  }
}

export const minMaxValue = (
  min: number | string,
  max: number | string,
  value: string,
): string | undefined => {
  if (Number.parseFloat(value) >= Number(min) && Number.parseFloat(value) <= Number(max)) {
    return undefined
  }

  return `Must be between ${min} and ${max}`
}

export const maxDecimals = (value: string, max: number) => {
  if (value.split('.')[1]?.length > max) {
    return `Precision too high. Only ${max} allowed`
  }
}
