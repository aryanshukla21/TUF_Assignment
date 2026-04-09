import { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import { format } from "date-fns";
import NotesPanel from "./NotesPanel";
import CalendarGrid from "./CalendarGrid";

const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=1000",
    "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=1000",
    "https://images.unsplash.com/photo-1490750967868-88cb4ecb07cb?q=80&w=1000",
    "https://images.unsplash.com/photo-1521633603463-71ab47926c48?q=80&w=1000",
    "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?q=80&w=1000",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000",
    "https://images.unsplash.com/photo-1533371452382-d45a9da51ad9?q=80&w=1000",
    "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000",
    "https://images.unsplash.com/photo-1508964942454-1a56651d54ac?q=80&w=1000",
    "https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=1000",
    "https://images.unsplash.com/photo-1509803874385-db7c23652552?q=80&w=1000",
    "https://images.unsplash.com/photo-1513269813580-0a568853b0a2?q=80&w=1000"
];

export default function InteractiveCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [customImages, setCustomImages] = useState({});
    const [animClass, setAnimClass] = useState("");

    const fileInputRef = useRef(null);
    const currentMonthIndex = currentDate.getMonth();

    useEffect(() => {
        const saved = localStorage.getItem("calendar_custom_images");
        if (saved) setCustomImages(JSON.parse(saved));
    }, []);

    const handleMonthChange = (newDate) => {
        setAnimClass("animate-sync-flip-out");
        setTimeout(() => {
            setCurrentDate(newDate);
            setStartDate(null);
            setEndDate(null);
            setAnimClass("animate-sync-flip-in");
            setTimeout(() => setAnimClass(""), 400);
        }, 400);
    };

    const displayImage = customImages[currentMonthIndex] || DEFAULT_IMAGES[currentMonthIndex];

    return (
        <article className="max-w-6xl w-full mx-auto bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col md:flex-row relative mt-8 border border-gray-200">

            {/* LEFT COLUMN (Desktop: Image & Notes stay together | Mobile: Only Image shows first) */}
            <div className="md:w-1/3 flex flex-col bg-gray-50 border-r border-gray-200">
                <figure
                    className={`h-64 md:h-80 w-full bg-cover bg-center relative group shrink-0 ${animClass}`}
                    style={{ backgroundImage: `url('${displayImage}')` }}
                >
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/95 px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
                        >
                            Upload Cover
                        </button>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={(e) => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                const newImgs = { ...customImages, [currentMonthIndex]: reader.result };
                                setCustomImages(newImgs);
                                localStorage.setItem("calendar_custom_images", JSON.stringify(newImgs));
                            };
                            reader.readAsDataURL(file);
                        }}
                    />
                </figure>

                {/* Hidden on mobile, shown on desktop as part of the side panel */}
                <div className="hidden md:flex flex-grow flex-col">
                    <NotesPanel currentDate={currentDate} animClass={animClass} />
                </div>
            </div>

            {/* RIGHT COLUMN (Desktop: Grid | Mobile: Grid then Notes) */}
            <div className="md:w-2/3 flex flex-col min-h-[500px]">
                <CalendarGrid
                    currentDate={currentDate}
                    onMonthChange={handleMonthChange}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    animClass={animClass}
                />

                {/* Shown on mobile at the bottom, hidden on desktop */}
                <div className="flex md:hidden flex-col border-t border-gray-200">
                    <NotesPanel currentDate={currentDate} animClass={animClass} />
                </div>
            </div>
        </article>
    );
}