"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

// Define the prize structure with types and amounts
const prizes = [
  { name: "100 تذكرة", type: "Tickets", amount: 100, color: "#A020F0" },
  { name: "50 نقطة", type: "Points", amount: 50, color: "#FF00FF" },
  { name: "5 تذاكر", type: "Tickets", amount: 5, color: "#DA70D6" },
  { name: "حاول مرة أخرى", type: "Nothing", amount: 0, color: "#E6E6FA" },
  { name: "200 نقطة", type: "Points", amount: 200, color: "#A020F0" },
  { name: "10 تذاكر", type: "Tickets", amount: 10, color: "#FF00FF" },
  { name: "50 تذكرة", type: "Tickets", amount: 50, color: "#DA70D6" },
  { name: "20 نقطة", type: "Points", amount: 20, color: "#E6E6FA" },
];

const SEGMENTS = prizes.length;
const SEGMENT_ANGLE = 360 / SEGMENTS;
const SPIN_COST = 1;

interface LuckyWheelProps {
    user: any | null; // From next-auth session
    userData: any; // From playfab inventory
}

export function LuckyWheel({ user, userData }: LuckyWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const { toast } = useToast();

  const spin = () => {
    if (spinning || !user || !userData) return;
    
    // Logic will be re-implemented with API routes
    toast({
        variant: "destructive",
        title: "خطأ",
        description: "قيد التطوير.",
    });

    return;

    // TODO: Re-implement spin logic
  };

  return (
    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] mx-auto">
      <div
        className="absolute top-1/2 left-1/2 w-4 h-8 bg-foreground rounded-b-full -translate-x-1/2 -translate-y-[110%] md:-translate-y-[120%] z-10"
        style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)'}}
       />
      <div
        className="w-full h-full rounded-full transition-transform duration-[5000ms] ease-out"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {prizes.map((prize, i) => {
            const startAngle = i * SEGMENT_ANGLE;
            const endAngle = startAngle + SEGMENT_ANGLE;
            const start = {
              x: 50 + 50 * Math.cos(Math.PI * startAngle / 180),
              y: 50 + 50 * Math.sin(Math.PI * startAngle / 180),
            };
            const end = {
              x: 50 + 50 * Math.cos(Math.PI * endAngle / 180),
              y: 50 + 50 * Math.sin(Math.PI * endAngle / 180),
            };
            const largeArcFlag = SEGMENT_ANGLE > 180 ? 1 : 0;

            const pathData = [
              `M 50 50`,
              `L ${start.x} ${start.y}`,
              `A 50 50 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
              `Z`,
            ].join(' ');

            const textAngle = startAngle + SEGMENT_ANGLE / 2;
            const textPos = {
              x: 50 + 35 * Math.cos(Math.PI * textAngle / 180),
              y: 50 + 35 * Math.sin(Math.PI * textAngle / 180),
            }

            return (
              <g key={i}>
                <path d={pathData} fill={prize.color} stroke="#fff" strokeWidth="0.5" />
                <text
                    x={textPos.x}
                    y={textPos.y}
                    transform={`rotate(${textAngle + 90}, ${textPos.x}, ${textPos.y})`}
                    fill={prize.color === '#E6E6FA' ? '#333' : '#fff'}
                    fontSize="4"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                >
                    {prize.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Button
          size="lg"
          onClick={spin}
          disabled={spinning || !user || !userData}
          className="h-20 w-20 md:h-28 md:w-28 rounded-full text-lg md:text-xl font-bold font-headline shadow-2xl"
        >
          {spinning ? "..." : "أدر"}
        </Button>
      </div>
    </div>
  );
}
