import { useContext } from "react";
import { Safe } from "../../providers/SafeProvider/safeConnector";
import { SafeContext } from "../../providers/SafeProvider";

export const useSafe = (): Safe => {
  const value = useContext(SafeContext);
  if (value === undefined) {
    throw new Error("You probably forgot to use <SafeProvider>.");
  }
  return value;
};
