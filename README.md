# Little Tree

A calm, connected kindergarten management demo built with React and Vite. This update extends the original project and preserves its class, student, attendance, leave, and announcement records. Application copy and documentation are in English.

**New to Little Tree?** Read the [illustrated user guide](USER_GUIDE.md) for setup, role walkthroughs, everyday workflows, and the public TV display, with real screenshots from the working app.

## Included features

| Section | Staff | Parents |
| --- | --- | --- |
| Today | A quiet welcome and three useful updates | Relevant menu, activity, and school update |
| Daily Menu | Dish CRUD, individual photos, copy, draft, publish, unpublish | Published menus by date, photos, allergens |
| Arrival & Pickup | Record arrivals, authorize contacts, manage queue, verify handover | Propose contacts, arrange pickup, join queue, see status |
| Class Activities | Publish instructions, materials, tasks, deadlines; review responses | View activities and school schedule; send text/photo responses |
| Class Moments | Publish class stories; approve submissions or request changes; moderate comments | Submit stories/photos for review and comment on published moments |
| Parent Feedback | Private replies, status changes, conversation history | Private questions, suggestions, and concerns |
| School Announcements | Draft, edit, schedule, publish, delete, urgent notices, image/PDF attachment, read confirmations | Read notices, download attachments, confirm reading |
| Leave & Attendance | Approve/decline leave; manage attendance | Request/cancel pending leave and view decisions |
| Public Display | Select published menus, schedules, and approved public notices for TV | Shared published content updates from the same local data |

**School Directory** retains principal class/student management, capacity checks, archive/restore, and exports. Teachers see assigned classes. **My Child** includes the family profile and recent attendance.

## Demo boundaries and saved data

- **Role and account selectors are demonstration controls, not authentication.** The complete fictional dataset lives in the browser. UI scopes and model checks demonstrate permissions; they do not secure data against someone using browser developer tools.
- **Synchronization is local.** Tabs at the same origin in one browser profile share progress. Other devices, browsers, profiles, and ports have separate storage. There is no server, secure sign-in, cross-device sync, email, or push delivery.
- Records use localStorage. Uploaded photos and attachments use IndexedDB. Clearing browser data removes both. Storage failures are reported. Normal use makes no external service requests.
- **Export records** includes JSON records and media references, not file contents. It is not a complete backup. Import/restore and media backup are not implemented.
- Use fictional content only. This version is not suitable for real children's information or operating a real pickup procedure.
- No automatic uploads or hosted deployment are configured. This documentation update does not publish the app or upload to AgentGit.

The original `little-tree.data.v1` browser record is left untouched. It migrates into `little-tree.data.v2` on first use; existing v2 progress is loaded thereafter. Unknown or damaged saved data is not silently reset. `little-tree-before-v2.zip`, beside the project, preserves the previous source code; it is not a browser-data backup.

## Start the app

Little Tree needs a local HTTP server. Do not open `index.html` or `display.html` as the application through `file://`.

1. In the `little-tree` folder, double-click **Start Little Tree.cmd**.
   **Success:** its window reports “Little Tree is ready” or “Little Tree is already running.” It opens the portal and public display in Microsoft Edge. Keep the launcher window open if it started a new server.
