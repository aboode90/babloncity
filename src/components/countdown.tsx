"use client";

import { useState, useEffect } from 'react';

export function Countdown({ to }: { to: Date }) {
    const [timeLeft, setTimeLeft] = useState({
        hours: '00',
        minutes: '00',
        seconds: '00',
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const distance = to.getTime() - now.getTime();

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
                return;
            }

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({
                hours: String(hours).padStart(2, '0'),
                minutes: String(minutes).padStart(2, '0'),
                seconds: String(seconds).padStart(2, '0'),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [to]);

    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold font-headline text-primary">{timeLeft.hours}</span>
                <span className="text-xs text-muted-foreground">Hours</span>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-primary pb-4">:</span>
            <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold font-headline text-primary">{timeLeft.minutes}</span>
                <span className="text-xs text-muted-foreground">Minutes</span>
            </div>
            <span className="text-2xl md:text-3xl font-bold text-primary pb-4">:</span>
            <div className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-bold font-headline text-primary">{timeLeft.seconds}</span>
                <span className="text-xs text-muted-foreground">Seconds</span>
            </div>
        </div>
    );
}
