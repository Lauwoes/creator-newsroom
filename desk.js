/* desk.js: the page behind desk.html. One plain script, no build step, nothing shared with app.js.
   desk.html?desk=<ID> shows the desk whose Google Apps Script web app has that deployment id.
   With no ?desk= the page is the blank desk ("Start your own desk") and calls no script at all.

   Everything a desk sends is untrusted. It is parsed, copied field by field through validateDesk and
   validateRead, cleaned with cleanText, and only ever put on the page as text.
   The pure functions come first and are exported at the bottom for tests/desk.test.mjs.
   All page code lives in startDesk(), which runs once the page has loaded. */
"use strict";

/* ===================== CONSTANTS ===================== */
const SERVICE = "creator-newsroom-first-reader";
const SCHEMA = 1;
const DESK_ID = /^[A-Za-z0-9_-]{20,120}$/;
const REGISTER_ID = /^[0-9a-fA-F]{12}$/;
const MAX_REPLY = 300000;          // characters; a longer answer is not read
const MAX_CODE = 400000;           // characters; the script file is far smaller
const MAX_DRAFT = 6000;            // characters; the script refuses longer drafts
const GET_TIMEOUT = 15000;
const POST_TIMEOUT = 45000;
const CODE_PATH = "./apps-script/Code.gs";
const DEFAULT_DISCLOSURE = ["#ad", "#sponsored", "paid partnership", "this video is sponsored"];
const RESERVED_RULES = ["disclosure missing", "hidden characters", "instruction to the reviewer"];
const LIMITS = { rules: 40, rule: 60, covers: 600, phrase: 40, phrases: 20, registerChars: 8000,
  name: 60, sells: 300, reviewedBy: 120, note: 200, disclosure: 12, problems: 10, problem: 160,
  bench: 50, channel: 60, beat: 30, subscribers: 12, checkedOn: 20, flags: 20, label: 80, quote: 400, reason: 400 };
const LANE_RANK = { green: 0, amber: 1, red: 2 };
const LANE_WORDS = {
  green: "Nothing flagged. A person still decides.",
  amber: "Flagged. Someone should look before this goes out.",
  red: "Stop. Take this to whoever signs off legal questions for this brand."
};
const NOT_READ_WORDS = "Not read by this desk's reader. Someone should look before this goes out.";
// What an API key looks like, anywhere in a draft. Such a draft is never sent (see runSend).
const KEY_SHAPE = /(?:^|[^A-Za-z0-9_-])(?:AIza[0-9A-Za-z_-]{30,}|AQ\.[0-9A-Za-z_.-]{20,})/;
const KEY_IN_DRAFT = "This text has what looks like an API key in it, so it was not sent. Never paste a key into this page.";
const PASTE_ERRORS = {
  key: "That looks like an API key. Never paste a key here. Paste the web app address that ends in /exec.",
  dev: "That is the test address. Use the one ending in /exec from Deploy > Manage deployments.",
  sheet: "That is your Sheet. Paste the web app address from Deploy > Manage deployments.",
  work: "That address belongs to a work or school account. Set the desk up with a personal Google account.",
  redirect: "That is the address Google redirects to. Copy the Web app URL from Deploy > Manage deployments instead.",
  other: "That is not a web app address. It should look like https://script.google.com/macros/s/.../exec",
  link: "That desk link is not valid."
};
const DESK_MESSAGES = {
  opening: "Opening the desk...",
  no_answer: "This desk did not answer. If it is yours: open your web app address in a private window. You should see text starting {\"ok\":true. If Google asks you to sign in, set Who has access to Anyone in Deploy > Manage deployments. If the address is wrong, copy the Web app URL again.",
  other_version: "This desk runs a different version of the code. If it is yours: paste the current code over the old, save, then Deploy > Manage deployments > edit > New version > Deploy.",
  not_set_up: "This desk is not set up yet. If it is yours: run setup in the script editor.",
  off: "This desk is switched off by its owner."
};
const READER_DOWN = {
  daily_limit: "Today's limit of reads on this desk is used up",
  too_long: "The draft is over 6,000 characters, more than the reader is sent",
  desk_off: "This desk is switched off",
  register_problem: "The desk's Sheet needs fixing",
  not_configured: "This desk has no key yet",
  model_gone: "The Gemini model this desk uses is no longer offered"
};
const PAGE_DOUBT = "This page did not understand part of this desk's answer, so it will not send drafts. If the desk is yours: update its code.";
const BENCH_CAPTION = "Typed into the desk's Sheet. Being listed here does not mean a channel works with this brand or has agreed to anything. Numbers are as typed on the date shown.";
const BENCH_HIDDEN = "This desk's bench is not shown here.";

/* ===================== PURE FUNCTIONS: text ===================== */
function isPlainObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}
function own(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
}
function stricter(a, b) {
  return LANE_RANK[a] >= LANE_RANK[b] ? a : b;
}

// The same characters the script's stripHidden_ removes (keep the two lists identical): soft hyphens, zero-width
// spaces, text-direction marks, invisible fillers and joiners, variation selectors that are not for emoji, and
// Unicode "tag" characters. The emoji joiner (U+200D) and the emoji selector (U+FE0F) are left alone, and so are
// the three flags built from tag characters.
function stripHidden(s) {
  const HIDDEN = /[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180B-\u180F\u200B\u200C\u200E\u200F\u202A-\u202E\u2060-\u206F\u3164\uFEFF\uFFA0]|\uDB40[\uDC00-\uDC7F\uDD00-\uDDEF]/g;
  const FLAG = /(\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)/;
  return String(s).split(FLAG).map(function (part, i) { return i % 2 ? part : part.replace(HIDDEN, ""); }).join("");
}