2. Use [the portal](http://127.0.0.1:5173/) and [the public display](http://127.0.0.1:5173/display.html) in the **same Edge profile**. Keep the portal tab open to supply published TV updates.
   **Success:** the portal shows Today; the TV shows today's published menu and selected schedules/notices.
3. If you opened an HTML file directly, it shows **Open Little Tree with the local launcher**, with the same instructions and a link to the correct HTTP address.
4. Press **Ctrl+C** in the launcher window to stop a server it started.
   **Success:** the server stops; your browser records remain saved.

The launcher builds the current source and serves it on `127.0.0.1:5173` only. It reuses an existing server only when it identifies the same Little Tree project, and refuses to replace an unrelated application using the port. It does not upload, reset school data, or disable browser security. If it reuses a server, closing the small launcher window does not stop that existing server. Close/restart the running production server after future code changes so it can rebuild.

Prerequisites: Node.js 22.12 or newer and the project's installed dependencies. They are already present in this workspace. On a new computer, install Node.js LTS, then run these commands in PowerShell:

```powershell
Set-Location 'C:\Users\TTK\Documents\ChatGPT\Session\little-tree'
npm ci
npm start
```

`npm ci` downloads packages from npm. **Success:** installation finishes without errors and `npm start` reports the local URLs. You can also run `npm run dev` while developing; it uses the same host and port. For terminal-only startup, use `npm start -- --no-open`.

### Why opening the HTML file was blank

The original source entry was an empty root followed by a module at `/src/display-main.jsx`. Under `file://`, a leading slash points outside the project folder, the browser cannot execute unprocessed JSX or resolve package imports, and module loading is subject to local-file origin/CORS restrictions. The production build also needs HTTP module loading. Changing slashes alone is not a complete fix.

Both HTML entries now contain a self-contained recovery message. Source entries skip application imports under `file://`; under HTTP they load the app and show recovery instructions if loading fails. Built asset paths are relative. The launcher provides the required build and server without requiring browser-security exceptions. Production HTML opened as a file may still log a blocked module, but its static launch instructions remain visible.

A file URL, `localhost`, `127.0.0.1`, a different port, and a different browser profile each have different storage. A new Edge profile does not automatically inherit records saved in the Codex in-app browser. Use one profile/address consistently. A fresh profile starts with fictional demo data. The TV itself never reads private school records; the portal creates its safe public projection.

## Try the connected workflows

### Publish a menu

1. As Principal or Teacher, open **Daily Menu**, choose a date, and select **Add dish** or **Edit**. Enter meal, dish name, description, allergens, and optional photo. Choose **Save Draft**.
2. Switch to Parent and open that date. **Success:** the previous published version remains visible.
3. Return to staff and choose **Publish**. Switch back to Parent. **Success:** the updated dish and photo appear.
4. Use **Copy menu** to copy another date into a draft. Deletions remain draft changes until publication. **Unpublish menu** hides the published menu while retaining its draft.

Photos accept JPEG, PNG, or WebP up to 8 MB. Images are decoded and resized to at most 1,600 pixels, removing original metadata. Announcement attachments also accept PDF up to 8 MB. Wait for uploads to finish before saving. Unreferenced files are not automatically reclaimed in this demo.

### Arrange and confirm pickup

1. As a parent, open **Arrival & Pickup → Manage pickup** and add a fictional contact. **Success:** it starts Pending.
2. As the child's teacher, open **Details** and authorize that contact. **Success:** the family can select it.
3. As the parent, save the contact, pickup time, and optional note.
4. As the teacher, choose **Record arrival** for today. **Success:** arrival appears and attendance becomes Present.
5. As the parent, choose **I'm here · Join pickup queue**. **Success:** staff see the child in queue order.
6. As staff, choose **Confirm handover**, check the identity-confirmation box, and confirm. **Success:** the family sees Picked up, the staff name, and confirmation time.

Editing a contact invalidates unfinished arrangements using it. Parents must obtain fresh authorization and save a new arrangement. Past handover records remain. A queue request alone never confirms pickup.

### Activities, moments, and feedback

1. Choose **Parent → Ava Bennett → Class Activities**. Respond to **A little nature collection** with text or a photo. **Success:** Emma Wilson can review it; other families cannot see the response.
2. Open **Class Moments** and submit a story/photo. **Success:** it appears in your submissions and the teacher's review queue, but not classmates' feeds.
3. As Emma, publish it. **Success:** Seedlings families can now see it and comment. Staff can instead request changes with a note.
4. As Ava's parent, open **Parent Feedback → New conversation**. **Success:** Emma and the principal can reply; another family's view does not contain the thread.
5. Resolve the thread as staff. **Success:** the status change remains in its history. A new reply reopens it.

### Schedule an announcement

1. As staff, open **School Announcements → Add announcement**. Enter title, message, and audience. Optionally mark urgent and attach an image/PDF.
2. Choose a future date/time and **Schedule**, or use **Save Draft** or **Publish**.
3. Keep a portal tab open. **Success:** matching families see it at the scheduled time, checked every 15 seconds. Background browser throttling may delay timers; reopening the portal evaluates the time immediately. The date/time input uses device-local time.
4. As a parent, choose **Confirm read**. **Success:** staff see the confirmation in **Read confirmations**. Editing a notice clears prior confirmations.

Teachers publish to assigned classes and edit their own notices. Principals can publish school-wide and manage all notices. Teachers' receipt lists are limited to assigned classes.

### Leave updates attendance

1. Choose **Parent → Ava Bennett → Leave & Attendance → Request leave**. Select a future school day without an overlapping request and enter a reason.
2. Choose **Teacher → Emma Wilson → Leave & Attendance** and approve it. **Success:** Approved and the review note appear.
3. Open the **Attendance** tab and requested date. **Success:** Ava is automatically marked Leave; manual attendance cannot overwrite it.
4. Return to the parent view and reload. **Success:** the decision remains saved. Navigation and role selection restart; school records persist.

Declines need an explanation. Leave cannot be reversed, entirely on weekends, longer than 31 days, or overlap pending/approved leave. Reviewed requests are final in this demo. Recorded arrival prevents conflicting leave approval or marking the child Absent/Unmarked.

## Public TV display

1. As principal, create a school-wide notice and approve a **separate public title and message**. Exclude student/family information.
2. Open **Public Display**. Enable today's published menu and select schedules and approved notices. Add/edit schedules here; parents can read today's schedule under **Class Activities**.
3. Open [the notice board](http://127.0.0.1:5173/display.html) in another tab of the same browser profile. **Success:** selected content appears and follows local changes.
4. Choose **Full screen**. If blocked, use the browser's own control, such as F11 on Windows. The embedded Codex browser blocks the Fullscreen API; its fallback was verified.

Keep a portal tab open for timed publication and public-feed refresh. The board updates on storage events and every 15 seconds. At Denver midnight it removes yesterday's menu/schedules and uses today's selected content. A different physical TV cannot synchronize with this local-only version yet. Select a suitable amount of content for the screen size.

The board has a separate build entry and reads only `little-tree.public.v1`. This public projection is built field by field. It excludes student records, contacts, feedback, moments, responses, attachments, and photos. Only selected, principal-approved whole-school notices appear; private message text is never copied automatically. Known student/family names, emails, and phone patterns are rejected from public text and rechecked at projection time.

Staff still need to review free-form public text: pattern checks cannot detect every possible personal detail. A production TV requires a server-generated public feed on a separate origin or a locked-down device. This same-origin demo is not a security boundary against someone with browser access.

## Verification

```powershell
npm test
npm run build
```

**Success:** all 40 model/workflow tests pass and Vite generates both `dist/index.html` and `dist/display.html`.

Tests also cover source-entry protocol guards, failed/slow module startup, server identity registration, migration, original school rules, publication isolation, contacts/handover, attendance conflicts, activity scopes/deadlines, moderation, private feedback/history, timed publication, read confirmations, public-field filtering, and midnight rollover. Browser checks include real local uploads, persisted media, cross-role workflows, scheduled delivery, receipt recording, attachment download, TV synchronization, and responsive layouts. See `design/QA.md`.

## Project map

- `Start Little Tree.cmd`, `scripts/launch.mjs`, `scripts/local-server.mjs`: local startup and server identity checks.
- `index.html`, `display.html`: startup recovery messages and conditional source entry loading.
- `src/model.js`: retained seed, date helpers, role scopes, and original transitions.
- `src/school.js`: v2 migration, rules, selectors, and public projection.
- `src/store.jsx`, `src/media.js`: local persistence, clock/sync, and IndexedDB files.
- `src/App.jsx`, `src/Today.jsx`: role-specific shell, disclosure, and simple homepage.
- Feature components: `DailyMenu`, `Arrivals`, `Activities`, `Moments`, `Feedback`, `Announcements`, `PublicDisplay`.
- Retained components: `People`, `Attendance`, `Leaves`.
- `src/components.jsx`, `src/SharedV2.jsx`: consistent forms, dialogs, uploads, and shared controls.
- `src/styles.css`, `src/v2.css`: original base followed by minimalist refinements.
- `display.html`, `src/display-main.jsx`, `src/display.css`: public board entry.
- `tests/`, `design/`: workflow tests, concepts, design decisions, and QA evidence.

The production next step is secure authentication, server-side authorization, a durable database/file store, public-feed isolation, backup/restore, and cross-device testing. Deployment and AgentGit publication require a later instruction.
