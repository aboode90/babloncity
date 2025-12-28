"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import { useFirestore, updateDocumentNonBlocking, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { doc, collection } from "firebase/firestore";
import type { User } from "firebase/auth";

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
    user: User | null;
    userData: any;
}

export function LuckyWheel({ user, userData }: LuckyWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const spin = () => {
    if (spinning || !user || !firestore || !userData) return;
    
    if (userData.tickets < SPIN_COST) {
        toast({
            variant: "destructive",
            title: "رصيد غير كافٍ",
            description: `أنت بحاجة إلى ${SPIN_COST} تذكرة على الأقل لتدوير العجلة.`,
        });
        return;
    }

    setSpinning(true);

    const userDocRef = doc(firestore, `users/${user.uid}`);
    const transactionsColRef = collection(firestore, `users/${user.uid}/transactions`);
    
    // 1. Deduct spin cost
    updateDocumentNonBlocking(userDocRef, { tickets: userData.tickets - SPIN_COST });
    addDocumentNonBlocking(transactionsColRef, {
        userId: user.uid,
        transactionDate: new Date().toISOString(),
        currencyType: 'Tickets',
        amount: -SPIN_COST,
        description: 'تدوير عجلة الحظ'
    });

    const spinNumber = Math.random();
    const prizeIndex = Math.floor(spinNumber * SEGMENTS);
    const prize = prizes[prizeIndex];

    // Calculate rotation for the animation
    const randomOffset = (Math.random() - 0.5) * SEGMENT_ANGLE * 0.8;
    const prizeAngle = prizeIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const finalAngle = 360 - prizeAngle + randomOffset;
    const newRotation = rotation + 360 * 5 + finalAngle;
    
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      
      toast({
        title: "تهانينا!",
        description: prize.type === 'Nothing' ? "حظاً أوفر في المرة القادمة!" : `لقد فزت بـ ${prize.name}!`,
      });

      // 2. Add prize if won
      if (prize.type !== 'Nothing') {
          const newBalance = (prize.type === 'Tickets' ? userData.tickets - SPIN_COST : userData.tickets) + (prize.type === 'Tickets' ? prize.amount : 0);
          
          const updatePayload: { [key: string]: any } = {};
          let prizeDescription = '';
          if (prize.type === 'Tickets') {
              updatePayload.tickets = userData.tickets - SPIN_COST + prize.amount;
              prizeDescription = `ربح ${prize.amount} تذكرة من عجلة الحظ`;
          } else if (prize.type === 'Points') {
              updatePayload.points = userData.points + prize.amount;
              prizeDescription = `ربح ${prize.amount} نقطة من عجلة الحظ`;
          }

          updateDocumentNonBlocking(userDocRef, updatePayload);
          addDocumentNonBlocking(transactionsColRef, {
              userId: user.uid,
              transactionDate: new Date().toISOString(),
              currencyType: prize.type,
              amount: prize.amount,
              description: prizeDescription
          });
      }

    }, 5000);
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
