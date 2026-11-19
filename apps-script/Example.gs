/**
 * The worked example for a creator desk: the standards shown on the project's example site.
 *
 * You do not need this file to run your own desk. Only the project's owner adds it, beside Code.gs,
 * to load the example into their own Sheet.
 *
 * Brooks Running is a real brand chosen for the example. It is not involved in this project and has not seen it.
 *
 * To use it: run setup first, then run loadBrooksExample. It fills in three answers in the Brand tab and
 * fourteen rows in the Standards tab. It refuses unless the Standards tab holds exactly the starter rows,
 * the example itself (so running it twice is harmless), or no rules at all. It never touches the Bench tab or the Log tab.
 */

// The brand and the claims register of the example. These match the example site (app.js); the local test fails if they drift.
const BROOKS_EXAMPLE = {
  name: "Brooks Running",
  sells: "Ghost 18, Hyperion Elite 6, Cascadia 20, Ghost Trail, Ghost Amp (new)",
  note: "Example only. Brooks Running is not involved in this project.",
  register: [
    {"lane":"red","label":"Health claim","detail":"Injury prevention is a health claim. The FTC expects health-benefit claims to be substantiated, and toning-shoe cases cost Reebok $25M and Skechers $40M. Legal must review."},
    {"lane":"red","label":"Health claim","detail":"Implies a medical outcome."},
    {"lane":"red","label":"Health claim","detail":"Treatment language ('cures', 'heals', 'treats my knee') is a medical claim."},
    {"lane":"red","label":"Unsubstantiated endorsement","detail":"Needs documented substantiation and legal sign-off."},
    {"lane":"red","label":"Guarantee","detail":"Guarantees create liability. Legal must review."},
    {"lane":"red","label":"Pricing claim","detail":"Comparative pricing claims are checked by legal."},
    {"lane":"red","label":"Promotion","detail":"Giveaways have their own rules and are not in the agreement."},
    {"lane":"red","label":"New product","detail":"The Ghost Amp is a new product launched for fall 2026: on sale at brooksrunning.com at $150 when read in a browser on 22 and 23 Sep 2026 (the site blocks scripted access; the exact launch day was not verified). New products always go to legal."},
    {"lane":"red","label":"Implied race partnership","detail":"Brooks is not a partner of the NYC (NYRR partners page, read 22 Sep 2026: TCS, Mastercard, New Balance), Chicago (Nike) or Berlin (adidas) marathons (race sites checked 23 Sep 2026); Boston was not checked. Where Brooks is a race sponsor, as at the Indianapolis Monumental Marathon, the race's own mark rules apply. Implying official status is a legal matter either way."},
    {"lane":"amber","label":"Superlative","detail":"Reword as an opinion ('my favourite') or cut."},
    {"lane":"amber","label":"Superlative","detail":"Needs an opinion frame or a source."},
    {"lane":"amber","label":"Performance figure","detail":"A number needs a source from the product team."},
    {"lane":"amber","label":"Competitor named","detail":"Competitor mentions are amber under the agreement. The list is the daily trainers and racers that compete with the Ghost 18: HOKA Clifton, Saucony Ride 19, ASICS Novablast, Nike Pegasus and Alphafly, New Balance 880v15, adidas Adios Pro (checked on the brands' sites or, for HOKA, trade coverage (Gear Patrol), 22 Sep 2026). Matched in any case."},
    {"lane":"amber","label":"Commercial terms","detail":"Offers must match what the agreement allows."}
  ]
};

// Run this once from the editor, after setup. It writes the example into the Sheet setup made.
function loadBrooksExample() {
  const book = book_();
  if (!book) throw new Error("Run setup first. It makes the Sheet the example is loaded into.");
  const props = PropertiesService.getScriptProperties();
  const brandTab = tab_(book, props.getProperty("TAB_BRAND"), TABS.brand);
  const standardsTab = tab_(book, props.getProperty("TAB_STANDARDS"), TABS.standards);
  if (!brandTab || !standardsTab) throw new Error("Run setup first. The Brand and Standards tabs are not in your Sheet yet.");

  // Everything is checked before anything is written, so a refusal leaves the Sheet as it was.
  const standards = standardsFrom_(standardsTab);
  if (!standards.tab) throw new Error("The Standards tab has no heading row. It needs Lane, Rule and What it covers in one of the first five rows.");
  if (!exampleMayLoad_(standards)) throw new Error("Your Standards tab has your own rules. Delete the rows under the headings first if you want the example.");
  const cells = brandFrom_(brandTab).cells;
  if (!cells.name || !cells.sells || !cells.note) throw new Error("The Brand tab is missing a row or its headings. The example needs the rows Brand name, What you sell and Note shown on the page.");

  // Brand: three answers. The other rows are left alone.
  brandTab.getRange(cells.name.row, cells.name.col).setValue(BROOKS_EXAMPLE.name);
  brandTab.getRange(cells.sells.row, cells.sells.col).setValue(BROOKS_EXAMPLE.sells);
  brandTab.getRange(cells.note.row, cells.note.col).setValue(BROOKS_EXAMPLE.note);

  // Standards: fourteen rows under the headings, nine red then five amber. Each column goes where its heading is.
  // Words to catch is left empty: the example site has its own quick check.
  const rows = BROOKS_EXAMPLE.register, first = standards.tab.headRow + 1, cols = standards.tab.cols;
  const column = function (col, values) {
    standardsTab.getRange(first, col, rows.length, 1).setValues(values.map(function (v) { return [v]; }));
  };
  column(cols.lane, rows.map(function (r) { return r.lane === "red" ? "Red" : "Amber"; }));
  column(cols.rule, rows.map(function (r) { return r.label; }));
  column(cols.covers, rows.map(function (r) { return r.detail; }));
  if (cols.words) column(cols.words, rows.map(function () { return ""; }));

  const desk = readDesk_(book);
  if (!desk.on) { console.log("Example loaded: 9 red, 5 amber. The desk is switched off in the Brand tab."); return; }
  if (!desk.ready) throw new Error("The example was written, but the Sheet still needs fixing. " + desk.problems[0]);
  console.log("Example loaded: 9 red, 5 amber. Register " + desk.registerId + ".");
}

// True when the Standards tab holds exactly the starter rows, exactly the example already, or no rules at all.
function exampleMayLoad_(standards) {
  if (standards.tab.more) return false;
  if (standards.textRows === 0) return true;
  if (standards.problems.length) return false;
  const holds = function (rows) {
    return standards.textRows === rows.length && standards.rules.length === rows.length && rows.every(function (want, i) {
      const got = standards.rules[i];
      return got.lane === want.lane && got.rule === want.rule && got.covers === want.covers &&
        got.words.join("\n") === phrases_(want.words, LIMITS.wordsCell, LIMITS.words).join("\n");
    });
  };
  const example = BROOKS_EXAMPLE.register.map(function (r) {
    return { lane: r.lane, rule: clean_(r.label, LIMITS.rule), covers: clean_(r.detail, LIMITS.covers), words: "" };
  });
  return holds(STARTER) || holds(example);
}
