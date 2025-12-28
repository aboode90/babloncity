"use client"

import { useState } from "react";
import axios from 'axios';
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();


  const spin = async () => {
    if (spinning || !session) return;
    
    setSpinning(true);

    try {
        const response = await axios.post('/api/wheel/spin');
        const { prize, newBalance } = response.data;

        // Find the prize index to determine the rotation
        const prizeIndex = prizes.findIndex(p => p.name === prize.name);
        
        // Calculate rotation
        // Add random offset inside the segment
        const randomOffset = Math.random() * (SEGMENT_ANGLE - 4) - (SEGMENT_ANGLE / 2 - 2);
        const targetRotation = 360 * 5 - (prizeIndex * SEGMENT_ANGLE) - randomOffset;

        setRotation(rotation + targetRotation);

        // Wait for animation to finish
        setTimeout(() => {
            setSpinning(false);
            toast({
                title: "تهانينا!",
                description: `لقد فزت بـ: ${prize.name}`,
            });
            // TODO: Update user balance in the UI. 
            // This is complex and requires state management (e.g. React Context or Zustand)
            // For now, we can just reload the page to show the new balance.
            window.location.reload(); 
        }, 5500); // 5000ms for animation + 500ms buffer

    } catch (error: any) {
        console.error("Spin error:", error);
        const errorMessage = error.response?.data?.error || "حدث خطأ أثناء تدوير العجلة.";
        toast({
            variant: "destructive",
            title: "خطأ",
            description: errorMessage,
        });
        setSpinning(false);
    }
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
          disabled={spinning || !session}
          className="h-20 w-20 md:h-28 md:w-28 rounded-full text-lg md:text-xl font-bold font-headline shadow-2xl"
        >
          {spinning ? "..." : "أدر"}
        </Button>
      </div>
    </div>
  );
}
