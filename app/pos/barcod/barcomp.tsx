"use client";

import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeProps {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
}

export default function Barcode({
  value,
  width = 2,
  height = 40,
  displayValue = true,
}: BarcodeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    JsBarcode(svgRef.current, value, {
      format: "CODE128",       // Best general-purpose barcode
      width,
      height,
      displayValue,
      fontSize: 10,
      margin: 0,
    });
  }, [value, width, height, displayValue]);

  return <svg ref={svgRef}></svg>;
}
