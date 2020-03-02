import React from "react";
import styled from "styled-components";

const StyledSection = styled.div`
  border: 1px solid #e8e7e6;
  border-radius: 5px;
  margin: 20px;
  padding: 0px 20px;
`;

type Props = {
  children: any;
};

const Section = ({ children }: Props) => (
  <StyledSection>{children}</StyledSection>
);

export default Section;
