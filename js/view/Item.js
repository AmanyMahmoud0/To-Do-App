import DropZone from "./DropZone.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class Item {
  constructor(id, content) {
    const bottomDropZone = DropZone.createDropZone();

    this.elements = {};
    this.elements.root = Item.createRoot();
    this.elements.input = this.elements.root.querySelector(".TASK_INPUT");
    const input_el = this.elements.root.querySelector(".TASK_INPUT");
    const edit_el = this.elements.root.querySelector(".task_edit_el");
    const delete_el = this.elements.root.querySelector(".task_delete_el");

    edit_el.addEventListener("click", (e) => {
      if (edit_el.innerText == "🖊") {
        edit_el.innerText = "✓";
        input_el.removeAttribute("readonly");
        input_el.focus();
      } else {
        edit_el.innerText = "🖊";
        input_el.setAttribute("readonly", "readonly");
      }
    });

    delete_el.addEventListener("click", (e) => {
      const check = confirm("Are you sure?");
      if (check) {
        KanbanAPI.deleteItem(id);

        this.elements.input.removeEventListener("blur", onBlur);
        this.elements.root.parentElement.removeChild(this.elements.root);
      }
    });

    this.elements.root.dataset.id = id;
    this.elements.input.textContent = content;
    this.content = content;
    this.elements.root.appendChild(bottomDropZone);

    const onBlur = () => {
      const newContent = this.elements.input.textContent.trim();

      if (newContent == this.content) {
        return;
      }

      this.content = newContent;

      KanbanAPI.updateItem(id, {
        content: this.content,
      });
    };

    this.elements.root.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", id);
    });

    this.elements.input.addEventListener("drop", (e) => {
      e.preventDefault();
    });
  }

  static createRoot() {
    const range = document.createRange();

    range.selectNode(document.body);

    return range.createContextualFragment(`
			<div class="TASK" draggable="true">
				<input
        readonly
				type="text"
				value="New Task"
				class="TASK_INPUT"
				>
				<button class="edit task_edit_el">🖊</button>
				<button class="delete  task_delete_el">🗑</button>
        <div class="dropzone"></div>
			</div>
		`).children[0];
  }
}
