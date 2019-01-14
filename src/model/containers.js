import styled from "styled-components";

export const AppContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

export const Navigation = styled.div`
  width: 220px;
  flex-shrink: 0;
  background: #fff;
  height: 100vh;
  border-right: 1px solid rgba(0, 0, 0, 0.125);
  background-color: rgba(79, 88, 87, 0.54);
`;
export const Body = styled.div`
  padding: 12px;
  height: 100vh;
`;

export const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background-color: rgba(79, 88, 87, 0.54);
`;
