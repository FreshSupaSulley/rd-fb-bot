import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  webExt: {
    disabled: true,
  },
  srcDir: "src",
  manifest: ({ browser, mode }) => {
    return {
      name: "RD Facebook Bot",
      description: "Mass invites people to my Facebook page who like my posts",
      version: "0.0.3",
      permissions: ["storage", "activeTab"],
      host_permissions: ["https://*.facebook.com/*"], // lets us run the content script on the page
      // Specific to firefox during dev
      ...(browser === "firefox" &&
        mode === "development" && {
          browser_specific_settings: {
            gecko: { id: "extensionname@example.org", strict_min_version: "88.0" },
          },
        }),
    };
  },
  modules: ["@wxt-dev/module-vue"],
});
