import { NextResponse } from "next/server";
import { STUDENT_CHAT_SYSTEM_PROMPT } from "@/lib/student-chat-system-prompt";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

type ChatTurn = { role: "user" | "assistant"; content: string };

type ChatRequest = {
  message?: string;
  history?: unknown;
};

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

/** Obvious non-LMS topics — block these; everything else gets rule-based / helpful default. */
function isClearlyOffTopic(q: string) {
  const block = [
    "cricket",
    "football",
    "ipl",
    "recipe",
    "bitcoin",
    "crypto",
    "stock market",
    "weather",
    "election",
    "politic",
    "dating",
    "porn",
    "hack wifi",
    "kill ",
    "bomb",
  ];
  return block.some((b) => q.includes(b));
}

const FEATURES_OVERVIEW_REPLY =
  "On the AiNextro LMS **student** side there are roughly **9 main areas**:\n\n" +
  "1. **Login / account** — sign in, logout, session\n" +
  "2. **Courses** — browse published courses, use filters\n" +
  "3. **Enroll** — join a course from the course page\n" +
  "4. **My Learning / dashboard** — enrolled courses, continue learning\n" +
  "5. **Lessons & progress** — complete lessons to update progress\n" +
  "6. **Certificates** — list and download; **verify** using the app’s link\n" +
  "7. **Profile & password** — edit profile, avatar/bio, change password\n" +
  "8. **Blogs** — student blogs section\n" +
  "9. **Help / notifications** — FAQ/help page, notifications (if available)\n\n" +
  "If you want steps for **one** area (for example how to enroll), ask about that specifically.";

/** Short casual openers — not a request for the full feature list */
function isGreetingOrSmallTalk(q: string) {
  if (q.length > 60) return false;
  const cleaned = q.replace(/[!?.，。、~]+/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return false;
  const tokens = cleaned.split(" ").filter(Boolean);
  if (tokens.length > 8) return false;
  const greet = new Set([
    "hi",
    "hii",
    "hello",
    "hey",
    "yo",
    "hola",
    "namaste",
    "namaskar",
    "namskar",
    "salaam",
    "salam",
    "assalam",
    "assalamualaikum",
    "adaab",
    "gm",
    "gn",
    "ge",
    "good",
    "morning",
    "evening",
    "afternoon",
    "night",
    "thanks",
    "thank",
    "you",
    "thx",
    "ty",
    "bye",
    "goodbye",
    "see",
    "later",
    "ok",
    "okay",
    "haan",
    "ha",
    "han",
    "yes",
    "no",
    "nahi",
    "kaise",
    "kaisy",
    "kese",
    "ho",
    "how",
    "are",
    "u",
    "there",
    "bro",
    "sir",
    "madam",
    "ji",
    "friend",
    "frnd",
    "dost",
    "sup",
    "whatsup",
  ]);
  return tokens.every((t) => greet.has(t));
}

function wantsFeatureListOrCount(q: string) {
  if (
    q.includes("feature") ||
    q.includes("features") ||
    q.includes("module") ||
    q.includes("modules") ||
    q.includes("functionality") ||
    q.includes("kitne") ||
    q.includes("how many") ||
    q.includes("kya kya") ||
    q.includes("kyaa kyaa") ||
    q.includes("list of") ||
    (q.includes("overview") &&
      (q.includes("lms") || q.includes("ainextro") || q.includes("student")))
  ) {
    return true;
  }
  // "lms me kya hai" / "app me kya kya"
  if (
    (q.includes("kya") || q.includes("kyaa")) &&
    (q.includes("lms") || q.includes("ainextro") || q.includes("student"))
  ) {
    return true;
  }
  return false;
}

function answerFor(q: string) {
  if (isGreetingOrSmallTalk(q)) {
    return (
      "Hello! I’m the **AiNextro LMS** tutor.\n\n" +
      "Ask me about **courses**, **enrolling**, **dashboard / progress**, **certificates**, **profile / password**, **blogs**, or **help** — type whatever you need."
    );
  }
  if (wantsFeatureListOrCount(q)) {
    return FEATURES_OVERVIEW_REPLY;
  }
  if (q.includes("enroll") || q.includes("enrollment")) {
    return (
      "To **enroll** in a course, open the **Courses** section, pick a course, and tap **Enroll**. " +
      "You need to be logged in. After enrolling, continue from **My Learning / Dashboard**."
    );
  }
  if (q.includes("my learning") || q.includes("dashboard")) {
    return (
      "**My Learning / Dashboard** shows your enrolled courses, progress, and related items. " +
      "Use **Continue learning** from there to open your course."
    );
  }
  if (q.includes("progress") || q.includes("lesson")) {
    return (
      "**Progress** updates when you **complete lessons** (use **Complete** / **Next lesson** or similar in the app). " +
      "Work through the lesson list inside the course; the percentage or bar will update as you go."
    );
  }
  if (q.includes("certificate") || q.includes("verify")) {
    return (
      "A **certificate** may be available after you finish the course or meet the app’s requirements. " +
      "Check the **Certificates** section to list or download. To let someone verify, use the **share / verify link** from the app; contact support if you can’t find it."
    );
  }
  if (q.includes("profile") || q.includes("password")) {
    return (
      "Update your **profile** (name, bio, avatar) from the profile or account area in the app. " +
      "For **password**, open security or account settings and use **Change password** (or similar)."
    );
  }
  if (q.includes("login") || q.includes("logout")) {
    return (
      "Use the app’s **login** page (e.g. phone/email and password, depending on setup). " +
      "**Logout** is usually under your profile or menu. You must be logged in to use student pages."
    );
  }
  if (q.includes("blog")) {
    return "Open **Blogs** from the app menu or **Blogs** section to read posts.";
  }
  if (q.includes("help")) {
    return "The **Help / FAQ** page in the app has common steps and guides.";
  }
  if (q.includes("course") || q.includes("courses")) {
    return (
      "All **published courses** are listed under **Courses** (or the course catalog); use filters to narrow them down. " +
      "After **Enroll**, open the same course from **Continue learning** or **My Learning** to keep studying."
    );
  }
  return (
    "I can help with **AiNextro LMS** for students. Ask your question and I’ll give **in-app steps**.\n\n" +
    "Topics: courses & **enroll**, **dashboard** / progress / lessons, **certificates** + verify, **profile** / password, **blogs**, **help**.\n\n" +
    "For a full overview, ask: **how many features** or **what’s in the LMS**."
  );
}

function parseHistory(raw: unknown): ChatTurn[] {
  if (!Array.isArray(raw)) return [];
  const out: ChatTurn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const r = (item as { role?: string; content?: string }).role;
    const c = (item as { role?: string; content?: string }).content;
    if ((r === "user" || r === "assistant") && typeof c === "string") {
      const trimmed = c.slice(0, 4000);
      if (trimmed) out.push({ role: r, content: trimmed });
    }
  }
  return out.slice(-30);
}

