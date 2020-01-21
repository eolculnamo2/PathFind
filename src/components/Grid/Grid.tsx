import React, { FC, useEffect, useState, useCallback } from "react";
import GridNode, { IGridNode, ICellStatus } from "../Node/GridNode";
import { GridWrapper } from "./style";

enum ClickType {
  START,
  DESTINATION,
  BARRIER
}

// useState does not work with recursive function
let found = false;

const Grid: FC = (): JSX.Element => {
  const [nodes, setNodes] = useState<IGridNode[]>([]);
  const [clickType, setClickType] = useState<ClickType>(ClickType.START);
  const [height] = useState<number>(10);
  const [width] = useState<number>(50);
  const [startIndex, setStartIndex] = useState<number | null>(null);
  const [endIndex, setEndIndex] = useState<number | null>(null);
  const [path, setPath] = useState<IGridNode[]>([]);

  const mount = useCallback(() => {
    const totalNodes: number = height * width;
    const nodesToSet: Array<IGridNode> = [];
    let i = 0;

    while (i < totalNodes) {
      nodesToSet.push({ id: i, distance: Infinity, status: ICellStatus.BLANK });
      i++;
    }

    setNodes(nodesToSet);
  }, [height, width]);

  // select appropriate status from click
  function getStatusFromClickType(node: IGridNode): ICellStatus {
    let clickStatus: ICellStatus;

    switch (clickType) {
      case ClickType.START:
        clickStatus = ICellStatus.START;
        setStartIndex(node.id);
        break;
      case ClickType.DESTINATION:
        clickStatus = ICellStatus.DESTINATION;
        setEndIndex(node.id);
        break;
      case ClickType.BARRIER:
        clickStatus = ICellStatus.BARRIER;
        break;
      default:
        clickStatus = ICellStatus.BLANK;
        break;
    }

    if (clickStatus === node.status) {
      return ICellStatus.BLANK;
    }
    return clickStatus;
  }

  // change nodes with same status to status blank
  function onlyOneOfType(node: IGridNode) {
    setNodes(
      [...nodes].map((n: IGridNode, i: number) => {
        if (n.status === node.status && i !== node.id) {
          n.status = ICellStatus.BLANK;
        }
        return n;
      })
    );
  }

  function cellClick(id: number) {
    const nodesClone = [...nodes];
    const node = nodesClone[id];
    node.status = getStatusFromClickType(node);

    if (
      node.status === ICellStatus.START ||
      node.status === ICellStatus.DESTINATION
    ) {
      onlyOneOfType(node);
    }

    setNodes(nodesClone);
  }

  function animatePath(node: IGridNode) {
    const topNode = nodes[node.id - width];
    const bottomNode = nodes[node.id + width];
    const leftNode = nodes[node.id - 1];
    const rightNode = nodes[node.id + 1];

    let neighbors: IGridNode[] = [topNode, bottomNode, leftNode, rightNode];

    neighbors = neighbors
      .filter((n: IGridNode) => n.distance !== Infinity)
      .sort((a, b) => a.distance - b.distance);
    const closestNode: IGridNode = neighbors[0];

    if (closestNode?.status === ICellStatus.CHECKED) {
      setTimeout(() => {
        const pathClone = [...path];
        closestNode.status = ICellStatus.FOUNDPATH;
        pathClone.push(closestNode);
        setPath(pathClone);
        animatePath(neighbors[0]);
      }, 100);
    }
  }

  function checkNeighbors(node: IGridNode, parentDistance: number) {
    if (!startIndex || !endIndex || found) return;
    // get top bottom left and right
    const topNode = nodes[node.id - width];
    const bottomNode = nodes[node.id + width];
    const leftNode = nodes[node.id - 1];
    const rightNode = nodes[node.id + 1];

    if (
      topNode?.status === ICellStatus.DESTINATION ||
      bottomNode?.status === ICellStatus.DESTINATION ||
      leftNode?.status === ICellStatus.DESTINATION ||
      rightNode?.status === ICellStatus.DESTINATION
    ) {
      node.status = ICellStatus.FOUNDPATH;
      animatePath(node);
      found = true;
    }

    if (node.status === ICellStatus.BLANK) {
      node.status = ICellStatus.CHECKED;
      node.distance = parentDistance + 1;
    }

    // recursively call each while none border destination.
    setTimeout(() => {
      if (found === false) {
        if (topNode && topNode?.status !== ICellStatus.CHECKED)
          checkNeighbors(topNode, parentDistance + 1);
        if (bottomNode && bottomNode?.status !== ICellStatus.CHECKED)
          checkNeighbors(bottomNode, parentDistance + 1);
        if (leftNode && leftNode?.status !== ICellStatus.CHECKED)
          checkNeighbors(leftNode, parentDistance + 1);
        if (rightNode && rightNode?.status !== ICellStatus.CHECKED)
          checkNeighbors(rightNode, parentDistance + 1);
      }
    }, 150);

    const nodesClone = [...nodes];
    nodesClone[node.id] = node;
    setNodes(nodesClone);
  }

  function findPath() {
    found = false;
    if (!startIndex) return;

    const nodesClone = [...nodes];
    nodesClone[startIndex].distance = 1;
    setNodes(nodesClone);

    // find start and finish nodes
    if (startIndex && nodes[startIndex]) {
      checkNeighbors(nodes[startIndex], 0);
    }
  }

  useEffect(() => {
    mount();
  }, [mount]);

  return (
    <>
      <input
        type="radio"
        name="click-type"
        value={clickType}
        checked={clickType === ClickType.START}
        onChange={() => setClickType(ClickType.START)}
      />
      <span> Start</span>
      <input
        type="radio"
        name="click-type"
        value={clickType}
        checked={clickType === ClickType.DESTINATION}
        onChange={() => setClickType(ClickType.DESTINATION)}
      />
      <span> Destination</span>
      <br />
      <br />
      <button onClick={findPath}>Visualize path</button>
      <GridWrapper width={width}>
        {nodes.map(({ id, distance, status }) => (
          <span key={`cell-${id}`} onClick={() => cellClick(id)}>
            <GridNode id={id} distance={distance} status={status} />
          </span>
        ))}
      </GridWrapper>
    </>
  );
};

export default Grid;
