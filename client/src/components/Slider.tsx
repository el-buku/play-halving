import { createPortal } from "react-dom";
import type { PortalProps } from "../types";
import { useEffect, useLayoutEffect, useRef, useState, type FC } from "react";

export const Slider: FC<PortalProps> = ({ container }) => {
  const portal = document.querySelector(container);
  const [sliderValuePercent, setSliderValue] = useState<any>(50);
  const sliderRef = useRef<HTMLInputElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updateDivPosition = (value: number) => {
    console.log({ value });
    if (sliderRef.current && tooltipRef.current) {
      const slider = sliderRef.current;
      const tooltip = tooltipRef.current;
      const position =
        ((value - 1) / (100 - 1)) * (slider.offsetWidth - tooltip.offsetWidth);
      tooltip.style.left = `${position}px`;
      tooltip.style.display = "flex";

      // Update the displayed value
      //   document.getElementById("demo").innerText = value.toString();
    }
  };
  useEffect(() => {
    setSliderValue(90);
  }, []);
  useLayoutEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.background = `linear-gradient(to right, #7b3dff ${sliderValuePercent}%, #ccc 0%)`;
    }
    updateDivPosition(sliderValuePercent);
  }, [sliderValuePercent]);

  return (
    portal &&
    createPortal(
      <>
        <input
          type="range"
          min="1"
          max="100"
          value={sliderValuePercent}
          style={{ position: "relative" }}
          className="slider"
          id="myRange"
          ref={sliderRef}
          //   onChange={(e) => setSliderValue(e.target.value)} // Add this line to update sliderValue on change
        />
        <div className="tool" id="tooltip">
          <span id="demo">50</span>Minimum tickets Left To Execute The Draw
        </div>
      </>,
      portal
    )
  );
};
