# WikiTree Prize Draw

A live-drawing tool for WikiTree livecasts. Hosts choose the event, and the page runs a drum roll while a slideshow slows down and lands on each winner, then plays applause. For the **Source-a-Thon** it spins participant bibs. For the **Connect-a-Thon** and **any other WikiTree event**, such as WikiTree Day, it spins balls in WikiTree's colors, each carrying a WikiTree ID or an attendee's name.

**Live page:** https://robinson27225.github.io/wikitree-prize-draw/

**Repository:** https://github.com/robinson27225/wikitree-prize-draw

Everything runs in the browser. There is no server to maintain. The only outside pieces are WikiTree (the random tool and the bib images) and a Google Apps Script that lives in the participants spreadsheet and shares the ineligible list and participant table between hosts.

## How a host uses it

The tool has three screens.

1. **Setup**
   - In Live mode, enter the **host code** in the box at the top first (see "The host code" below). Nothing can be drawn or changed until it is accepted.
   - Choose **Test** or **Live** at the top. Test mode shows an amber banner on every screen and saves nothing, so use it to practise. Live mode saves the ineligible list.
   - A summary line at the top shows how many participants are eligible and how many are marked ineligible in the sheet.
   - Enter how many winners to draw.
   - Add the **studio hosts** for this draw (see below).
   - Choose **When someone wins** (see below): winners are either added to the ineligible list automatically, or hosts add them by hand after they claim.
   - Add any other ineligible WikiTree IDs by hand. Paste IDs one per line or separated by commas, or paste wikitree.com/wiki/... links, then press **Add to list**. Remove an ID with the x on its chip.
   - Under **Draw settings** you can choose where winners come from, turn the drum roll and applause on or off, run a **Sound check**, and set the spin length (3 to 20 seconds).
   - Press **Continue**.
2. **Ready to draw**: press the WikiTree logo to start.
3. **The draw**: the bibs spin and slow down, then land on the winner. Press **Draw next winner** for each additional winner. After the last one, **Show all winners** gives a summary, **Prize winners table** opens the prize winners screen (below), and **New draw** returns to setup.

A small **Sound on / Sound off** button in the bottom-right corner mutes everything quickly.

## The three events

At the top of the setup screen, **What are we drawing for?** has three choices.

| Event | Shows | Winners come from | Runs |
| --- | --- | --- | --- |
| **Source-a-Thon** | Participant bibs | The participant table, using the WikiTree Random Participant tool by default (challenge `SourceAThon` plus the year, such as `SourceAThon2026`) | Friday 8:00 AM ET to Monday 9:00 AM ET |
| **Connect-a-Thon** | Balls with WikiTree IDs | A published list of participants' WikiTree IDs, using the Random Participant tool by default (challenge such as `ConnectAThon202701`) | Friday 8:00 AM ET to Monday 9:00 AM ET |
| **Other event** | Balls with WikiTree IDs or attendee names | The published list only. It never uses the Random Participant tool | Any start and end you set, in Eastern time |

The Source-a-Thon and Connect-a-Thon run on the marathon weekend. An "Other event" has its own dates. WikiTree Day, for example, runs from the morning of November 5 through the 8th, with activities and livecasts in between.

**The balls.** A ball spins and changes color at random through the WikiTree brand palette (`#FCB815`, `#F37C26`, `#E5EECF`, `#E1F0B4`, `#A5D167`, `#25422D`, `#FFEE99`, `#FFE270`, `#FAD158` and `#8FC641`; black is left out because it would vanish on the page). Each ball carries one entry from the list, slows down with the draw, and lands on the winner. The drum roll, applause, studio hosts, ineligible list, host code and prize winners screen all work as they do for the Source-a-Thon.

**The lists.** An admin publishes a list for the Connect-a-Thon and a separate one for the Other event (see Admin view), so one does not replace the other. A list is one of two kinds:

1. **Participants' WikiTree IDs.** The balls show WikiTree IDs. The winner screen shows the person's name when it is known, with their ID linked to their profile.
2. **Attendee names**, for events with guests who are not on WikiTree. The balls show names, and winners come from the list only. The Random Participant tool is never used for these events, and its option is hidden.

**The Random Participant tool** belongs to the two weekend marathons, which run on the weekend only, so they need no start or end time:

- **Source-a-Thon:** one a year, challenge `SourceAThon` plus the year (`SourceAThon2026`). The page picks the year for you. An admin can change the tool address in the Admin view.
- **Connect-a-Thon:** three a year, challenge `ConnectAThon`, then the year, then `01`, `02` or `03`. `ConnectAThon202601` was January 2026, `202602` April and `202603` July. An admin enters the code with the Connect-a-Thon list and can test it against the real tool.
- **Other events** never use the tool, so there is no challenge code to enter. Winners come from the list, and the event has its own start and end.