// Cleaning, as SPEC-common section 3: a string or nothing; no hidden or control characters; one space for any run
// of white space; trimmed; three or more double quotes become one; cut to the field's maximum.
// Tabs and line breaks count as white space (they become a space); every other control character is removed.
function cleanText(value, max) {
  if (typeof value !== "string") return "";
  let s = stripHidden(value);
  s = s.replace(/[\u0000-\u0008\u000E-\u001F\u007F-\u009F]/g, "");
  s = s.replace(/\s+/g, " ").trim();
  s = s.replace(/"{3,}/g, "\"");
  if (typeof max === "number" && s.length > max) {
    s = s.slice(0, max);
    if (/[\uD800-\uDBFF]$/.test(s)) s = s.slice(0, -1);   // never leave half a character at the cut
    s = s.trim();
  }
  return s;
}

// True when the text has what looks like an API key anywhere in it.
function looksLikeKey(text) {
  return typeof text === "string" && KEY_SHAPE.test(text);
}

// Local time as HH:MM:SS from the script's "readAt" (for example 2026-11-19T15:02:10Z). "" when it is not a time.
function localTime(iso) {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/.test(iso)) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return [d.getHours(), d.getMinutes(), d.getSeconds()].map(function (n) { return String(n).padStart(2, "0"); }).join(":");
}

