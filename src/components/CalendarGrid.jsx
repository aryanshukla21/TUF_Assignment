import { useState } from "react";
import {
    format, addMonths, subMonths, startOfMonth, startOfWeek,
    isSameMonth, isSameDay, addDays, eachDayOfInterval,
    isBefore, isWithinInterval, differenceInDays
} from "date-fns";
import { ChevronLeft, ChevronRight, Lock, Unlock, CalendarDays } from "lucide-react";

export default function CalendarGrid({
    currentDate, onMonthChange, startDate, setStartDate,
    endDate, setEndDate, animClass
}) {
    const [anim, setAnim] = useState('');
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    // Calculate total days in the range
    const selectedCount = startDate && endDate
        ? differenceInDays(endDate, startDate) + 1
        : startDate ? 1 : 0;

    const handleFlip = (newDate, direction) => {
        const outAnim = direction === 'next' ? 'animate-flip-up-out' : 'animate-flip-down-out';
        const inAnim = direction === 'next' ? 'animate-flip-up-in' : 'animate-flip-down-in';
        setAnim(outAnim);
        setTimeout(() => {
            onMonthChange(newDate);
            setAnim(inAnim);
            setTimeout(() => setAnim(''), 300);
        }, 300);
    };

    const handleDateClick = (day) => {
        if (!isSelectionMode) return;

        if (!startDate || (startDate && endDate)) {
            setStartDate(day);
            setEndDate(null);
        } else {
            isBefore(day, startDate) ? setStartDate(day) : setEndDate(day);
        }
    };

    const gridDays = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentDate)),
        end: addDays(startOfWeek(startOfMonth(currentDate)), 41),
    });

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        if (isSelectionMode) {
            setStartDate(null);
            setEndDate(null);
        }
    };

    return (
        <section className="bg-white flex flex-col pt-4 relative z-10 h-full">
            <header className="flex justify-between items-center px-8 pb-4 border-b border-gray-100">
                <h2 className={`text-2xl font-bold text-gray-800 uppercase tracking-widest ${animClass || anim}`}>
                    {format(currentDate, "MMMM yyyy")}
                </h2>
                <div className="flex space-x-3">
                    <button onClick={() => handleFlip(subMonths(currentDate, 1), 'prev')} className="p-2 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => handleFlip(addMonths(currentDate, 1), 'next')} className="p-2 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            <div className={`grid grid-cols-7 px-6 md:px-10 gap-y-2 py-6 flex-grow transition-opacity ${animClass || anim} ${!isSelectionMode ? 'opacity-60' : 'opacity-100'}`}>
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(d => (
                    <div key={d} className="text-center text-xs font-bold text-blue-500 py-2 tracking-widest">{d}</div>
                ))}
                {gridDays.map(day => {
                    const isS = startDate && isSameDay(day, startDate);
                    const isE = endDate && isSameDay(day, endDate);
                    const isB = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate }) && !isS && !isE;
                    const isM = isSameMonth(day, currentDate);

                    return (
                        <button
                            key={day.toString()}
                            onClick={() => handleDateClick(day)}
                            disabled={!isM || !isSelectionMode}
                            className={`h-12 md:h-16 flex items-center justify-center transition-all text-sm md:text-base
                                ${!isM ? "text-gray-200 cursor-default" : "text-gray-700"}
                                ${isSelectionMode && isM ? "hover:bg-blue-50 cursor-pointer" : "cursor-not-allowed"}
                                ${isS || isE ? "bg-blue-600 text-white font-bold rounded-full shadow-md z-10" : ""}
                                ${isB ? "bg-blue-100 text-blue-800" : ""}
                                ${isS && endDate ? "rounded-l-full rounded-r-none bg-blue-100" : ""}
                                ${isE && startDate ? "rounded-r-full rounded-l-none bg-blue-100" : ""}
                            `}
                        >
                            {format(day, "d")}
                        </button>
                    );
                })}
            </div>

            <footer className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-xs flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    {/* Selection Mode Toggle */}
                    <button
                        onClick={toggleSelectionMode}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300 shadow-sm
                            ${isSelectionMode
                                ? "bg-blue-600 text-white border-blue-700 scale-105"
                                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        {isSelectionMode ? <Unlock size={14} /> : <Lock size={14} />}
                        <span className="font-bold uppercase tracking-wider">
                            {isSelectionMode ? "Exit Selection" : "Start Selection"}
                        </span>
                    </button>

                    {/* Day Counter Display */}
                    {selectedCount > 0 && (
                        <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-100 animate-in fade-in zoom-in duration-300">
                            <CalendarDays size={14} />
                            <span className="font-bold">
                                {selectedCount} {selectedCount === 1 ? 'Day' : 'Days'} Selected
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Active Range</span>
                    <span className="font-mono text-gray-700 font-bold">
                        {startDate ? `${format(startDate, "dd MMM")} - ${endDate ? format(endDate, "dd MMM") : ".."}` : "None"}
                    </span>
                </div>
            </footer>
        </section>
    );
}