# Screenshot capture guide

This directory stores **real screenshots** used by the root README. Do not create mock screenshots or use images from another Google Drive product.

## Required screenshot set

| File | Capture |
| --- | --- |
| `home.png` | Public landing page, desktop viewport |
| `login.png` | Sign-in page |
| `dashboard.png` | Authenticated user dashboard |
| `mcp-connect.png` | MCP connection setup/instructions |
| `mcp-consent.png` | OAuth consent page for a test MCP client |
| `client-access.png` | Authorized client details and per-tool access controls |

## Capture workflow

1. Start the web and API applications using the instructions in the root README.
2. Open the local app at `http://localhost:3000`.
3. Capture the landing and sign-in screens.
4. Sign in using a dedicated Google test account.
5. Capture the dashboard and connection setup pages.
6. Trigger an MCP authorization flow using a disposable/test MCP client and capture its consent page.
7. Capture the per-client tool permission management view.
8. Review every image before committing it.

Use a consistent browser viewport (for example 1440 × 900), hide unrelated desktop UI, and capture a clean page state.

## Privacy and safety checklist

- Use a test Google account and test Drive content.
- Remove or blur email addresses, profile photos, file names, document contents, client IDs, authorization codes, cookies, tokens, and personal identifiers.
- Never screenshot a production secret or real customer data.
- Do not add images until the matching real screen has been captured.
- Keep original unredacted captures outside the repository; commit only reviewed and redacted versions.

## Browser capture

You can capture a visible page using your browser's screenshot feature or an approved local screenshot tool. Save files with the exact names above.
