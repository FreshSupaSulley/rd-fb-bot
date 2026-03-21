# Rick's Deals Facebook Bot
Mass invites people to my Facebook page who like my posts.

# Installing (Chrome)
1. Navigate to `chrome://extensions`.
2. Enable *Developer mode* (button in top-right corner).
3. Click `Load unpacked` and select the folder. Extension is now loaded (probably should pin it).

# User guide
1. Navigate to your [Facebook page](https://www.facebook.com/profile.php?id=61573827387139). You must be signed in.
2. Click the extension to open the popup.
3. Click the checkbox in the center of the extension to toggle it. You may also use the slider to manually set the delay.
4. Profit.

> [!IMPORTANT]
> You **CANNOT** fuck with the browser while it's running. The extension depends on you staying on the Facebook page and not doing anything. However, you **CAN** Alt+Tab out of the browser and use other apps while it's running.

# Nerd shit

## What didn't work
Facebook uses **graphql** for their requests. Upon inspecting those requests, it seems incredibly complex (not to mention the risk of bot detection skyrockets if we avoid manipulating the frontend). We are sticking with a "Puppeteer" approach, except we need credentials for Facebook if we actually used Puppeteer and adding automated logging in would be a different beast. So this is a Chrome extension to activate this flow on demand in an already opened Facebook session.

## Flow
1. Search for `$x('//div[contains(text(), "All reactions")]')`. Then `.click()` it.
> This searches for every "see who liked this post" button and opens the panel.
2. Search for `$x('//div[@aria-label="Invite" and @role="button"]')`. Then `.click()` it. Scroll and repeat, until we hit the bottom.
> This finds every "Invite" button, clicks it, and keeps going until we run out of things to click.
3. Repeat.

## Flaws
* Slow network speeds / minor page updates from FB can break the extension.
* Risk of getting rate limited (although this is mitigated by an operator-controlled delay slider).
* Potential bot verification checks (never encountered in my testing, could happen with abuse).
* **Risk of getting flagged as a bot, leading to an account ban**. Probably don't attempt to run 24/7, *especially* on the lowest delay.

# Todo
- ~~Activate on certain posts, not the entire page~~ done
- ~~Implement a retry system when speeds are slow and it can't grab people (there's one particular part of the flow)~~ maybe I was geeking?
- Refresh the page when we run out of posts to theoretically support running this indefinitely.
- Metrics to show how many people have been invited in the current session.
