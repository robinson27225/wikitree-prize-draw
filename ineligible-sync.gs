// Shared services for the WikiTree Prize Draw, kept in this spreadsheet:
//   * the ineligible list ("Ineligible" tab), changed by hosts
//   * the published participant table for Source-a-Thon ("Published Roster" tab), changed only with the admin code
//   * the published lists for Connect-a-Thon and other events ("Published Connect-a-Thon" and "Published Other Event"
//     tabs): WikiTree IDs or attendee names, changed only with the admin code
//
// The tabs this script writes all start with "Published". It never writes to, and never reads from, any other tab you
// have, so your own tables (for example a tab named "Roster") are safe.
//
// Two different codes:
//   PASSCODE        - host code. Lets a host read and edit the ineligible list and load the published tables.
//   ADMIN_PASSCODE  - admin code. Required to publish or remove a table or list, or to clear a whole ineligible list.
//                     It must be different from PASSCODE. Admin actions are refused while it is empty.

const PASSCODE = "";          // host code (optional; empty means no host code)
const ADMIN_PASSCODE = "";    // admin code (required for admin actions)

const TAB = "Ineligible";
const ROSTER_TAB = "Published Roster";
const POOL_TABS = { cat: "Published Connect-a-Thon", other: "Published Other Event" };
const RESERVED_TABS = [TAB, ROSTER_TAB, POOL_TABS.cat, POOL_TABS.other];
const HEADER = ["WikiTree ID", "Date", "Timestamp"];       // Date = which list this is: a marathon weekend's Friday, or an event
const ROSTER_HEADER = ["WikiTreeID", "Name", "Team", "Bib#", "Note", "Image"];
const POOL_HEADER = ["Value", "Name", "Team", "Note"];

const HOST_ACTIONS = { list: 1, add: 1, remove: 1, getRoster: 1, getPool: 1 };
const ADMIN_ACTIONS = { adminCheck: 1, clear: 1, setRoster: 1, publishFromSheet: 1, clearRoster: 1, setPool: 1, publishPoolFromSheet: 1, clearPool: 1 };

function doGet() {
  return json_({ ok: true, message: "Draw service is running.", needsCode: String(PASSCODE).trim() !== "", adminCodeSet: String(ADMIN_PASSCODE).trim() !== "" });
}

function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: "bad request" }); }
  const action = String(req.action || "");

  if (ADMIN_ACTIONS[action]) {
    const err = adminError_(req.adminCode);
    if (err) return json_({ ok: false, error: err });
  } else if (HOST_ACTIONS[action]) {
    if (!codeOk_(req.code) && adminError_(req.adminCode) !== null) return json_({ ok: false, error: "bad code" });
  } else {
    return json_({ ok: false, error: "bad request" });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    if (action === "getRoster") return json_(Object.assign({ ok: true }, getRoster_(String(req.since || ""))));
    if (action === "adminCheck") return json_({ ok: true });
    if (action === "getPool") return json_(Object.assign({ ok: true }, getPool_(slotOf_(req), String(req.since || ""))));
    if (action === "setPool") return json_(Object.assign({ ok: true }, setPool_(req)));
    if (action === "publishPoolFromSheet") return json_(publishPoolFromSheet_(req));
    if (action === "clearPool") { clearPool_(slotOf_(req)); return json_({ ok: true }); }
    if (action === "setRoster") return json_(Object.assign({ ok: true }, setRoster_(req.rows)));
    if (action === "publishFromSheet") return json_(publishFromSheet_(String(req.tab || "")));
    if (action === "clearRoster") { clearRoster_(); return json_({ ok: true }); }

    const win = String(req.window || "");
    if (!win) return json_({ ok: false, error: "bad request" });
    const sh = sheet_();
    if (action === "add") add_(sh, win, req.ids || []);
    else if (action === "remove") remove_(sh, win, req.ids || []);
    else if (action === "clear") remove_(sh, win, null);
    return json_({ ok: true, ids: list_(sh, win) });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- codes ---------- */
function codeOk_(given) {
  const need = String(PASSCODE).trim();
  return need === "" || String(given == null ? "" : given).trim() === need;
}
function adminError_(given) {                                // null when the admin code is right
  const admin = String(ADMIN_PASSCODE).trim();
  if (admin === "") return "admin code not set";
  if (admin === String(PASSCODE).trim()) return "admin code must differ from host code";
  return String(given == null ? "" : given).trim() === admin ? null : "bad admin code";
}

/* ---------- ineligible list ---------- */
function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(TAB);
  if (!sh) sh = ss.insertSheet(TAB);
  if (sh.getLastRow() === 0) {                               // brand new or emptied tab: add the header row
    sh.getRange("A:B").setNumberFormat("@");                 // keep IDs and list names as plain text
    sh.appendRow(HEADER);
    sh.setFrozenRows(1);
  }
  return sh;
}
function key_(s) { return String(s).trim().toLowerCase().replace(/\s+/g, "_"); }
function winOf_(v, tz) { return v instanceof Date ? Utilities.formatDate(v, tz, "yyyy-MM-dd") : String(v).trim(); }
function tz_() { return SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone(); }

