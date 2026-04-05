"use client";

import React, {useEffect, useMemo, useRef, useState} from "react";
import {Send, X, Maximize2, Minimize2} from "lucide-react";

type Msg = {
    role: "user" | "assistant";
    text: string
};

/** International format, no + (e.g. India 91 + 10 digits). Change if your WhatsApp is on another country code. */
const WHATSAPP_E164 = "919772609110";

const WHATSAPP_PREFILL = "Hi there! 👋\n\n" + "I'm interested in *AiNextro LMS* and would like to know more about your courses and enrollment process.\n\n" + "Could you please assist me? Thanks in advance! 😊";

function whatsappHref(): string {
    const text = encodeURIComponent(WHATSAPP_PREFILL);
    return `https://wa.me/${WHATSAPP_E164}?text=${text}`;
}

function WhatsAppGlyph({
    className = "h-7 w-7"
} : {
    className? : string
}) {
    return (
        <svg className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
    );
}

/** Mascot — body uses CSS vars (globals) aligned with app primary hue */
function ChatMascot({
    className = "h-9 w-9"
} : {
    className? : string
}) {
    return (
        <svg className={className}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden>
            <path d="M8 18c0-4 4-7 16-7s16 3 16 7v14c0 4-4 7-16 7S8 36 8 32V18z" fill="var(--student-mascot-body)" className="drop-shadow-sm"/>
            <ellipse cx="18" cy="22" rx="3.5" ry="4" fill="white"/>
            <ellipse cx="30" cy="22" rx="3.5" ry="4" fill="white"/>
            <circle cx="17.5" cy="22" r="1.6" fill="#111827"/>
            <circle cx="29.5" cy="22" r="1.6" fill="#111827"/>
            <circle cx="18" cy="30" r="1.2" fill="var(--student-mascot-dots)" opacity="0.95"/>
            <circle cx="24" cy="30" r="1.2" fill="var(--student-mascot-dots)" opacity="0.95"/>
            <circle cx="30" cy="30" r="1.2" fill="var(--student-mascot-dots)" opacity="0.95"/>
            <path d="M12 10h24l-2 4H14l-2-4z" fill="#111827"/>
            <rect x="22" y="8" width="4" height="6" rx="1" fill="#111827"/>
            <path d="M36 32c2 2 4 6 4 8H8c0-2 2-6 4-8" fill="var(--student-mascot-body)"/>
        </svg>
    );
}

