import { Size } from "./types";

export const getSize = (currentSize: Size, scales: { [key in Size]: string | undefined }) =>
  scales[currentSize] || scales["xs"];
