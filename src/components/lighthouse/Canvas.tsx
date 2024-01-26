'use client';
import { LightHouseMessage, MentorRequestStatus } from '@/app/api/lighthouse';
import { KonvaEventObject } from 'konva/lib/Node';
import { useState } from 'react';
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
  const [image] = useImage(img);

  const [rectangle, setRectangle] = useState<Rectangle | null>();
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (viewOnly || disableMultiSelect) {
      return;
    }
    const stage = e.target.getStage();
    setStartPosition({
      x: stage?.getPointerPosition()?.x ?? 0,
      y: stage?.getPointerPosition()?.y ?? 0
    });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (viewOnly || disableMultiSelect) {
      return;
    }
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const endPosition = {
      x: stage?.getPointerPosition()?.x ?? 0,
      y: stage?.getPointerPosition()?.y ?? 0
    };

    const newRectangle: Rectangle = {
      x: Math.min(startPosition.x, endPosition.x),
      y: Math.min(startPosition.y, endPosition.y),
      width:
        Math.max(startPosition.x, endPosition.x) -
        Math.min(startPosition.x, endPosition.x),
      height:
        Math.max(startPosition.y, endPosition.y) -
        Math.min(startPosition.y, endPosition.y)
    };

    setRectangle(newRectangle);
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    setIsDrawing(false);
    const overlappingElements: TableCoordinates[] = [];
    tableCoordinates.forEach(tableCoordinate => {
      const tableRect: Rectangle = {
        x: tableCoordinate.canvasPosition.x,
        y: tableCoordinate.canvasPosition.y,
        width: 20,
        height: 20
      };
      if (rectangle && doRectanglesOverlap(rectangle, tableRect)) {
        overlappingElements.push(tableCoordinate);
      }
    });
    const tablesToAdd = overlappingElements.map(t => t.number);
    if (e.evt.shiftKey) {
      setSelectedTables(Array.from(new Set(selected.concat(tablesToAdd))));
    } else {
      setSelectedTables(tablesToAdd);
    }
    setRectangle(null);
  };

  const doRectanglesOverlap = (rect1: Rectangle, rect2: Rectangle) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };
  return (
    <Stage
      width={width}
      height={height}
      className="border-solid border-2 border-gray-300 rounded-[10px] w-fit"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Layer>
        <Image x={0} y={0} image={image} alt="background" />
        {tableCoordinates.map(table => {
          const isSelected =
            selected.findIndex(num => num === table.number) !== -1;
          const lighthouse = lighthouses.find(l => l.table === table.number);
          return (
            <Group
              x={table.canvasPosition.x}
              y={table.canvasPosition.y}
              key={table.number}
              onClick={(event: KonvaEventObject<MouseEvent>) => {
                if (viewOnly) {
                  return;
                }
                if (event.evt.shiftKey && !disableMultiSelect) {
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
              }}
              onMouseEnter={e => {
                if (viewOnly) {
                  return;
                }
                const container = e.target!.getStage()!.container();
                container.style.cursor = 'pointer';
              }}
              onMouseLeave={e => {
                if (viewOnly) {
                  return;
                }
                const container = e.target!.getStage()!.container();
                container.style.cursor = 'default';
              }}
            >
              <Rect
                fill={lighthouse ? getRectColor(lighthouse) : 'cyan'}
                width={20}
                height={20}
                shadowBlur={10}
                stroke={isSelected ? 'yellow' : 'cyan'}
                strokeWidth={isSelected ? 2 : 1}
              />
              <Text
                text={String(table.number)}
                fontSize={12}
                padding={String(table.number).length > 2 ? 1 : 4}
              />
            </Group>
          );
        })}
        {rectangle && (
          <Rect {...rectangle} stroke="black" fill="blue" opacity={0.5} />
        )}
      </Layer>
    </Stage>
  );
}
