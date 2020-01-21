import styled from "styled-components";
import { ICellStatus } from "./GridNode";
import { gridSize } from "../../constants";

interface INodeWrapper {
  status: ICellStatus;
}

export const NodeWrapper = styled.div<INodeWrapper>`
  height: ${gridSize}px;
  width: ${gridSize}px;
  border: 1px solid #555;
  box-sizing: border-box;
  cursor: pointer;
  background-color: ${({ status }) =>
    status === ICellStatus.BLANK
      ? "#fff"
      : status === ICellStatus.START
      ? "green"
      : status === ICellStatus.DESTINATION
      ? "orange"
      : status === ICellStatus.CHECKED
      ? "blue"
      : status === ICellStatus.FOUNDPATH
      ? "yellow"
      : "#fff"};
`;
