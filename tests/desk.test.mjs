// Offline checks for desk.js and desk.html. No dependencies and no network: every answer from a "desk" is made up here.
// Run from the repository folder:  node tests/desk.test.mjs
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import vm from "node:vm";

// Made-up key shapes for the tests, written in two halves so nothing here looks like a real key to a scanner.
const FAKE_AIZA = "AIza" + "SyA-made-up-key-for-this-test-0123456";
const FAKE_AQ = "AQ." + "Ab8-made-up-key-for-this-test-0123456789";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const D = require(path.join(root, "desk.js"));
const deskJs = readFileSync(path.join(root, "desk.js"), "utf8");
const deskHtml = readFileSync(path.join(root, "desk.html"), "utf8");
const styleCss = readFileSync(path.join(root, "style.css"), "utf8");

let passed = 0, failed = 0;
function check(name, ok, detail) {
  if (ok) { passed++; return; }
  failed++;
  console.log("FAIL  " + name + (detail === undefined ? "" : "\n      " + detail));
}
function eq(name, got, want) {
  check(name, JSON.stringify(got) === JSON.stringify(want), "got  " + JSON.stringify(got) + "\n      want " + JSON.stringify(want));
}
function section(title) { console.log(title); }
process.on("exit", () => {
  console.log("\n" + passed + " passed, " + failed + " failed");
  if (failed) process.exitCode = 1;
});

const ID = "AKfycbx" + "A1b2C3d4E5f6G7h8".repeat(4) + "_-9";   // made up, the shape of a deployment id
const EXEC = "https://script.google.com/macros/s/" + ID + "/exec";

/* ===================== parseDeskInput, deskUrl, deskIdFromSearch ===================== */
section("the paste box and the desk address");
{
  const P = D.parseDeskInput, E = D.PASTE_ERRORS;
  eq("a full /exec address gives the id", P(EXEC), { ok: true, id: ID });
  eq("spaces around the address are ignored", P("  " + EXEC + "\n"), { ok: true, id: ID });
  eq("an /exec address with a query still gives the id", P(EXEC + "?x=1"), { ok: true, id: ID });
  eq("an address copied from a second signed-in account (/u/1/) gives the id", P("https://script.google.com/macros/u/1/s/" + ID + "/exec"), { ok: true, id: ID });
  eq("a bare id is accepted", P(ID), { ok: true, id: ID });
  const OTHER_ID = "Zz9" + "A1b2C3d4E5f6G7h8".repeat(4) + "_-9";   // well formed, but not how a deployment id starts
  eq("a bare id is accepted only when it starts with AKfycb", [P(OTHER_ID), P("akfycb" + ID.slice(6)), P("x" + ID), P("a".repeat(20)), P("abcdefghijklmnopqrstuvwxyz0123456789"), P("AKfycb" + "a".repeat(14))],
    [{ ok: false, message: E.other }, { ok: false, message: E.other }, { ok: false, message: E.other }, { ok: false, message: E.other }, { ok: false, message: E.other }, { ok: true, id: "AKfycb" + "a".repeat(14) }]);
  eq("a full /exec address is accepted whatever its id", [P("https://script.google.com/macros/s/" + OTHER_ID + "/exec"), P("script.google.com/macros/s/" + OTHER_ID + "/exec?x=1")], [{ ok: true, id: OTHER_ID }, { ok: true, id: OTHER_ID }]);
  eq("an id from a full address is still a good desk link", [D.deskIdFromSearch("?desk=" + OTHER_ID), D.deskUrl(OTHER_ID)], [{ present: true, id: OTHER_ID }, "https://script.google.com/macros/s/" + OTHER_ID + "/exec"]);
  eq("/dev is the test address", P("https://script.google.com/macros/s/" + ID + "/dev"), { ok: false, message: E.dev });
  eq("a Sheet address is explained", P("https://docs.google.com/spreadsheets/d/1AbCdEfGhIjKlMnOpQrStUvWxYz0123456789/edit#gid=0"), { ok: false, message: E.sheet });
  eq("/a/macros/ is a work or school account", P("https://script.google.com/a/macros/example.edu/s/" + ID + "/exec"), { ok: false, message: E.work });
  eq("googleusercontent is the redirect address", P("https://script.googleusercontent.com/macros/echo?user_content_key=abc123&lib=xyz"), { ok: false, message: E.redirect });
  eq("an AIza key is refused as a key", P("" + FAKE_AIZA + ""), { ok: false, message: E.key });
  eq("an AQ. key is refused as a key", P("" + FAKE_AQ + ""), { ok: false, message: E.key });
  eq("a bare host name is not called a key", P("script.google.com"), { ok: false, message: E.other });
  eq("empty", P(""), { ok: false, message: E.other });
  eq("only spaces", P("   "), { ok: false, message: E.other });
  eq("300 characters of junk", P("x".repeat(300)), { ok: false, message: E.other });
  eq("300 characters of junk with symbols", P("<script>/".repeat(34)), { ok: false, message: E.other });
  eq("another site ending in /exec", P("https://example.com/macros/s/" + ID + "/exec"), { ok: false, message: E.other });
  eq("a look-alike host", P("https://script.google.com.example.com/macros/s/" + ID + "/exec"), { ok: false, message: E.other });
  eq("an id that is too short", P("https://script.google.com/macros/s/short/exec"), { ok: false, message: E.other });
  eq("a library address", P("https://script.google.com/macros/library/d/" + ID + "/3"), { ok: false, message: E.other });
  eq("not a string", [P(null), P(undefined), P(7), P({})].map(r => r.message), [E.other, E.other, E.other, E.other]);
  check("a refused paste never carries an id", [P("AIzaSyA-made-up"), P(EXEC.replace("/exec", "/dev")), P("x".repeat(300))].every(r => r.ok === false && !("id" in r)));
  eq("the wording for a key", E.key, "That looks like an API key. Never paste a key here. Paste the web app address that ends in /exec.");
  eq("the wording for /dev", E.dev, "That is the test address. Use the one ending in /exec from Deploy > Manage deployments.");
  eq("the wording for a Sheet", E.sheet, "That is your Sheet. Paste the web app address from Deploy > Manage deployments.");
  eq("the wording for a work account", E.work, "That address belongs to a work or school account. Set the desk up with a personal Google account.");
  eq("the wording for the redirect address", E.redirect, "That is the address Google redirects to. Copy the Web app URL from Deploy > Manage deployments instead.");
  eq("the wording for anything else", E.other, "That is not a web app address. It should look like https://script.google.com/macros/s/.../exec");
  eq("the wording for a bad desk link", E.link, "That desk link is not valid.");

  eq("deskUrl builds the one address the page calls", D.deskUrl(ID), EXEC);
  eq("deskUrl refuses anything that is not an id", [D.deskUrl("short"), D.deskUrl(ID + "/../x"), D.deskUrl(EXEC), D.deskUrl(null), D.deskUrl("a".repeat(121))], ["", "", "", "", ""]);
  eq("no ?desk= is the blank page", D.deskIdFromSearch(""), { present: false, id: "" });
  eq("another parameter is still the blank page", D.deskIdFromSearch("?other=1"), { present: false, id: "" });
  eq("?desk=<id> is read", D.deskIdFromSearch("?desk=" + ID), { present: true, id: ID });
  eq("a malformed ?desk= is present but has no id", D.deskIdFromSearch("?desk=" + encodeURIComponent(EXEC)), { present: true, id: "" });
  eq("an empty ?desk= is present but has no id", D.deskIdFromSearch("?desk="), { present: true, id: "" });
}

/* ===================== cleanText ===================== */
section("cleaning");
{
  const C = D.cleanText;
  eq("not a string becomes empty", [C(null, 10), C(undefined, 10), C(7, 10), C({}, 10), C(["a"], 10)], ["", "", "", "", ""]);
  eq("hidden characters are removed", C("gua\u200Bran\u00ADtee\uFEFF \u202Eabc\u2066", 60), "guarantee abc");
  eq("tag characters are removed", C("a\u{E0041}\u{E0042}b", 60), "ab");
  eq("the flag of Scotland is kept", C("x \u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F} y", 60), "x \u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F} y");
  eq("control characters are removed", C("a\u0000b\u0007c\u001Bd\u007Fe\u0085f\u009Fg", 60), "abcdefg");
  eq("tabs and line breaks become one space", C("  one\t\ttwo\r\nthree \n four  ", 60), "one two three four");
  eq("three or more double quotes become one", C('say """hello"""" now ""ok""', 60), 'say "hello" now ""ok""');
  eq("cut to the maximum", C("abcdefghij", 4), "abcd");
  eq("no space is left at the cut", C("abc defg", 4), "abc");
  eq("half a character is never left at the cut", C("ab\u{1F600}cd", 3), "ab");
  eq("markup is kept as plain text", C("<script>alert(1)</script>", 60), "<script>alert(1)</script>");
  const messy = " \u200B<b>Hi</b>\u0001 \"\"\"there\"\"\"\n";
  eq("cleaning twice changes nothing more", C(C(messy, 60), 60), C(messy, 60));

  // The hidden-character list, written out once more here: single characters, then [first, last] ranges.
  const HIDDEN_ONE = [0x00AD, 0x034F, 0x061C, 0x115F, 0x1160, 0x17B4, 0x17B5, 0x200B, 0x200C, 0x200E, 0x200F, 0x3164, 0xFEFF, 0xFFA0];
  const HIDDEN_RANGES = [[0x180B, 0x180F], [0x202A, 0x202E], [0x2060, 0x206F], [0xE0000, 0xE007F], [0xE0100, 0xE01EF]];
  const isHidden = cp => HIDDEN_ONE.includes(cp) || HIDDEN_RANGES.some(([a, b]) => cp >= a && cp <= b);
  const everyPoint = [];
  for (let cp = 0x20; cp <= 0xFFFF; cp++) if (cp < 0xD800 || cp > 0xDFFF) everyPoint.push(cp);
  for (let cp = 0xE0000; cp <= 0xE01FF; cp++) everyPoint.push(cp);
  const hex = cp => "U+" + cp.toString(16).toUpperCase().padStart(4, "0");
  const removedBy = strip => cp => strip("a" + String.fromCodePoint(cp) + "b") === "ab";
  eq("stripHidden removes every character on the list and no other", everyPoint.filter(cp => removedBy(D.stripHidden)(cp) !== isHidden(cp)).map(hex), []);
  eq("the newly listed characters are removed", ["\u034F", "\u061C", "\u115F", "\u1160", "\u17B4", "\u17B5", "\u180B", "\u180D", "\u180E", "\u180F", "\u2060", "\u2064", "\u2069", "\u206A", "\u206F", "\u3164", "\uFFA0", "\u{E0100}", "\u{E0142}", "\u{E01EF}"].map(ch => C("gua" + ch + "ran" + ch + ch + "tee", 60)), Array(20).fill("guarantee"));
  eq("the emoji joiner and the emoji selector are kept", [C("\u{1F469}\u200D\u{1F4BB}", 60), C("\u2764\uFE0F", 60), C("\u{1F3F3}\uFE0F\u200D\u{1F308}", 60)], ["\u{1F469}\u200D\u{1F4BB}", "\u2764\uFE0F", "\u{1F3F3}\uFE0F\u200D\u{1F308}"]);
  const FLAGS = ["\u{E0065}\u{E006E}\u{E0067}", "\u{E0073}\u{E0063}\u{E0074}", "\u{E0077}\u{E006C}\u{E0073}"].map(region => "\u{1F3F4}\u{E0067}\u{E0062}" + region + "\u{E007F}");
  eq("the flags of England, Scotland and Wales are kept", FLAGS.map(f => D.stripHidden("x" + f + "\u{E0100}y\u2060")), FLAGS.map(f => "x" + f + "y"));
  eq("a flag with a hidden character pushed inside it is not kept", C("\u{1F3F4}\u{E0067}\u{E0062}\u2060\u{E0073}\u{E0063}\u{E0074}\u{E007F}", 60), "\u{1F3F4}");

  // The script keeps the same list in stripHidden_. When the script file is here, the two are compared.
  const scriptFile = path.join(root, "apps-script", "Code.gs");
  if (existsSync(scriptFile)) {
    const patternIn = (text, fn) => { const m = new RegExp("function " + fn + "\\(s\\) \\{\\s*(?:\\/\\/[^\\n]*\\n\\s*)*const HIDDEN = \\/(.+)\\/g;").exec(text); return m ? m[1] : ""; };
    const mine = patternIn(deskJs, "stripHidden"), theirs = patternIn(readFileSync(scriptFile, "utf8"), "stripHidden_");
    check("the hidden-character pattern is found in desk.js and in Code.gs", !!mine && !!theirs, JSON.stringify([mine, theirs]));
    if (mine && theirs) {
      const strip = source => s => s.replace(new RegExp(source, "g"), "");
      eq("desk.js and Code.gs remove exactly the same hidden characters", everyPoint.filter(cp => removedBy(strip(mine))(cp) !== removedBy(strip(theirs))(cp)).map(hex), []);
      eq("desk.js and Code.gs write the hidden-character pattern the same way", mine, theirs);
    }
  }
}

