import styled from 'styled-components';

export const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;

  margin-bottom: 15px;

  *:first-child {
    margin-right: 5px;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 15px;
`;
