import { MarkdownView, TFile, Vault, Workspace } from "obsidian";
import EventCache from "src/core/EventCache";

export function openMeetingLinkForEvent(cache: EventCache, id: string) {
    const event = cache.getEventById(id);
    if (!event) {
        throw new Error("Event not found.");
    }
    if (event.type !== "single" || !event.meetingLink) {
        throw new Error("Event has no meeting link.");
    }
    window.open(event.meetingLink, "_blank");
}

/**
 * Open a file in the editor to a given event.
 * @param cache
 * @param param1 App
 * @param id event ID
 * @returns
 */
export async function openFileForEvent(
    cache: EventCache,
    { workspace, vault }: { workspace: Workspace; vault: Vault },
    id: string
) {
    const details = cache.getInfoForEditableEvent(id);
    if (!details) {
        throw new Error("Event does not have local representation.");
    }
    const {
        location: { path, lineNumber },
    } = details;
    let leaf = workspace.getMostRecentLeaf();
    const file = vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
        return;
    }
    if (!leaf) {
        return;
    }
    if (leaf.getViewState().pinned) {
        leaf = workspace.getLeaf("tab");
    }
    await leaf.openFile(file);
    if (lineNumber && leaf.view instanceof MarkdownView) {
        leaf.view.editor.setCursor({ line: lineNumber, ch: 0 });
    }
}