/* ===================== youtubeLink, linkLabel ===================== */
section("bench links");
{
  const Y = D.youtubeLink, UC = "UC" + "aB3_dE6-hI9kL2nO5qR8tU".slice(0, 22);
  eq("a handle address is kept", Y("https://www.youtube.com/@some.channel_1"), "https://www.youtube.com/@some.channel_1");
  eq("a channel id address is kept", Y("https://www.youtube.com/channel/" + UC), "https://www.youtube.com/channel/" + UC);
  eq("the query and fragment are dropped", Y("https://www.youtube.com/@handle?si=abc#top"), "https://www.youtube.com/@handle");
  eq("m.youtube.com is rewritten", Y("https://m.youtube.com/@handle"), "https://www.youtube.com/@handle");
  eq("youtube.com is rewritten", Y("https://youtube.com/@handle/"), "https://www.youtube.com/@handle/");
  eq("a video is not a channel", Y("https://www.youtube.com/watch?v=abcdefghijk"), "");
  eq("a short video link is not a channel", Y("https://youtu.be/abcdefghijk"), "");
  eq("a redirect is refused", Y("https://www.youtube.com/redirect?q=https://example.com"), "");
  eq("javascript: is refused", Y("javascript:alert(1)"), "");
  eq("javascript: dressed as a channel is refused", Y("javascript://www.youtube.com/@handle"), "");
  eq("data: is refused", Y("data:text/html,<script>alert(1)</script>"), "");
  eq("http: is refused", Y("http://www.youtube.com/@handle"), "");
  eq("a user name in the address is refused", Y("https://user:pw@www.youtube.com/@handle"), "");
  eq("a port is refused", Y("https://www.youtube.com:8443/@handle"), "");
  eq("a look-alike host is refused", Y("https://www.youtube.com.example.com/@handle"), "");
  eq("another site with the address inside is refused", Y("https://example.com/https://www.youtube.com/@handle"), "");
  eq("a longer path is refused", Y("https://www.youtube.com/@handle/videos"), "");
  eq("a handle that is too short is refused", Y("https://www.youtube.com/@ab"), "");
  eq("a space inside is refused", Y("https://www.youtube.com/@han dle"), "");
  eq("not a string is refused", [Y(null), Y(5), Y({})], ["", "", ""]);
  eq("the link text is the handle", D.linkLabel("https://www.youtube.com/@handle"), "@handle");
  eq("the link text is the channel id", D.linkLabel("https://www.youtube.com/channel/" + UC), UC);
  eq("no link text for anything else", [D.linkLabel(""), D.linkLabel("https://example.com/@handle"), D.linkLabel(null)], ["", "", ""]);
}

/* ===================== validateDesk ===================== */
// A made-up desk answer in the shape of SPEC-common section 2. Every test changes a fresh copy.
const REG = "a1b2c3d4e5f6";
function goodAnswer() {
  return {
    ok: true, service: "creator-newsroom-first-reader", schema: 1, version: "2026-11-20.1", model: "gemini-test-model",
    keySet: true, sheetReady: true,
    desk: {
      on: true, ready: true, problems: [], readAt: "2026-11-19T15:02:10Z", registerId: REG, counts: { red: 2, amber: 2 },
      brand: { name: "Made Up Kettles", sells: "Kettles, teapots", note: "A test desk.", reviewedBy: "" },
      disclosureWords: ["#ad", "#sponsored", "paid partnership", "this video is sponsored"],
      standards: [
        { lane: "amber", rule: "Superlative", covers: "Calls the product the best.", words: ["best", "#1"] },
        { lane: "red", rule: "Guarantee", covers: "Promises a result.", words: ["guarantee", "money back"] },
        { lane: "amber", rule: "Discount", covers: "Mentions a discount.", words: ["% off", "promo code"] },
        { lane: "red", rule: "Health claim", covers: "Says the product cures something.", words: ["cure", "heal"] }
      ],
      benchShown: true,
      bench: [
        { channel: "Tea With Sam", link: "https://www.youtube.com/@teawithsam", beat: "Tea", subscribers: "48.2K", checkedOn: "19 Nov 2026" },
        { channel: "Kettle Lab", link: "https://www.youtube.com/channel/UCaB3_dE6-hI9kL2nO5qR8tU", beat: "Reviews", subscribers: "1.2M", checkedOn: "2026-11-18" }
      ]
    }
  };
}
const change = fn => { const a = goodAnswer(); fn(a); return D.validateDesk(a); };

section("what a desk sends: the desk");
{
  const v = D.validateDesk(goodAnswer());
  eq("a good answer is understood", v.status, "ok");
  eq("a good answer is ready", v.desk.ready, true);
  eq("version, model and key are copied", [v.version, v.model, v.keySet], ["2026-11-20.1", "gemini-test-model", true]);
  eq("a version that is not a plain version is dropped", ["<b>9</b>", "Official release", 9, "v".repeat(41)].map(x => change(a => { a.version = x; }).version), ["", "", "", ""]);
  eq("keySet must be exactly true", ["true", 1, null].map(x => change(a => { a.keySet = x; }).keySet), [false, false, false]);
  eq("the register id is kept", v.desk.registerId, REG);
  eq("counts match the rules shown", v.desk.counts, { red: 2, amber: 2 });
  eq("red rules come first, in the owner's order", v.desk.standards.map(r => r.lane + ":" + r.rule), ["red:Guarantee", "red:Health claim", "amber:Superlative", "amber:Discount"]);
  eq("words to catch are kept as a list", v.desk.standards[0].words, ["guarantee", "money back"]);
  eq("the brand is copied", v.desk.brand, { name: "Made Up Kettles", sells: "Kettles, teapots", note: "A test desk.", reviewedBy: "" });
  eq("the bench is copied", v.desk.bench.map(r => r.channel + "|" + r.link + "|" + r.subscribers + "|" + r.checkedOn), ["Tea With Sam|https://www.youtube.com/@teawithsam|48.2K|19 Nov 2026", "Kettle Lab|https://www.youtube.com/channel/UCaB3_dE6-hI9kL2nO5qR8tU|1.2M|2026-11-18"]);
  eq("the same answer through JSON text", D.validateDesk(D.parseReply(JSON.stringify(goodAnswer()))), v);

  eq("not an object is no answer", [null, undefined, "x", 5, [], [goodAnswer()]].map(x => D.validateDesk(x).status), Array(6).fill("no_answer"));
  eq("ok:false is no answer", D.validateDesk({ ok: false, error: "server_error", message: "The health check failed." }).status, "no_answer");
  eq("a wrong service is another version", change(a => { a.service = "something-else"; }).status, "other_version");
  eq("schema 2 is another version", change(a => { a.schema = 2; }).status, "other_version");
  eq("schema \"1\" as text is another version", change(a => { a.schema = "1"; }).status, "other_version");
  eq("a missing schema is another version", change(a => { delete a.schema; }).status, "other_version");
  check("another version carries no desk", change(a => { a.schema = 2; }).desk === null);
  eq("no Sheet yet", change(a => { a.sheetReady = false; a.desk = null; }).status, "not_set_up");
  eq("desk null with a Sheet is no answer", change(a => { a.desk = null; }).status, "no_answer");
  eq("sheetReady missing is no answer", change(a => { delete a.sheetReady; }).status, "no_answer");
  const off = change(a => { a.desk.on = false; });
  eq("a desk switched off", [off.status, off.desk], ["off", null]);
  check("a desk switched off shows none of its content", !JSON.stringify(off).includes("Kettles") && !JSON.stringify(off).includes("Guarantee"));
  eq("\"on\" missing is no answer", change(a => { delete a.desk.on; }).status, "no_answer");

  const purple = change(a => { a.desk.standards[1].lane = "purple"; });
  eq("an unknown lane: the rule is dropped", purple.desk.standards.map(r => r.rule), ["Health claim", "Superlative", "Discount"]);
  eq("an unknown lane: the desk is not ready", [purple.status, purple.desk.ready, purple.desk.registerId], ["ok", false, ""]);
  check("an unknown lane: the page says why", purple.desk.problems.length === 1 && purple.desk.problems[0].startsWith("This page did not understand"));
  eq("lanes must be exactly red or amber", change(a => { a.desk.standards[0].lane = "Amber"; }).desk.ready, false);

  const long = change(a => { a.desk.standards[1].rule = "R".repeat(61); });
  eq("a 61-character rule name is cut to 60", [long.desk.standards[0].rule.length, long.desk.ready], [60, true]);
  eq("a 700-character covers text is cut to 600", change(a => { a.desk.standards[1].covers = "c".repeat(700); }).desk.standards[0].covers.length, 600);
  const many = n => change(a => { a.desk.standards = Array.from({ length: n }, (_, i) => ({ lane: i % 2 ? "amber" : "red", rule: "Rule " + i, covers: "Covers " + i, words: [] })); });
  eq("40 rules are fine", [many(40).desk.ready, many(40).desk.standards.length], [true, 40]);
  eq("41 rules: not ready", [many(41).desk.ready, many(41).desk.standards.length], [false, 40]);
  eq("more than 8,000 characters of rules: not ready", change(a => { a.desk.standards = Array.from({ length: 20 }, (_, i) => ({ lane: "red", rule: "Rule " + i, covers: "c".repeat(450), words: [] })); }).desk.ready, false);
  eq("zero rules: not ready", change(a => { a.desk.standards = []; }).desk.ready, false);
  eq("standards missing: not ready", change(a => { delete a.desk.standards; }).desk.ready, false);
  eq("a rule with no covers text is dropped and the desk is not ready", change(a => { a.desk.standards[0].covers = "  "; }).desk.ready, false);
  eq("a rule that is not an object: not ready", change(a => { a.desk.standards.push("red"); }).desk.ready, false);
  const reserved = change(a => { a.desk.standards.push({ lane: "amber", rule: "Hidden Characters", covers: "x", words: [] }); });
  eq("a reserved rule name is dropped and the desk is not ready", [reserved.desk.ready, reserved.desk.standards.length], [false, 4]);
  const wordy = change(a => { a.desk.standards[1].words = ["x", " Cure ", "cure", 7, "y".repeat(41), "z".repeat(40)].concat(Array.from({ length: 30 }, (_, i) => "word" + i)); }).desk.standards[0].words;
  eq("words to catch: cleaned, 2 to 40 characters, no repeats, at most 20", [wordy.slice(0, 3), wordy.length], [["Cure", "z".repeat(40), "word0"], 20]);
  eq("words that are not a list become none", change(a => { a.desk.standards[1].words = "cure, heal"; }).desk.standards[0].words, []);

  eq("a register id that is not 12 hex characters: not ready", ["a1b2c3", "a1b2c3d4e5f6a", "zzzzzzzzzzzz", 123456789012, null].map(id => change(a => { a.desk.registerId = id; }).desk.ready), [false, false, false, false, false]);
  const notReady = change(a => { a.desk.ready = false; a.desk.registerId = ""; a.desk.problems = ["Standards row 9 has text but no lane."]; });
  eq("a desk that says it is not ready", [notReady.status, notReady.desk.ready, notReady.desk.problems], ["ok", false, ["Standards row 9 has text but no lane."]]);
  eq("\"ready\" must be true or false", change(a => { a.desk.ready = "yes"; }).desk.ready, false);
  const probs = change(a => { a.desk.problems = Array.from({ length: 14 }, (_, i) => "Problem " + i + " " + "p".repeat(200)).concat([5, null]); });
  eq("problems: at most 10, each at most 160 characters", [probs.desk.problems.length, Math.max(...probs.desk.problems.map(p => p.length)), probs.desk.ready], [10, 160, true]);

  const links = ["https://www.youtube.com/watch?v=abcdefghijk", "https://www.youtube.com/redirect?q=https%3A%2F%2Fexample.com", "javascript:alert(1)", "data:text/html,<b>x</b>", "http://www.youtube.com/@handle", "https://m.youtube.com/@handle"];
  const bench = change(a => { a.desk.bench = links.map((link, i) => ({ channel: "Channel " + i, link, beat: "b", subscribers: "1K", checkedOn: "1 Nov 2026" })); });
  eq("bench links: a video, a redirect, javascript:, data: and http: become empty, m.youtube.com is rewritten", bench.desk.bench.map(r => r.link), ["", "", "", "", "", "https://www.youtube.com/@handle"]);
  eq("a bench row with a refused link still shows", bench.desk.bench.length, 6);
  eq("bench problems never stop reads", bench.desk.ready, true);
  const rows = change(a => { a.desk.bench = [
    { channel: "Example: channel name", link: "", beat: "", subscribers: "", checkedOn: "" },
    { channel: "EXAMPLE two", link: "", beat: "", subscribers: "", checkedOn: "" },
    { channel: "   ", link: "", beat: "", subscribers: "", checkedOn: "" },
    { channel: "Real One", link: 5, beat: "A beat that is much longer than thirty characters", subscribers: "about 5,000", checkedOn: "<19 Nov>", privateNote: "secret" },
    "not a row"
  ]; });
  eq("example rows and empty rows are skipped; odd cells are emptied", rows.desk.bench, [{ channel: "Real One", link: "", beat: "A beat that is much longer tha", subscribers: "", checkedOn: "" }]);
  eq("subscribers as typed, when they look like a count", ["48.2K", "310K", "1,234,567", "2 M", "12"].map(sub => change(a => { a.desk.bench[0].subscribers = sub; }).desk.bench[0].subscribers), ["48.2K", "310K", "1,234,567", "2 M", "12"]);
  eq("at most 50 bench rows", change(a => { a.desk.bench = Array.from({ length: 60 }, (_, i) => ({ channel: "Channel " + i })); }).desk.bench.length, 50);
  const hiddenBench = change(a => { a.desk.benchShown = false; });
  eq("bench not shown: no rows are kept even when rows are sent", [hiddenBench.desk.benchShown, hiddenBench.desk.bench], [false, []]);

  const dirty = change(a => {
    a.desk.brand.name = "<script>alert(1)</script>\u200BKet\u0000tles\u0007";
    a.desk.brand.note = "line one\nline\ttwo \"\"\"quoted\"\"\"";
    a.desk.brand.reviewedBy = "<img src=x onerror=alert(1)>";
    a.desk.standards[1].covers = "Pro\u00ADmises\u202E a result.\u0085";
  });
  eq("markup stays plain text; hidden and control characters are removed", [dirty.desk.brand.name, dirty.desk.brand.note, dirty.desk.brand.reviewedBy, dirty.desk.standards[0].covers],
    ["<script>alert(1)</script>Kettles", "line one line two \"quoted\"", "<img src=x onerror=alert(1)>", "Promises a result."]);
  eq("brand fields are cut to 60, 300, 200 and 120", (b => [b.name.length, b.sells.length, b.note.length, b.reviewedBy.length])(change(a => { a.desk.brand = { name: "n".repeat(99), sells: "s".repeat(999), note: "o".repeat(999), reviewedBy: "r".repeat(999) }; }).desk.brand), [60, 300, 200, 120]);
  eq("a brand that is not an object becomes empty", change(a => { a.desk.brand = "Kettles"; }).desk.brand, { name: "", sells: "", note: "", reviewedBy: "" });

  const extra = change(a => { a.key = "AIza-made-up"; a.sheetId = "sheet-id"; a.desk.sheetUrl = "https://docs.google.com/x"; a.desk.bench[0].privateNote = "private words"; a.desk.standards[0].html = "<b>x</b>"; a.desk.brand.logo = "https://example.com/x.png"; });
  check("extra unknown fields are ignored", extra.status === "ok" && extra.desk.ready && !/made-up|sheet-id|docs\.google|private words|<b>x|example\.com/.test(JSON.stringify(extra)));
  const polluted = D.validateDesk(D.parseReply('{"ok":true,"service":"creator-newsroom-first-reader","schema":1,"sheetReady":true,"__proto__":{"polluted":1},"desk":{"on":true,"ready":true,"__proto__":{"polluted":1},"constructor":{"prototype":{"polluted":1}}}}'));
  check("nothing sent can reach the page's own objects", ({}).polluted === undefined && polluted.status === "ok" && polluted.desk.ready === false);

  eq("no disclosure words: the four defaults are used", change(a => { a.desk.disclosureWords = []; }).desk.disclosureWords, ["#ad", "#sponsored", "paid partnership", "this video is sponsored"]);
  eq("disclosure words that are not a list: the defaults", change(a => { a.desk.disclosureWords = "#ad"; }).desk.disclosureWords, D.DEFAULT_DISCLOSURE);
  eq("disclosure words: 2 to 40 characters, no repeats, at most 12", change(a => { a.desk.disclosureWords = ["#", "#ad", "#AD", "w".repeat(50)].concat(Array.from({ length: 20 }, (_, i) => "#tag" + i)); }).desk.disclosureWords.length, 12);
  eq("a time that is not a time is dropped", ["yesterday", "2026-11-19 15:02", 5, "2026-99-99T99:99:99Z"].map(t => change(a => { a.desk.readAt = t; }).desk.readAt), ["", "", "", ""]);

  eq("parseReply: not JSON, not an object, or too long is no answer", [D.parseReply("<html>Sign in</html>"), D.parseReply("[1,2]"), D.parseReply("null"), D.parseReply("\"text\""), D.parseReply(5), D.parseReply('{"ok":true,"pad":"' + "x".repeat(300000) + '"}')], [null, null, null, null, null, null]);
  eq("parseReply: an object is read", D.parseReply('{"ok":true}'), { ok: true });
}