// A row belongs to a list when its Date column equals that list's id. The header row never matches,
// so no row is ever skipped by position.
function list_(sh, win) {
  const tz = tz_();
  return sh.getDataRange().getValues()
    .filter(r => String(r[0]).trim() !== "" && winOf_(r[1], tz) === win)
    .map(r => String(r[0]).trim());
}
function add_(sh, win, ids) {
  const have = new Set(list_(sh, win).map(key_));
  const rows = [];
  ids.forEach(id => {
    const k = key_(id);
    if (k && !have.has(k)) { have.add(k); rows.push([String(id).trim(), win, new Date().toISOString()]); }
  });
  if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, 3).setValues(rows);
}
function remove_(sh, win, ids) {                            // ids === null removes the whole list
  const drop = ids === null ? null : new Set(ids.map(key_));
  const tz = tz_();
  const vals = sh.getDataRange().getValues();
  for (let i = vals.length - 1; i >= 0; i--) {
    if (winOf_(vals[i][1], tz) === win && (drop === null || drop.has(key_(vals[i][0])))) sh.deleteRow(i + 1);
  }
}

/* ---------- helpers for reading your own tabs ---------- */
function props_() { return PropertiesService.getScriptProperties(); }
function hnorm_(v) { return String(v).toLowerCase().replace(/[\s#_]/g, ""); }
function tabNames_(ss) { return ss.getSheets().map(s => s.getName()).filter(n => RESERVED_TABS.indexOf(n) < 0); }
// Finds the tab holding a participant table: the named one, or the first of your tabs with WikiTreeID and Bib#/Name headings.
// The tabs this script publishes to are never used as a source.
function participantTab_(ss, name, needBib) {
  if (name) return RESERVED_TABS.indexOf(name) >= 0 ? null : ss.getSheetByName(name);
  return ss.getSheets().find(s => {
    if (RESERVED_TABS.indexOf(s.getName()) >= 0 || s.getLastRow() < 2) return false;
    const h = s.getRange(1, 1, 1, Math.max(s.getLastColumn(), 4)).getValues()[0].map(hnorm_);
    const hasId = h.indexOf("wikitreeid") >= 0 || h.indexOf("id") >= 0;
    return hasId && (!needBib || h.indexOf("bib") >= 0 || h.indexOf("bibnumber") >= 0);
  }) || null;
}
function tabProblem_(ss, tabName) {
  return { ok: false, error: tabName ? "tab not found" : "no participants tab found", tabs: tabNames_(ss) };
}

/* ---------- published participant table (Source-a-Thon, with bibs) ---------- */
function getRoster_(since) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ROSTER_TAB);
  const updated = props_().getProperty("rosterUpdated") || "";
  if (!sh || sh.getLastRow() < 2 || !updated) return { rows: null, updated: "" };
  if (since && since === updated) return { unchanged: true, updated: updated };
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, 6).getValues().map(r => r.map(v => String(v).trim()));
  return { rows: rows, updated: updated };
}
function writeRoster_(rows) {                               // rows: [id, name, team, bib, note, image]
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ROSTER_TAB);
  if (!sh) sh = ss.insertSheet(ROSTER_TAB);
  sh.clearContents();
  sh.getRange("A:F").setNumberFormat("@");                  // keep bib numbers like 007 as text
  sh.getRange(1, 1, 1, 6).setValues([ROSTER_HEADER]);
  sh.setFrozenRows(1);
  if (rows.length) sh.getRange(2, 1, rows.length, 6).setValues(rows);
  const updated = new Date().toISOString();
  props_().setProperty("rosterUpdated", updated);
  return { count: rows.length, updated: updated };
}
function setRoster_(rows) {
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > 5000) return { ok: false, error: "bad roster" };
  const clean = [];
  const seen = new Set();
  for (const r of rows) {
    if (!Array.isArray(r) || r.length < 4) continue;
    const id = String(r[0]).trim(), bib = String(r[3]).trim();
    if (!id || !bib || seen.has(key_(id))) continue;
    seen.add(key_(id));
    clean.push([id, String(r[1]).trim(), String(r[2]).trim(), bib, String(r[4] || "").trim(), String(r[5] || "").trim()]);
  }
  if (!clean.length) return { ok: false, error: "bad roster" };
  return writeRoster_(clean);
}
function clearRoster_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ROSTER_TAB);
  if (sh) sh.clearContents();
  props_().deleteProperty("rosterUpdated");
}
// Publishes the Source-a-Thon table that already lives in this spreadsheet (a tab with WikiTreeID and Bib# headings).
function publishFromSheet_(tabName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = participantTab_(ss, tabName, true);
  if (!sh) return tabProblem_(ss, tabName);
  const vals = sh.getDataRange().getValues();
  const h = vals[0].map(hnorm_);
  const col = (...names) => h.findIndex(x => names.indexOf(x) >= 0);
  const ix = { id: col("wikitreeid", "id"), name: col("name"), team: col("team"), bib: col("bib", "bibnumber", "bibno"), img: col("image", "imageurl"), note: col("note", "notes") };
  if (ix.id < 0 || ix.name < 0 || ix.team < 0 || ix.bib < 0) return { ok: false, error: "missing columns" };
  const get = (r, i) => i >= 0 && r[i] != null ? String(r[i]).trim() : "";
  const rows = [];
  vals.slice(1).forEach(r => {
    const id = get(r, ix.id);
    let bib = get(r, ix.bib).replace(/\.0$/, "");
    if (!id || !bib) return;
    if (/^\d+$/.test(bib)) bib = ("000" + bib).slice(-Math.max(3, bib.length));
    rows.push([id, get(r, ix.name) || id, get(r, ix.team), bib, get(r, ix.note), get(r, ix.img)]);
  });
  const res = setRoster_(rows);
  if (res.ok === false) return res;
  return { ok: true, count: res.count, updated: res.updated, tab: sh.getName() };
}

