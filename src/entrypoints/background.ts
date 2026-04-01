export default defineBackground(() => {
  console.log("Hello background!", { id: browser.runtime.id });
  // Trying to keep all of the methods in the same place to reduce space
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Log so it'll appear in the little "Errors" bubble at chrome://extensions
    console.error("Failed: ", message);
    getAction().setBadgeText({ text: `Fail` });
    getAction().setBadgeBackgroundColor({ color: `#FF0000` });
    // Clear after a while
    setTimeout(() => {
      getAction().setBadgeText({ text: `` });
    }, 5000);
  });
});

function getAction() {
  return import.meta.env.MANIFEST_VERSION === 2 ? browser.browserAction : browser.action;
}