/* ===================== validateRead ===================== */
function goodRead() {
  return { ok: true, lane: "amber", flags: [{ lane: "amber", label: "Superlative", quote: "the best kettle", reason: "Says it is the best.", quoteFound: true }],
    model: "gemini-test-model", tokensIn: 100, tokensOut: 20, seconds: 1.2, logged: true, registerId: REG, counts: { red: 2, amber: 2 } };
}
const changeRead = fn => { const a = goodRead(); fn(a); return D.validateRead(a); };

section("what a desk sends: a read");
{
  eq("a good read", D.validateRead(goodRead()), { ok: true, lane: "amber", flags: [{ lane: "amber", label: "Superlative", quote: "the best kettle", reason: "Says it is the best.", found: true, byScript: false }], registerId: REG });
  eq("not an object is not a read", [null, "x", [], 5].map(x => D.validateRead(x)), Array(4).fill({ ok: false, why: "unreachable" }));
  eq("an error code is passed on", D.validateRead({ ok: false, error: "daily_limit", message: "x" }), { ok: false, why: "daily_limit" });
  eq("an error that is not a code is not passed on", [D.validateRead({ ok: false, error: "<b>x</b>" }), D.validateRead({ ok: false, error: 5 }), D.validateRead({ ok: false })], Array(3).fill({ ok: false, why: "unreachable" }));
  eq("an unknown lane is not a read", changeRead(a => { a.lane = "purple"; }), { ok: false, why: "unreachable" });
  eq("a lane taken from Object's own names is not a read", changeRead(a => { a.lane = "constructor"; }), { ok: false, why: "unreachable" });
  eq("flags that are not a list are not a read", changeRead(a => { a.flags = "none"; }), { ok: false, why: "unreachable" });
  eq("a read with no register id is not a read", [changeRead(a => { delete a.registerId; }), changeRead(a => { a.registerId = "abc"; })], Array(2).fill({ ok: false, why: "unreachable" }));
  eq("green with a red flag is red", changeRead(a => { a.lane = "green"; a.flags = [{ lane: "red", label: "Guarantee", quote: "guaranteed", reason: "r" }]; }).lane, "red");
  eq("green with no flags is green", changeRead(a => { a.lane = "green"; a.flags = []; }).lane, "green");
  eq("flags without an amber or red lane are dropped", changeRead(a => { a.flags = [{ lane: "green", label: "x" }, null, "x", { lane: "amber", label: "Kept" }]; }).flags.map(f => f.label), ["Kept"]);
  const hid = changeRead(a => { a.flags.unshift({ lane: "amber", label: "Hidden characters", quote: "", reason: "Invisible characters were removed from the draft before it was read.", quoteFound: null }); });
  eq("the script's own hidden-characters flag is marked", hid.flags.map(f => f.byScript), [true, false]);
  eq("words the script did not find are marked", changeRead(a => { a.flags[0].quoteFound = false; }).flags[0].found, false);
  const dirtyRead = changeRead(a => { a.flags[0] = { lane: "red", label: "<b>Guarantee</b>\u200B", quote: "guar\u0000anteed\n result", reason: "<script>x</script> " + "r".repeat(500) }; });
  eq("a reader's words are cleaned and stay plain text", [dirtyRead.flags[0].label, dirtyRead.flags[0].quote, dirtyRead.flags[0].reason.length], ["<b>Guarantee</b>", "guaranteed result", 400]);
  eq("at most 20 flags", changeRead(a => { a.flags = Array.from({ length: 50 }, () => ({ lane: "amber", label: "L", quote: "", reason: "" })); }).flags.length, 20);
  eq("why a read failed, in the page's words", ["daily_limit", "too_long", "desk_off", "register_problem", "not_configured", "model_gone", "busy", "unreachable", "constructor", undefined].map(D.readerWhy), [
    "Today's limit of reads on this desk is used up", "The draft is over 6,000 characters, more than the reader is sent", "This desk is switched off", "The desk's Sheet needs fixing",
    "This desk has no key yet", "The Gemini model this desk uses is no longer offered", "The desk's reader did not answer", "The desk's reader did not answer", "The desk's reader did not answer", "The desk's reader did not answer"]);
}

/* ===================== quickCheck ===================== */
const DESK = D.validateDesk(goodAnswer()).desk;
const deskWith = (words, lane) => ({ disclosureWords: D.DEFAULT_DISCLOSURE, standards: [{ lane: lane || "amber", rule: "Test rule", covers: "Covers.", words }] });
const labels = r => r.hits.map(h => h.label);
const catches = (phrase, text) => { const h = D.quickCheck("#ad " + text, deskWith([phrase])).hits; return h.length ? h[0].match : null; };

section("the quick check");
{
  const Q = D.quickCheck;
  eq("#ad present: no disclosure hit", labels(Q("#ad I love this kettle.", DESK)), []);
  eq("#ad present: green", Q("#ad I love this kettle.", DESK).lane, "green");
  eq("#ad absent: a red hit with no match", Q("I love this kettle.", DESK), { lane: "red", hits: [{ lane: "red", label: "Disclosure missing", match: null, by: "quick check", detail: "The draft has none of: #ad, #sponsored, paid partnership, this video is sponsored." }] });
  eq("#adidas does not count as #ad", labels(Q("Wearing my #adidas today.", DESK)), ["Disclosure missing"]);
  eq("#ads and #ad2 do not count as #ad", [labels(Q("#ads", DESK)), labels(Q("#ad2", DESK))], [["Disclosure missing"], ["Disclosure missing"]]);
  eq("#AD. at the end of a sentence counts", labels(Q("Thanks for watching #AD.", DESK)), []);
  eq("a disclosure in any capitals, across a line break", labels(Q("This is a Paid\nPartnership with a kettle maker.", DESK)), []);
  eq("a desk with no disclosure words still checks the four defaults", [labels(Q("hello", {})), labels(Q("#sponsored hello", {})), labels(Q("hello", null))], [["Disclosure missing"], [], ["Disclosure missing"]]);
  eq("the owner's own disclosure words are used", [labels(Q("#ad hello", { disclosureWords: ["#werbung"], standards: [] })), labels(Q("#Werbung hello", { disclosureWords: ["#werbung"], standards: [] }))], [["Disclosure missing"], []]);
  const disclosed = (word, text) => labels(Q(text, { disclosureWords: [word], standards: [] })).length === 0;
  eq("\"ad\" is not found inside \"made\", \"ads\", \"adult\" or \"3ad\"", ["I made this.", "Two ads.", "An adult kettle.", "3ad"].map(t => disclosed("ad", t)), [false, false, false, false]);
  eq("\"ad\" on its own counts, wherever it is", ["ad", "Ad: a kettle.", "This is an ad.", "(ad)", "an\nAD\nhere", "kettle-ad!"].map(t => disclosed("ad", t)), [true, true, true, true, true, true]);
  eq("\"sponsored\" is not found inside \"unsponsored\" or \"sponsoredish\"", ["This is unsponsored.", "Sort of sponsoredish.", "Sponsored by nobody."].map(t => disclosed("sponsored", t)), [false, false, true]);
  eq("a disclosure phrase must stand on its own at both ends", ["A paid partnership.", "An unpaid partnership.", "Paid partnerships.", "prepaid partnership"].map(t => disclosed("paid partnership", t)), [true, false, false, false]);
  eq("\"#ad\" straight after a word still counts, and never inside a longer tag", ["kettle#ad", "#ad", "#ad_", "#adidas", "#adé"].map(t => disclosed("#ad", t)), [true, true, true, false, false]);
  eq("letters with accents and digits count at a disclosure word's edges", ["caféad", "éad", "adé", "ad1", "1 ad 1"].map(t => disclosed("ad", t)), [false, false, false, false, true]);
  eq("a disclosure word that ends in a symbol is only held at the end that has a letter", ["this is (ad) here", "this is bad) here", "(ad)vert"].map(t => disclosed("ad)", t)), [true, false, true]);

  eq("\"guarantee\" catches \"guaranteed\"", catches("guarantee", "It is guaranteed to work."), "guaranteed");
  eq("\"guarantee\" catches \"Guarantees\" and \"guaranteeing\"", [catches("guarantee", "Guarantees for all."), catches("guarantee", "I am guaranteeing it.")], ["Guarantees", "guaranteeing"]);
  eq("\"best\" does not catch \"bestseller\"", catches("best", "A bestseller in my house."), null);
  eq("\"best\" does not catch \"asbestos\"", catches("best", "No asbestos here."), null);
  eq("\"best\" catches \"the best.\"", catches("best", "Simply the best."), "best");
  eq("\"cure\" catches \"cured\" and \"cures\" but not \"secure\" or \"curable\"", ["It cured me.", "It cures all.", "A secure lid.", "Is it curable?"].map(t => catches("cure", t)), ["cured", "cures", null, null]);
  eq("\"% off\" works", [catches("% off", "Get 20% off today."), catches("% off", "Get 20% offer.")], ["% off", null]);
  eq("\"#1\" works", [catches("#1", "The #1 kettle."), catches("#1", "Ranked #10."), catches("#1", "Ranked #1st.")], ["#1", null, null]);
  eq("a phrase with regex characters is literal", [catches("(.*)+$", "anything at all"), catches("(.*)+$", "type (.*)+$ here")], [null, "(.*)+$"]);
  eq("other pattern characters are literal too", [catches(".*", "anything"), catches("a|b", "a"), catches("a|b", "say a|b now"), catches("[a-z]+", "abc"), catches("\\d\\d", "12"), catches("why?", "wh"), catches("^start", "start")], [null, null, "a|b", null, null, null, null]);
  eq("straight and curly quotes are the same", [catches("don't wait", "Don\u2019t wait!"), catches("don\u2019t wait", "don't wait"), catches("the \"real\" deal", "the \u201Creal\u201D deal")], ["Don\u2019t wait", "don't wait", "the \u201Creal\u201D deal"]);
  eq("a line break inside a phrase matches any white space", [catches("money\nback", "Money back if not."), catches("money back", "money\n  back"), catches("money back", "moneyback")], ["Money back", "money\n  back", null]);
  eq("letters with accents count as letters", [catches("caf\u00E9", "caf\u00E9s open"), catches("cure", "\u00E9cure")], ["caf\u00E9s", null]);
  eq("a space in a phrase also matches a hyphen or a dash", [catches("pain free", "A pain-free kettle."), catches("money back", "Money-back if not."), catches("pain free", "pain\u2010free"), catches("pain free", "pain\u2011free"), catches("pain free", "pain\u2013free"), catches("pain free", "pain - free"), catches("money back", "money\u2013 back")],
    ["pain-free", "Money-back", "pain\u2010free", "pain\u2011free", "pain\u2013free", "pain - free", "money\u2013 back"]);
  eq("a space in a phrase still needs something there, and other marks do not count", [catches("pain free", "painfree"), catches("pain free", "pain_free"), catches("pain free", "pain/free"), catches("pain free", "pain.free")], [null, null, null, null]);
  eq("a hyphen typed in a phrase is still only a hyphen", [catches("pain-free", "pain-free"), catches("pain-free", "pain free")], ["pain-free", null]);
  eq("a phrase at the very start of the draft is found, with its place", (h => [h.match, h.at, h.end])(Q("Best kettle #ad", deskWith(["best"])).hits[0]), ["Best", 0, 4]);
  eq("the character before a phrase is never part of the match", ["(best)", " best", "\nbest", "\u{1F600}best", "\u2014best"].map(t => (h => (h ? h.match + "@" + h.at + "-" + h.end : null))(Q("#ad " + t, deskWith(["best"])).hits[0])), ["best@5-9", "best@5-9", "best@5-9", "best@6-10", "best@5-9"]);
  eq("a phrase that starts with a symbol needs nothing before it", ["20% off", "x% off"].map(t => catches("% off", t)), ["% off", "% off"]);
  eq("phraseMatch says where the words are", [D.phraseMatch("guarantee", "It is guaranteed."), D.phraseMatch("guarantee", "none here"), D.phraseMatch("", "x"), D.phraseMatch("best", null)], [{ match: "guaranteed", at: 6, end: 16 }, null, null, null]);
  check("a phrase's pattern keeps its words in group 1", (m => !!m && m[0] === " Cured" && m[1] === "Cured")(D.phraseRegex("cure").exec("It Cured me")));
  const both = Q("#ad It will cure and heal you. Guaranteed, money back.", DESK);
  eq("one hit per rule: the first phrase in the list that matches", both.hits.map(h => h.label + ":" + h.match), ["Guarantee:Guaranteed", "Health claim:cure"]);
  const order = Q("The best kettle, guaranteed. 20% off.", DESK);
  eq("red rules, then the disclosure, then amber rules", labels(order), ["Guarantee", "Disclosure missing", "Superlative", "Discount"]);
  eq("each hit says where it is", order.hits.filter(h => h.match).map(h => "The best kettle, guaranteed. 20% off.".slice(h.at, h.end)), ["guaranteed", "best", "% off"]);
  eq("each hit carries what the rule covers", order.hits[0].detail, "Promises a result.");
  eq("lanes: red if any red hit, amber if only amber, green if none", [order.lane, Q("#ad the best kettle", DESK).lane, Q("#ad a kettle", DESK).lane], ["red", "amber", "green"]);
  eq("a draft that is not text is treated as empty", labels(Q(null, DESK)), ["Disclosure missing"]);
  check("no phrase is ever built into a pattern that fails", ["(", ")", "[", "]", "{", "}", "\\", "^$", "a{2", "*+?", "\uD800x"].every(p => D.phraseRegex(p) instanceof RegExp));
}

