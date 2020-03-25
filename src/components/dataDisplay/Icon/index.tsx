import React from "react";
import styled from "styled-components";

import alert from "./images/alert.svg";
import check from "./images/check.svg";
import error from "./images/error.svg";
import info from "./images/info.svg";

export type IconType = "alert" | "check" | "error" | "info";

function getSrc(type?: IconType, customUrl?: string) {
  if (type) {
    return icons[type];
  }

  return customUrl;
}

const Img = styled.img<Props>`
  width: ${({ size, theme }) => theme.icons.size[size] || theme.icons.size.xs};
  height: ${({ size, theme }) => theme.icons.size[size] || theme.icons.size.xs};
`;

const icons = {
  alert,
  check,
  error,
  info
};

type Props = {
  alt: string;
  size: "xxs" | "xs";
  type?: IconType;
  customUrl?: string;
};

/**
 * The `Icon` renders an icon, it can be one already defined specified by
 * the type props or custom one using the customUrl.
 */
function Icon({ alt, type, customUrl, ...rest }: Props) {
  return <Img alt={alt} src={getSrc(type, customUrl)} {...rest} />;
}

export default Icon;
