import React from "react";
import styled from "styled-components";

import alert from "./images/alert.svg";
import check from "./images/check.svg";
import error from "./images/error.svg";
import info from "./images/info.svg";

export type IconType = "alert" | "check" | "error" | "info";

const Img = styled.img`
  max-width: 15px;
  max-height: 15px;
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
  type?: IconType;
  customUrl?: string;
};

function getSrc(type?: IconType, customUrl?: string) {
  if (type) {
    return icons[type];
  }

  return customUrl;
}

function Icon({ alt, type, customUrl }: Props) {
  return <Img alt={alt} src={getSrc(type, customUrl)} />;
}

export default Icon;