/* ===================== findQuote, mergeReads, spansFor ===================== */
const read = (lane, flags) => D.validateRead({ ok: true, lane, flags, registerId: REG });
const down = { ok: false, why: "unreachable" };

section("the two reads together");
{
  const M = D.mergeReads;
  eq("findQuote: any case, any white space, either kind of quote", [D.findQuote("It\u2019s  the\nBEST kettle", "it's the best"), D.findQuote("abc", "x"), D.findQuote("abc", ""), D.findQuote("a.c abc", "a.c"), D.findQuote("abc", null)], [{ at: 0, end: 14 }, null, null, { at: 0, end: 3 }, null]);

  const clean = "#ad A nice kettle.", kwClean = D.quickCheck(clean, DESK);
  eq("waiting for the reader: no lane", M(clean, kwClean, null, REG), { state: "waiting", lane: null, marks: [] });
  eq("the reader failed and the quick check found nothing: amber, never green", [M(clean, kwClean, down, REG).state, M(clean, kwClean, down, REG).lane], ["failed", "amber"]);
  eq("every failure code: never green", ["daily_limit", "too_long", "desk_off", "register_problem", "not_configured", "model_gone", "busy", "unreachable"].map(why => M(clean, kwClean, { ok: false, why }, REG).lane), Array(8).fill("amber"));
  const redDraft = "A kettle, guaranteed.", kwRed = D.quickCheck(redDraft, DESK);
  eq("the reader failed and the quick check found red: red", M(redDraft, kwRed, down, REG).lane, "red");
  eq("both green: green", [M(clean, kwClean, read("green", []), REG).state, M(clean, kwClean, read("green", []), REG).lane], ["read", "green"]);
  eq("the stricter lane stands: quick check amber, reader red", M("#ad the best kettle", D.quickCheck("#ad the best kettle", DESK), read("red", [{ lane: "red", label: "Health claim", quote: "kettle", reason: "r" }]), REG).lane, "red");
  eq("the stricter lane stands: quick check red, reader green", M(redDraft, kwRed, read("green", []), REG).lane, "red");
  eq("the stricter lane stands: quick check green, reader amber", M(clean, kwClean, read("amber", [{ lane: "amber", label: "Superlative", quote: "nice kettle", reason: "r" }]), REG).lane, "amber");
  eq("the reader says green with a red flag: red", M(clean, kwClean, read("green", [{ lane: "red", label: "Guarantee", quote: "nice", reason: "r" }]), REG).lane, "red");

  const twice = "#ad This is the best kettle. Honestly the best one.", kwTwice = D.quickCheck(twice, DESK);
  const samePlace = M(twice, kwTwice, read("amber", [{ lane: "amber", label: "superlative", quote: "the best kettle", reason: "Says best." }]), REG);
  eq("the same rule at the same place is shown once, credited to both", samePlace.marks.map(m => m.label + "|" + m.match + "|" + m.by), ["Superlative|best|quick check and reader"]);
  const otherPlace = M(twice, kwTwice, read("amber", [{ lane: "amber", label: "Superlative", quote: "the best one", reason: "Says best again." }]), REG);
  eq("the same rule at another place is shown twice", otherPlace.marks.map(m => m.label + "|" + m.match + "|" + m.by), ["Superlative|best|quick check", "Superlative|the best one|reader"]);
  const otherRule = M(twice, kwTwice, read("red", [{ lane: "red", label: "Guarantee", quote: "the best kettle", reason: "r" }]), REG);
  eq("another rule at the same place is shown twice", otherRule.marks.map(m => m.label + "|" + m.by), ["Superlative|quick check", "Guarantee|reader"]);
  const stricterMark = M(twice, kwTwice, read("red", [{ lane: "red", label: "Superlative", quote: "best kettle", reason: "r" }]), REG);
  eq("a merged mark takes the stricter lane", [stricterMark.marks.length, stricterMark.marks[0].lane, stricterMark.lane], [1, "red", "red"]);
  const noAd = "A nice kettle.", kwNoAd = D.quickCheck(noAd, DESK);
  eq("both say the disclosure is missing: shown once", M(noAd, kwNoAd, read("red", [{ lane: "red", label: "Disclosure missing", quote: "", reason: "No disclosure." }]), REG).marks.map(m => m.label + "|" + m.by), ["Disclosure missing|quick check and reader"]);
  const hidden = M(clean, kwClean, read("green", [{ lane: "amber", label: "Hidden characters", quote: "", reason: "Invisible characters were removed from the draft before it was read.", quoteFound: null }]), REG);
  eq("the script's hidden-characters flag is tagged \"before the reader\" and cannot be green", [hidden.lane, hidden.marks.map(m => m.label + "|" + m.by)], ["amber", ["Hidden characters|before the reader"]]);
  const lost = M(clean, kwClean, read("amber", [{ lane: "amber", label: "Superlative", quote: "greatest kettle", reason: "r", quoteFound: false }]), REG);
  eq("words the script did not find are marked missing", [lost.marks[0].missing, D.spansFor(clean, lost.marks)], [true, []]);

  const changed = M(clean, kwClean, read("green", []), "ffffffffffff");
  eq("a different register id: not read, no lane", [changed.state, changed.lane], ["changed", null]);
  eq("no register id on the page: not read", [M(clean, kwClean, read("green", []), "").state, M(clean, kwClean, read("green", []), undefined).state, M(clean, kwClean, read("green", [])).lane], ["changed", "changed", null]);
  eq("a different register id drops the reader's marks", M(twice, kwTwice, read("red", [{ lane: "red", label: "Guarantee", quote: "kettle", reason: "r" }]), "ffffffffffff").marks.map(m => m.by), ["quick check"]);
  check("no way to green without a read the page understood", [null, down, { ok: false, why: "daily_limit" }].every(fr => M(clean, kwClean, fr, REG).lane !== "green") && M(clean, kwClean, read("green", []), "000000000000").lane !== "green");

  const seller = "#ad A bestseller, and the best kettle.", kwSeller = D.quickCheck(seller, DESK);
  eq("the underline is where the quick check matched, not an earlier look-alike", D.spansFor(seller, M(seller, kwSeller, null, REG).marks).map(s => seller.slice(s.at, s.end) + "@" + s.at), ["best@26"]);
  const spans = D.spansFor(twice, otherPlace.marks);
  eq("spans are in reading order with their numbers", spans.map(s => twice.slice(s.at, s.end) + ":" + s.lane + ":" + s.nums.join(",")), ["best:amber:1", "the best one:amber:2"]);
  const overlap = D.spansFor(twice, otherRule.marks);
  eq("the same words flagged twice: one underline, both numbers, the stricter colour", overlap.map(s => twice.slice(s.at, s.end) + ":" + s.lane + ":" + s.nums.join(",")), ["best:red:1,2"]);
  eq("a mark with a place outside the draft is not underlined", D.spansFor("short", [{ lane: "red", label: "x", match: "y", at: 3, end: 99 }, { lane: "red", label: "x", match: "y", at: -1, end: 2 }]), []);
  check("spans never overlap", (() => { const s = D.spansFor(twice, stricterMark.marks.concat(otherPlace.marks, otherRule.marks)); return s.every((x, i) => i === 0 || s[i - 1].end <= x.at); })());
}

/* ===================== parseStarter, parseVersion ===================== */
section("the script file");
{
  const code = 'function setup() {}\nconst VERSION = "2026-11-20.1";\nconst SCHEMA_VERSION = 1;\nconst STARTER = /*STARTER*/[\n {"lane":"red","rule":"Guarantee","covers":"Promises a result.","words":"guarantee, risk free"},\n {"lane":"amber","rule":"Superlative","covers":"Calls it the best \\u2018ever\\u2019.","words":""}\n]/*STARTER*/;\n';
  eq("the starter rows are cut out and read", D.parseStarter(code), [{ lane: "red", rule: "Guarantee", covers: "Promises a result.", words: "guarantee, risk free" }, { lane: "amber", rule: "Superlative", covers: "Calls it the best \u2018ever\u2019.", words: "" }]);
  eq("no markers, one marker, bad JSON, not a list, no rows: nothing", [D.parseStarter("const STARTER = [];"), D.parseStarter("/*STARTER*/[]"), D.parseStarter("/*STARTER*/[{lane:'red'}]/*STARTER*/"), D.parseStarter('/*STARTER*/{"lane":"red"}/*STARTER*/'), D.parseStarter("/*STARTER*/[]/*STARTER*/"), D.parseStarter(null)], [null, null, null, null, null, null]);
  eq("starter rows are cleaned like anything else", D.parseStarter('/*STARTER*/[{"lane":"purple","rule":"x","covers":"y","words":""},{"lane":"red","rule":"<b>R</b>\\u200b","covers":"C\\u0000","words":["a b","c"],"extra":1}]/*STARTER*/'), [{ lane: "red", rule: "<b>R</b>", covers: "C", words: "a b, c" }]);
  eq("the version line is read", D.parseVersion(code), "2026-11-20.1");
  eq("no version line: empty", [D.parseVersion("// change VERSION below\nvar x = 1;"), D.parseVersion('const VERSION = "<b>";'), D.parseVersion(null)], ["", "", ""]);
  const real = path.join(root, "apps-script", "Code.gs");
  if (existsSync(real)) {
    const text = readFileSync(real, "utf8"), rows = D.parseStarter(text);
    console.log("  note (not a check): apps-script/Code.gs now has " + (rows ? rows.length + " starter rows" : "no readable STARTER block") + " and version " + (D.parseVersion(text) || "(none found)") + ".");
  }
}

