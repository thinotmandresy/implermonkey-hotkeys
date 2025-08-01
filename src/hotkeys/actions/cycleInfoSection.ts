export default function cycleInfoSection(_e: KeyboardEvent): void {
  // Don't if currently in fullscreen gallery mode
  if (document.querySelector(".modal-close-btn img")) {
    return;
  }

  const tabBtns = document.querySelectorAll(".eva-job__section-buttons .eva-job__section-button");
  if (tabBtns.length === 0) {
    console.warn("[Hotkeys: cycleInfoSection] - No tab buttons found.");
    return;
  }

  const activeTab = Array.from(tabBtns).find((btn) => btn.classList.contains("active"));
  if (activeTab && activeTab.nextElementSibling) {
    (activeTab.nextElementSibling as HTMLButtonElement).click();
  } else {
    (tabBtns[0] as HTMLButtonElement).click();
  }
}
