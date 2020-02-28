import styled from "styled-components";

export const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 15px;

  *:first-child {
    margin-right: 5px;
  }
`;

export const DaiInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 350px;

  > * {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
`;