/* ===================== the page's own sentences ===================== */
section("the page's own sentences");
{
  const desk = D.validateDesk(goodAnswer()).desk;
  eq("the brand line: the page's words, then the typed name on its own", D.brandLine(desk), { before: "Brand, as typed by the desk's owner: ", typed: "Made Up Kettles", after: "" });
  eq("no brand name", D.brandLine({ brand: { name: "" } }), { before: "This desk has no brand name yet.", typed: "", after: "" });
  eq("the owner's note gets a label", D.noteLine(desk), { before: "Note typed by the desk's owner: ", typed: "A test desk.", after: "" });
  eq("no note: no line at all", D.noteLine({ brand: { note: "" } }), { before: "", typed: "", after: "" });
  check("the Sheet line", /^Read from the owner's Sheet at \d\d:\d\d:\d\d\. 2 red and 2 amber rules in use, plus the built-in disclosure rule\.$/.test(D.sheetLine(desk)), D.sheetLine(desk));
  eq("the Sheet line with no time", D.sheetLine({ ready: true, readAt: "", counts: { red: 7, amber: 4 } }), "Read from the owner's Sheet. 7 red and 4 amber rules in use, plus the built-in disclosure rule.");
  eq("the Sheet line on a desk that is not ready says \"found\", not \"in use\"", D.sheetLine({ ready: false, readAt: "", counts: { red: 7, amber: 4 } }), "Read from the owner's Sheet. 7 red and 4 amber rules found, plus the built-in disclosure rule.");
  eq("the local time is the script's time", D.localTime("2026-11-19T15:02:10Z"), (d => [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2, "0")).join(":"))(new Date("2026-11-19T15:02:10Z")));
  eq("the two headings for problems", [D.problemsHead({ ready: false }), D.problemsHead({ ready: true })], ["The Sheet needs fixing before this desk can read drafts:", "Notes from the Sheet:"]);
  eq("nobody reviewed", D.reviewedLine(desk), { before: "Starter or unreviewed rules. Nobody has told this page they were reviewed.", typed: "", after: "" });
  eq("reviewed, as typed", D.reviewedLine({ brand: { reviewedBy: "Sam Lee, counsel, 3 Nov 2026" } }), { before: "Reviewed by, as typed by the desk's owner: ", typed: "Sam Lee, counsel, 3 Nov 2026", after: " Not checked by anyone else." });
  check("no quotation marks are put around typed text any more", [D.brandLine(desk), D.noteLine(desk), D.reviewedLine({ brand: { reviewedBy: "x" } })].every(l => !/"/.test(l.before + l.after)));
  eq("the version line", [D.versionLine("2026-11-19.2", "2026-11-20.1"), D.versionLine("2026-11-20.1", "2026-11-20.1"), D.versionLine("", "2026-11-20.1"), D.versionLine("2026-11-19.2", "")], ["This desk runs code version 2026-11-19.2. The current version is 2026-11-20.1.", "", "", ""]);
  eq("the built-in rule's text", D.disclosureDetail(desk.disclosureWords), "The draft has none of: #ad, #sponsored, paid partnership, this video is sponsored.");
  eq("the three lanes, in the page's own words", D.LANE_WORDS, { green: "Nothing flagged. A person still decides.", amber: "Flagged. Someone should look before this goes out.", red: "Stop. Take this to whoever signs off legal questions for this brand." });
  const kw = { lane: "green", hits: [] }, fr = read("amber", []);
  eq("who said what, after a read", D.readLine(kw, fr, { state: "read", lane: "amber" }), "Quick check: green. This desk's reader: amber. The stricter lane stands.");
  eq("who said what, after a failure", D.readLine(kw, { ok: false, why: "daily_limit" }, { state: "failed", lane: "amber" }), "Quick check: green. Today's limit of reads on this desk is used up, so a person should read this one.");
  eq("nothing more is said while waiting or when the standards changed", [D.readLine(kw, null, { state: "waiting" }), D.readLine(kw, fr, { state: "changed" })], ["", ""]);
  eq("the big word", [D.laneWord({ state: "waiting", lane: null }), D.laneWord({ state: "changed", lane: null }), D.laneWord({ state: "read", lane: "green" }), D.laneWord({ state: "failed", lane: "amber" })], ["Reading...", "Not read", "green", "amber"]);
  const aMark = { lane: "amber", label: "Superlative", match: "best", by: "quick check" };
  eq("the sentence under it", [D.verdictText({ state: "waiting", lane: null, marks: [] }), D.verdictText({ state: "changed", lane: null, marks: [] }), D.verdictText({ state: "read", lane: "red", marks: [] }), D.verdictText({ state: "read", lane: "amber", marks: [] }), D.verdictText({ state: "read", lane: "green", marks: [] })],
    ["The quick check has read it. This desk's reader is reading it now.", "The standards changed while you were reading. Press Read again, then send the draft again.", D.LANE_WORDS.red, D.LANE_WORDS.amber, D.LANE_WORDS.green]);
  eq("not read and nothing marked: the page says it was not read, not that it was flagged", [D.verdictText({ state: "failed", lane: "amber", marks: [] }), D.verdictText({ state: "failed", lane: "amber" }), D.NOT_READ_WORDS], Array(3).fill("Not read by this desk's reader. Someone should look before this goes out."));
  eq("not read but marked by the quick check: the lane's own sentence", [D.verdictText({ state: "failed", lane: "amber", marks: [aMark] }), D.verdictText({ state: "failed", lane: "red", marks: [aMark] })], [D.LANE_WORDS.amber, D.LANE_WORDS.red]);
  eq("the same, through mergeReads", [D.verdictText(D.mergeReads("#ad A nice kettle.", D.quickCheck("#ad A nice kettle.", desk), { ok: false, why: "unreachable" }, REG)), D.verdictText(D.mergeReads("#ad the best kettle", D.quickCheck("#ad the best kettle", desk), { ok: false, why: "unreachable" }, REG)), D.verdictText(D.mergeReads("A kettle.", D.quickCheck("A kettle.", desk), { ok: false, why: "unreachable" }, REG))],
    ["Not read by this desk's reader. Someone should look before this goes out.", "Flagged. Someone should look before this goes out.", "Stop. Take this to whoever signs off legal questions for this brand."]);
  eq("what looks like an API key in a draft", ["" + FAKE_AIZA + "", "my key is " + FAKE_AIZA + " ok", "key=" + FAKE_AIZA + "", "line one\n" + FAKE_AQ + "", "(AQ." + "Ab8_made.up-key-for-this-test)"].map(D.looksLikeKey), [true, true, true, true, true]);
  eq("what does not look like a key", ["#ad A nice kettle.", "AIza", "AIzaShort-0123456789", "AQ. is a clue in the crossword", "AQ.short", "MOS" + FAKE_AIZA + "", "F" + FAKE_AQ + "", "aiza" + "x".repeat(40), "", null, undefined, 7].map(D.looksLikeKey), Array(12).fill(false));
  eq("the wording when a draft has a key in it", D.KEY_IN_DRAFT, "This text has what looks like an API key in it, so it was not sent. Never paste a key into this page.");
  eq("the two bench sentences", [D.BENCH_CAPTION, D.BENCH_HIDDEN], ["Typed into the desk's Sheet. Being listed here does not mean a channel works with this brand or has agreed to anything. Numbers are as typed on the date shown.", "This desk's bench is not shown here."]);
  eq("a mark's words", [D.markText({ match: "guaranteed", detail: "Promises a result." }), D.markText({ match: "x", missing: true, detail: "Why." }), D.markText({ match: null, detail: "Why." })], [" (\"guaranteed\"). Promises a result.", " (\"x\", words not found in the draft). Why.", ". Why."]);
  eq("the messages for a desk that cannot be shown", [D.DESK_MESSAGES.opening, D.DESK_MESSAGES.no_answer, D.DESK_MESSAGES.other_version, D.DESK_MESSAGES.not_set_up, D.DESK_MESSAGES.off], [
    "Opening the desk...",
    "This desk did not answer. If it is yours: open your web app address in a private window. You should see text starting {\"ok\":true. If Google asks you to sign in, set Who has access to Anyone in Deploy > Manage deployments. If the address is wrong, copy the Web app URL again.",
    "This desk runs a different version of the code. If it is yours: paste the current code over the old, save, then Deploy > Manage deployments > edit > New version > Deploy.",
    "This desk is not set up yet. If it is yours: run setup in the script editor.",
    "This desk is switched off by its owner."]);
}

/* ===================== a static scan of desk.js, desk.html and the appended styles ===================== */
// desk.html as a reader sees it: comments removed, links and bold read straight through, every other tag a gap,
// entities decoded, white space collapsed.
const pageText = deskHtml.replace(/<!--[\s\S]*?-->/g, " ").replace(/<\/?(?:a|b)\b[^>]*>/g, "").replace(/<[^>]+>/g, " ")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ");
const CSP = "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://script.google.com https://script.googleusercontent.com; img-src 'self' data:; base-uri 'none'; form-action 'none'\">";

section("a static scan");
{
  for (const word of ["innerHTML", "outerHTML", "insertAdjacentHTML", "document.write", "eval(", "new Function", ".style.", "style=", "onclick=", "localStorage"]) {
    check("desk.js has no " + word, !deskJs.includes(word));
    check("desk.html has no " + word, !deskHtml.includes(word));
  }
  for (const word of ["sessionStorage", "indexedDB", "document.cookie", "XMLHttpRequest", "sendBeacon", "WebSocket", "import(", "headers", "credentials", "keepalive", "no-cors", "setAttribute(\"on", "srcdoc", "location.href", "location.assign", "location.replace", "window.open"]) {
    check("desk.js has no " + word, !deskJs.includes(word));
  }
  check("the CSP meta tag is present, word for word", deskHtml.includes(CSP));
  check("the CSP meta tag is the first thing in <head> after the charset", /<head>\s*<meta charset="utf-8">\s*<meta http-equiv="Content-Security-Policy"/.test(deskHtml));
  check("the title is fixed", deskHtml.includes("<title>A creator desk \u00B7 The Creator Newsroom</title>") && !/\.title\b/.test(deskJs));
  eq("the only script is desk.js, with nothing inline", deskHtml.match(/<script\b[^>]*>[\s\S]*?<\/script>/g), ["<script src=\"desk.js\"></script>"]);
  check("desk.html does not load app.js", !deskHtml.includes("app.js"));
  check("desk.html has no inline handlers, forms or frames", !/\son[a-z]+\s*=/i.test(deskHtml) && !/<(form|iframe|object|embed|base)\b/i.test(deskHtml) && !/javascript:/i.test(deskHtml));
  check("desk.html shares style.css", deskHtml.includes("<link rel=\"stylesheet\" href=\"style.css\">"));
  eq("desk.js calls fetch in one place only", (deskJs.match(/\bfetch\(/g) || []).length, 1);
  check("a request carries only method, body and signal", deskJs.includes("body === null ? { method: \"GET\", signal: ctrl.signal } : { method: \"POST\", body: body, signal: ctrl.signal }") && deskJs.includes("await fetch(address, options)"));
  check("the desk address is built in one place", (deskJs.match(/https:\/\/script\.google\.com\/macros\/s\/" \+/g) || []).length === 1);
  check("desk.js ends with the export line", deskJs.trimEnd().split("\n").pop().startsWith("if (typeof module !== \"undefined\") module.exports = { parseDeskInput, deskUrl,"));
  check("desk.js is plain ASCII, so nothing can hide in it", /^[\t\n\x20-\x7E]*$/.test(deskJs));
  check("no em dash or en dash in desk.html or desk.js", !/[\u2013\u2014]/.test(deskHtml) && !/[\u2013\u2014]/.test(deskJs));
  check("desk.js has no pattern that looks behind itself (older Safari cannot build one)", !deskJs.includes("(?<"));

  const ids = [...deskHtml.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  eq("ids in desk.html are not repeated", ids.length, new Set(ids).size);
  const used = [...new Set([...deskJs.matchAll(/"(dk[A-Z][A-Za-z]+)"/g)].map(m => m[1]))];
  eq("every id desk.js asks for is in desk.html", used.filter(id => !ids.includes(id)), []);
  check("desk.js asks for a good number of ids", used.length >= 25, String(used.length));

  const marker = "/* desk.html: the blank desk */";
  eq("style.css has the desk comment once", styleCss.split(marker).length - 1, 1);
  const added = styleCss.slice(styleCss.indexOf(marker) + marker.length).replace(/\/\*[\s\S]*?\*\//g, "");
  const selectors = [...added.matchAll(/([^{}]+)\{/g)].map(m => m[1].trim()).filter(s => !s.startsWith("@media"));
  eq("every rule added for the desk uses a dk- class", selectors.filter(s => !s.split(",").every(part => /\.dk-[a-z0-9-]+/.test(part))), []);
  check("rules were added for the desk", selectors.length >= 20, String(selectors.length));
  const classes = [...new Set([...deskHtml.matchAll(/class="([^"]*)"/g)].flatMap(m => m[1].split(/\s+/)).concat([...deskJs.matchAll(/"((?:[a-z0-9-]+ )*dk-[a-z0-9-]+(?: [a-z0-9-]+)*)"/g)].flatMap(m => m[1].split(" "))))].filter(c => c.startsWith("dk-"));
  eq("every dk- class in use has a rule", classes.filter(c => !added.includes("." + c)), []);
  check("no em dash in the added styles", !/[\u2013\u2014]/.test(added));
}

section("desk.html, word for word");
{
  const has = (name, words) => check(name, pageText.includes(words), "missing: " + words);
  has("the kicker and headline", "Start your own desk A creator desk for your own brand");
  has("the dek and its link", "A blank copy of the standards and the bench. You type your rules and your creators into a Google Sheet. Google's Gemini reads draft scripts against your rules, on your own key. The worked example uses Brooks Running, a real brand that is not involved in this project. See the worked example");
  check("the dek no longer speaks of a Brooks Running desk", !pageText.includes("The Brooks Running desk"));
  check("the dek links to the worked example", deskHtml.includes("<a href=\"./index.html#standards\">See the worked example</a>"));
  has("the paste box button", "Open my desk");
  has("the starter note", "Starter headings, not legal advice. They follow United States advertising rules. Ask whoever signs off your adverts before you rely on them.");
  has("the starter fallback", "The starter list could not be loaded.");
  has("the bench headings and example row", "Channel Link Beat Subscribers Checked on Private note Example: channel name the channel's YouTube address Their topic 48.2K 19 Nov 2026 stays in your Sheet");
  has("the bench note", "You type these in from each channel's public page. Nothing is looked up for you. The bench stays off your desk page until you switch it on.");
  has("before you start", "Before you start. Use a computer, not a phone. Use a personal Google account, not a work or school one, in a browser window signed in to only that account. Anyone who has your desk link can read your rules, so type nothing secret.");
  const steps = [
    "Get a Gemini key. Go to Google AI Studio (aistudio.google.com), choose \"Get API key\", then \"Create API key\". Add prepaid credit when it asks; a few dollars is plenty. Never paste the key into an email, a chat or this page.",
    "Copy the desk's code. Press \"Copy the code\" below.",
    "Open script.new in a new tab. Click \"Untitled project\" at the top and name it, for example \"Creator desk\". Click in the code area, press Ctrl+A (Cmd+A on a Mac), paste, then press Ctrl+S (Cmd+S).",
    "Add your key. Click the gear on the left (\"Project Settings\"). Under \"Script Properties\" press \"Add script property\". Property: GEMINI_API_KEY. Value: your key. Press \"Save script properties\".",
    "Run setup. Click \"< >\" on the left to go back to the code. In the bar above the code, check the menu shows \"setup\", then press \"Run\".",
    "Say yes to Google. Google will say it has not verified this app. That is expected: this copy is yours, and Google has not reviewed it. Click \"Advanced\", then \"Go to (your project name)\". Tick every box and continue. One box lets the script edit your Google Sheets; it only opens the one Sheet it creates.",
    "Wait for \"Setup worked\" in the log under the code. The line above it is the link to your new Sheet. Open it and bookmark it. Running setup again never erases your work. If a red error appears instead, read it: it says what to fix. Then run setup again.",
    "Put it online. Top right: \"Deploy\", then \"New deployment\". Click the gear beside \"Select type\" and choose \"Web app\". Execute as: Me. Who has access: Anyone. Not \"Anyone with a Google account\". Not \"Only myself\". Press \"Deploy\" and copy the \"Web app URL\". It ends in /exec.",
    "Open your desk. Paste that address in the box at the top of this page and press \"Open my desk\". You should see the starter rules. Bookmark the page: that is your desk link. The page changes to your desk. To come back to these steps, press Start your own desk at the bottom.",
    "Make it yours. In your Sheet, fill in the Brand tab, edit the Standards tab, then add your creators to the Bench tab. Press Enter after each change, then reload your desk page. The page tells you if it could not read a row."
  ];
  steps.forEach((s, i) => has("step " + (i + 1), s));
  const list = /<ol class="dk-steps">([\s\S]*?)<\/ol>/.exec(deskHtml);
  eq("the steps are an ordered list of ten", list ? (list[1].match(/<li>/g) || []).length : 0, 10);
  check("the steps are in order", steps.every((s, i) => i === 0 || pageText.indexOf(steps[i - 1]) < pageText.indexOf(s)));
  has("step 2 has the button and the link", "Copy the code Read the code on GitHub");
  check("the code link goes to the readable file on GitHub", deskHtml.includes("<a href=\"https://github.com/Lauwoes/creator-newsroom/blob/main/apps-script/Code.gs\" target=\"_blank\" rel=\"noopener noreferrer\">Read the code on GitHub</a>"));
  check("the read-only box for the code comes after the button, inside step 2", /id="dkCopy"[\s\S]*?Read the code on GitHub<\/a><\/div>\s*<textarea class="dk-codebox dk-off" id="dkCodeBox" readonly [^>]*><\/textarea>\s*<\/li>/.test(deskHtml));
  has("afterwards", "Afterwards. Share the desk link with creators. Share the Sheet only with your own team, and never share the script. To pause the desk, set \"Desk is\" to Off in the Brand tab. The \"Read me\" tab in your Sheet says how to take it down.");
  check("the old wording is gone", !pageText.includes("Read the code first") && !pageText.includes("select everything, paste, and save") && !pageText.includes("never the Sheet or the script"));
  has("the note about names", "(Button and menu names are Google's and may read slightly differently; pick the closest match.)");
  const nots = [
    "YouTube channels only. English only.",
    "The starter headings follow United States advertising rules. They are not legal advice.",
    "Two parts of the example: standards and bench. No trend board, no assignments, no dashboard.",
    "No sign-in, no approvals, no record of who decided what. Anyone who can edit the Sheet can change the rules.",
    "Anyone with a desk link can read that desk's standards, and its bench if the owner switched it on.",
    "Gemini can be wrong both ways: it can clear a draft it should flag, and flag one that is fine. How often has not been measured.",
    "The code does not update itself. Each desk runs the copy its owner pasted.",
    "Each desk lives in one person's Google account and runs on that person's Gemini key."
  ];
  has("what this is not, as one list in order", "What this is not " + nots.join(" "));
  has("the footer line", "A student prototype from the NYU SPS and Google Marketing Accelerator Hackathon. Not a Google product. Not legal advice.");
  has("the frame", "This desk was set up by the person who shared this link. The Creator Newsroom project has not checked it. A brand name on this page does not mean that brand is involved.");
  check("the frame is the first thing on the page", /<div class="wrap">\s*<p class="dk-frame dk-off" id="dkFrame">/.test(deskHtml));
  has("the loading line", "Opening the desk...");
  has("the three lanes", "Green Nothing flagged. A person still decides. Amber Flagged. Someone should look before this goes out. Red Stop. Take this to whoever signs off legal questions for this brand.");
  has("the no-key line", "Gemini is not connected yet: this desk has no key.");
  has("the two test buttons and their notices", "Check on this page Looks for the desk's words to catch and a disclosure. Nothing leaves your browser. Send to this desk's reader Sends your text to the person who runs this desk and to Google's Gemini on their account. They keep a copy. Paste nothing private.");
  check("the test box has no sample text", /<textarea id="dkText"[^>]*><\/textarea>/.test(deskHtml));
  has("the not-ready line", "This desk cannot read drafts until its Sheet is fixed.");
  check("the footer links", deskHtml.includes("<a href=\"./desk.html\">Start your own desk</a>") && deskHtml.includes("<a href=\"./index.html\">The worked example</a>"));
  check("the order of the blank page", ["Open a desk", "What you fill in", "Set it up", "What this is not", "A student prototype"].every((s, i, a) => i === 0 || pageText.indexOf(a[i - 1]) < pageText.indexOf(s)));
}

/* ===================== the page itself, run against a stand-in for the browser ===================== */
// A very small stand-in for the DOM: just what desk.js uses. Elements with an id come from desk.html, so a wrong
// id in desk.js fails here. fetch is a stand-in too: nothing in this file touches the network.
class FakeText {
  constructor(text) { this.text = String(text); }
  get textContent() { return this.text; }
}
class FakeEl {
  constructor(tag) {
    this.tagName = tag.toUpperCase(); this.children = []; this.attrs = {}; this.listeners = {}; this.classes = []; this.value = ""; this.disabled = false;
    this.classList = {
      contains: c => this.classes.includes(c),
      toggle: (c, force) => {
        const has = this.classes.includes(c), want = force === undefined ? !has : !!force;
        if (want && !has) this.classes.push(c);
        if (!want && has) this.classes = this.classes.filter(x => x !== c);
        return want;
      }
    };
  }
  get className() { return this.classes.join(" "); }
  set className(v) { this.classes = String(v).split(/\s+/).filter(Boolean); }
  get firstChild() { return this.children[0] || null; }
  get textContent() { return this.children.map(c => c.textContent).join(""); }
  set textContent(v) { this.children = v === "" ? [] : [new FakeText(v)]; }
  appendChild(node) { if (!(node instanceof FakeEl) && !(node instanceof FakeText)) throw new Error("appendChild needs a node"); this.children.push(node); return node; }
  removeChild(node) { const i = this.children.indexOf(node); if (i < 0) throw new Error("not a child"); this.children.splice(i, 1); return node; }
  setAttribute(k, v) { this.attrs[k] = String(v); }
  getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; }
  addEventListener(type, fn) { (this.listeners[type] = this.listeners[type] || []).push(fn); }
  fire(type, event) { (this.listeners[type] || []).forEach(fn => fn(event || { type })); }
  focus() { this.focused = true; }
  select() { this.selected = true; }
  all(pred, out = []) { for (const c of this.children) if (c instanceof FakeEl) { if (pred(c)) out.push(c); c.all(pred, out); } return out; }
}
const settle = async () => { for (let i = 0; i < 25; i++) await new Promise(r => setImmediate(r)); };
const reply = body => Promise.resolve({ ok: true, status: 200, text: async () => (typeof body === "string" ? body : JSON.stringify(body)) });
const CODE = 'function setup() {}\nconst VERSION = "2026-11-21.9";\nconst STARTER = /*STARTER*/[{"lane":"red","rule":"Guarantee","covers":"Promises a result.","words":"guarantee, risk free"},{"lane":"amber","rule":"Superlative","covers":"Calls it the best.","words":"best, #1"}]/*STARTER*/;\n';

// Loads desk.html's ids and desk.js into a fresh stand-in page. respond(url, options) plays the network.
function openPage(search, respond, opts = {}) {
  const ids = new Map(), made = [], calls = [], copied = [], ready = {};
  for (const m of deskHtml.matchAll(/<([a-z0-9]+)\b[^>]*\bid="([^"]+)"[^>]*>/g)) {
    const node = new FakeEl(m[1]), cls = /\bclass="([^"]*)"/.exec(m[0]);
    node.id = m[2];
    node.className = cls ? cls[1] : "";
    ids.set(m[2], node);
  }
  const document = {
    readyState: "loading",
    getElementById: id => ids.get(id) || null,
    createElement: tag => { const node = new FakeEl(tag); made.push(node); return node; },
    createTextNode: text => new FakeText(text),
    addEventListener: (type, fn) => { ready[type] = fn; }
  };
  const window = { location: { search } };
  const navigator = opts.noClipboard ? {} : { clipboard: { writeText: async text => { if (opts.clipboardBlocked) throw new Error("blocked"); copied.push(text); } } };
  const fetch = (url, options) => { calls.push({ url, options, keys: Object.keys(options || {}).sort().join(",") }); return respond(url, options); };
  // Stand-in timers: nothing waits for real; a test can see each time limit and let it run out.
  const timers = [];
  const startTimer = (fn, ms) => { timers.push({ fn, ms, cleared: false }); return timers.length; };
  const stopTimer = n => { if (timers[n - 1]) timers[n - 1].cleared = true; };
  vm.runInContext(deskJs, vm.createContext({ document, window, navigator, fetch, AbortController, setTimeout: startTimer, clearTimeout: stopTimer, URLSearchParams, console }), { filename: "desk.js" });
  ready.DOMContentLoaded();
  const el = id => { if (!ids.has(id)) throw new Error("no #" + id); return ids.get(id); };
  return { el, made, calls, copied, timers, window, document, text: id => el(id).textContent, hidden: id => el(id).classList.contains("dk-off"),
    toDesk: () => calls.filter(c => c.url !== "./apps-script/Code.gs") };
}
const codeOnly = url => (url === "./apps-script/Code.gs" ? reply(CODE) : Promise.reject(new Error("unexpected call to " + url)));
// What a node holds, piece by piece: "text:..." for the page's own words, "TAG.class:..." for an element.
const parts = node => node.children.map(c => (c instanceof FakeEl ? c.tagName + "." + c.className : "text") + ":" + c.textContent);
// Plays one desk: GET gives `get()`, POST gives `post(body)`, the code file gives CODE.
const deskNet = (get, post) => (url, options) => {
  if (url === "./apps-script/Code.gs") return reply(CODE);
  if (url !== EXEC) return Promise.reject(new Error("unexpected call to " + url));
  return options.method === "POST" ? post(JSON.parse(options.body)) : get();
};

section("the page: the blank desk");
{
  const page = openPage("", codeOnly);
  await settle();
  eq("no ?desk=: the only call is for the code file on this site", page.calls.map(c => c.url + " " + c.options.method + " " + c.keys), ["./apps-script/Code.gs GET method,signal"]);
  eq("no ?desk=: no script is called", page.toDesk().length, 0);
  eq("the blank page shows; the desk, the frame and the desk links do not", [page.hidden("dkBlank"), page.hidden("dkDesk"), page.hidden("dkFrame"), page.hidden("dkFootLinks")], [false, true, true, true]);
  const table = page.el("dkStarter").all(n => n.tagName === "TABLE");
  eq("the starter table has its headings and rows", table.length === 1 ? table[0].children.map(tr => tr.children.map(td => td.textContent).join(" | ")) : null,
    ["Lane | Rule | What it covers | Words to catch", "Red | Guarantee | Promises a result. | guarantee, risk free", "Amber | Superlative | Calls it the best. | best, #1"]);
  eq("no starter error", page.hidden("dkStarterErr"), true);

  page.el("dkPaste").value = "" + FAKE_AIZA + "";
  page.el("dkOpen").fire("click");
  eq("a pasted key is explained and goes nowhere", [page.text("dkPasteErr"), page.window.location.search], [D.PASTE_ERRORS.key, ""]);
  page.el("dkPaste").value = EXEC.replace("/exec", "/dev");
  page.el("dkPaste").fire("keydown", { key: "Enter" });
  eq("Enter works too, and /dev is explained", [page.text("dkPasteErr"), page.window.location.search], [D.PASTE_ERRORS.dev, ""]);
  page.el("dkPaste").fire("keydown", { key: "a" });
  eq("other keys do nothing", page.window.location.search, "");
  page.el("dkPaste").value = "  " + EXEC + " ";
  page.el("dkOpen").fire("click");
  eq("a good address puts only the id in the address bar", [page.text("dkPasteErr"), page.window.location.search], ["", "?desk=" + ID]);

  page.el("dkCopy").fire("click");
  await settle();
  eq("Copy the code: the whole file goes to the clipboard", [page.copied.length, page.copied[0] === CODE, page.text("dkCopyNote"), page.el("dkCopy").disabled], [1, true, "Copied. Version 2026-11-21.9. The exact text is in the box below.", false]);
  eq("Copy the code: the exact copied text is also shown in the read-only box", [page.hidden("dkCodeBox"), page.el("dkCodeBox").value === page.copied[0], !!page.el("dkCodeBox").selected], [false, true, false]);
  check("the box for the code cannot be typed in", /<textarea class="dk-codebox dk-off" id="dkCodeBox" readonly /.test(deskHtml));
  eq("the code file is fetched once", page.calls.length, 1);
  const noVersion = openPage("", url => (url === "./apps-script/Code.gs" ? reply(CODE.replace("const VERSION", "const RELEASE")) : Promise.reject(new Error("unexpected call to " + url))));
  await settle();
  noVersion.el("dkCopy").fire("click");
  await settle();
  eq("Copy the code with no version line: the same, without a version", [noVersion.text("dkCopyNote"), noVersion.hidden("dkCodeBox"), noVersion.el("dkCodeBox").value === noVersion.copied[0]], ["Copied. The exact text is in the box below.", false, true]);

  const blocked = openPage("", codeOnly, { clipboardBlocked: true });
  await settle();
  blocked.el("dkCopy").fire("click");
  await settle();
  eq("copying blocked: the code is shown, selected, for copying by hand", [blocked.hidden("dkCodeBox"), blocked.el("dkCodeBox").value === CODE, blocked.el("dkCodeBox").selected, blocked.text("dkCopyNote")], [false, true, true, "Copying was blocked. The code is selected below: copy it with Ctrl+C, or Cmd+C on a Mac. Version 2026-11-21.9."]);
  const noClip = openPage("", codeOnly, { noClipboard: true });
  await settle();
  noClip.el("dkCopy").fire("click");
  await settle();
  eq("no clipboard at all: the same fallback", [noClip.hidden("dkCodeBox"), noClip.el("dkCodeBox").selected], [false, true]);

  const offline = openPage("", () => Promise.reject(new Error("offline")));
  await settle();
  eq("the code file cannot be fetched: the page says so and carries on", [offline.hidden("dkStarterErr"), offline.el("dkStarter").children.length, offline.hidden("dkBlank")], [false, 0, false]);
  offline.el("dkCopy").fire("click");
  await settle();
  eq("Copy the code then asks again, and says it could not be loaded", [offline.calls.length, offline.text("dkCopyNote"), offline.copied.length], [2, "The code could not be loaded. Use the link below.", 0]);
  const notFound = openPage("", () => Promise.resolve({ ok: false, status: 404, text: async () => "Not found" }));
  await settle();
  eq("a 404 for the code file is the same", notFound.hidden("dkStarterErr"), false);
  const noBlock = openPage("", () => reply("function setup() {}\n"));
  await settle();
  eq("a code file with no starter block is the same", noBlock.hidden("dkStarterErr"), false);

  for (const bad of ["?desk=bad", "?desk=", "?desk=" + encodeURIComponent(EXEC), "?desk=" + encodeURIComponent("<script>alert(1)</script>")]) {
    const page2 = openPage(bad, codeOnly);
    await settle();
    eq("a malformed desk link (" + bad.slice(0, 16) + "): the blank page with one line, and no script called", [page2.hidden("dkBlank"), page2.hidden("dkDesk"), page2.hidden("dkFrame"), page2.text("dkPasteErr"), page2.toDesk().length], [false, true, true, "That desk link is not valid.", 0]);
  }
}

section("the page: someone's desk");
{
  let getAnswer = goodAnswer(), postAnswer = goodRead(), posts = [];
  const net = deskNet(() => reply(getAnswer), body => { posts.push(body); return postAnswer instanceof Error ? Promise.reject(postAnswer) : reply(postAnswer); });
  const page = openPage("?desk=" + ID, net);
  eq("while loading: the frame, the loading line, and no blank page", [page.hidden("dkFrame"), page.hidden("dkBlank"), page.hidden("dkDesk"), page.text("dkStatusText"), page.hidden("dkBody"), page.hidden("dkRetry")], [false, true, false, "Opening the desk...", true, true]);
  await settle();
  eq("the desk is asked once, at its own address, with no headers", page.toDesk().map(c => c.url + " " + c.options.method + " " + c.keys), [EXEC + " GET method,signal"]);
  eq("the desk shows", [page.hidden("dkStatus"), page.hidden("dkBody"), page.hidden("dkFrame"), page.hidden("dkFootLinks")], [true, false, false, false]);
  eq("the brand line and the owner's note", [page.text("dkBrand"), page.text("dkNote"), page.hidden("dkNote")], ["Brand, as typed by the desk's owner: Made Up Kettles", "Note typed by the desk's owner: A test desk.", false]);
  eq("the brand name is in a box of its own, after the page's words", parts(page.el("dkBrand")), ["text:Brand, as typed by the desk's owner: ", "SPAN.dk-typed:Made Up Kettles"]);
  eq("the owner's note is in a box of its own, after its label", parts(page.el("dkNote")), ["text:Note typed by the desk's owner: ", "SPAN.dk-typed:A test desk."]);
  check("the Sheet line", /^Read from the owner's Sheet at \d\d:\d\d:\d\d\. 2 red and 2 amber rules in use, plus the built-in disclosure rule\.$/.test(page.text("dkSheet")), page.text("dkSheet"));
  eq("a key is set and there are no problems: neither line shows", [page.hidden("dkNoKey"), page.hidden("dkProblems")], [true, true]);
  eq("the code on this site is newer: one quiet line", [page.hidden("dkVersion"), page.text("dkVersion")], [false, "This desk runs code version 2026-11-20.1. The current version is 2026-11-21.9."]);
  const rows = page.el("dkRegister").all(n => n.tagName === "TR").map(tr => tr.children.map(td => td.textContent).join(" | "));
  eq("the register: red first, then amber, then the built-in rule", rows, ["Lane | Rule | What it covers", "Red | Guarantee | Promises a result.", "Red | Health claim | Says the product cures something.", "Amber | Superlative | Calls the product the best.", "Amber | Discount | Mentions a discount.",
    "Red | Disclosure missing | The draft has none of: #ad, #sponsored, paid partnership, this video is sponsored."]);
  eq("nobody reviewed: the page's own sentence, with no box", parts(page.el("dkReviewed")), ["text:Starter or unreviewed rules. Nobody has told this page they were reviewed."]);
  eq("the test box shows", [page.hidden("dkTestBox"), page.hidden("dkTestOff")], [false, true]);
  const benchRows = page.el("dkBench").all(n => n.tagName === "TR").map(tr => tr.children.map(td => td.textContent).join(" | "));
  eq("the bench, as sent, with the handle or channel id as the link text", benchRows, ["Channel | Link | Beat | Subscribers | Checked on", "Tea With Sam | @teawithsam | Tea | 48.2K | 19 Nov 2026", "Kettle Lab | UCaB3_dE6-hI9kL2nO5qR8tU | Reviews | 1.2M | 2026-11-18"]);
  eq("the bench says what being listed means", page.el("dkBench").children[0].textContent, "Typed into the desk's Sheet. Being listed here does not mean a channel works with this brand or has agreed to anything. Numbers are as typed on the date shown.");
  eq("bench links open safely", page.el("dkBench").all(n => n.tagName === "A").map(a => [a.attrs.href, a.attrs.target, a.attrs.rel].join(" ")), ["https://www.youtube.com/@teawithsam _blank noopener noreferrer", "https://www.youtube.com/channel/UCaB3_dE6-hI9kL2nO5qR8tU _blank noopener noreferrer"]);
  eq("buttons are ready", ["dkReload", "dkCheck", "dkSend"].map(id => page.el(id).disabled), [false, false, false]);

  // Check on this page
  page.el("dkText").value = "";
  page.el("dkCheck").fire("click");
  eq("an empty box asks for a draft", page.text("dkOut"), "Paste a draft first.");
  page.el("dkText").value = "The best kettle, guaranteed.";
  page.el("dkCheck").fire("click");
  await settle();
  const out = page.el("dkOut");
  eq("Check on this page sends nothing", [page.toDesk().length, posts.length], [1, 0]);
  eq("Check on this page: a heading, the draft, the marks", [out.children[0].textContent, out.all(n => n.tagName === "PRE")[0].textContent, out.all(n => n.tagName === "LI").map(li => li.textContent)],
    ["Quick check", "The best3 kettle, guaranteed1.", ["1Guarantee (\"guaranteed\"). Promises a result. quick check", "2Disclosure missing. The draft has none of: #ad, #sponsored, paid partnership, this video is sponsored. quick check", "3Superlative (\"best\"). Calls the product the best. quick check"]]);
  eq("Check on this page shows no lane", out.all(n => n.classList.contains("lane") || n.classList.contains("verdict")).length, 0);
  eq("the flagged words are underlined in their lane", out.all(n => n.tagName === "MARK").map(m => m.className + ":" + m.children[0].textContent), ["a:best", "r:guaranteed"]);
  page.el("dkText").value = "#ad A nice kettle.";
  page.el("dkCheck").fire("click");
  eq("nothing found is not a read", [out.children.map(c => c.textContent), out.all(n => n.classList.contains("lane")).length], [["Quick check", "The quick check found nothing. That is not a read: send it to the reader for a lane."], 0]);

  // Send to this desk's reader
  page.el("dkText").value = "  #ad This is the best kettle.  ";
  page.el("dkSend").fire("click");
  eq("Send: Reading... at once, with the buttons off", [out.all(n => n.classList.contains("lane"))[0].textContent, out.all(n => n.classList.contains("lane"))[0].className, page.el("dkSend").disabled, page.el("dkCheck").disabled, page.el("dkReload").disabled], ["Reading...", "lane p", true, true, true]);
  await settle();
  eq("Send: one POST to the desk's own address with only method, body and signal", page.toDesk().slice(1).map(c => c.url + " " + c.options.method + " " + c.keys), [EXEC + " POST body,method,signal"]);
  eq("Send: the body is the draft and a label, as plain text", [typeof page.toDesk()[1].options.body, posts], ["string", [{ script: "#ad This is the best kettle.", source: "desk page" }]]);
  const lane = () => out.all(n => n.classList.contains("lane")).map(n => n.className + ":" + n.textContent);
  const lines = () => out.all(n => n.classList.contains("muted")).map(n => n.textContent);
  eq("Send: the merged result", [lane(), lines()], [["lane a:amber"], ["Flagged. Someone should look before this goes out.", "Quick check: amber. This desk's reader: amber. The stricter lane stands."]]);
  eq("Send: a mark both made is shown once", out.all(n => n.tagName === "LI").map(li => li.textContent), ["1Superlative (\"best\"). Calls the product the best. quick check and reader"]);
  eq("Send: the buttons come back", ["dkReload", "dkCheck", "dkSend"].map(id => page.el(id).disabled), [false, false, false]);

  const send = async (text, answer) => { postAnswer = answer; page.el("dkText").value = text; page.el("dkSend").fire("click"); await settle(); };
  await send("#ad A nice kettle.", { ok: true, lane: "green", flags: [], registerId: REG });
  eq("both green: green, with the page's own words", [lane(), lines()], [["lane g:green"], ["Nothing flagged. A person still decides.", "Quick check: green. This desk's reader: green. The stricter lane stands.", "Nothing flagged by the quick check or by the reader. Disclosure present."]]);
  await send("#ad A nice kettle.", { ok: true, lane: "green", flags: [], registerId: "ffffffffffff" });
  eq("the standards changed during the read: no lane", [lane(), lines()[0]], [["lane p:Not read"], "The standards changed while you were reading. Press Read again, then send the draft again."]);
  await send("#ad A nice kettle.", { ok: true, lane: "green", flags: [] });
  eq("a read with no register id: never green", [lane(), lines()[1]], [["lane a:amber"], "Quick check: green. The desk's reader did not answer, so a person should read this one."]);
  await send("#ad A nice kettle.", { ok: false, error: "daily_limit", message: "x" });
  eq("the daily limit: never green", [lane(), lines()[1]], [["lane a:amber"], "Quick check: green. Today's limit of reads on this desk is used up, so a person should read this one."]);
  await send("#ad A nice kettle.", new Error("offline"));
  eq("offline: never green", [lane(), lines()[1], page.el("dkSend").disabled], [["lane a:amber"], "Quick check: green. The desk's reader did not answer, so a person should read this one.", false]);
  eq("not read and nothing marked: amber, and the page says it was not read rather than flagged", lines(), ["Not read by this desk's reader. Someone should look before this goes out.", "Quick check: green. The desk's reader did not answer, so a person should read this one.", "Nothing flagged by the quick check. Disclosure present."]);
  await send("#ad A nice kettle.", "<html>Sign in</html>");
  eq("an answer that is not JSON: never green", [lane(), lines()[0]], [["lane a:amber"], "Not read by this desk's reader. Someone should look before this goes out."]);
  await send("#ad The best kettle.", new Error("offline"));
  eq("offline and the quick check marked amber: amber, and flagged", [lane(), lines()], [["lane a:amber"], ["Flagged. Someone should look before this goes out.", "Quick check: amber. The desk's reader did not answer, so a person should read this one."]]);
  await send("A kettle, guaranteed.", new Error("offline"));
  eq("offline and the quick check found red: red", [lane(), lines()[0]], [["lane r:red"], "Stop. Take this to whoever signs off legal questions for this brand."]);
  await send("#ad <img src=x onerror=alert(1)> kettle", { ok: true, lane: "red", registerId: REG, flags: [{ lane: "red", label: "<script>alert(1)</script>", quote: "<img src=x onerror=alert(1)>", reason: "<b onmouseover=alert(1)>why</b>", quoteFound: true }] });
  eq("a reader's words are always text", [out.all(n => n.tagName === "LI")[0].textContent, out.all(n => n.tagName === "MARK")[0].children[0].textContent], ["1<script>alert(1)</script> (\"<img src=x onerror=alert(1)>\"). <b onmouseover=alert(1)>why</b> reader", "<img src=x onerror=alert(1)>"]);
  const before = posts.length;
  await send("#ad " + "k".repeat(6100), goodRead());
  eq("a draft over 6,000 characters is not sent", [posts.length - before, lines()[1]], [0, "Quick check: green. The draft is over 6,000 characters, more than the reader is sent, so a person should read this one."]);
  const before2 = posts.length;
  await send("   ", goodRead());
  eq("an empty draft is not sent", [posts.length - before2, page.text("dkOut")], [0, "Paste a draft first."]);
  const before4 = posts.length, callsBefore = page.calls.length;
  for (const withKey of ["#ad A nice kettle. " + FAKE_AIZA + "", "" + FAKE_AQ + "\n#ad A nice kettle.", "#ad the best kettle, key=" + FAKE_AIZA + "&x=1"]) {
    page.el("dkText").value = withKey;
    page.el("dkSend").fire("click");
    eq("a draft with what looks like an API key: refused at once, with the buttons left on (" + withKey.slice(0, 12) + ")", [page.text("dkOut"), out.children.map(c => c.className), page.el("dkSend").disabled, out.all(n => n.classList.contains("lane")).length],
      ["This text has what looks like an API key in it, so it was not sent. Never paste a key into this page.", ["dk-err"], false, 0]);
    await settle();
  }
  eq("a draft with what looks like an API key makes no call of any kind", [posts.length - before4, page.calls.length - callsBefore, page.text("dkOut")], [0, 0, D.KEY_IN_DRAFT]);
  check("the key never reaches the page's own output", !page.text("dkOut").includes("AIza") && !page.text("dkOut").includes("AQ."));
  await send("#ad A nice kettle.", { ok: true, lane: "green", flags: [], registerId: REG });
  eq("the next clean draft is sent as usual", [posts.length - before4, lane()], [1, ["lane g:green"]]);

  // Read again
  getAnswer = goodAnswer();
  getAnswer.desk.brand.name = "Second Name";
  getAnswer.keySet = false;
  getAnswer.desk.problems = ["Bench row 4 has a link that is not a YouTube channel."];
  const gets = () => page.toDesk().filter(c => c.options.method === "GET").length;
  page.el("dkReload").fire("click");
  eq("Read again: the buttons are off while it reads", [page.el("dkReload").disabled, page.el("dkSend").disabled], [true, true]);
  await settle();
  eq("Read again asks the desk again and redraws", [gets(), page.text("dkBrand"), page.text("dkOut"), page.el("dkReload").disabled], [2, "Brand, as typed by the desk's owner: Second Name", "", false]);
  eq("Read again: the brand line is rebuilt, not added to", parts(page.el("dkBrand")), ["text:Brand, as typed by the desk's owner: ", "SPAN.dk-typed:Second Name"]);
  eq("no key: the page says Gemini is not connected", page.hidden("dkNoKey"), false);
  eq("notes from the Sheet on a desk that is ready", [page.hidden("dkProblems"), page.text("dkProblemsHead"), page.el("dkProblemsList").children.map(li => li.textContent)], [false, "Notes from the Sheet:", ["Bench row 4 has a link that is not a YouTube channel."]]);
  getAnswer = goodAnswer();
  getAnswer.desk.on = false;
  page.el("dkReload").fire("click");
  await settle();
  eq("Read again on a desk now switched off: one message and nothing of the desk left", [page.text("dkStatusText"), page.hidden("dkStatus"), page.hidden("dkBody"), page.hidden("dkRetry"), page.text("dkBrand"), page.text("dkRegister"), page.text("dkBench"), page.text("dkProblemsList")], ["This desk is switched off by its owner.", false, true, true, "", "", "", ""]);
  const before3 = posts.length;
  page.el("dkSend").fire("click");
  page.el("dkCheck").fire("click");
  await settle();
  eq("with no desk on the page nothing can be sent", posts.length - before3, 0);
  check("the page never touched the title", !("title" in page.document));
}

section("the page: desks that cannot be shown, and desks that try things");
{
  const firstLoad = async respond => { const page = openPage("?desk=" + ID, (url, options) => (url === "./apps-script/Code.gs" ? reply(CODE) : respond(url, options))); await settle(); return page; };
  const shown = page => [page.text("dkStatusText"), page.hidden("dkStatus"), page.hidden("dkBody"), page.hidden("dkRetry"), page.hidden("dkFrame"), page.text("dkBrand")];
  const M = D.DESK_MESSAGES;

  const cases = [
    ["the network fails", () => Promise.reject(new Error("offline"))],
    ["the desk answers 500", () => Promise.resolve({ ok: false, status: 500, text: async () => JSON.stringify(goodAnswer()) })],
    ["Google shows a sign-in page", () => reply("<!DOCTYPE html><html><body>Sign in</body></html>")],
    ["the answer is a list", () => reply("[]")],
    ["the answer says ok:false", () => reply({ ok: false, error: "server_error", message: "The health check failed." })],
    ["the answer is too long", () => reply(JSON.stringify(Object.assign(goodAnswer(), { pad: "x".repeat(300000) })))],
    ["the desk part is missing", () => reply(Object.assign(goodAnswer(), { desk: null }))]
  ];
  for (const [name, respond] of cases) {
    eq("did not answer (" + name + "): one message, Try again, no desk content", shown(await firstLoad(respond)), [M.no_answer, false, true, false, false, ""]);
  }
  eq("another version: its own message, no Try again", shown(await firstLoad(() => reply(Object.assign(goodAnswer(), { schema: 2 })))), [M.other_version, false, true, true, false, ""]);
  eq("today's example script (no schema): another version", shown(await firstLoad(() => reply({ ok: true, service: "creator-newsroom-first-reader", version: "2026-11-19.2", model: "m", keySet: true }))), [M.other_version, false, true, true, false, ""]);
  eq("not set up yet", shown(await firstLoad(() => reply(Object.assign(goodAnswer(), { sheetReady: false, desk: null })))), [M.not_set_up, false, true, true, false, ""]);
  eq("switched off", shown(await firstLoad(() => reply(Object.assign(goodAnswer(), { desk: { on: false } })))), [M.off, false, true, true, false, ""]);

  let n = 0;
  const flaky = await firstLoad(() => (++n === 1 ? Promise.reject(new Error("offline")) : reply(goodAnswer())));
  eq("Try again shows first", flaky.hidden("dkRetry"), false);
  flaky.el("dkRetry").fire("click");
  eq("Try again: back to the loading line", [flaky.text("dkStatusText"), flaky.hidden("dkRetry")], [M.opening, true]);
  await settle();
  eq("Try again: the desk shows", [flaky.hidden("dkStatus"), flaky.hidden("dkBody"), flaky.text("dkBrand")], [true, false, "Brand, as typed by the desk's owner: Made Up Kettles"]);

  // time limits, with the stand-in timers
  const slow = openPage("?desk=" + ID, (url, options) => (url === "./apps-script/Code.gs" ? reply(CODE) : new Promise((_, no) => options.signal.addEventListener("abort", () => no(new Error("aborted"))))));
  await settle();
  eq("the desk gets 15 seconds", [slow.timers.length, slow.timers[0].ms, slow.text("dkStatusText")], [1, 15000, M.opening]);
  slow.timers[0].fn();
  await settle();
  eq("no answer in 15 seconds: did not answer", [slow.text("dkStatusText"), slow.hidden("dkRetry")], [M.no_answer, false]);
  let hang = false;
  const slowRead = openPage("?desk=" + ID, (url, options) => (url === "./apps-script/Code.gs" ? reply(CODE) : options.method === "POST" && hang ? new Promise((_, no) => options.signal.addEventListener("abort", () => no(new Error("aborted")))) : reply(goodAnswer())));
  await settle();
  hang = true;
  slowRead.el("dkText").value = "#ad A nice kettle.";
  slowRead.el("dkSend").fire("click");
  await settle();
  const postTimer = slowRead.timers.filter(t => !t.cleared);
  eq("a read gets 45 seconds", [postTimer.length, postTimer[0] && postTimer[0].ms, slowRead.el("dkSend").disabled], [1, 45000, true]);
  postTimer[0].fn();
  await settle();
  eq("no read in 45 seconds: amber, never green", [slowRead.el("dkOut").all(x => x.classList.contains("lane")).map(x => x.className), slowRead.el("dkSend").disabled], [["lane a"], false]);
  check("every finished request stops its timer", flaky.timers.every(t => t.cleared));

  // a desk whose Sheet needs fixing
  const broken = await firstLoad((url, options) => (options.method === "POST" ? Promise.reject(new Error("must not be sent")) : reply(Object.assign(goodAnswer(), { desk: Object.assign(goodAnswer().desk, { ready: false, registerId: "", standards: [], counts: { red: 0, amber: 0 }, problems: ["Standards row 9 has text but no lane.", "Standards row 12 uses a rule name the desk keeps for itself."] }) }))));
  eq("not ready: the problems are listed under their heading", [broken.hidden("dkProblems"), broken.text("dkProblemsHead"), broken.el("dkProblemsList").children.map(li => li.textContent)], [false, "The Sheet needs fixing before this desk can read drafts:", ["Standards row 9 has text but no lane.", "Standards row 12 uses a rule name the desk keeps for itself."]]);
  eq("not ready: no test box, one line instead", [broken.hidden("dkTestBox"), broken.hidden("dkTestOff")], [true, false]);
  check("not ready: the Sheet line says rules found, not rules in use", /^Read from the owner's Sheet at \d\d:\d\d:\d\d\. 0 red and 0 amber rules found, plus the built-in disclosure rule\.$/.test(broken.text("dkSheet")), broken.text("dkSheet"));
  broken.el("dkText").value = "#ad A nice kettle.";
  broken.el("dkSend").fire("click");
  broken.el("dkCheck").fire("click");
  await settle();
  eq("not ready: nothing is sent and no result shows", [broken.toDesk().length, broken.text("dkOut")], [1, ""]);
  eq("not ready: the register still shows the built-in rule", broken.el("dkRegister").all(x => x.tagName === "TR").length, 2);
  const doubtful = await firstLoad(() => reply(Object.assign(goodAnswer(), { desk: Object.assign(goodAnswer().desk, { registerId: "not-an-id" }) })));
  eq("a desk that says ready but is in doubt: treated as not ready, and the page says why", [doubtful.hidden("dkTestBox"), doubtful.hidden("dkTestOff"), doubtful.text("dkProblemsHead"), doubtful.el("dkProblemsList").children.length], [true, false, "The Sheet needs fixing before this desk can read drafts:", 1]);
  check("a desk in doubt: its rules are \"found\", not \"in use\"", doubtful.text("dkSheet").includes(" 2 red and 2 amber rules found, plus the built-in disclosure rule."), doubtful.text("dkSheet"));

  // the bench
  const noBench = await firstLoad(() => reply(Object.assign(goodAnswer(), { desk: Object.assign(goodAnswer().desk, { benchShown: false, bench: [{ channel: "Should Not Show" }] }) })));
  eq("bench not shown", noBench.text("dkBench"), "This desk's bench is not shown here.");
  const emptyBench = await firstLoad(() => reply(Object.assign(goodAnswer(), { desk: Object.assign(goodAnswer().desk, { bench: [{ channel: "Example: channel name" }] }) })));
  eq("an empty bench", emptyBench.text("dkBench"), "No channels yet.");
  const sameVersion = openPage("?desk=" + ID, (url) => (url === "./apps-script/Code.gs" ? reply(CODE.replace("2026-11-21.9", "2026-11-20.1")) : reply(goodAnswer())));
  await settle();
  eq("the same code version: no version line", [sameVersion.hidden("dkVersion"), sameVersion.text("dkVersion")], [true, ""]);
  const noCode = openPage("?desk=" + ID, (url) => (url === "./apps-script/Code.gs" ? Promise.reject(new Error("offline")) : reply(goodAnswer())));
  await settle();
  eq("the code file cannot be fetched: the desk still shows, with no version line", [noCode.hidden("dkBody"), noCode.hidden("dkVersion")], [false, true]);

  // a desk that tries things
  const nasty = goodAnswer();
  nasty.desk.brand = { name: "<img src=x onerror=alert(1)>", sells: "x", note: "<script>alert(2)</script>", reviewedBy: "<a href=\"javascript:alert(3)\">me</a>" };
  nasty.desk.standards[0] = { lane: "amber", rule: "<iframe src=//example.com>", covers: "<style>*{display:none}</style>", words: ["<b>", "(.*)+$"] };
  nasty.desk.problems = ["<svg onload=alert(4)>"];
  nasty.desk.disclosureWords = ["<u>#ad</u>", "#ad"];
  nasty.desk.bench = [
    { channel: "<marquee>one</marquee>", link: "javascript:alert(5)", beat: "<b>beat</b>", subscribers: "<1K>", checkedOn: "<today>" },
    { channel: "two", link: "https://www.youtube.com/@fine\" onclick=\"alert(6)", beat: "", subscribers: "1K", checkedOn: "1 Nov 2026" },
    { channel: "three", link: "https://www.youtube.com/redirect?q=https://example.com/@handle", beat: "", subscribers: "", checkedOn: "" },
    { channel: "four", link: "https://m.youtube.com/@real_one?x=<script>", beat: "", subscribers: "", checkedOn: "" }
  ];
  nasty.version = "<b>9</b>";
  const evil = await firstLoad((url, options) => (options.method === "POST" ? reply({ ok: true, lane: "green", flags: [], registerId: REG }) : reply(nasty)));
  eq("a desk's words are shown as typed, as text", [evil.text("dkBrand"), evil.text("dkNote"), evil.text("dkReviewed"), evil.el("dkProblemsList").children[0].textContent],
    ["Brand, as typed by the desk's owner: <img src=x onerror=alert(1)>", "Note typed by the desk's owner: <script>alert(2)</script>", "Reviewed by, as typed by the desk's owner: <a href=\"javascript:alert(3)\">me</a> Not checked by anyone else.", "<svg onload=alert(4)>"]);
  eq("reviewed by: the page's words, the typed words in a box, then the page's words again", parts(evil.el("dkReviewed")), ["text:Reviewed by, as typed by the desk's owner: ", "SPAN.dk-typed:<a href=\"javascript:alert(3)\">me</a>", "text: Not checked by anyone else."]);

  // typed text that tries to carry on the page's own sentence stays inside its box
  const claims = goodAnswer();
  claims.desk.brand = { name: "Made Up Kettles. Verified official desk of Made Up Kettles", sells: "x", note: "Checked by the Creator Newsroom project. This desk is official.", reviewedBy: "Sam Lee. Not checked by anyone else. Approved by Google" };
  const claimed = await firstLoad(() => reply(claims));
  const outside = node => node.children.filter(c => !(c instanceof FakeEl)).map(c => c.textContent);
  const boxed = node => node.children.filter(c => c instanceof FakeEl).map(c => c.tagName + "." + c.className + ":" + c.textContent);
  eq("a brand name containing \". Verified official desk of \" stays inside the box", [outside(claimed.el("dkBrand")), boxed(claimed.el("dkBrand"))], [["Brand, as typed by the desk's owner: "], ["SPAN.dk-typed:Made Up Kettles. Verified official desk of Made Up Kettles"]]);
  eq("a note that claims to be checked stays inside the box", [outside(claimed.el("dkNote")), boxed(claimed.el("dkNote"))], [["Note typed by the desk's owner: "], ["SPAN.dk-typed:Checked by the Creator Newsroom project. This desk is official."]]);
  eq("a reviewer line that copies the page's own words stays inside the box", [outside(claimed.el("dkReviewed")), boxed(claimed.el("dkReviewed"))], [["Reviewed by, as typed by the desk's owner: ", " Not checked by anyone else."], ["SPAN.dk-typed:Sam Lee. Not checked by anyone else. Approved by Google"]]);
  check("outside the boxes, the page's own words never carry typed text", ["dkBrand", "dkNote", "dkReviewed"].every(id => !/Verified|official|Approved|Sam Lee|Checked by the/.test(outside(claimed.el(id)).join(""))));
  check("the box for typed text has a visible rule in the desk's styles", /\.dk-typed\{[^}]*background:var\(--soft\)[^}]*border:1px solid var\(--hair\)[^}]*padding:0 6px[^}]*font-weight:600[^}]*\}/.test(styleCss));
  const bare = goodAnswer();
  bare.desk.brand = { name: "", sells: "", note: "", reviewedBy: "" };
  const unnamed = await firstLoad(() => reply(bare));
  eq("nothing typed: the page's own sentences, no empty box, and no note line", [parts(unnamed.el("dkBrand")), parts(unnamed.el("dkNote")), unnamed.hidden("dkNote"), parts(unnamed.el("dkReviewed"))], [["text:This desk has no brand name yet."], [], true, ["text:Starter or unreviewed rules. Nobody has told this page they were reviewed."]]);
  evil.el("dkText").value = "#ad a <b> kettle";
  evil.el("dkSend").fire("click");
  await settle();
  const allowed = ["TABLE", "TR", "TH", "TD", "SPAN", "P", "A", "LI", "DIV", "PRE", "MARK", "SUP", "OL", "B"];
  eq("only plain building blocks are ever made", [...new Set(evil.made.map(x => x.tagName))].filter(t => !allowed.includes(t)), []);
  eq("the only attributes ever set are on bench links", evil.made.filter(x => Object.keys(x.attrs).length && x.tagName !== "A").length, 0);
  eq("the only link made is a checked YouTube channel address", evil.made.filter(x => x.tagName === "A").map(a => [a.attrs.href, a.attrs.target, a.attrs.rel, a.textContent].join(" ")), ["https://www.youtube.com/@real_one _blank noopener noreferrer @real_one"]);
  eq("rows with a refused link still show, without one", evil.el("dkBench").all(x => x.tagName === "TR").slice(1).map(tr => tr.children[0].textContent + "|" + tr.children[1].textContent), ["<marquee>one</marquee>|", "two|", "three|", "four|@real_one"]);
  eq("the desk's version is not shown unless it is a plain version", [evil.hidden("dkVersion"), evil.text("dkVersion")], [true, ""]);
  check("every element was filled as text", evil.made.every(x => x.children.every(c => c instanceof FakeText || c instanceof FakeEl)));
}