**Each event has its own ineligible list**, shared by all hosts:

- Source-a-Thon: one list per marathon weekend.
- Connect-a-Thon: its own list per weekend, separate from the Source-a-Thon's.
- Other event: one list for that event name and start time. A new event name, or a new start time, starts fresh.

**Live or Test by default.** If the event is running when the page opens, it starts in Live mode. Otherwise it starts in Test mode. Once a host picks Test or Live, the page leaves it alone.

On the prize winners screen, the Event column defaults to the event name. Attendees without a WikiTree ID get an empty ID cell, and WikiTree IDs without a known name get empty First and Last cells. Fill those in before you paste. The lists are protected by the host code like the ineligible list, so a new tab asks for the code before it shows them.

## After the draw: the prize winners screen

When the draw is finished, press **Prize winners table**. It opens a screen with:

- A link to the WikiTree **Prize Winners** page: https://www.wikitree.com/wiki/Space:Prize_Winners
- **WikiTree markup** for this draw's winners, ready to copy with one button. Each winner is a table row in the format of the Current Event Winners table (WikiTree ID, First, Last, Event):

  ```
  |-
  |Zurcher-160||Randi||Zurcher||SaTXI
  ```

- **Rows to add** (the default) gives just this draw's rows. Paste them into the existing table on the Prize Winners page, just above the last line (the `|}` that closes the table).
- **Whole table** gives the complete Current Event Winners section: **everyone on this event's ineligible list, in the order they were added, plus this draw's winners**. The ineligible list is where winners are recorded, so this includes winners from earlier draws and from other hosts' screens. The page re-reads the shared list when the prize screen opens, so it is up to date. It also includes anyone a host added to the list by hand, so remove any entries that weren't winners before you copy.
- **Already have the table on WikiTree?** WikiTree doesn't let the page read its own page, so the tool can't see rows that were added before it started recording winners. Open **Already have the table on WikiTree? Paste it to add to it** under the buttons and paste the whole Current Event Winners section from the edit box. The tool keeps your rows exactly as they are and adds only the winners that aren't in it yet, just before the closing `|}`.
- An **Event name** box (it starts as SaTXI and is remembered in the browser) fills the Event column. Change it for each marathon.
- The markup box is editable. First and Last are split from the participant's name automatically, keeping prefixes such as "van der" with the surname. Check them, and fix any by hand, before copying.

**Back to the first screen** returns to setup, ready for the next draw, and clears the studio hosts. **Back to the winners** returns to the winner display.

## How winners are picked

By default the page asks the WikiTree Random Participant tool for a participant, once per winner, and keeps asking until it gets someone who is on the roster, is eligible, and has not already been drawn in the current draw.

If the tool cannot be reached, the page says so and offers **Entire eligible roster** instead. That picks at random from every eligible person on the roster, including people who have not been active recently, so use it only as a fallback.

## Who is ineligible

A participant cannot win if any of these is true:

- They have anything in the **Note** column of the participant table. That column is only for members who won in the previous marathon or who are WikiTree team members.
- Their ID is on the **ineligible list** for the weekend, either added by a host or added automatically when they won.
- They are one of the **studio hosts** entered for the current draw.

### When someone wins: two ways

A toggle on the setup screen chooses what happens to each winner.

- **Add winners to the ineligible list automatically** (the default). The moment a winner lands, their ID goes on the ineligible list, so they cannot win again this weekend. Nobody has to wait for a claim. In Live mode the ID is saved to the shared list that every host sees; in Test mode it goes on the test list only. If saving to the shared list fails, a short warning appears under the winner so a host can add the ID by hand. If a draw was a mistake, remove the ID with the x on its chip.
- **Hosts add winners after they claim.** The original way. Nothing is added automatically, and hosts add each winner to the ineligible list by hand once they have claimed their prize.

The choice is saved in each host's browser, so make sure everyone drawing uses the same one.

### Studio hosts (this draw only)

The hosts in the studio cannot win the current draw. Enter their WikiTree IDs in **Studio hosts** on the setup screen. This list is for the current draw only: it is not saved, not shared with other hosts, and it clears when you press **New draw**. Enter them again for the next draw.

## The shared ineligible list

The ineligible list is shared by every host. Each event has its own list (see "The three events"), and the Source-a-Thon's and Connect-a-Thon's lists clear themselves when the next Friday 8:00 AM ET window starts.

The list is stored in an **Ineligible** tab of the Google Sheet, through the Google Apps Script (`ineligible-sync.gs`). Hosts can also view and edit it directly in that tab. The tab's columns are WikiTree ID, Date and Timestamp. Date says which event's list the row belongs to: the marathon weekend's Friday (for example `2026-10-02`), `cat-` and the Friday for the Connect-a-Thon, or `event-` and the event name and start for another event.

