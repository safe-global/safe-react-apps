import React from "react";
import styled from "styled-components";

import alert from "./images/alert.svg";
import check from "./images/check.svg";
import error from "./images/error.svg";
import info from "./images/info.svg";

import { Size } from "../../types";
import { getSize } from "../../utils";

export type IconType = "alert" | "check" | "error" | "info";

const sizeScales = {
  xs: "15px",
  sm: "20px",
  md: "25px",
  lg: "30px"
};

function getSrc(type?: IconType, customUrl?: string) {
  if (type) {
    return icons[type];
  }

  return customUrl;
}

const Img = styled.img`
  width: ${({ size }: Props) => getSize(size, sizeScales)};
  height: ${({ size }: Props) => getSize(size, sizeScales)};
  margin-right: 5px;
`;

const icons = {
  alert,
  check,
  error,
  info
};

type Props = {
  alt: string;
  size: Size;
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
