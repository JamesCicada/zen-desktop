/* Any copyright is dedicated to the Public Domain.
   https://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

add_task(async function test_Check_ScrollBox_Overflow() {
  const scrollbox = gZenWorkspaces.activeScrollbox;
  scrollbox.smoothScroll = false;
  const selectedTab = gBrowser.selectedTab;
  const tabsToRemove = [];
  while (!scrollbox.overflowing) {
    await BrowserTestUtils.openNewForegroundTab(
      window.gBrowser,
      "https://example.com/",
      true
    );
    tabsToRemove.push(gBrowser.selectedTab);
  }

  // An extra tab to ensure the scrollbox is overflowing
  await BrowserTestUtils.openNewForegroundTab(
    window.gBrowser,
    "https://example.com/",
    true
  );
  tabsToRemove.push(gBrowser.selectedTab);

  ok(
    scrollbox.overflowing,
    "The scrollbox should be overflowing after opening enough tabs"
  );

  Assert.strictEqual(
    scrollbox.scrollPosition,
    0,
    "The scrollbox should be scrolled to the top"
  );

  gBrowser.selectedTab = gBrowser.tabs[gBrowser.tabs.length - 1];
  await new Promise(resolve => {
    /* eslint-disable-next-line mozilla/no-arbitrary-setTimeout */
    setTimeout(() => {
      Assert.greater(
        scrollbox.scrollPosition,
        0,
        "The scrollbox should be scrolled to the bottom"
      );
      resolve();
    }, 200);
  });

  const scrolledPosition = scrollbox.scrollPosition;
  gBrowser.selectedTab = gBrowser.visibleTabs[0];
  await new Promise(resolve => {
    /* eslint-disable-next-line mozilla/no-arbitrary-setTimeout */
    setTimeout(() => {
      Assert.less(
        scrollbox.scrollPosition,
        scrolledPosition,
        "The scrollbox should be scrolled back toward the top"
      );
      resolve();
    }, 200);
  });
  gBrowser.selectedTab = selectedTab;
  for (const tab of tabsToRemove) {
    await BrowserTestUtils.removeTab(tab);
  }
});
