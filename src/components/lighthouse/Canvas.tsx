'use client';
import { LightHouseMessage, MentorRequestStatus } from '@/app/api/lighthouse';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useRef, useState } from 'react';
import { Group, Image, Layer, Rect, Stage, Text } from 'react-konva';
import useImage from 'use-image';
import { TableCoordinates } from './LighthouseFloorView';

type CanvasProps = {
  img: string;
  width: number;
  height: number;
  lighthouses: LightHouseMessage[];
  tableCoordinates: TableCoordinates[];
  selected: number[];
  setSelectedTables: (tableNumbers: number[]) => void;
  viewOnly?: boolean;
  disableMultiSelect?: boolean;
};

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getRectColor(lighthouse: LightHouseMessage): string {
  if (lighthouse.mentor_requested === MentorRequestStatus.REQUESTED) {
    return 'red';
  }
  if (lighthouse.mentor_requested === MentorRequestStatus.ACKNOWLEDGED) {
    return 'orange';
  }
  if (lighthouse.mentor_requested === MentorRequestStatus.EN_ROUTE) {
    return 'forestgreen';
  }
  return 'cyan';
}

export default function Canvas({
  img,
  width,
  height,
  lighthouses,
  tableCoordinates,
  selected,
  setSelectedTables,
  disableMultiSelect,
  viewOnly
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBottomRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const startPosition = useRef<{ x: number; y: number } | null>(null);
  const rectangle = useRef<Rectangle | null>(null);
  const onTable = useRef(-1);
  const update = useRef<() => void>(() => {});
  const setStartPosition = (pos: { x: number; y: number } | null) => { startPosition.current = pos; };
  const setRectangle = (rect: Rectangle | null) => { rectangle.current = rect; };
  const setOnTable = (onTableNew: number) => {
    onTable.current = onTableNew;
    if(!!divRef.current) {
      divRef.current.style.cursor = onTableNew >= 0 ? 'pointer' : 'default';
    }
  };

  useEffect(() => {
    const canvas = canvasBottomRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    if(!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    tableCoordinates.forEach(table => {
      const isSelected =
        selected.findIndex(num => num === table.number) !== -1;
      const lighthouse = lighthouses.find(l => l.table === table.number);

      ctx.fillStyle = lighthouse ? getRectColor(lighthouse) : 'cyan';
      ctx.shadowBlur = 10;
      ctx.shadowColor = "black";
      ctx.fillRect(table.canvasPosition.x, table.canvasPosition.y, 20, 20);
      ctx.shadowBlur = 0;
      if (isSelected) {
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.strokeRect(table.canvasPosition.x, table.canvasPosition.y, 20, 20);
      }
      ctx.font = "12px Arial";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(table.number), table.canvasPosition.x + 10, table.canvasPosition.y + 10);

      return (
          <Rect
            fill={lighthouse ? getRectColor(lighthouse) : 'cyan'}
            width={20}
            height={20}
            shadowBlur={10}
            stroke={isSelected ? 'yellow' : 'cyan'}
            strokeWidth={isSelected ? 2 : 1}
          />
      );
    });

    if (!viewOnly) {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext("2d");
      if(!ctx) return;
      update.current = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (rectangle.current) {
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(
            rectangle.current.x,
            rectangle.current.y,
            rectangle.current.width,
            rectangle.current.height
            );
        }
      }
      update.current();
    }
  }, [selected, lighthouses, tableCoordinates, viewOnly, disableMultiSelect])

  const doPointAndRectangleOverlap = (point: { x: number; y: number }, rect: Rectangle) => {
    return (
      point.x >= rect.x && point.x <= rect.x + rect.width &&
      point.y >= rect.y && point.y <= rect.y + rect.height
    );
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (viewOnly || disableMultiSelect) {
      return;
    }

    if (onTable.current >= 0) {
      const table = tableCoordinates[onTable.current];
      if (e.shiftKey && !disableMultiSelect) {
        let newSelected = selected.slice();
        const selectedIdx = selected.findIndex(
          num => num === table.number
        );
        if (selectedIdx != -1) {
          newSelected.splice(selectedIdx, 1);
        } else {
          newSelected.push(table.number);
        }
        setSelectedTables(newSelected);
      } else {
        setSelectedTables([table.number]);
      }
    }

    setStartPosition({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    });
    setRectangle({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      width: 0,
      height: 0
    });
    update.current();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (viewOnly || disableMultiSelect) {
      return;
    }

    if (!startPosition.current) {
      const table = tableCoordinates.findIndex(table => {
        const tableRect: Rectangle = {
          x: table.canvasPosition.x,
          y: table.canvasPosition.y,
          width: 20,
          height: 20
        };

        return doPointAndRectangleOverlap({
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY
        }, tableRect);
      })
      setOnTable(table);
      return;
    }

    const endPosition = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    };
    setRectangle({
      x: Math.min(startPosition.current.x, endPosition.x),
      y: Math.min(startPosition.current.y, endPosition.y),
      width: Math.abs(startPosition.current.x - endPosition.x),
      height: Math.abs(startPosition.current.y - endPosition.y)
    });
    update.current();
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (viewOnly) {
      return;
    }

    if (!startPosition || disableMultiSelect) {
      return;
    }

    const overlappingElements: TableCoordinates[] = [];
    tableCoordinates.forEach(tableCoordinate => {
      const tableRect: Rectangle = {
        x: tableCoordinate.canvasPosition.x,
        y: tableCoordinate.canvasPosition.y,
        width: 20,
        height: 20
      };
      if (rectangle.current && doRectanglesOverlap(rectangle.current, tableRect)) {
        overlappingElements.push(tableCoordinate);
      }
    });
    const tablesToAdd = overlappingElements.map(t => t.number);
    if (e.shiftKey) {
      setSelectedTables(Array.from(new Set(selected.concat(tablesToAdd))));
    } else {
      setSelectedTables(tablesToAdd);
    }
    setStartPosition(null);
    setRectangle(null);
    update.current();
  };

  const doRectanglesOverlap = (rect1: Rectangle, rect2: Rectangle) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };
  
  return <div className="relative" ref={divRef} style={{
    width: width,
    height: height
  }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}>
    <img className="absolute z-0" src={img} width={width} height={height} />
    <canvas ref={canvasBottomRef} width={width} height={height} className="absolute z-10"></canvas>
    <canvas ref={canvasRef} width={width} height={height}
      className="absolute border-solid border-2 border-gray-300 rounded-[10px] w-fit z-20"></canvas>
  </div>;
}