/* ---------- published lists for Connect-a-Thon ("cat") and other events ("other") ----------
   kind "ids": WikiTree IDs.  kind "names": attendee names (guests who are not on WikiTree).
   Each list carries its event name, an optional Random Participant tool challenge code (like ConnectAThon202604),
   and, for other events, a start and end in Eastern time as YYYYMMDDHHMMSS. */
function slotOf_(req) { return req.slot === "cat" ? "cat" : "other"; }
function pkey_(slot, name) { return "pool_" + slot + "_" + name; }

function getPool_(slot, since) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(POOL_TABS[slot]);
  const p = props_();
  const updated = p.getProperty(pkey_(slot, "updated")) || "";
  if (!sh || sh.getLastRow() < 2 || !updated) return { rows: null, updated: "", slot: slot };
  const meta = {
    slot: slot, updated: updated,
    kind: p.getProperty(pkey_(slot, "kind")) || "names", event: p.getProperty(pkey_(slot, "event")) || "",
    challenge: p.getProperty(pkey_(slot, "challenge")) || "", start: p.getProperty(pkey_(slot, "start")) || "", end: p.getProperty(pkey_(slot, "end")) || ""
  };
  if (since && since === updated) return Object.assign({ unchanged: true }, meta);
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues().map(r => r.map(v => String(v).trim()));
  return Object.assign({ rows: rows }, meta);
}
// req: { slot, kind, event, challenge, start, end, rows: [[value, name, team, note], ...] }
function setPool_(req) {
  const slot = slotOf_(req);
  const kind = req.kind === "ids" ? "ids" : req.kind === "names" ? "names" : "";
  const event = String(req.event || "").trim().slice(0, 80);
  if (!kind || !event || !Array.isArray(req.rows) || req.rows.length === 0 || req.rows.length > 5000) return { ok: false, error: "bad list" };
  const challenge = String(req.challenge || "").trim();
  if (challenge && !/^[A-Za-z0-9_-]{2,60}$/.test(challenge)) return { ok: false, error: "bad challenge" };
  const start = String(req.start || "").trim(), end = String(req.end || "").trim();
  if ((start && !/^\d{14}$/.test(start)) || (end && !/^\d{14}$/.test(end)) || (start && end && start >= end)) return { ok: false, error: "bad dates" };

  const rows = [];
  const seen = new Set();
  req.rows.forEach(r => {
    const a = Array.isArray(r) ? r : [r];
    const value = String(a[0] == null ? "" : a[0]).trim();
    if (!value || seen.has(key_(value))) return;
    seen.add(key_(value));
    rows.push([value, String(a[1] || "").trim(), String(a[2] || "").trim(), String(a[3] || "").trim()]);
  });
  if (!rows.length) return { ok: false, error: "bad list" };
  const lookup = kind === "ids" ? enrich_(rows) : { filled: 0, error: "" };

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(POOL_TABS[slot]);
  if (!sh) sh = ss.insertSheet(POOL_TABS[slot]);
  sh.clearContents();
  sh.getRange("A:D").setNumberFormat("@");
  sh.getRange(1, 1, 1, 4).setValues([POOL_HEADER]);
  sh.setFrozenRows(1);
  sh.getRange(2, 1, rows.length, 4).setValues(rows);
  const updated = new Date().toISOString();
  const p = props_();
  p.setProperty(pkey_(slot, "kind"), kind); p.setProperty(pkey_(slot, "event"), event); p.setProperty(pkey_(slot, "updated"), updated);
  p.setProperty(pkey_(slot, "challenge"), challenge); p.setProperty(pkey_(slot, "start"), start); p.setProperty(pkey_(slot, "end"), end);
  return { count: rows.length, slot: slot, kind: kind, event: event, challenge: challenge, start: start, end: end, updated: updated, enriched: lookup.filled, lookupError: lookup.error };
}
// Publishes a list from a tab of this spreadsheet. IDs: a WikiTreeID (or ID) column; names: a Name column.
// Name, Team and Note columns are carried over, and anyone with a Note stays ineligible.
function publishPoolFromSheet_(req) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabName = String(req.tab || "").trim();
  const kind = req.kind === "names" ? "names" : "ids";
  const sh = participantTab_(ss, tabName, false);
  if (!sh) return tabProblem_(ss, tabName);
  const vals = sh.getDataRange().getValues();
  const h = vals[0].map(hnorm_);
  const col = (...names) => h.findIndex(x => names.indexOf(x) >= 0);
  const ix = { id: col("wikitreeid", "id"), name: col("name"), team: col("team"), note: col("note", "notes") };
  if ((kind === "ids" && ix.id < 0) || (kind === "names" && ix.name < 0)) return { ok: false, error: "missing columns" };
  const get = (r, i) => i >= 0 && r[i] != null ? String(r[i]).trim() : "";
  const rows = [];
  vals.slice(1).forEach(r => {
    const value = kind === "ids" ? get(r, ix.id) : get(r, ix.name);
    if (!value) return;
    rows.push([value, kind === "ids" ? get(r, ix.name) : "", get(r, ix.team), get(r, ix.note)]);
  });
  const res = setPool_(Object.assign({}, req, { kind: kind, rows: rows }));
  if (res.ok === false) return res;
  return Object.assign({ ok: true, tab: sh.getName() }, res);
}
function clearPool_(slot) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(POOL_TABS[slot]);
  if (sh) sh.clearContents();
  const p = props_();
  ["kind", "event", "updated", "challenge", "start", "end"].forEach(n => p.deleteProperty(pkey_(slot, n)));
}
// Fills in a name for WikiTree IDs that came without one, using WikiTree's public API. Best effort: if WikiTree is slow,
// rate-limits, or the lookup fails, the list is still published with IDs only, and the reason is reported.
function enrich_(rows) {
  let filled = 0, error = "";
  try {
    const need = rows.filter(r => !r[1]);
    for (let i = 0; i < need.length; i += 50) {
      const chunk = need.slice(i, i + 50);
      const url = "https://api.wikitree.com/api.php?action=getPeople&fields=Name,RealName,LastNameCurrent&keys=" +
        chunk.map(r => encodeURIComponent(r[0])).join(",");
      const data = JSON.parse(UrlFetchApp.fetch(url, { muteHttpExceptions: true }).getContentText());
      const first = data && data[0] || {};
      if (first.status && first.status !== "" && !first.people) { error = String(first.status); break; }
      const people = first.people || {};
      const byName = {};
      Object.keys(people).forEach(k => { const q = people[k]; if (q && q.Name) byName[key_(q.Name)] = q; });
      chunk.forEach(r => {
        const q = byName[key_(r[0])];
        const name = q ? [q.RealName, q.LastNameCurrent].filter(Boolean).join(" ").trim() : "";
        if (name) { r[1] = name; filled++; }
      });
    }
  } catch (err) { error = String(err && err.message || err); }
  return { filled: filled, error: error };
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
