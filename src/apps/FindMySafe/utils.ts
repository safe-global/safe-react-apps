import TokenPlaceholder from "./token-placeholder.svg";

export const setImageToPlaceholder: React.ReactEventHandler<HTMLImageElement> = (
  e
) => {
  (e.target as HTMLImageElement).onerror = null;
  (e.target as HTMLImageElement).src = TokenPlaceholder;
};
