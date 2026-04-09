import { useState, useEffect, useRef } from "react";
import { Camera } from "lucide-react";
import NotesPanel from "./NotesPanel";
import CalendarGrid from "./CalendarGrid";

const DEFAULT_IMAGES = [
    import.meta.env.VITE_IMG_JAN,
    import.meta.env.VITE_IMG_FEB,
    import.meta.env.VITE_IMG_MAR,
    import.meta.env.VITE_IMG_APR,
    import.meta.env.VITE_IMG_MAY,
    import.meta.env.VITE_IMG_JUN,
    import.meta.env.VITE_IMG_JUL,
    import.meta.env.VITE_IMG_AUG,
    import.meta.env.VITE_IMG_SEP,
    import.meta.env.VITE_IMG_OCT,
    import.meta.env.VITE_IMG_NOV,
    import.meta.env.VITE_IMG_DEC
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
        // Preload helper
        const preloadImage = (url) => {
            const img = new Image();
            img.src = url;
        };

        // Calculate indices for next and previous months
        const nextIdx = (currentMonthIndex + 1) % 12;
        const prevIdx = (currentMonthIndex - 1 + 12) % 12;

        // Preload both default and custom images for neighbors
        preloadImage(customImages[nextIdx] || DEFAULT_IMAGES[nextIdx]);
        preloadImage(customImages[prevIdx] || DEFAULT_IMAGES[prevIdx]);
    }, [currentMonthIndex, customImages]);

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