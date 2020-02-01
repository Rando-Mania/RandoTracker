(function() {
	const currentDocument = document.currentScript.ownerDocument;
	const RESULT_UNKNOWN = 0;
	const RESULT_SPLIT_FIRST = 1;
	const RESULT_SPLIT_SINGLE = 2;
	const RESULT_SPLIT_DOUBLE = 3;
	const RESULT_DEAD_END = 6;
	const RESULT_SINGLE_TOWN = 25;
	const RESULT_FULL_TOWN = 33;
	const RESULT_FILLER = -1;

	class FFREntranceElement extends HTMLElement {
		constructor() {
			super();
			this.image = null;
			this.options = [];
			this.dialog = null;
			this.listener = null;
		}

		getPropertyName(row, column) {
			return "entrance_" + this.entrance + "_" + row + "_" + column;
		}

		get previousEntrance() {
			return Tracker.getPropertyAttribute(null, this.getPropertyName(this.row, this.column-1));
		}

		get property() {
			return Tracker.getPropertyAttribute(null, this.getPropertyName(this.row, this.column));
		}

		get entrance() {
			return this.closest("*[entrance]").getAttribute("entrance");
		}

		get row() {
			return parseInt(this.closest("ffr-entrance-row").row);
		}

		get column() {
			return parseInt(this.getAttribute("column"));
		}

		set visible(val) {
			if (val) {
				this.style.visibility = "visible";
			} else {
				this.style.visibility = "hidden";
			}
		}

		showOptions() {
			if (this.dialog) {
				return;
			}

			// Remove all other dialogs
			document.querySelectorAll("ffr-entrance").forEach(function(el) {
				if (el !== this) {
					el.closeOptions(el);
				}
			});

			const instance = this;

			this.dialog = document.createElement("div");
			this.dialog.classList.add("dialog");
			this.dialog.classList.add("entrance-dialog");
			this.dialog.style.position = "absolute";

			this.options.forEach(function(option, index) {
				var image = document.createElement("img");

				image.onerror = function() {
					image.style.display = "none";
				};
				image.src = option.getAttribute("path");
				image.setAttribute("value", index);

				if (index >= RESULT_FULL_TOWN) {
					image.classList.add("town");
				}
				
				image.onclick = function(e) {
					e.stopPropagation();
					instance.closeOptions(instance);

					var imageValue = image.getAttribute("value");
					var updates = [];

					if (imageValue == RESULT_SPLIT_SINGLE || imageValue == RESULT_SPLIT_DOUBLE) {
						updates.push({
							property: "entrance_" + instance.entrance + "_row_" + (instance.row + 1),
							value: true
						});

						updates.push({
							property: instance.getPropertyName(instance.row+1, instance.column),
							value: imageValue
						});

						for (var col = 0; col < instance.column; col++) {
							updates.push({
								property: instance.getPropertyName(instance.row+1, col),
								value: RESULT_FILLER
							});
						}

						if (imageValue == RESULT_SPLIT_DOUBLE) {
							updates.push({
								property: "entrance_" + instance.entrance + "_row_" + (instance.row + 2),
								value: true
							});

							for (var col = 0; col <= instance.column; col++) {
								updates.push({
									property: instance.getPropertyName(instance.row+2, col),
									value: RESULT_FILLER
								});
							}
						}
					} else if (imageValue == RESULT_SPLIT_FIRST) {
						updates.push({
							property: instance.property,
							value: imageValue
						});
						updates.push({
							property: "entrance_" + instance.entrance + "_row_" + (instance.row + 1),
							value: true
						});
						updates.push({
							property: instance.getPropertyName(instance.row+1, instance.column),
							value: RESULT_UNKNOWN
						});
					} else {
						updates.push({
							property: instance.property,
							value: imageValue
						});
					}

					Tracker.updateLayoutMultiple(updates);
				};

				instance.dialog.appendChild(image);
			});

			var rect = this.getBoundingClientRect();

			this.dialog.style.left = (rect.right + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0)) + "px";
			this.dialog.style.top = (rect.bottom + (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0)) + "px";

			this.listener = function() {
				instance.closeOptions(instance);
			}

			document.addEventListener("click", this.listener);
			document.body.appendChild(this.dialog);
		}

		closeOptions(instance) {
			if (instance.dialog) {
				document.body.removeChild(instance.dialog);
				instance.dialog = null;
			}

			if (instance.listener) {
				document.removeEventListener("click", instance.listener);
				instance.listener = null;
			}
		}

		connectedCallback() {
			const instance = this;

			// TODO: Pull options from hard-coded list
			this.options = this.querySelectorAll("ffr-entrance-option");
			this.image = document.createElement("img");
			this.appendChild(this.image);

			this.image.onerror = function() {
				this.style.display = "none";
			}

			document.addEventListener("tr-layout", function(e) {
				var value = RESULT_UNKNOWN;
				var visible = instance.column == 0;

				if (e.detail) {
					value = e.detail[instance.property] || RESULT_UNKNOWN;

					if (instance.column != 0) {
						var prevValue = e.detail[instance.previousEntrance];

						if (prevValue) {
							if (prevValue == RESULT_UNKNOWN) {
								visible = false;
							} else if (prevValue >= RESULT_DEAD_END && prevValue <= RESULT_SINGLE_TOWN) {
								visible = false;
							} else if (prevValue >= RESULT_FULL_TOWN) {
								visible = false;
							} else {
								visible = true;
							}
						} else {
							visible = false;
						}
					}
				}

				var option = instance.options[Number(value)];

				if (option) {
					instance.image.style.display = "initial";
					instance.image.src = option.getAttribute("path");
					instance.visible = visible;
				} else {
					// RESULT_FILLER
					instance.visible = false;
				}
			});

			if (this.options.length !== 0) {
				instance.onclick = function(e) {
					e.stopPropagation();
					instance.showOptions();
				}
			}
		}
	}

	customElements.define("ffr-entrance", FFREntranceElement);
})();

(function() {
	const currentDocument = document.currentScript.ownerDocument;

	class FFREntranceRowElement extends HTMLElement {
		constructor() {
			super();
		}

		get entrance() {
			return this.closest("*[entrance]").getAttribute("entrance");
		}

		get property() {
			return Tracker.getPropertyAttribute(null, "entrance_" + this.entrance + "_row_" + this.row);
		}

		get row() {
			return this.getAttribute("row");
		}

		get visible() {
			return this.style.visible === "visible";
		}

		set visible(val) {
			if (val) {
				this.style.display = "block";
			} else {
				this.style.display = "none";
			}
		}

		connectedCallback() {
			const instance = this;

			document.addEventListener("tr-layout", function(e) {
				if (!e.detail) {
					return;
				}

				var value = e.detail[instance.property] || false;

				if (instance.row == 0) {
					value = true;
				}

				instance.visible = value;
			});
		}
	}

	customElements.define("ffr-entrance-row", FFREntranceRowElement);
})();