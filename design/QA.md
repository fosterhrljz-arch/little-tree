# Little Tree v2 QA

Verified November 9, 2026, with fictional demo data. The original project and v1 browser record were preserved. No AgentGit upload, deployment, or external account action was performed.

## Automated checks

- `npm test`: **33 passed, 0 failed** (14 retained workflows plus 19 v2 checks).
- `npm run build`: **passed**, with separate application and public-display entries.
- Model coverage: v1 migration, valid persisted v2 loading, corrupt-data rejection, role/class/family scopes, menu draft isolation/copy/unpublish, contact approval and invalidation, arrival/leave conflicts, verified pickup, private responses, deadlines, moment moderation/comments, private feedback and status history, scheduling, receipts reset on edit, public allowlist/PII checks, and Denver-midnight rollover.

## Browser workflows observed

| Workflow | Evidence |
| --- | --- |
| Menu photo and publication | Uploaded the local vegetable pasta photo. Parent view had no draft image; it appeared after publication. The image decoded after a reload and in another local tab. |
| Activity response | Ava's family submitted a nature-observation response. Emma saw the correct child's response in the review dialog. |
| Moment moderation | A parent submitted a photo story. Another parent could not see it before review. Emma published it; classmates could see and comment afterward. |
| Feedback privacy/history | Another family could not see Ava's conversation. Staff replied and resolved a new suggestion; all three history entries remained visible. |
| Arrival and pickup | Staff recorded Ava's arrival, the family arranged an authorized pickup and joined the queue, and staff verified identity and confirmed handover. The family saw Picked up, staff name, and time. |
| Scheduled announcement | A future urgent kitchen notice remained hidden before 07:16 Denver time, then appeared in the parent portal and selected TV feed after its scheduled time. |
| Read confirmation | A parent confirmed reading. The principal's receipt dialog showed that family as Confirmed. |
| Attachment | The image attachment downloaded successfully from the parent's announcement view. |
| TV synchronization | Toggling today's menu in the staff settings immediately removed/restored it in the board tab. Only the separate approved public title/message appeared for the notice. |
| Shared schedules | The same school schedule appeared in the parent Class Activities disclosure and the TV board. |
| Existing leave/attendance | Original browser checks covered request, review, automatic attendance, and persistence. All corresponding model regression tests still pass after the update. |
| Form validation | Empty activity publication remained in the dialog with the required title field invalid. Upload-busy submission is guarded. |
| Mobile navigation/forms | All parent pages, staff directory, TV settings, and the activity editing window were checked at 390 x 844. No page-level horizontal overflow remained; tables retain their own scroll. |

The contact-approval and rejection rules, menu copying/deleting, deadline rejection, wrong-role attempts, and public-field exclusions were additionally verified by automated model tests. Browser tests are workflow checks, not a claim of exhaustive interaction or security coverage.

## Visual review

- Compared the 1536 x 1024 homepage with `today-v2-concept.png`: navigation order, typographic hierarchy, still-life banner, three open rows, whitespace, and green palette are preserved.
- Reviewed the phone homepage at 390 x 844 and the TV board at 1920 x 1080.
- Corrected stylesheet load order so v2 styling wins over the original base.
- Darkened secondary text, fixed feedback grid overflow, and contained an absolutely positioned table accessibility label that caused mobile document scrolling.
- Shared dialogs maintain consistent actions and allow long forms to scroll.
- Intentional reference differences and asset prompt briefs are in `DESIGN.md`.

Screenshots are saved beside the project:

- `../little-tree-v2-desktop.jpg`
- `../little-tree-v2-mobile.jpg`
- `../little-tree-v2-tv.jpg`

## Console and environment

A transient React context error occurred during development hot reload while several source modules were being edited. Clean reloads after the edits, subsequent navigation, and the public board produced **no new console errors or warnings**. This is distinct from the retained earlier development log entries.

The embedded Codex browser rejected the native Fullscreen API. The app displayed its fallback message correctly; full-screen success in a standalone browser or on physical TV hardware was not verified. The TV layout itself was verified at a 1920 x 1080 viewport. Temporary viewport overrides were reset after testing.

## Boundaries

- Authentication and authorization are simulated in a local browser, not enforced by a server.
- No cross-device synchronization, real identity checks, push/email delivery, or production privacy certification.
- Scheduled publishing is evaluated by an open portal and its 15-second timer; browsers may throttle background tabs.
- TV rendering reads a field-whitelisted public payload, but same-origin browser storage remains accessible to someone with browser access. Production requires an isolated public feed and secure deployment.
- Free-form public text requires staff review; pattern matching cannot identify every possible private detail.
- JSON export does not include media; there is no restore workflow or automatic media cleanup.
- Simultaneous writers are refreshed from the latest saved state before each action, but localStorage does not provide a multi-device or transactional database.
- Browser-provided file/date dialogs follow the browser/operating-system locale. Application-authored strings are English.
