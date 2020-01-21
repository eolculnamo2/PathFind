import React, { FC } from "react";
import { NodeWrapper } from "./style";

export interface IGridNode {
  distance: number;
  id: number;
  status: ICellStatus;
}

export enum ICellStatus {
  BLANK,
  START,
  DESTINATION,
  BARRIER,
  CHECKED,
  FOUNDPATH
}

const GridNode: FC<IGridNode> = ({
  distance = Infinity,
  id,
  status
}): JSX.Element => {
  return <NodeWrapper status={status}></NodeWrapper>;
};

export default GridNode;
