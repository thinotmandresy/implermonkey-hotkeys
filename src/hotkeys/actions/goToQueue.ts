export default function goToQueue(_e: KeyboardEvent, index: number): void {
  const rows = document.querySelectorAll<HTMLTableRowElement>('[data-cy="queues-table"] tbody tr');
  if (rows.length === 0) {
    console.warn("[Hotkeys: goToQueue] - Queue rows not found");
    return;
  }

  if (index < 0 || index >= rows.length) {
    console.warn(`[Hotkeys: goToQueue] - Index ${index} out of bounds`);
    return;
  }

  const targetRow = rows[index];
  const link = targetRow.querySelector<HTMLAnchorElement>("a.anchor-full-row-clickable");
  if (!link) {
    console.warn("[Hotkeys: goToQueue] - Queue link not found");
    return;
  }

  link.click();
}
