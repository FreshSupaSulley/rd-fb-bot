// The magic of this extension
export default defineContentScript({
  matches: ["*://*.facebook.com/*"],
  main() {
    async function execute() {
      const sleepTime = Number(await browser.storage.local.get(["delay"]).then(e => e.delay) ?? 2000); // 2000ms is the default
      console.log("Sleep time (ms):", sleepTime);
      // Wait a bit before we start to ensure everything loads
      await sleep(sleepTime);
      // First order of biz: scroll to the top of the posts, which has this "Manage posts" button at the top
      console.log("Scrolling to top of posts");
      // ($x(`//span[text()='Manage posts']`)[0] as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      // Find the reaction buttons for the posts with a hard cap max # of attempts
      let batchNum = 0;
      for (; true; batchNum++) {
        let posts = await findPosts(sleepTime);
        console.log("Found", posts.length, "posts:", posts);
        console.log("Post batch #", batchNum + 1);
        // For each button that corresponds to a post
        for (const post of posts as HTMLElement[]) {
          console.log("Entering post:", post);
          post.dataset.processed = "true"; // mark it as processed so we don't reselect it
          // Scroll to button. This also helps with loading more posts in the future
          // post.scrollIntoView();
          // await sleep(sleepTime);
          // Click the button
          post.click();
          await sleep(sleepTime);
          // Find all people until we run out
          let lastCount = 0,
            successCount = 0;
          let invites = $x('//div[@aria-label="Following" or @aria-label="Invite" or @aria-label="Invited"]') as HTMLElement[];
          while (lastCount == 0 || lastCount != invites.length) {
            console.log("Found", invites.length, "people (last was", lastCount, ")");
            for (const person of invites) {
              // If this person still needs to be invited
              if (person.ariaLabel == "Invite") {
                console.log("Sending an invite");
                person.click();
                successCount++;
                await sleep(sleepTime / 2);
              }
            }
            // Scroll to the last goblin to reveal more goons
            console.log("Scrolling to last goon to reveal more");
            invites[invites.length - 1].scrollIntoView();
            lastCount = invites.length;
            await sleep(sleepTime);
            // Refresh the array
            invites = $x('//div[@aria-label="Following" or @aria-label="Invite" or @aria-label="Invited"]') as HTMLElement[];
          }
          console.log("Scanned through", lastCount, "goons (", successCount, "invites), moving to next post");
          // Close window (ideally there's only one button)
          for (const close of $x('//div[@aria-label="Close"]') as HTMLElement[]) {
            close.click();
          }
        }
      }
    }
    async function findPosts(sleepTime: number) {
      let posts: HTMLElement[] = [];
      const maxAttempts = 5;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        window.scrollTo(0, document.body.scrollHeight); // scroll to bottom
        console.log("Trying to find posts (attempt", attempt, ")...");
        posts = $x('//div[contains(text(), "All reactions") and not(@data-processed="true")]') as HTMLElement[];
        if (posts.length > 0) {
          return posts;
        }
        await sleep(sleepTime);
      }
      throw new Error("Took too long to find posts");
    }
    // Sleep for good measure
    // sleep(3000).then(() =>
    browser.storage.local
      .get("enabled")
      .then((data) => data.enabled)
      .then((enabled) => {
        if (!enabled) {
          console.log("Extension disabled, abandoning")
          return;
        }
        console.log("Starting script");
        // Entrypoint
        execute().catch((e) => {
          console.error("A fatal error occurred:", e);
        });
      })
      .catch((e) => {
        console.error(e);
      });
  },
});

// Our xpath function
function $x(xpath: string, context = document) {
  // IMPORTANT: return in document order (the order returned matches the order in which they appear in the DOM)
  const result = document.evaluate(xpath, context, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  const nodes = [];
  for (let i = 0; i < result.snapshotLength; i++) {
    nodes.push(result.snapshotItem(i));
  }
  return nodes;
}

// Randomizes the delay slightly
async function sleep(ms: number) {
  const factor = 1 + Math.random() * 0.2; // 1.2x max randomization
  const trueDelay = Math.round(factor * ms);
  await new Promise((resolve) => setTimeout(resolve, trueDelay));
}
