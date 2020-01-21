import styled from "styled-components";
import { gridSize } from "../../constants";

interface IGridWrapper {
  width: number;
}

export const GridWrapper = styled.div<IGridWrapper>`
  display: flex;
  width: ${({ width }) => width * gridSize}px;
  margin: 5em auto;
  flex-wrap: wrap;
  border: 1px solid #999;
`;
