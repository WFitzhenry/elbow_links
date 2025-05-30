import { createElbowConnector } from './elbow-connector';
import './styles.css';
import { Box, Point } from './types';
import {
    GRID_SIZE,
    isPointInAnyRectangle,
    isPointInBounds,
    rectangleByPoints,
    rectanglesOverlap,
    simplifyPath,
    snapPointToGrid,
  } from "./utils";


  function main(): void {
    const canvas = document.getElementById("elbowCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
  
    const rectWidth = 80;
    const rectHeight = 60;
  
    const rects: Box[] = [
      { x: 60, y: 60, w: rectWidth, h: rectHeight },
      { x: 250, y: 200, w: rectWidth, h: rectHeight }
    ];
  
    let dragging: Box | null = null;
    let offsetX = 0;
    let offsetY = 0;
    let pathPoints = getElbowInputs()
  
    function draw(): void {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#000";
      rects.forEach(rect => {
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      });

      if (pathPoints.length > 2){
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i < pathPoints.length; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }
      ctx.stroke();
     }
    }
  
    function getRectAt(x: number, y: number): Box | undefined {
      return rects.find(rect =>
        x >= rect.x &&
        x <= rect.x + rect.w &&
        y >= rect.y &&
        y <= rect.y + rect.h
      );
    }
  
    function getCanvasRelativePos(e: PointerEvent): { x: number, y: number } {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
  
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  
    canvas.addEventListener("pointerdown", (e: PointerEvent) => {
      const { x, y } = getCanvasRelativePos(e);
      const target = getRectAt(x, y);
      if (target) {
        dragging = target;
        offsetX = x - target.x;
        offsetY = y - target.y;
      }
    });

    function getElbowInputs(): Point[] {
        const rect1 = rects[0];
        const rect2 = rects[1];
        const rect1Connector = {x: rect1.x + rect1.w/2, y: rect1.y + rect1.h};
        const rect2Connector = {x: rect2.x + rect2.w /2, y: rect2.y};

        return createElbowConnector(rect1Connector, rect2Connector, rect1, rect2)
    }
  
    canvas.addEventListener("pointermove", (e: PointerEvent) => {
      if (dragging) {
        const { x, y } = getCanvasRelativePos(e);
        const snapped = snapPointToGrid({
            x: x - offsetX,
            y: y - offsetY,
          });
          
          dragging.x = Math.max(0, Math.min(canvas.width - dragging.w, snapped.x));
          dragging.y = Math.max(0, Math.min(canvas.height - dragging.h, snapped.y));
        pathPoints = getElbowInputs()
        draw();
      }
    });
  
    canvas.addEventListener("pointerup", () => {
      dragging = null;
    });
  
    canvas.addEventListener("pointerleave", () => {
      dragging = null;
    });
  
    draw();
  }
  
  addEventListener("DOMContentLoaded", () => {
    main();
  });
  