/* ===================== PURE FUNCTIONS: the desk's address ===================== */
// What was typed in the paste box -> { ok:true, id } or { ok:false, message }. Nothing typed here is ever put in
// the address bar unless it is a well-formed deployment id.
// An id pasted on its own is taken only when it starts the way Google's deployment ids do ("AKfycb"); any other
// run of letters and digits is not a web app address. A full /exec address is taken whatever its id.
function parseDeskInput(input) {
  const s = typeof input === "string" ? input.trim() : "";
  const no = function (kind) { return { ok: false, message: PASTE_ERRORS[kind] }; };
  if (!s || s.length > 2000) return no("other");
  if (s.indexOf("AIza") === 0 || s.indexOf("AQ.") === 0) return no("key");
  if (DESK_ID.test(s)) return s.indexOf("AKfycb") === 0 ? { ok: true, id: s } : no("other");
  const lower = s.toLowerCase();
  const path = lower.split(/[?#]/)[0];
  if (/\/dev\/?$/.test(path)) return no("dev");
  if (lower.indexOf("docs.google.com/spreadsheets") >= 0) return no("sheet");
  if (lower.indexOf("/a/macros/") >= 0) return no("work");
  if (lower.indexOf("script.googleusercontent.com") >= 0) return no("redirect");
  const m = /^(?:https?:\/\/)?script\.google\.com\/macros\/(?:u\/\d{1,2}\/)?s\/([A-Za-z0-9_-]{20,120})\/exec\/?(?:[?#].*)?$/.exec(s);
  return m ? { ok: true, id: m[1] } : no("other");
}

// The only address this page ever calls for a desk. "" when the id is not well formed.
function deskUrl(id) {
  return typeof id === "string" && DESK_ID.test(id) ? "https://script.google.com/macros/s/" + id + "/exec" : "";
}

// Reads ?desk= from the address. { present:false } on the blank page; { present:true, id:"" } when it is malformed.
function deskIdFromSearch(search) {
  let value = null;
  try { value = new URLSearchParams(typeof search === "string" ? search : "").get("desk"); } catch (e) { value = null; }
  if (value === null) return { present: false, id: "" };
  return { present: true, id: DESK_ID.test(value) ? value : "" };
}

// A bench link is kept only when it is a YouTube channel page (SPEC-common section 3). Anything else becomes "".
function youtubeLink(value) {
  const s = cleanText(value, 200);
  const m = /^https:\/\/(?:www\.|m\.)?youtube\.com(\/(?:@[A-Za-z0-9._-]{3,30}|channel\/UC[A-Za-z0-9_-]{22})\/?)(?:[?#].*)?$/i.exec(s);
  if (!m) return "";
  if (!/^\/(@[A-Za-z0-9._-]{3,30}|channel\/UC[A-Za-z0-9_-]{22})\/?$/.test(m[1])) return "";   // "channel/UC" in these capitals only
  return "https://www.youtube.com" + m[1];
}
// The words shown for a bench link: the handle or the channel id from the checked address, never the typed name.
function linkLabel(link) {
  const m = /^https:\/\/www\.youtube\.com\/(?:(@[A-Za-z0-9._-]{3,30})|channel\/(UC[A-Za-z0-9_-]{22}))\/?$/.exec(typeof link === "string" ? link : "");
  return m ? (m[1] || m[2]) : "";
}

/* ===================== PURE FUNCTIONS: what a desk sends ===================== */
// The answer text -> a plain object, or null. Too long, not JSON, or not an object all count as no answer.
function parseReply(text) {
  if (typeof text !== "string" || text.length > MAX_REPLY) return null;
  let data = null;
  try { data = JSON.parse(text); } catch (e) { return null; }
  return isPlainObject(data) ? data : null;
}

// Cleans a list of phrases: each 2 to 40 characters (others are dropped, never cut), repeats dropped (any capitals),
// at most `most`.
function cleanPhrases(list, most) {
  const out = [], seen = {};
  if (!Array.isArray(list)) return out;
  for (let i = 0; i < list.length && out.length < most; i++) {
    const p = cleanText(list[i], 200), k = "k:" + p.toLowerCase();
    if (p.length < 2 || p.length > LIMITS.phrase || seen[k]) continue;
    seen[k] = true;
    out.push(p);
  }
  return out;
}

// One rule of the register, or null when it cannot be used as sent.
function cleanRule(item) {
  if (!isPlainObject(item)) return null;
  const lane = own(item, "lane");
  if (lane !== "red" && lane !== "amber") return null;
  const rule = cleanText(own(item, "rule"), LIMITS.rule), covers = cleanText(own(item, "covers"), LIMITS.covers);
  if (!rule || !covers || RESERVED_RULES.indexOf(rule.toLowerCase()) >= 0) return null;
  return { lane: lane, rule: rule, covers: covers, words: cleanPhrases(own(item, "words"), LIMITS.phrases) };
}

// One row of the bench, or null when it is not shown (no channel name, or an "Example" row).
function cleanBenchRow(item) {
  if (!isPlainObject(item)) return null;
  const channel = cleanText(own(item, "channel"), LIMITS.channel);
  if (!channel || /^example/i.test(channel)) return null;
  const subscribers = cleanText(own(item, "subscribers"), LIMITS.subscribers);
  const checkedOn = cleanText(own(item, "checkedOn"), LIMITS.checkedOn);
  return {
    channel: channel,
    link: youtubeLink(own(item, "link")),
    beat: cleanText(own(item, "beat"), LIMITS.beat),
    subscribers: /^[0-9][0-9.,]{0,9} ?[KkMm]?$/.test(subscribers) ? subscribers : "",
    checkedOn: /^[0-9A-Za-z ,./-]+$/.test(checkedOn) ? checkedOn : ""
  };
}

// The answer to GET, copied field by field. Returns { status, version, model, keySet, desk }.
// status: "ok" (desk is filled in), "no_answer", "other_version", "not_set_up" or "off" (desk is null).
// A desk that says it is ready is still treated as not ready when any part of its register is in doubt.
function validateDesk(reply) {
  const out = { status: "no_answer", version: "", model: "", keySet: false, desk: null };
  if (!isPlainObject(reply) || own(reply, "ok") !== true) return out;
  if (own(reply, "service") !== SERVICE || own(reply, "schema") !== SCHEMA) { out.status = "other_version"; return out; }
  out.version = /^[0-9A-Za-z._-]{1,40}$/.test(cleanText(own(reply, "version"), 60)) ? cleanText(own(reply, "version"), 60) : "";   // a plain version or nothing
  out.model = cleanText(own(reply, "model"), 60);
  out.keySet = own(reply, "keySet") === true;
  const sheetReady = own(reply, "sheetReady"), d = own(reply, "desk");
  if (sheetReady === false) { out.status = "not_set_up"; return out; }
  if (sheetReady !== true || !isPlainObject(d)) return out;
  if (own(d, "on") === false) { out.status = "off"; return out; }
  if (own(d, "on") !== true) return out;

  const saidReady = own(d, "ready") === true;
  let doubt = typeof own(d, "ready") !== "boolean";

  // The register: red rules first, then amber. A rule that cannot be used is dropped and the desk is not ready.
  const sent = own(d, "standards"), red = [], amber = [];
  let kept = 0, chars = 0;
  if (!Array.isArray(sent)) doubt = true;
  else for (let i = 0; i < sent.length; i++) {
    const r = cleanRule(sent[i]);
    if (!r) { doubt = true; continue; }
    kept++;
    if (kept > LIMITS.rules) { doubt = true; break; }
    chars += r.rule.length + r.covers.length;
    (r.lane === "red" ? red : amber).push(r);
  }
  if (kept === 0 || chars > LIMITS.registerChars) doubt = true;

  const idSent = own(d, "registerId");
  const registerId = typeof idSent === "string" && REGISTER_ID.test(idSent) ? idSent : "";
  if (!registerId) doubt = true;

  const problems = [];
  const sentProblems = own(d, "problems");
  if (Array.isArray(sentProblems)) for (let i = 0; i < sentProblems.length && problems.length < LIMITS.problems; i++) {
    const p = cleanText(sentProblems[i], LIMITS.problem);
    if (p) problems.push(p);
  }
  const ready = saidReady && !doubt;
  if (saidReady && doubt) { problems.unshift(PAGE_DOUBT); problems.length = Math.min(problems.length, LIMITS.problems); }

  const b = isPlainObject(own(d, "brand")) ? own(d, "brand") : {};
  let disclosureWords = cleanPhrases(own(d, "disclosureWords"), LIMITS.disclosure);
  if (!disclosureWords.length) disclosureWords = DEFAULT_DISCLOSURE.slice();   // the rule can never be switched off

  const benchShown = own(d, "benchShown") === true, bench = [];
  const sentBench = own(d, "bench");
  if (benchShown && Array.isArray(sentBench)) for (let i = 0; i < sentBench.length && bench.length < LIMITS.bench; i++) {
    const row = cleanBenchRow(sentBench[i]);
    if (row) bench.push(row);
  }

  out.status = "ok";
  out.desk = {
    ready: ready,
    problems: problems,
    readAt: localTime(own(d, "readAt")) ? own(d, "readAt") : "",
    registerId: ready ? registerId : "",
    counts: { red: red.length, amber: amber.length },
    brand: {
      name: cleanText(own(b, "name"), LIMITS.name),
      sells: cleanText(own(b, "sells"), LIMITS.sells),
      note: cleanText(own(b, "note"), LIMITS.note),
      reviewedBy: cleanText(own(b, "reviewedBy"), LIMITS.reviewedBy)
    },
    disclosureWords: disclosureWords,
    standards: red.concat(amber),
    benchShown: benchShown,
    bench: bench
  };
  return out;
}

// The answer to POST, copied field by field. Returns { ok:true, lane, flags, registerId } or { ok:false, why }.
// Anything this page does not understand counts as "not read", never as green.
function validateRead(reply) {
  const down = { ok: false, why: "unreachable" };
  if (!isPlainObject(reply)) return down;
  if (own(reply, "ok") !== true) {
    const code = own(reply, "error");
    return { ok: false, why: typeof code === "string" && /^[a-z_]{1,40}$/.test(code) ? code : "unreachable" };
  }
  const lane = own(reply, "lane"), sent = own(reply, "flags"), id = own(reply, "registerId");
  if (typeof lane !== "string" || !Object.prototype.hasOwnProperty.call(LANE_RANK, lane) || !Array.isArray(sent)) return down;
  if (typeof id !== "string" || !REGISTER_ID.test(id)) return down;
  const flags = [];
  for (let i = 0; i < sent.length && flags.length < LIMITS.flags; i++) {
    const f = sent[i];
    if (!isPlainObject(f) || (own(f, "lane") !== "amber" && own(f, "lane") !== "red")) continue;
    const label = cleanText(own(f, "label"), LIMITS.label), quote = cleanText(own(f, "quote"), LIMITS.quote);
    flags.push({ lane: own(f, "lane"), label: label, quote: quote, reason: cleanText(own(f, "reason"), LIMITS.reason),
      found: own(f, "quoteFound") !== false, byScript: label === "Hidden characters" && !quote });
  }
  return { ok: true, lane: flags.reduce(function (l, f) { return stricter(l, f.lane); }, lane), flags: flags, registerId: id };
}

// Why a read failed, as the first half of the sentence shown under the lane.
function readerWhy(code) {
  return typeof code === "string" && Object.prototype.hasOwnProperty.call(READER_DOWN, code) ? READER_DOWN[code] : "The desk's reader did not answer";
}

/* ===================== PURE FUNCTIONS: the quick check ===================== */
// Typed words -> the source of a regular expression that matches them literally: every special character is
// escaped, any white space matches `gap` (any white space unless told otherwise), straight and curly quotes are the same.
function literalPattern(words, gap) {
  return String(words).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, gap || "\\s+")
    .replace(/['\u2018\u2019]/g, "['\u2018\u2019]")
    .replace(/["\u201C\u201D]/g, "[\"\u201C\u201D]");
}

// The two edges of a word, as pattern text. No pattern on this page looks behind itself (older Safari cannot build
// one): the character before the words is matched and left out of capture group 1 instead.
const EDGE_BEFORE = "(?:^|[^\\p{L}\\p{N}])";
const EDGE_AFTER = "(?![\\p{L}\\p{N}])";
const LETTER_OR_DIGIT = /[\p{L}\p{N}]/u;
// Between two words of a phrase: white space, a hyphen (U+2010 to U+2013, so the en dash too) or the minus key.
const PHRASE_GAP = "[\\s\\u2010-\\u2013-]+";

// A phrase from "Words to catch" -> a regular expression, or null. The phrase is never read as a pattern.
// It must not run into a letter or digit at an end where it has one, a final letter may take s, es, d, ed or ing,
// and a space also matches a hyphen or dash ("pain free" catches "pain-free").
// The words found are capture group 1; they start at  m.index + m[0].length - m[1].length  (see phraseMatch).
function phraseRegex(phrase) {
  const chars = Array.from(typeof phrase === "string" ? phrase.trim() : "");
  if (!chars.length) return null;
  const first = chars[0], last = chars[chars.length - 1];
  let p = "(" + literalPattern(chars.join(""), PHRASE_GAP) + (/\p{L}/u.test(last) ? "(?:es|ed|ing|s|d)?" : "") + ")";
  if (LETTER_OR_DIGIT.test(first)) p = EDGE_BEFORE + p;
  if (LETTER_OR_DIGIT.test(last)) p += EDGE_AFTER;
  try { return new RegExp(p, "iu"); } catch (e) { return null; }
}

// Where a phrase is in the text -> { match, at, end }, or null when it is not there.
function phraseMatch(phrase, text) {
  const re = phraseRegex(phrase);
  const m = re && typeof text === "string" ? re.exec(text) : null;
  if (!m || !m[1]) return null;
  const at = m.index + m[0].length - m[1].length;
  return { match: m[1], at: at, end: at + m[1].length };
}

// True when any disclosure word is in the text (any capitals). A word that starts with a letter or digit must not
// come straight after one, and a word that ends with one (or starts with "#") must not run straight into one:
// "ad" is not found inside "made", "sponsored" not inside "unsponsored", and "#ad" not inside "#adidas".
function hasDisclosure(text, words) {
  return words.some(function (w) {
    const chars = Array.from(typeof w === "string" ? w.trim() : "");
    if (!chars.length) return false;
    let p = literalPattern(chars.join(""));
    if (LETTER_OR_DIGIT.test(chars[0])) p = EDGE_BEFORE + p;
    if (chars[0] === "#" || LETTER_OR_DIGIT.test(chars[chars.length - 1])) p += EDGE_AFTER;
    try { return new RegExp(p, "iu").test(text); } catch (e) { return false; }
  });
}

function disclosureDetail(words) {
  return "The draft has none of: " + words.join(", ") + ".";
}

// The page's own check: the desk's words to catch and the disclosure. Nothing leaves the browser.
// -> { lane, hits:[{ lane, label, match, by:"quick check", detail, at, end }] }, red rules first, one hit per rule.
function quickCheck(text, desk) {
  const draft = typeof text === "string" ? text : "";
  const rules = desk && Array.isArray(desk.standards) ? desk.standards : [];
  const words = desk && Array.isArray(desk.disclosureWords) && desk.disclosureWords.length ? desk.disclosureWords : DEFAULT_DISCLOSURE;
  const hits = [];
  const check = function (lane) {
    rules.forEach(function (r) {
      if (!r || r.lane !== lane || !Array.isArray(r.words)) return;
      for (let i = 0; i < r.words.length; i++) {
        const hit = phraseMatch(r.words[i], draft);
        if (hit) {
          hits.push({ lane: lane, label: r.rule, match: hit.match, by: "quick check", detail: r.covers, at: hit.at, end: hit.end });
          return;
        }
      }
    });
  };
  check("red");
  if (!hasDisclosure(draft, words)) hits.push({ lane: "red", label: "Disclosure missing", match: null, by: "quick check", detail: disclosureDetail(words) });
  check("amber");
  const lane = hits.some(function (h) { return h.lane === "red"; }) ? "red" : hits.length ? "amber" : "green";
  return { lane: lane, hits: hits };
}

/* ===================== PURE FUNCTIONS: the two reads together ===================== */
// Finds a reader's words in the draft the way the script compares them: any case, any white space, straight or curly quotes.
function findQuote(text, quote) {
  const q = typeof quote === "string" ? quote.trim() : "";
  if (!q || typeof text !== "string") return null;
  let hit = null;
  try { hit = new RegExp(literalPattern(q), "iu").exec(text); } catch (e) { return null; }
  return hit && hit[0] ? { at: hit.index, end: hit.index + hit[0].length } : null;
}

// Where a mark sits in the draft: the quick check knows its own place; a reader's words are looked up.
function placeOf(text, mark) {
  if (!mark || !mark.match || mark.missing) return null;
  if (typeof mark.at === "number" && typeof mark.end === "number") {
    return mark.at >= 0 && mark.end > mark.at && mark.end <= text.length ? { at: mark.at, end: mark.end } : null;
  }
  return findQuote(text, mark.match);
}

// One list of marks from both reads. kw is quickCheck's answer, fr is validateRead's (or null while waiting),
// registerId is the register this page loaded. -> { state, lane, marks }
//   state "waiting": no answer yet, lane null.     state "failed": the reader did not read it, lane amber or red.
//   state "changed": the reader used another register, lane null (not read).     state "read": the stricter lane stands.
// A draft the reader did not read is never green.
function mergeReads(text, kw, fr, registerId) {
  const marks = kw.hits.map(function (h) {
    return { lane: h.lane, label: h.label, match: h.match, detail: h.detail, by: "quick check", own: true, at: h.at, end: h.end };
  });
  if (!fr) return { state: "waiting", lane: null, marks: marks };
  if (!fr.ok) return { state: "failed", lane: stricter(kw.lane, "amber"), marks: marks };
  if (typeof registerId !== "string" || !registerId || fr.registerId !== registerId) return { state: "changed", lane: null, marks: marks };
  const samePlace = function (quote, mark) {
    const q = findQuote(text, quote), w = placeOf(text, mark);
    if (q && w) return q.at < w.end && w.at < q.end;
    const ql = quote.toLowerCase(), wl = mark.match.toLowerCase();
    return ql.indexOf(wl) >= 0 || wl.indexOf(ql) >= 0;
  };
  fr.flags.forEach(function (f) {
    // The reader repeating a mark the quick check already made (same rule, same place) is shown once, credited to both.
    const label = f.label.toLowerCase();
    const same = f.byScript ? [] : marks.filter(function (m) {
      return m.own && m.label.toLowerCase() === label && (m.match ? !!f.quote && samePlace(f.quote, m) : !f.quote);
    });
    if (same.length) { same.forEach(function (m) { m.by = "quick check and reader"; m.lane = stricter(m.lane, f.lane); }); return; }
    marks.push({ lane: f.lane, label: f.label, match: f.quote || null, detail: f.reason,
      by: f.byScript ? "before the reader" : "reader", own: false, missing: !!f.quote && !f.found });
  });
  return { state: "read", lane: stricter(kw.lane, fr.lane), marks: marks };
}

// The stretches of the draft to underline: [{ at, end, lane, nums }] in reading order, never overlapping.
// The same words flagged twice get one underline and both numbers.
function spansFor(text, marks) {
  const spans = [];
  if (typeof text !== "string" || !Array.isArray(marks)) return spans;
  marks.forEach(function (m, i) {
    const hit = placeOf(text, m);
    if (!hit) return;
    const over = spans.find(function (s) { return hit.at < s.end && hit.end > s.at; });
    if (over) { over.nums.push(i + 1); if (m.lane === "red") over.lane = "red"; }
    else spans.push({ at: hit.at, end: hit.end, lane: m.lane === "red" ? "red" : "amber", nums: [i + 1] });
  });
  spans.sort(function (a, b) { return a.at - b.at; });
  return spans;
}

/* ===================== PURE FUNCTIONS: the script file ===================== */
// The starter rows, cut out of Code.gs between the two STARTER markers. -> [{ lane, rule, covers, words }] or null.
function parseStarter(code) {
  if (typeof code !== "string") return null;
  const MARK = "/*STARTER*/";
  const a = code.indexOf(MARK), b = a < 0 ? -1 : code.indexOf(MARK, a + MARK.length);
  if (a < 0 || b < 0) return null;
  let rows = null;
  try { rows = JSON.parse(code.slice(a + MARK.length, b)); } catch (e) { return null; }
  if (!Array.isArray(rows)) return null;
  const out = [];
  for (let i = 0; i < rows.length && out.length < LIMITS.rules; i++) {
    const r = rows[i];
    if (!isPlainObject(r)) continue;
    const lane = own(r, "lane"), words = own(r, "words");
    const rule = cleanText(own(r, "rule"), LIMITS.rule), covers = cleanText(own(r, "covers"), LIMITS.covers);
    if ((lane !== "red" && lane !== "amber") || !rule || !covers) continue;
    out.push({ lane: lane, rule: rule, covers: covers, words: cleanText(Array.isArray(words) ? words.join(", ") : words, 400) });
  }
  return out.length ? out : null;
}

// The VERSION line of Code.gs, for example  const VERSION = "2026-11-20.1";  -> "2026-11-20.1". "" when not found.
function parseVersion(code) {
  if (typeof code !== "string") return "";
  const m = /^[ \t]*const VERSION = "([0-9A-Za-z._-]{1,40})"/m.exec(code);
  return m ? m[1] : "";
}

/* ===================== PURE FUNCTIONS: the page's own sentences ===================== */
// A line that carries text the desk's owner typed is three parts: { before, typed, after }. The page's own words are
// `before` and `after`; `typed` goes in a box of its own (see typedLine), so it can never read as the page talking.
// `typed` is "" when the owner typed nothing: then `before` is the whole line.
function brandLine(desk) {
  return desk.brand.name
    ? { before: "Brand, as typed by the desk's owner: ", typed: desk.brand.name, after: "" }
    : { before: "This desk has no brand name yet.", typed: "", after: "" };
}
function noteLine(desk) {
  return desk.brand.note
    ? { before: "Note typed by the desk's owner: ", typed: desk.brand.note, after: "" }
    : { before: "", typed: "", after: "" };
}
function sheetLine(desk) {
  const time = localTime(desk.readAt);
  return "Read from the owner's Sheet" + (time ? " at " + time : "") + ". " + desk.counts.red + " red and " + desk.counts.amber +
    " amber rules " + (desk.ready ? "in use" : "found") + ", plus the built-in disclosure rule.";
}
function problemsHead(desk) {
  return desk.ready ? "Notes from the Sheet:" : "The Sheet needs fixing before this desk can read drafts:";
}
function reviewedLine(desk) {
  return desk.brand.reviewedBy
    ? { before: "Reviewed by, as typed by the desk's owner: ", typed: desk.brand.reviewedBy, after: " Not checked by anyone else." }
    : { before: "Starter or unreviewed rules. Nobody has told this page they were reviewed.", typed: "", after: "" };
}
// "" unless both versions are known and they differ.
function versionLine(deskVersion, currentVersion) {
  if (!deskVersion || !currentVersion || deskVersion === currentVersion) return "";
  return "This desk runs code version " + deskVersion + ". The current version is " + currentVersion + ".";
}
// The big word of a result (m is mergeReads' answer). A lane only when the reader's answer was understood or it failed.
function laneWord(m) {
  return m.state === "waiting" ? "Reading..." : m.state === "changed" ? "Not read" : m.lane;
}
// The sentence under the big word. A draft the reader did not read, with no marks from the quick check, is amber
// because nobody read it, not because anything was flagged: it gets its own sentence.
function verdictText(m) {
  if (m.state === "waiting") return "The quick check has read it. This desk's reader is reading it now.";
  if (m.state === "changed") return "The standards changed while you were reading. Press Read again, then send the draft again.";
  if (m.state === "failed" && !(Array.isArray(m.marks) && m.marks.length)) return NOT_READ_WORDS;
  return LANE_WORDS[m.lane];
}
// Who said what. "" while waiting, and when the standards changed under the read.
function readLine(kw, fr, m) {
  if (m.state === "read") return "Quick check: " + kw.lane + ". This desk's reader: " + fr.lane + ". The stricter lane stands.";
  if (m.state === "failed") return "Quick check: " + kw.lane + ". " + readerWhy(fr.why) + ", so a person should read this one.";
  return "";
}
// Shown in place of the list when there are no marks at all.
function nothingLine(fr, m) {
  if (m.state !== "read") return "Nothing flagged by the quick check. Disclosure present.";
  if (fr.lane === "green") return "Nothing flagged by the quick check or by the reader. Disclosure present.";
  return "Nothing flagged by the quick check. The reader sorted it " + fr.lane + " without giving a reason.";
}
// One mark's words after its label, for example  ("guaranteed"). Promises a result.
function markText(mark) {
  const quoted = mark.match ? " (\"" + mark.match + "\"" + (mark.missing ? ", words not found in the draft" : "") + ")" : "";
  return quoted + ". " + (mark.detail || "");
}

/* ===================== THE PAGE (runs once desk.html has loaded) ===================== */
// Every node is made with createElement and filled with textContent. Nothing a desk sends is ever read as markup.
function startDesk() {
  const byId = function (id) {
    const node = document.getElementById(id);
    if (!node) throw new Error("desk.html has no #" + id);
    return node;
  };
  const el = function (tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  };
  const clear = function (node) { while (node.firstChild) node.removeChild(node.firstChild); };
  const show = function (node, on) { node.classList.toggle("dk-off", !on); };
  // Text the desk's owner typed goes in an element of its own, so it can never continue the page's own sentence.
  const typedLine = function (node, before, typed, after) {
    clear(node);
    node.appendChild(document.createTextNode(before));
    node.appendChild(el("span", "dk-typed", typed));
    if (after) node.appendChild(document.createTextNode(after));
  };
  // One of the page's sentences ({ before, typed, after }): boxed when it carries typed text, plain text when not.
  const setLine = function (node, line) {
    if (line.typed) typedLine(node, line.before, line.typed, line.after);
    else node.textContent = line.before;
  };

  const where = deskIdFromSearch(window.location.search);
  const url = deskUrl(where.id);   // "" on the blank page: then no script is ever called
  let current = null;              // the checked answer now on the page
  let codeText = null;             // Code.gs once fetched; "" when it could not be fetched
  let codeJob = null;

  /* ---------- fetching ---------- */
  // Only method, body and signal are passed. Any header would break the call to a desk.
  async function fetchText(address, body, timeout, most) {
    const ctrl = new AbortController();
    const timer = setTimeout(function () { ctrl.abort(); }, timeout);
    try {
      const options = body === null ? { method: "GET", signal: ctrl.signal } : { method: "POST", body: body, signal: ctrl.signal };
      const res = await fetch(address, options);
      if (!res.ok) return null;
      const text = await res.text();
      return typeof text === "string" && text.length <= most ? text : null;
    } catch (e) {
      return null;   // offline, blocked, or no answer in time
    } finally {
      clearTimeout(timer);
    }
  }
  // The script file from this site (same origin). Fetched once; "" when it could not be fetched.
  function loadCode() {
    if (!codeJob) codeJob = fetchText(CODE_PATH, null, GET_TIMEOUT, MAX_CODE).then(function (text) { codeText = text || ""; return codeText; });
    return codeJob;
  }

  /* ---------- small builders ---------- */
  function laneStamp(lane) {
    return el("span", "stamp " + (lane === "red" ? "r" : "a"), lane === "red" ? "Red" : "Amber");
  }
  // rows: arrays of cells; a cell is a string (shown as text) or a node built here.
  function tableOf(className, headings, rows) {
    const table = el("table", className), head = el("tr");
    headings.forEach(function (h) { head.appendChild(el("th", "", h)); });
    table.appendChild(head);
    rows.forEach(function (cells) {
      const tr = el("tr");
      cells.forEach(function (cell) {
        const td = el("td");
        if (typeof cell === "string") td.textContent = cell; else if (cell) td.appendChild(cell);
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
    return table;
  }

  /* ---------- state A: the blank desk ---------- */
  function showBlank(errorText) {
    show(byId("dkBlank"), true);
    show(byId("dkDesk"), false);
    show(byId("dkFrame"), false);
    show(byId("dkFootLinks"), false);
    byId("dkPasteErr").textContent = errorText;
    byId("dkOpen").addEventListener("click", openFromBox);
    byId("dkPaste").addEventListener("keydown", function (e) { if (e.key === "Enter") openFromBox(); });
    byId("dkCopy").addEventListener("click", function () { copyCode().catch(function () { byId("dkCopy").disabled = false; }); });
    loadCode().then(function (code) { renderStarter(parseStarter(code)); }).catch(function () { renderStarter(null); });
  }
  // Only a well-formed deployment id ever reaches the address bar.
  function openFromBox() {
    const r = parseDeskInput(byId("dkPaste").value);
    byId("dkPasteErr").textContent = r.ok ? "" : r.message;
    if (r.ok) window.location.search = "?desk=" + encodeURIComponent(r.id);
  }
  function renderStarter(rows) {
    const box = byId("dkStarter");
    clear(box);
    show(byId("dkStarterErr"), !rows);
    if (!rows) return;
    box.appendChild(tableOf("rules dk-reg dk-reg4", ["Lane", "Rule", "What it covers", "Words to catch"],
      rows.map(function (r) { return [laneStamp(r.lane), r.rule, r.covers, r.words]; })));
  }
  async function copyCode() {
    const note = byId("dkCopyNote"), btn = byId("dkCopy"), box = byId("dkCodeBox");
    btn.disabled = true;
    note.textContent = "";
    if (codeText === "") codeJob = null;   // the last try failed: ask again
    const code = codeText || await loadCode();
    btn.disabled = false;
    if (!code) { note.textContent = "The code could not be loaded. Use the link below."; return; }
    const version = parseVersion(code), versionNote = version ? " Version " + version + "." : "";
    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(code); copied = true; }
    } catch (e) { copied = false; }
    // The exact text is always shown in the read-only box, so what was copied can be checked before it is pasted.
    box.value = code;
    show(box, true);
    if (copied) { note.textContent = "Copied." + versionNote + " The exact text is in the box below."; return; }
    box.focus();
    box.select();
    note.textContent = "Copying was blocked. The code is selected below: copy it with Ctrl+C, or Cmd+C on a Mac." + versionNote;
  }

  /* ---------- state B: someone's desk ---------- */
  function showDeskView() {
    show(byId("dkBlank"), false);
    show(byId("dkDesk"), true);
    show(byId("dkFrame"), true);
    show(byId("dkFootLinks"), true);
    byId("dkRetry").addEventListener("click", openDesk);
    byId("dkReload").addEventListener("click", openDesk);
    byId("dkCheck").addEventListener("click", runCheck);
    byId("dkSend").addEventListener("click", runSend);
  }
  function setBusy(on) {
    ["dkRetry", "dkReload", "dkCheck", "dkSend"].forEach(function (id) { byId(id).disabled = on; });
  }
  // A message in place of the desk. Nothing the desk sent stays on the page.
  function showStatus(kind) {
    ["dkBrand", "dkNote", "dkSheet", "dkProblemsHead", "dkProblemsList", "dkVersion", "dkRegister", "dkReviewed", "dkOut", "dkBench"]
      .forEach(function (id) { clear(byId(id)); });
    show(byId("dkBody"), false);
    show(byId("dkStatus"), true);
    byId("dkStatusText").textContent = DESK_MESSAGES[kind];
    show(byId("dkRetry"), kind === "no_answer");
  }
  // Asks the desk for its standards and bench (GET), checks the answer, and draws it. Also behind "Read again".
  function openDesk() {
    setBusy(true);
    if (!current) showStatus("opening");
    fetchText(url, null, GET_TIMEOUT, MAX_REPLY).then(function (text) {
      const answer = validateDesk(parseReply(text));
      current = answer.status === "ok" ? answer : null;
      if (!current) { showStatus(answer.status); return; }
      renderBrand(answer.desk);
      renderSheetCheck(answer);
      renderVersion(answer, "");
      renderRegister(answer.desk);
      renderTest(answer.desk);
      renderBench(answer.desk);
      show(byId("dkStatus"), false);
      show(byId("dkBody"), true);
      loadCode().then(function (code) { if (current === answer) renderVersion(answer, parseVersion(code)); });
    }).catch(function () {
      current = null;
      showStatus("no_answer");
    }).then(function () { setBusy(false); });
  }
  function renderBrand(desk) {
    setLine(byId("dkBrand"), brandLine(desk));
    setLine(byId("dkNote"), noteLine(desk));
    show(byId("dkNote"), !!desk.brand.note);
  }
  function renderSheetCheck(answer) {
    const desk = answer.desk, list = byId("dkProblemsList");
    byId("dkSheet").textContent = sheetLine(desk);
    show(byId("dkNoKey"), !answer.keySet);
    clear(list);
    desk.problems.forEach(function (p) { list.appendChild(el("li", "", p)); });
    byId("dkProblemsHead").textContent = problemsHead(desk);
    show(byId("dkProblems"), desk.problems.length > 0);
  }
  function renderVersion(answer, currentVersion) {
    const line = versionLine(answer.version, currentVersion);
    byId("dkVersion").textContent = line;
    show(byId("dkVersion"), !!line);
  }
  function renderRegister(desk) {
    const box = byId("dkRegister");
    const rows = desk.standards.map(function (r) { return [laneStamp(r.lane), r.rule, r.covers]; });
    rows.push([laneStamp("red"), "Disclosure missing", disclosureDetail(desk.disclosureWords)]);
    clear(box);
    box.appendChild(tableOf("rules dk-reg", ["Lane", "Rule", "What it covers"], rows));
    setLine(byId("dkReviewed"), reviewedLine(desk));
  }
  function renderTest(desk) {
    clear(byId("dkOut"));
    show(byId("dkTestBox"), desk.ready);
    show(byId("dkTestOff"), !desk.ready);
  }
  function renderBench(desk) {
    const box = byId("dkBench");
    clear(box);
    if (!desk.benchShown) { box.appendChild(el("p", "small", BENCH_HIDDEN)); return; }
    if (!desk.bench.length) { box.appendChild(el("p", "small", "No channels yet.")); return; }
    box.appendChild(el("p", "small", BENCH_CAPTION));
    const wrap = el("div", "tablewrap");
    wrap.appendChild(tableOf("ledger dk-ledger", ["Channel", "Link", "Beat", "Subscribers", "Checked on"],
      desk.bench.map(function (r) { return [r.channel, benchLink(r.link), r.beat, r.subscribers, r.checkedOn]; })));
    box.appendChild(wrap);
  }
  // The one place an address from a desk becomes a link. It is checked again here, and the words shown are
  // the handle or channel id from the checked address.
  function benchLink(link) {
    const safe = youtubeLink(link), label = linkLabel(safe);
    if (!safe || !label) return "";
    const a = el("a", "", label);
    a.setAttribute("href", safe);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
    return a;
  }

  /* ---------- state B: test a script ---------- */
  // The draft with each flagged phrase underlined and numbered. Built from text nodes only.
  function copyNode(text, marks) {
    const pre = el("pre", "copy");
    let pos = 0;
    spansFor(text, marks).forEach(function (s) {
      pre.appendChild(document.createTextNode(text.slice(pos, s.at)));
      const mark = el("mark", s.lane === "red" ? "r" : "a", text.slice(s.at, s.end));
      mark.appendChild(el("sup", "", s.nums.join(",")));
      pre.appendChild(mark);
      pos = s.end;
    });
    pre.appendChild(document.createTextNode(text.slice(pos)));
    return pre;
  }
  // The numbered list under the draft. Labels, quotes and reasons are text, whoever wrote them.
  function marksList(marks) {
    const list = el("ol", "marks");
    marks.forEach(function (m, i) {
      const li = el("li", m.lane === "red" ? "r" : "a"), body = el("span");
      li.appendChild(el("sup", "", String(i + 1)));
      body.appendChild(el("b", "", m.label));
      body.appendChild(document.createTextNode(markText(m) + " "));
      body.appendChild(el("span", "by", m.by));
      li.appendChild(body);
      list.appendChild(li);
    });
    return list;
  }
  function draftOrAsk(out) {
    const text = byId("dkText").value;
    clear(out);
    if (text.trim()) return text;
    out.appendChild(el("p", "small muted", "Paste a draft first."));
    return "";
  }
  // "Check on this page": the quick check's marks and no lane. Nothing is sent anywhere.
  function runCheck() {
    if (!current || !current.desk.ready) return;
    const out = byId("dkOut"), text = draftOrAsk(out);
    if (!text) return;
    const marks = mergeReads(text, quickCheck(text, current.desk), null, "").marks;
    out.appendChild(el("p", "sub", "Quick check"));
    if (!marks.length) { out.appendChild(el("p", "small", "The quick check found nothing. That is not a read: send it to the reader for a lane.")); return; }
    out.appendChild(copyNode(text, marks));
    out.appendChild(marksList(marks));
  }
  // fr is null while the reader is reading.
  function showRead(out, text, kw, fr, desk) {
    const m = mergeReads(text, kw, fr, desk.registerId), box = el("div", "verdict"), line = readLine(kw, fr, m);
    box.appendChild(el("div", "lane " + (m.lane ? { green: "g", amber: "a", red: "r" }[m.lane] : "p"), laneWord(m)));
    box.appendChild(el("div", "small muted", verdictText(m)));
    if (line) box.appendChild(el("div", "small muted", line));
    box.appendChild(copyNode(text, m.marks));
    box.appendChild(m.marks.length ? marksList(m.marks) : el("p", "small muted dk-row", nothingLine(fr, m)));
    clear(out);
    out.appendChild(box);
  }
  // "Send to this desk's reader": the quick check first, then one POST to the desk. Never green unless the reader read it.
  // A draft with what looks like an API key in it is refused here, before anything is sent anywhere.
  function runSend() {
    if (!current || !current.desk.ready) return;
    const out = byId("dkOut"), text = draftOrAsk(out), desk = current.desk;
    if (!text) return;
    if (looksLikeKey(text)) { out.appendChild(el("p", "dk-err", KEY_IN_DRAFT)); return; }
    const kw = quickCheck(text, desk);
    const down = function () { return { ok: false, why: "unreachable" }; };
    showRead(out, text, kw, null, desk);
    setBusy(true);
    const job = text.trim().length > MAX_DRAFT
      ? Promise.resolve({ ok: false, why: "too_long" })
      : fetchText(url, JSON.stringify({ script: text.trim(), source: "desk page" }), POST_TIMEOUT, MAX_REPLY)
          .then(function (answer) { return validateRead(parseReply(answer)); });
    job.catch(down).then(function (fr) {
      try { showRead(out, text, kw, fr, desk); } catch (e) { showRead(out, text, kw, down(), desk); }
    }).then(function () { setBusy(false); }, function () { setBusy(false); });
  }

  /* ---------- which state ---------- */
  if (!where.present) showBlank("");
  else if (!url) showBlank(PASTE_ERRORS.link);
  else { showDeskView(); openDesk(); }
  if (document.documentElement) document.documentElement.classList.remove("dk-opening");
}

if (typeof document !== "undefined") {
  // This file is loaded in the head, so this runs before the page is drawn: a desk link never flashes the blank page first.
  if (document.documentElement && deskIdFromSearch(window.location.search).present) document.documentElement.classList.add("dk-opening");
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startDesk);
  else startDesk();
}

if (typeof module !== "undefined") module.exports = { parseDeskInput, deskUrl, deskIdFromSearch, cleanText, stripHidden, localTime, parseReply, validateDesk, validateRead, readerWhy, quickCheck, phraseRegex, phraseMatch, findQuote, mergeReads, spansFor, youtubeLink, linkLabel, parseStarter, parseVersion, brandLine, noteLine, sheetLine, problemsHead, reviewedLine, versionLine, laneWord, verdictText, readLine, nothingLine, markText, disclosureDetail, looksLikeKey, PASTE_ERRORS, DESK_MESSAGES, LANE_WORDS, NOT_READ_WORDS, KEY_IN_DRAFT, BENCH_CAPTION, BENCH_HIDDEN, DEFAULT_DISCLOSURE };
