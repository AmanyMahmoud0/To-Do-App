import KanbanAPI from "../api/KanbanAPI.js";
import DropZone from "./DropZone.js";
import Item from "./Item.js";

export default class Column {
  constructor(id, title) {
    const topDropZone = DropZone.createDropZone();

    this.elements = {};
    this.elements.root = Column.createRoot();
    this.elements.title = this.elements.root.querySelector(".LIST_TITLE");
    this.elements.items = this.elements.root.querySelector(".LIST_ITEMS");
    this.elements.addItem = this.elements.root.querySelector(".ADD_BTN");

    this.elements.root.dataset.id = id;
    this.elements.title.textContent = title;
    this.elements.items.appendChild(topDropZone);

    this.elements.addItem.addEventListener("click", () => {
      const newItem = KanbanAPI.insertItem(id, "");

      this.renderItem(newItem);
    });

    KanbanAPI.getItems(id).forEach((item) => {
      this.renderItem(item);
    });
  }

  static createRoot() {
    const range = document.createRange();

    range.selectNode(document.body);

    return range.createContextualFragment(`
			<div class="LIST">
				<div class="LIST_TITLE"></div>
				<div class="LIST_ITEMS">
        </div>
				<button class="ADD_BTN" type="button">+ Add</button>
			</div>
		`).children[0];
  }

  renderItem(data) {
    const item = new Item(data.id, data.content);

    this.elements.items.appendChild(item.elements.root);
  }
}
