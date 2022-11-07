export const mustBeFloat = (value: string): string | undefined =>
  value && Number.isNaN(Number(value)) ? "Must be a number" : undefined

export const minMaxValue = (
  min: number | string,
  max: number | string,
  value: string
) => {
  if (
    Number.parseFloat(value) >= Number(min) &&
    Number.parseFloat(value) <= Number(max)
  ) {
    return undefined
  }

  return `Must be between ${min} and ${max}`
}

export const maxDecimals = (value: string, max: number) =>
  value.split(".")[1]?.length > max
    ? `Precision too high. Only ${max} allowed`
    : undefined