If the shared list cannot be reached, the page shows a warning and, in Live mode, will not continue until it is reachable again.

### The host code

If a **host code** is set in the script, every host must enter it before using Live mode. A box at the top of the setup screen asks for it.

- Until the code is accepted, Live mode is **locked**: the ineligible list is hidden, IDs cannot be added or removed, and **Continue** and the draw are blocked. There is no "continue anyway".
- The code is checked by the script, so even a modified page cannot change the list without it.
- The code is remembered **until the browser tab is closed**. A reload in the same tab keeps it, but opening the page in a new tab, or after closing the tab, asks for it again. It is never saved in the browser's long-term storage. If the script stops accepting a remembered code (for example, after you change it), the page forgets it and asks again. Any code or list saved on a device by an older version is removed.
- If the code stops being accepted, or the shared list cannot be reached, the draw is stopped before anyone is drawn.
- Test mode does not need the code. It never reads or changes the shared list.
- The page can only require a code that the script requires. If `PASSCODE` in the script is empty, nothing is locked.

## Two codes

The script uses two different passcodes. They must not be the same.

| Code | Who has it | What it allows |
| --- | --- | --- |
| **Host code** (`PASSCODE`) | Everyone drawing | Read and edit the ineligible list (including the winners added automatically), and load the participant table and event list. Remembered only until the tab is closed. |
| **Admin code** (`ADMIN_PASSCODE`) | Only the person managing the participant table | Everything above, plus publishing or removing the participant table or the event list, and clearing the whole ineligible list. |

Both codes are checked by the Google script, not by the page, so neither appears in the page's source. Admin actions are refused until an admin code is set.

## Published tables and lists

The script keeps three published copies in your spreadsheet. Each tab's name starts with **Published**:

| Tab | What it holds |
| --- | --- |
| `Published Roster` | The Source-a-Thon participant table, with bibs |
| `Published Connect-a-Thon` | The Connect-a-Thon list |
| `Published Other Event` | The list for the other event |

Hosts never read your own tabs. An admin **publishes**, which copies a table or list into a Published tab that every host's page reads. Each page checks for newer versions every 15 seconds and when it opens. The script only ever writes to tabs whose names start with Published, and it never reads from them, so your own tabs, such as one named `Roster`, are safe. If nothing has been published, the Source-a-Thon page uses the table built into `index.html`.

So a change to a table or list reaches the hosts only when someone with the admin code publishes it.

## Admin view

Add `#admin` to the end of the page address (the page has no link to it). It asks for the admin code before showing anything, and it locks again when you leave the view or press **Lock admin**. The code is held only in memory.

- **Participant table (Source-a-Thon):** press **Publish from the spreadsheet** to publish the participants tab of the sheet. It finds your tab automatically, or type its name. If the name isn't found, the message lists the tabs that do exist. Or paste or upload a CSV, check the summary, and press **Publish to all hosts**. **Back to the built-in table for everyone** removes the published table.
- **Connect-a-Thon and other events:** choose which event the list is for, then enter:
  - the **event name**;
  - for an Other event, whether the list holds WikiTree IDs or attendee names;
  - for a Connect-a-Thon, the **Random Participant tool challenge code**, if you want to draw with the tool (press **Test the code** to check it). Other events don't use the tool;
  - for an Other event, a **start and end in Eastern time as `YYYYMMDDHHMMSS`** (for example `20261105080000` for November 5, 2026 at 8:00 AM), or leave both empty for an event with no set dates. Connect-a-Thon's schedule is set automatically.
  - the list, either pasted or uploaded (one entry per line; for IDs you can add a name after a comma), or **published from a tab of this spreadsheet**. The tab needs a WikiTreeID column (or a Name column for attendee names), and optional Name, Team and Note columns. Anyone with a Note, such as WikiTree team members, stays ineligible. The tab is only read, never changed.
  - Names for IDs that came without one are looked up on WikiTree when you publish, as a best effort. If WikiTree limits requests or the script lacks permission, the list is still published and the page tells you why.
- **Random participant tool:** enter the marathon's tool URL (it must start with `https://plus.wikitree.com/`, and should include the challenge name and hours) and test it. This setting is saved in the browser you use.
- **Ineligible list:** see the weekend window, test or change the shared list connection, or clear the list for everyone.

## Setting up a Connect-a-Thon or other event

1. Open the page with `#admin`, enter the admin code, and find **Connect-a-Thon and other events**.
2. Choose the event and enter its name. For the Connect-a-Thon, enter its challenge code (use **Test the code**). For an Other event, enter the start and end in Eastern time.
3. Add the list by pasting it, or publish it from a tab of the spreadsheet, then publish it to all hosts.
4. On the setup screen, choose the event. Check that the line under it names your event, shows the right count and shows the right dates, then do a practice draw in Test mode.