async function groqReply(
  apiKey: string,
  model: string,
  userMessage: string,
  history: ChatTurn[]
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const messages: { role: string; content: string }[] = [
    { role: "system", content: STUDENT_CHAT_SYSTEM_PROMPT },
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: userMessage.slice(0, 8000) },
  ];

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: Math.min(
        4096,
        Number(process.env.GROQ_MAX_TOKENS) || 2048
      ),
      temperature: Number(process.env.GROQ_TEMPERATURE) || 0.65,
      top_p: 0.92,
    }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };

  if (!res.ok) {
    const msg = data.error?.message || `HTTP ${res.status}`;
    return { ok: false, error: msg };
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    return { ok: false, error: "Empty model response" };
  }
  return { ok: true, text };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as ChatRequest;
  const message = typeof body.message === "string" ? body.message : "";
  const q = normalize(message);
  const history = parseHistory(body.history);

  if (!q) {
    return NextResponse.json(
      { ok: false, message: "Message required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GROQ_API_KEY?.trim();
  const model =
    process.env.GROQ_CHAT_MODEL?.trim() || "llama-3.3-70b-versatile";

  if (apiKey) {
    const ai = await groqReply(apiKey, model, message, history);
    if (ai.ok) {
      return NextResponse.json({ ok: true, reply: ai.text, source: "groq" });
    }
    // Fall through to rule-based when Groq fails
    if (!isClearlyOffTopic(q)) {
      return NextResponse.json({
        ok: true,
        reply: answerFor(q),
        source: "fallback",
        warning: `AI temporarily unavailable: ${ai.error}`,
      });
    }
    return NextResponse.json({
      ok: true,
      reply:
        "I couldn’t reach the AI service right now. Please try again in a moment or use the in-app **Help** page. " +
        "Ask about LMS topics: courses, enrollment, progress, certificates, or your account.",
      source: "error",
    });
  }

  // No API key: ChatGPT-style natural answers need Groq — say so clearly + rule fallback
  if (isClearlyOffTopic(q)) {
    return NextResponse.json({
      ok: true,
      reply:
        "I can only help with **AiNextro LMS** (courses, enrollment, progress, certificates, account, help). " +
        "I can’t help with that topic — please ask something about the LMS.\n\n" +
        "For richer, ChatGPT-style answers, set **`GROQ_API_KEY`** in `LMS LMS/.env.local` and restart the dev server (get a key at console.groq.com).",
      source: "rules",
    });
  }

  return NextResponse.json({
    ok: true,
    reply: answerFor(q),
    source: "rules",
  });
}