export default function StudentChatWidget() {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState < Msg[] > ([{
            role: "assistant",
            text: "Hi! I’m the **AiNextro LMS** tutor — ask me anything about this product (short or detailed). " +
                "Replies are more natural when **`GROQ_API_KEY`** is set on the server; otherwise you’ll get basic hints."
        },]);
    const listRef = useRef < HTMLDivElement | null > (null);

    useEffect(() => {
        if (!open) 
            return;
        
        setTimeout(() => listRef.current ?. scrollTo({top: listRef.current.scrollHeight}), 0);
    }, [open, messages.length, loading]);

    /** Chat open: lock page scroll so only the chat panel scrolls */
    useEffect(() => {
        if (!open) 
            return;
        
        const html = document.documentElement;
        const body = document.body;
        const prevHtmlOverflow = html.style.overflow;
        const prevBodyOverflow = body.style.overflow;
        const scrollbarW = window.innerWidth - html.clientWidth;
        const prevBodyPaddingRight = body.style.paddingRight;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        if (scrollbarW > 0) 
            body.style.paddingRight = `${scrollbarW}px`;
        

        return () => {
            html.style.overflow = prevHtmlOverflow;
            body.style.overflow = prevBodyOverflow;
            body.style.paddingRight = prevBodyPaddingRight;
        };
    }, [open]);

    const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

    async function send() {
        const text = input.trim();
        if (! text || loading) 
            return;
        
        setInput("");
        setLoading(true);
        setMessages((prev) => [
            ...prev, {
                role: "user",
                text
            }
        ]);
        try {
            const historyPayload = messages
                .slice(-30)
                .map((m) => ({role: m.role, content: m.text}));
            const res = await fetch("/api/student-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: text,
                    history: historyPayload,
                }),
            });
            const data = await res.json().catch(() => ({}));
            const reply = (data && typeof data.reply === "string" && data.reply) || (data && typeof data.message === "string" && data.message) || "Sorry, I could not reply right now.";
            setMessages((prev) => [
                ...prev, {
                    role: "assistant",
                    text: reply
                }
            ]);
        } catch {
            setMessages((prev) => [
                ...prev, {
                    role: "assistant",
                    text: "Network error. Please try again."
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

const panelWidth = expanded ? "w-[min(96vw,520px)]" : "w-[min(92vw,380px)]";
const panelHeight = expanded ? "max-h-[min(85vh,640px)]" : "max-h-[min(78vh,520px)]";

return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
        {
        open && (
            <div className={
                `${panelWidth} rounded-2xl overflow-hidden shadow-2xl border border-primary/25 flex flex-col bg-white dark:bg-card overscroll-contain isolate`
            }
                onWheel={
                    (e) => e.stopPropagation()
                }>
                {/* Same as app nav: bg-primary + primary-foreground */}
                <div className="flex items-center justify-between gap-2 px-4 py-3 bg-primary text-primary-foreground shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="shrink-0 rounded-lg bg-primary-foreground/15 p-0.5">
                            <ChatMascot className="h-8 w-8"/>
                        </div>
                        <div className="min-w-0 flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold tracking-tight">AiNextro</span>
                            <span className="rounded-md bg-primary-foreground/95 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary">
                                Tutor
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                        <button type="button" className="h-9 w-9 rounded-lg hover:bg-primary-foreground/15 flex items-center justify-center text-primary-foreground"
                            onClick={
                                () => setExpanded((e) => !e)
                            }
                            aria-label={
                                expanded ? "Shrink chat" : "Expand chat"
                        }>
                            {
                            expanded ? <Minimize2 size={18}/> : <Maximize2 size={18}/>
                        } </button>
                        <button type="button" className="h-9 w-9 rounded-lg hover:bg-primary-foreground/15 flex items-center justify-center text-primary-foreground"
                            onClick={
                                () => setOpen(false)
                            }
                            aria-label="Close chat">
                            <X size={20}/>
                        </button>
                    </div>
                </div>

                <div className={
                    `flex flex-col flex-1 min-h-0 bg-muted/30 dark:bg-background ${panelHeight}`
                }>
                    <div className="shrink-0 px-3 pt-3 pb-2">
                        <div className="rounded-xl border border-border bg-card px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
                            <strong className="text-foreground">Note:</strong>
                            This chat gives automated,
                                            AI-style replies and may be wrong. Help is only for this LMS (courses, progress,
                                            certificates, account). Use is subject to product terms.
                        </div>
                    </div>

                    <div ref={listRef}
                        className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain touch-pan-y px-3 pb-2 space-y-3 [-webkit-overflow-scrolling:touch]">
                        {
                        messages.map((m, idx) => (
                            <div key={idx}
                                className={
                                    `flex gap-2 ${
                                        m.role === "user" ? "justify-end" : "justify-start"
                                    }`
                            }>
                                {
                                m.role === "assistant" && (
                                    <div className="shrink-0 mt-0.5 rounded-full bg-primary/15 p-1">
                                        <ChatMascot className="h-6 w-6"/>
                                    </div>
                                )
                            }
                                <div className={
                                    `max-w-[82%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed shadow-sm whitespace-pre-wrap break-words ${
                                        m.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-card text-foreground border border-border rounded-bl-md"
                                    }`
                                }>
                                    {
                                    m.text
                                } </div>
                            </div>
                        ))
                    }
                        {
                        loading && (
                            <div className="flex gap-2 items-center pl-1">
                                <div className="rounded-full bg-primary/15 p-1">
                                    <ChatMascot className="h-6 w-6 opacity-70"/>
                                </div>
                                <span className="text-xs text-muted-foreground">Typing…</span>
                            </div>
                        )
                    } </div>

                    <div className="shrink-0 p-3 pt-2 bg-card border-t border-border">
                        <form onSubmit={
                                (e) => {
                                    e.preventDefault();
                                    send();
                                }
                            }
                            className="flex items-center gap-2 rounded-full border-2 border-primary/25 bg-muted/40 dark:bg-background pl-4 pr-1.5 py-1 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
                            <input value={input}
                                onChange={
                                    (e) => setInput(e.target.value)
                                }
                                placeholder="Write a message"
                                className="flex-1 min-w-0 bg-transparent py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"/>
                            <button type="submit"
                                disabled={
                                    ! canSend
                                }
                                className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-35 disabled:cursor-not-allowed transition-opacity"
                                aria-label="Send">
                                <Send size={18}
                                    className="ml-0.5"/>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

        <div className="flex flex-col items-end gap-2.5">
            <a href={
                    whatsappHref()
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-4 ring-[#25D366]/25 transition-all hover:scale-105 hover:shadow-xl hover:ring-[#25D366]/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
                aria-label="Chat on WhatsApp with AiNextro support"
                title="Message us on WhatsApp — we’ll help you quickly">
                <WhatsAppGlyph className="h-7 w-7"/>
                <span className="pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold leading-none text-[#25D366] shadow-sm">
                    Hi
                </span>
            </a>

            <button type="button"
                onClick={
                    () => setOpen((v) => !v)
                }
                className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center ring-4 ring-primary/25"
                aria-label={
                    open ? "Close chat" : "Open LMS Tutor chat"
            }>
                <ChatMascot className="h-11 w-11"/>
            </button>
        </div>
    </div>
);}
