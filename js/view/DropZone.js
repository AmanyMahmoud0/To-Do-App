import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {
  static createDropZone() {
    const range = document.createRange();

    range.selectNode(document.body);

    const dropZone = range.createContextualFragment(`
			<div class="dropzone"></div>
		`).children[0];

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dropactive");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("dropactive");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropZone.classList.remove("dropactive");

      const columnElement = dropZone.closest(".LIST");
      const columnId = Number(columnElement.dataset.id);
      const dropZonesInColumn = Array.from(
        columnElement.querySelectorAll(".dropzone")
      );
      const droppedIndex = dropZonesInColumn.indexOf(dropZone);
      const itemId = Number(e.dataTransfer.getData("text/plain"));
      const droppedItemElement = document.querySelector(
        `[data-id="${itemId}"]`
      );
      const insertAfter = dropZone.parentElement.classList.contains("TASK")
        ? dropZone.parentElement
        : dropZone;

      if (droppedItemElement.contains(dropZone)) {
        return;
      }

      insertAfter.after(droppedItemElement);
      KanbanAPI.updateItem(itemId, {
        columnId,
        position: droppedIndex,
      });
    });

    return dropZone;
  }
}
