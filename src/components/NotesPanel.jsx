// src/components/NotesPanel.jsx
import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function NotesPanel({ currentDate, animClass }) {
    const key = format(currentDate, "yyyy-MM");

    // Fix: Initialize state directly from localStorage to avoid extra renders
    const [allNotes, setAllNotes] = useState(() => {
        const saved = localStorage.getItem("calendar_notes");
        if (!saved) return {};
        try {
            const parsed = JSON.parse(saved);
            return (typeof parsed === 'object' && parsed !== null) ? parsed : { [key]: saved };
        } catch {
            // Fix: Removed unused 'e'
            return { [key]: saved };
        }
    });

    // Sync state to localStorage whenever allNotes changes
    useEffect(() => {
        if (Object.keys(allNotes).length > 0) {
            localStorage.setItem("calendar_notes", JSON.stringify(allNotes));
        }
    }, [allNotes]);

    return (
        <section className="bg-yellow-50 p-6 md:p-8 flex-grow border-t border-gray-200 shadow-inner overflow-hidden">
            <div className={`h-full flex flex-col ${animClass}`}>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">
                    {format(currentDate, "MMMM")} Memos
                </h3>
                <textarea
                    value={allNotes[key] || ""}
                    onChange={(e) => setAllNotes({ ...allNotes, [key]: e.target.value })}
                    placeholder="Jot down notes for this month..."
                    className="w-full h-48 md:h-full bg-transparent border-none focus:ring-0 resize-none text-sm text-gray-800 leading-[28px] font-medium placeholder-gray-400"
                    style={{
                        backgroundImage: "linear-gradient(transparent, transparent 27px, #d1d5db 28px)",
                        backgroundSize: "100% 28px"
                    }}
                />
            </div>
        </section>
    );
}