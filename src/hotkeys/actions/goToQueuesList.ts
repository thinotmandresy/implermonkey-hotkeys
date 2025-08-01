export default function goToQueuesList(_e: KeyboardEvent): void {
  if (
    document.activeElement instanceof HTMLInputElement ||
    document.activeElement instanceof HTMLTextAreaElement ||
    document.activeElement instanceof HTMLSelectElement
  ) {
    return;
  }

  const url = window.location.href;
  const currentDomain = url.split("/")[4];
  if (!currentDomain) {
    console.warn("[Hotkeys: goToQueuesList] - Current domain not found from URL.", url);
    return;
  }

  const link = document.querySelector(`a[href="/a/${currentDomain}/manual/"]`);
  if (!link) {
    console.warn("[Hotkeys: goToQueuesList] - Link to queues list not found.");
    return;
  }

  (link as HTMLAnchorElement).click();
}