## Setting up for a new marathon

1. Update the participants tab of the Google Sheet, including the Note column (previous marathon winners and WikiTree team members).
2. Open the page with `#admin`, enter the admin code, and press **Publish from the spreadsheet**. Check the summary line under "Participant table".
3. Check the Source-a-Thon tool address under **Random participant tool** and press **Test it**. By default it uses `SourceAThon` plus the current year.
4. On the setup screen, check that it says "Shared with all hosts" and "Connected to the WikiTree random participant tool", then do a practice draw in Test mode.

The table built into `index.html` is a snapshot (Oct 2, 2026, 602 participants). It is used until a table is published.

## Setting up the Google script (one time)

1. Open the participants Google Sheet and choose **Extensions, then Apps Script**.
2. Replace the sample code with the contents of `ineligible-sync.gs`. (Earlier versions of the script wrote tabs named `Roster` and `Event`. This version doesn't use them, so you can delete them.)
3. Set `PASSCODE` (host code) and `ADMIN_PASSCODE` (admin code) near the top, using two different words.
4. Choose **Deploy, then New deployment, then Web app**. Set **Execute as** to **Me** and **Who has access** to **Anyone**, then **Deploy** and authorize it.
   The script can look up names on WikiTree when you publish an ID list, so Google asks you to approve a permission to "connect to an external service". That is only used for that lookup.
5. Copy the **Web app URL**. It is built into `index.html` (the `SYNC_DEFAULT` value), or an admin can paste it in the Admin view.
6. After any later change to the script, use **Deploy, Manage deployments, pencil icon, Version: New version, Deploy**. The URL stays the same.

This repository and page are public, so set both codes. Without them anyone who finds the web app URL could change the list or publish a different participant table.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app in one file, including the built-in table, WikiTree logo and sounds. This is the only file GitHub Pages needs. |
| `ineligible-sync.gs` | Reference copy of the Google Apps Script. It runs inside the Google Sheet and is not served by the page. |
| `assets/icon-500.png` | The 500 by 500 app icon, in the same letter-tile style as the WikiTree Bingo and Games icons (it spells PRIZE, with the WikiTree logo as the last tile). |
| `assets/favicon.png` | The 128 by 128 version of the icon. A copy is built into `index.html` as the browser tab icon, so the page does not need this file. |
| `README.md` | This file. |

## Notes

- The page and repository are public. `index.html` contains the participant names, WikiTree IDs, teams and bib numbers from the built-in table.
- Bib images load from wikitree.com and are cached in the background when the page opens.
- Sound only plays after a click, which is a browser rule. The page unlocks it when the host presses Continue and the logo.
- The logo and the audio clips are embedded in `index.html`. Make sure you have permission to publish them.
- The ineligible list, studio hosts and settings are held by the browser while the page is open. Studio hosts are never saved. Clearing a browser's saved site data resets that browser's settings but does not affect the shared lists.

## Troubleshooting

| What you see | What to do |
| --- | --- |
| "Enter the host code to use Live mode" | Type the host code in the box at the top of the setup screen and press Enter or **Unlock**. The page tells you if it is wrong. It is remembered until the tab is closed, and has to be entered again in a new tab. |
| "The draw was stopped because the shared list isn't unlocked" | The code was rejected or the shared list could not be reached when the draw started. Nothing was drawn. Enter the code again, or press **Retry**, and start again. |
| "Can't reach the shared list" | Check the connection and press **Retry**. The reason is shown in brackets. "Unreadable response" usually means the Apps Script was not deployed with access set to **Anyone**. |
| Admin says "No admin passcode has been set" | Set `ADMIN_PASSCODE` in the script and deploy a new version. |
| Admin says the admin passcode must differ from the host code | Change one of the two codes in the script and deploy a new version. |
| "That passcode isn't right" in Admin | The admin code is case-sensitive. Check it with whoever set up the script. |
| The participant table did not change on a host's screen | Press **Refresh roster** at the bottom of the setup screen, or wait about 15 seconds. Make sure someone published it from the Admin view. |
| "No event list has been published yet" | Choose **Other event** only after an admin has published a list in the Admin view. Press **Refresh roster** at the bottom if it was just published. |
| Tool shows as not reachable | Press **Check again** under Draw settings, or confirm the URL in the Admin view. Use the whole-roster option only as a fallback. |
| A winner's bib does not appear | The participant table may be missing that person. Update the sheet and publish it again. |
| No sound | Press **Sound check**, make sure the corner button says "Sound on", and check the computer's volume. |
