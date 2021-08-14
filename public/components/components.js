(function() {
	const currentDocument = document.currentScript.ownerDocument;

	// tr-button-reset
	(function() {
		class ResetButton extends HTMLElement {
			constructor() {
				super();
			}

			get tracking() {
				return this.getAttribute("tracking");
			}

			connectedCallback() {
				const instance = this;
				const button = document.createElement("button");

				if (instance.tracking) {
					button.innerHTML = "Reset Tracking";
				} else {
					button.innerHTML = "Reset Room";
				}
				
				button.onclick = function() {
					var result = window.confirm("Are you sure you want to reset the room?");

					if (result) {
						Tracker.resetRoom(instance.tracking);
					}
				};

				this.appendChild(button);
			}
		}

		customElements.define("tr-button-reset", ResetButton);
	})();

	// tr-button-timer
	(function() {
		class TimeButtonProperty extends HTMLElement {
			constructor() {
				super();
				this.isRunning = false;
				this.elapsed = 0;
				this.serverTime = 0;
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			connectedCallback() {
				const instance = this;
				const startButton = document.createElement("button");
				const resetButton = document.createElement("button");
				const pauseButton = document.createElement("button");
				const resetConfirm = document.createElement("span");
				var showConfirm = false;

				startButton.innerHTML = "Start";
				resetButton.innerHTML = "Reset";
				pauseButton.innerHTML = "Pause";
				resetConfirm.innerHTML = "Click Reset again to confirm.";

				var updateButtonStatus = function() {
					if (instance.isRunning) {
						startButton.style.display = "none";
						pauseButton.style.display = "initial";
					} else {
						startButton.style.display = "initial";
						pauseButton.style.display = "none";
					}

					if (showConfirm) {
						resetConfirm.style.display = "initial";
					} else {
						resetConfirm.style.display = "none";
					}
				};

				startButton.classList.add("start");
				resetButton.classList.add("reset");
				pauseButton.classList.add("pause");
				resetConfirm.classList.add("reset-confirm");

				startButton.onclick = function() {
					var inputTimer = document.querySelector("tr-input-timer[property='" + instance.property + "']");
					var elapsed = instance.elapsed;

					if (inputTimer) {
						elapsed = Tracker.timerToTimeValue(inputTimer.value);
					}

					showConfirm = false;
					Tracker.setActiveTimer(instance.property);
					Tracker.updateLayout(instance.property, {
						elapsed: elapsed,
						isRunning: true,
						serverTime: firebase.database.ServerValue.TIMESTAMP
					});
				};
				resetButton.onclick = function() {
					if (showConfirm) {
						Tracker.updateLayout(instance.property, {
							elapsed: 0,
							isRunning: false,
							serverTime: firebase.database.ServerValue.TIMESTAMP
						});
						showConfirm = false;
					} else {
						showConfirm = true;
						updateButtonStatus();
					}
				};
				pauseButton.onclick = function() {
					showConfirm = false;
					Tracker.getServerTime().then(function (data) {
						Tracker.updateLayout(instance.property, {
							elapsed: instance.elapsed + (data.val() - instance.serverTime),
							isRunning: false,
							serverTime: firebase.database.ServerValue.TIMESTAMP
						});
					});
				};

				this.appendChild(startButton);
				this.appendChild(pauseButton);
				this.appendChild(resetButton);
				this.appendChild(resetConfirm);
				updateButtonStatus();

				document.addEventListener("tr-layout", function(e) {
					if (!e.detail) {
						return;
					}

					const value = e.detail[instance.property];

					if (!value) {
						instance.isRunning = false;
						instance.elapsed = 0;
						instance.serverTime = 0;
						updateButtonStatus();
						return;
					}

					instance.isRunning = value.isRunning;
					instance.elapsed = value.elapsed;
					instance.serverTime = value.serverTime;
					updateButtonStatus();
				});
			}
		}

		customElements.define("tr-button-timer", TimeButtonProperty);
	})();

	// tr-button-view
	(function() {
		class ViewButton extends HTMLElement {
			constructor() {
				super();
			}

			get view() {
				return this.getAttribute("view");
			}

			get title() {
				return this.getAttribute("title");
			}

			connectedCallback() {
				const instance = this;
				const button = document.createElement("button");

				button.textContent = this.title;
				button.onclick = function() {
					Tracker.openView(instance.view);
				};

				this.appendChild(button);

				var eventListener = function(e) {
					if (Tracker.getCurrentView() === instance.view) {
						button.classList.add("active");
					}

					document.removeEventListener("tr-layout", eventListener)
				}

				document.addEventListener("tr-layout", eventListener);
			}
		}

		customElements.define("tr-button-view", ViewButton);
	})();

	// tr-class-if-full
	(function() {
		class ClassIfFullElement extends HTMLElement {
			constructor() {
				super();
			}

			get toggle_class() {
				return this.getAttribute("toggle-class");
			}

			get targets() {
				return document.querySelectorAll(this.getAttribute("target"));
			}

			connectedCallback() {
				const instance = this;

				var checkForContent = function() {
					var nonEmptyTargetCount = 0;
					var targetGoal = 0;

					if (instance.targets.length) {
						targetGoal = instance.targets.length;

						instance.targets.forEach((target) => {
							if (target.textContent.trim().length > 0) {
								nonEmptyTargetCount += 1;
							}
						});
					} else {
						targetGoal = 1;
						nonEmptyTargetCount = instance.textContent.trim().length > 0;
					}

					if (nonEmptyTargetCount === targetGoal) {
						instance.classList.add(instance.toggle_class);
					} else {
						instance.classList.remove(instance.toggle_class);
					}
				};

				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						checkForContent();
					});
				});

				var config = {characterData: true, subtree: true, childList: true};

				if (instance.targets.length) {
					instance.targets.forEach((target) => {
						observer.observe(target, config);
					});
				} else {
					observer.observe(instance, config);
				}

				setTimeout(checkForContent, 1);
			}
		}

		customElements.define("tr-class-if-full", ClassIfFullElement);
	})();

	// tr-hide-if-empty
	(function() {
		class HideIfEmptyElement extends HTMLElement {
			constructor() {
				super();
			}

			get toggle_class() {
				return this.getAttribute("toggle-class");
			}

			get targets() {
				return document.querySelectorAll(this.getAttribute("target"));
			}

			connectedCallback() {
				const instance = this;

				var checkForEmpty = function() {
					var length = 0;
					if (instance.targets.length) {
						instance.targets.forEach((target) => {
							length = length + target.textContent.trim().length;
						});
					} else {
						length = instance.textContent.trim().length;
					}

					if (length == 0) {
						if (instance.toggle_class) {
							instance.classList.add(instance.toggle_class);
						} else {
							instance.style.display = "none";
						}
					} else {
						if (instance.toggle_class) {
							instance.classList.remove(instance.toggle_class);
						} else {
							instance.style.display = "initial";
						}
					}
				};

				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						checkForEmpty();
					});
				});

				var config = {characterData: true, subtree: true, childList: true};

				if (instance.targets.length) {
					instance.targets.forEach((target) => {
						observer.observe(target, config);
					});
				} else {
					observer.observe(instance, config);
				}

				setTimeout(checkForEmpty, 1);
			}
		}

		customElements.define("tr-hide-if-empty", HideIfEmptyElement);
	})();

	// tr-image
	(function() {
		class LayoutImage extends HTMLElement {
			constructor() {
				super();
				this.image = null;
				this.options = [];
				this.dialog = null;
				this.listener = null;
				this.initialIndex = -1;
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			showOptions() {
				if (this.dialog) {
					return;
				}

				// Remove all other dialogs
				document.querySelectorAll("tr-image").forEach(function(el) {
					if (el !== this) {
						el.closeOptions(el);
					}
				});

				const instance = this;

				this.dialog = document.createElement("div");
				this.dialog.classList.add("dialog");
				this.dialog.style.position = "absolute";
				this.dialog.id = this.property;

				this.options.forEach(function(option, index) {
					var figure = document.createElement("figure");
					var image = document.createElement("img");

					image.onerror = function() {
						image.style.display = "none";
					};
					image.src = option.getAttribute("path");
					image.setAttribute("value", index);
					image.className = option.className;
					
					image.onclick = function(e) {
						e.stopPropagation();
						instance.closeOptions(instance);

						Tracker.updateLayoutMultiple([{
							property: instance.property,
							value: image.getAttribute("value")
						}, {
							property: Tracker.getLabelPropertyName(instance.property),
							value: image.getAttribute("label")
						}]);
					};
					figure.appendChild(image);

					if (option.getAttribute("label")) {
						image.setAttribute("label", option.getAttribute("label"));
						
						var label = document.createElement("figcaption");

						label.textContent = image.getAttribute("label");
						figure.appendChild(label);
					};

					instance.dialog.appendChild(figure);
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
				var clearClassesToAdd = function() {
					// Remove all possible classes to be added
					instance.options.forEach(function(option) {
						var classToRemove = option.getAttribute("class-to-set");

						if (classToRemove) {
							if (classToRemove.indexOf(" ") !== -1) {
								classToRemove.split(" ").forEach(function(ctr) {
									instance.image.classList.remove(ctr);
								});
							} else {
								instance.image.classList.remove(classToRemove);
							}
							
						}
					});
				}

				const instance = this;

				this.options = this.querySelectorAll("tr-image-option");
				this.image = document.createElement("img");
				this.appendChild(this.image);
				this.initialized = false;

				// Preload images
				this.options.forEach(function(option) {
					var image = document.createElement("img");
					image.src = option.getAttribute("path");
					image.style.display = "none";
					image.onload = function() {
						document.body.removeChild(this);
					};
					document.body.appendChild(image);
				});

				// Hide image if invalid path to avoid broken icons
				this.image.onerror = function() {
					this.style.display = "none";
				};

				var absolutePath = function(href) {
				    var link = document.createElement("a");
				    link.href = href;
				    return link.href;
				}

				if (instance.initialIndex === -1) {
					instance.initialIndex = Array.prototype.slice.call(instance.options).findIndex(function(e) {
						return e.hasAttribute("selected");
					});
				}

				if (instance.initialIndex === -1) {
					instance.initialIndex = 0;
				}

				// Listen for updates!
				document.addEventListener("tr-layout", function(e) {
					var value;

					if (e.detail) {
						value = e.detail[instance.property];

						if (typeof(value) === "undefined") {
							if (instance.options.length > 0 && instance.initialized === false) {
								setTimeout(function() {
									Tracker.updateLayoutMultiple([{
										property: Tracker.getLabelPropertyName(instance.property),
										value: instance.options[0].getAttribute("label")
									}]);
								}, 1);
								clearClassesToAdd();
								instance.initialized = true;
							}

							value = instance.initialIndex;
						}
					}

					if (instance.options.length === 0) {
						if (absolutePath(value) !== instance.image.src) {
							// Only try to load if we've actually changed.
							instance.image.style.display = "initial";
							instance.image.src = value;
						}
					} else {
						instance.options.forEach(function(option) {
							option.removeAttribute("selected");
						});

						var option = instance.options[Number(value)];

						if (option) {
							instance.image.style.display = "initial";
							instance.image.src = option.getAttribute("path");
							option.setAttribute("selected", "selected");
							clearClassesToAdd();

							var classToSet = option.getAttribute("class-to-set");

							if (classToSet) {
								if (classToSet.indexOf(" ") !== -1) {
									classToSet.split(" ").forEach(function(cts) {
										instance.image.classList.add(cts);
									});
								} else {
									instance.image.classList.add(classToSet);
								}
							}
						}
					}
				});

				document.addEventListener("tr-reset", function(e) {
					instance.initialized = false;
				});

				if (this.options.length !== 0) {
					instance.onclick = function(e) {
						e.stopPropagation();
						instance.showOptions();
					}
				}
			}
		}

		customElements.define("tr-image", LayoutImage);
	})();

	// tr-image-toggle
	(function() {
		class LayoutImageToggle extends HTMLElement {
			constructor() {
				super();
				this.image = null;
				this._value = false;
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			get src() {
				return this.getAttribute("src");
			}

			get value() {
				return this._value;
			}

			set value(v) {
				if (v) {
					this.image.classList.add(this.class);
				} else {
					this.image.classList.remove(this.class);
				}

				this._value = v;
			}

			get class() {
				return this.getAttribute("class");
			}

			connectedCallback() {
				const instance = this;

				this.image = document.createElement("img");
				this.image.src = this.src;
				this.appendChild(this.image);
				this.image.onerror = function() {
					this.style.display = "none";
				};

				document.addEventListener("tr-layout", function(e) {
					if (!e.detail) {
						return;
					}

					instance.value = (e.detail[instance.property] == true);
				});

				instance.onclick = function(e) {
					Tracker.updateLayout(instance.property, !instance.value);
				};
			};
		}

		customElements.define("tr-image-toggle", LayoutImageToggle);
	})();

	// tr-input-number
	(function() {
		class LayoutNumberProperty extends HTMLElement {
			constructor() {
				super();
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			get oninput() {
				return this.hasAttribute("oninput");
			}

			get value() {
				return this.getAttribute("value");
			}

			get max() {
				return this.getAttribute("max");
			}

			get min() {
				return this.getAttribute("min");
			}

			connectedCallback() {
				const instance = this;

				instance.innerHTML = "<input type='number'/>"

				const input = instance.childNodes[0];

				var updateLayout = function() {
					Tracker.updateLayout(instance.property, input.value);
				};

				if (this.oninput) {
					input.oninput = updateLayout;				
				} else {
					input.onblur = updateLayout;
				}

				input.setAttribute("min", this.min);
				input.setAttribute("max", this.max);

				document.addEventListener("tr-layout", function(e) {
					if (!e.detail) {
						return;
					}

					var value = e.detail[instance.property];
					var sendUpdate = false;

					if (!value) {
						value = instance.value;
						sendUpdate = true;

						if (!value) {
							input.value = "";
							return;
						}
					}

					input.value = value;

					// Only do this after all updates are read
					if (sendUpdate) {
						setTimeout(updateLayout, 1);
					}
				});
			}
		}

		customElements.define("tr-input-number", LayoutNumberProperty);
	})();

	// tr-input-radio
	(function() {
		const currentDocument = document.currentScript.ownerDocument;

		class InputRadioElement extends HTMLElement {
			constructor() {
				super();
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			get value() {
				return this.getAttribute("value");
			}

			get checked() {
				return this.hasAttribute("checked");
			}

			connectedCallback() {
				const instance = this;

				this.input = document.createElement("input");

				var updateRadio = function() {
					Tracker.updateLayoutMultiple([{
						property: instance.property,
						value: instance.value
					}, {
						property: Tracker.getLabelPropertyName(instance.property),
						value: instance.getAttribute("label")
					}]);
				};

				this.input.type = "radio";
				this.input.value = this.value;
				this.input.id = this.id;
				this.id = "";
				this.input.onchange = function(e) {
					e.stopPropagation();
					updateRadio();
				};

				this.appendChild(this.input);

				document.addEventListener("tr-layout", function(e) {
					var value;

					if (e.detail) {
						value = e.detail[instance.property];
					}

					if (typeof(value) === "undefined" && instance.checked) {
						instance.input.name = instance.property;
						setTimeout(updateRadio, 1);
						return;
					}

					if (typeof(value) !== "undefined" && value == instance.value) {
						instance.input.setAttribute("checked", true);
						instance.input.checked = true;
					} else {
						instance.input.removeAttribute("checked");
						instance.input.checked = false;
					}

					if (instance.hasAttribute("target") && instance.hasAttribute("toggle-class")) {
						var targets = document.querySelectorAll(instance.getAttribute("target"));

						targets.forEach(function(el) {
							if (instance.input.checked) {
								el.classList.add(instance.getAttribute("toggle-class"));
							} else {
								el.classList.remove(instance.getAttribute("toggle-class"));
							}
						});
					}
				});
			}
		};

		customElements.define("tr-input-radio", InputRadioElement);
	})();

	// tr-input-text
	(function() {
		class LayoutTextProperty extends HTMLElement {
			constructor() {
				super();
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			get oninput() {
				return this.hasAttribute("oninput");
			}

			get list() {
				return this.hasAttribute("list");
			}
			get listValue() {
				return this.getAttribute("list");
			}

			connectedCallback() {
				const instance = this;

				instance.innerHTML = "<input type='text' placeholder=' '/>"

				const input = instance.childNodes[0];

				var updateLayout = function() {
					Tracker.updateLayout(instance.property, input.value);
				};

				if(this.list){
					input.classList.add("awesomplete");
					input.setAttribute("list", this.listValue);
				}

				if (this.oninput) {
					input.oninput = updateLayout;				
				} else {
					input.onblur = updateLayout;
				}

				document.addEventListener("tr-layout", function(e) {
					if (!e.detail) {
						return;
					}

					const value = e.detail[instance.property];

					if (!value) {
						input.value = "";
						return;
					}

					input.value = value;
				});
			}
		}

		customElements.define("tr-input-text", LayoutTextProperty);
	})();

	// tr-input-textarea
	(function() {
		class LayoutTextAreaProperty extends HTMLElement {
			constructor() {
				super();
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			get oninput() {
				return this.hasAttribute("oninput");
			}

			get rows() {
				return this.getAttribute("rows");
			}

			get cols() {
				return this.getAttribute("cols");
			}

			connectedCallback() {
				const instance = this;

				instance.innerHTML = "<textarea placeholder=' '/>"

				const input = instance.childNodes[0];

				input.setAttribute("rows", instance.rows);
				input.setAttribute("cols", instance.cols);

				var updateLayout = function() {
					Tracker.updateLayout(instance.property, input.value);
				};

				if (this.oninput) {
					input.oninput = updateLayout;				
				} else {
					input.onblur = updateLayout;
				}

				document.addEventListener("tr-layout", function(e) {
					if (!e.detail) {
						return;
					}

					const value = e.detail[instance.property];

					if (!value) {
						input.value = "";
						return;
					}

					input.value = value;
				});
			}
		}

		customElements.define("tr-input-textarea", LayoutTextAreaProperty);
	})();

	// tr-input-timer
	(function() {
		class TimeInputProperty extends HTMLElement {
			constructor() {
				super();
				this.lastUpdate = 0;
				this.isRunning = false;
				this.elapsed = 0;
				this.serverTime = 0;
				this.input = null;
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			get value() {
				return this.input.value;
			}

			connectedCallback() {
				const instance = this;

				instance.innerHTML = "<input type='text'/>"

				this.input = instance.childNodes[0];

				var updateTimer = function() {
					var time = Tracker.parseMS(instance.elapsed);

					instance.input.value = Tracker.dateToText(time, false);
				};

				var timerInterval = function() {
					if (instance.isRunning === false) {
						return;
					}

					var now = new Date();
					instance.elapsed += now - instance.lastUpdate;
					instance.lastUpdate = now;
					updateTimer();
				};

				setInterval(timerInterval, 50);

				document.addEventListener("tr-layout", function(e) {
					if (!e.detail) {
						return;
					}

					const value = e.detail[instance.property];

					if (!value) {
						instance.lastUpdate = 0;
						instance.isRunning = false;
						instance.elapsed = 0;
						instance.serverTime = 0;
						updateTimer();
						return;
					}

					instance.lastUpdate = new Date();
					instance.isRunning = value.isRunning;

					if (instance.isRunning) {
						instance.elapsed = value.elapsed + (e.detail["__now__"] - value.serverTime);
					} else {
						instance.elapsed = value.elapsed;
					}

					instance.serverTime = value.serverTime;
					updateTimer();
				});
			}
		}

		customElements.define("tr-input-timer", TimeInputProperty);
	})();

	// tr-input-toggle
	(function() {
		class ToggleInputElement extends HTMLElement {
			constructor() {
				super();
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			connectedCallback() {
				const instance = this;
				const input = document.createElement("input");

				input.type = "checkbox";

				if (instance.id) {
					input.id = instance.id;
					instance.removeAttribute("id");
				}

				instance.appendChild(input);

				input.onchange = function() {
					Tracker.updateLayout(instance.property, input.checked);
				};

				document.addEventListener("tr-layout", function(e) {
					var value = false;

					if (e.detail) {
						value = e.detail[instance.property];

						if (typeof(value) === "undefined") {
							value = instance.hasAttribute("checked") || false;
						}
					}

					if (input.checked != value) {
						input.checked = value;
						input.onchange();
					}
				});
			}
		}

		customElements.define("tr-input-toggle", ToggleInputElement);
	})();

	// tr-input-toggle-class
	(function() {
		class ToggleInputClassElement extends HTMLElement {
			constructor() {
				super();
				this.initialDisplay = this.style.display;
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			get targets() {
				return document.querySelectorAll(this.getAttribute("target"));
			}

			get toggle_class() {
				return this.getAttribute("toggle-class");
			}

			connectedCallback() {
				const instance = this;
				const input = document.createElement("input");

				input.type = "checkbox";

				if (instance.id) {
					input.id = instance.id;
					instance.removeAttribute("id");
				}

				instance.appendChild(input);

				input.onchange = function() {
					Tracker.updateLayout(instance.property, input.checked);
				};

				document.addEventListener("tr-layout", function(e) {
					var value = false;

					if (e.detail) {
						value = e.detail[instance.property];

						if (typeof(value) === "undefined") {
							value = instance.hasAttribute("checked") || false;
						}
					}

					if (input.checked != value) {
						input.checked = value;
						input.onchange();
					}

					instance.targets.forEach(function(el) {
						if (value) {
							el.classList.add(instance.toggle_class);
						} else {
							el.classList.remove(instance.toggle_class);
						}
					});
				});
			}
		}

		customElements.define("tr-input-toggle-class", ToggleInputClassElement);
	})();

	// tr-label
	(function() {
		class LayoutLabelProperty extends HTMLElement {
			constructor() {
				super();
			}

			get property() {
				return Tracker.getLabelPropertyName(Tracker.getPropertyAttribute(this));
			}

			connectedCallback() {
				const instance = this;

				document.addEventListener("tr-layout", function(e) {
					instance.textContent = "";

					if (!e.detail) {
						return;
					}

					const value = e.detail[instance.property];

					if (!value) {
						return;
					}

					instance.textContent = value;
				});
			}
		}

		customElements.define("tr-label", LayoutLabelProperty);
	})();

	// tr-select
	(function() {
		class SelectTextElement extends HTMLElement {
			constructor() {
				super();
				this.options = [];
				this.select = null;
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			get size() {
				return this.hasAttribute("size");
			}
			get sizeValue() {
				return this.getAttribute("size");
			}

			connectedCallback() {
				const instance = this;

				this.select = document.createElement("select");

				this.options = this.querySelectorAll("tr-option");
				this.options.forEach(function(option, index) {
					var el = document.createElement("option");

					el.textContent = option.textContent;

					el.setAttribute("value", option.getAttribute("value"));

					if (!el.textContent) {
						el.textContent = option.getAttribute("value");
					}

					if (option.hasAttribute("selected")) {
						el.selected = true;
					}

					instance.select.appendChild(el);
					option.style.display = "none";
				});

				this.appendChild(this.select);

				var updateSelect = function() {
					Tracker.updateLayoutMultiple([{
						property: instance.property,
						value: instance.select.value
					}, {
						property: Tracker.getLabelPropertyName(instance.property),
						value: instance.options[instance.select.selectedIndex].getAttribute("label")
					}]);
				}

				this.select.onchange = function(e) {
					e.stopPropagation();
					updateSelect();
				};

				if (this.hasAttribute("disabled")) {
					this.select.setAttribute("disabled", "disabled");
				}

				if(this.size){
					this.select.setAttribute("size", instance.sizeValue);
				}

				document.addEventListener("tr-layout", function(e) {
					var value;

					if (e.detail) {
						value = e.detail[instance.property];
					}

					if (typeof(value) !== "undefined") {
						instance.select.value = value;
					} else {
						var initialIndex = Array.prototype.slice.call(instance.options).findIndex(function(e) {
							return e.hasAttribute("selected");
						});

						if (initialIndex === -1) {
							initialIndex = 0;
						}

						instance.select.selectedIndex = initialIndex;
						setTimeout(updateSelect, 1);
						return;
					}

					instance.options.forEach(function(option) {
						if (option.hasAttribute("target") && option.hasAttribute("toggle-class")) {
							var targets = document.querySelectorAll(option.getAttribute("target"));

							targets.forEach(function(el) {
								if (option.getAttribute("value") === instance.select.value) {
									el.classList.add(option.getAttribute("toggle-class"));
								} else {
									el.classList.remove(option.getAttribute("toggle-class"));
								}
							});
						}
					});
				});
			}
		};

		customElements.define("tr-select", SelectTextElement);
	})();

	// tr-select-toggle
	(function() {
		class SelectToggleElement extends HTMLElement {
			constructor() {
				super();
				this.options = [];
				this.select = null;
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			connectedCallback() {
				const instance = this;

				var getPropertyName = function(option) {
					if (option.hasAttribute("player")) {
						return Tracker.getPropertyAttribute(option, instance.property);
					} else {
						return option.getAttribute("value");
					}
				};

				this.select = document.createElement("select");
				this.options = this.querySelectorAll("tr-option");
				this.options.forEach(function(option, index) {
					var el = document.createElement("option");

					el.textContent = option.textContent;
					el.setAttribute("value", option.getAttribute("value"));

					if (!el.textContent) {
						el.textContent = option.getAttribute("value");
					}

					if (option.hasAttribute("selected")) {
						el.selected = true;
					}

					instance.select.appendChild(el);
					option.style.display = "none";
				});

				this.appendChild(this.select);

				var updateSelect = function() {
					var updates = [];

					instance.options.forEach(function(option, index) {
						var update = {}

						update.property = getPropertyName(option);

						if (option.getAttribute("value") == instance.select.value) {
							update.value = true;
						} else {
							update.value = false;
						}

						updates.push(update);
					});

					Tracker.updateLayoutMultiple(updates);
				};

				this.select.onchange = function(e) {
					e.stopPropagation();
					updateSelect();
				};

				document.addEventListener("tr-layout", function(e) {
					var isValueFound = false;
					
					instance.options.forEach(function(option) {
						var value = false;

						if (e.detail) {
							value = e.detail[getPropertyName(option)] || false;
						}

						if (option.hasAttribute("target") && option.hasAttribute("toggle-class")) {
							var targets = document.querySelectorAll(option.getAttribute("target"));

							targets.forEach(function(el) {
								if (value) {
									el.classList.add(option.getAttribute("toggle-class"));
								} else {
									el.classList.remove(option.getAttribute("toggle-class"));
								}
							});
						}

						if (value) {
							instance.select.value = option.getAttribute("value");
							isValueFound = true;
						}
					});

					if (!isValueFound) {
						var initialIndex = Array.prototype.slice.call(instance.options).findIndex(function(e) {
							return e.hasAttribute("selected");
						});

						if (initialIndex === -1) {
							initialIndex = 0;
						}

						instance.select.selectedIndex = initialIndex;
						setTimeout(updateSelect, 1);
					}
				});
			}
		};

		customElements.define("tr-select-toggle", SelectToggleElement);
	})();

	// tr-template
	(function() {
		class LayoutTemplateProperty extends HTMLElement {
			constructor() {
				super();
			}

			get source() {
				return this.getAttribute("source");
			}

			get href() {
				return this.getAttribute("href");
			}

			connectedCallback() {
				const instance = this;

				if (this.href) {
					var xhr = new XMLHttpRequest();

					xhr.open("GET", this.href, true);
					xhr.onload = function(e) {
						if (xhr.readyState === 4) {
							if (xhr.status === 200) {
								instance.innerHTML = xhr.responseText;
							} else {
								console.log(xhr.statusText);
							}
						}
					};
					xhr.onerror = function(e) {
						console.log(xhr.statusText);
					};
					xhr.send();
				} else {
					var content = document.querySelector(this.source).content;

					this.appendChild(document.importNode(content, true));
				}
			}
		}

		customElements.define("tr-template", LayoutTemplateProperty);
	})();

	// tr-text
	(function() {
		class LayoutProperty extends HTMLElement {
			constructor() {
				super();
				this.goalWidth = 0;
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			get scaleToFit() {
				return this.hasAttribute("scale-to-fit");
			}

			get scaleToFitMaxWidth() {
				return this.hasAttribute("scale-to-fit-max-width");
			}

			connectedCallback() {
				const instance = this;

				this.goalWidth = this.offsetWidth;

				document.addEventListener("tr-layout", function(e) {
					instance.textContent = "";

					if (!e.detail) {
						return;
					}

					const value = e.detail[instance.property];

					if (!value) {
						instance.textContent = "";
						return;
					}

					instance.textContent = value;
				});

				if (instance.scaleToFit) {
					var mutationObserver = new MutationObserver(function(mutationList) {
						// TODO: Find out why and/or workaround to width not being defined leading to right offset
						var mutation = mutationList[0];
						var target = mutation.target;

						if (target.nodeName === "#text") {
							target = target.parentNode;
						}

						var finalTransform = target.style.transform;

						if (finalTransform.indexOf("scaleX") !== -1) {
							finalTransform = finalTransform.replace(/scaleX\(.*?\) */g, "");
						}

						var goalWidth = instance.goalWidth;
						if (instance.scaleToFitMaxWidth) {
							goalWidth = instance.offsetWidth;
						}
						if (target.scrollWidth > goalWidth) {
							var scaleAmount = goalWidth / target.scrollWidth;
							var marginAmount = scaleAmount * ((goalWidth - target.scrollWidth) / 2);

							finalTransform += " scaleX(" + scaleAmount + ") ";
							target.style.marginLeft = marginAmount + "px";
						} else {
							finalTransform += " scaleX(1) ";
							target.style.marginLeft = 0;
						}

						target.style.transform = finalTransform;

						// TODO: completely replace the marginLeft adjustment with transform-origin: left
						// It does the same thing but works with any text alignment.
						if (instance.scaleToFitMaxWidth) {
							target.style.marginLeft = 0;
							target.style.transformOrigin = "left"
						}
					});

					mutationObserver.observe(this, {
						childList: true,
						characterData: true,
						subtree: true
					});
				}
			}
		}

		customElements.define("tr-text", LayoutProperty);
	})();

	// tr-timer
	(function() {
		class TimerProperty extends HTMLElement {
			constructor() {
				super();
				this.lastUpdate = 0;
				this.isRunning = false;
				this.elapsed = 0;
				this.serverTime = 0;
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			get includePadding() {
				return this.getAttribute("include-padding");
			}

			get targets() {
				return document.querySelectorAll(this.getAttribute("target"));
			}

			get toggle_class() {
				return this.getAttribute("toggle-class");
			}

			connectedCallback() {
				const instance = this;

				var updateTimer = function() {
					var time = Tracker.parseMS(instance.elapsed);

					instance.innerHTML = Tracker.dateToTags(time, instance.includePadding);

					if (instance.isRunning) {
						instance.setAttribute("running", true);
					} else {
						instance.removeAttribute("running");
					}

					instance.targets.forEach(function(el) {
						if (instance.isRunning) {
							el.classList.add(instance.toggle_class);
						} else {
							el.classList.remove(instance.toggle_class);
						}
					});
				};

				var timerInterval = function() {
					if (instance.isRunning === false) {
						return;
					}

					var now = new Date();
					instance.elapsed += now - instance.lastUpdate;
					instance.lastUpdate = now;
					updateTimer();
				};

				setInterval(timerInterval, 50);

				document.addEventListener("tr-layout", function(e) {
					if (!e.detail) {
						return;
					}

					const value = e.detail[instance.property];

					if (!value) {
						instance.lastUpdate = 0;
						instance.isRunning = false;
						instance.elapsed = 0;
						instance.serverTime = 0;
						updateTimer();
						return;
					}

					instance.lastUpdate = new Date();
					instance.isRunning = value.isRunning;

					if (instance.isRunning) {
						instance.elapsed = value.elapsed + (e.detail["__now__"] - value.serverTime);
					} else {
						instance.elapsed = value.elapsed;
					}

					instance.serverTime = value.serverTime;
					updateTimer();
				});
			}
		}

		customElements.define("tr-timer", TimerProperty);
	})();

	// tr-timestamp
	(function() {
		class LayoutTimestampProperty extends HTMLElement {
			constructor() {
				super();
			}

			get property() {
				return Tracker.getTimestampPropertyName(Tracker.getPropertyAttribute(this));
			}

			connectedCallback() {
				const instance = this;

				document.addEventListener("tr-layout", function(e) {
					instance.textContent = "";

					if (!e.detail) {
						return;
					}

					const value = e.detail[instance.property];

					if (!value) {
						return;
					}

					instance.textContent = value;
				});
			}
		}

		customElements.define("tr-timestamp", LayoutTimestampProperty);
	})();

	// tr-toggle
	(function() {
		class ToggleElement extends HTMLElement {
			constructor() {
				super();
				this.initialDisplay = this.style.display;
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			connectedCallback() {
				const instance = this;

				document.addEventListener("tr-layout", function(e) {
					var value = true;

					if (e.detail) {
						value = e.detail[instance.property];

						if (value === null) {
							value = true;
						}
					}

					if (value) {
						instance.style.display = instance.initialDisplay;
					} else {
						instance.style.display = "none";
					}
				});
			}
		}

		customElements.define("tr-toggle", ToggleElement);
	})();

	// tr-toggle-class
	(function() {
		class ToggleClassElement extends HTMLElement {
			constructor() {
				super();
			}

			get property() {
				return Tracker.getPropertyAttribute(this);
			}

			get toggle_class() {
				return this.getAttribute("toggle-class");
			}

			get value() {
				return this._value;
			}

			set value(v) {
				if (v) {
					this.classList.add(this.toggle_class);
				} else {
					this.classList.remove(this.toggle_class);
				}

				this._value = v;
			}

			connectedCallback() {
				const instance = this;

				document.addEventListener("tr-layout", function(e) {
					if (!e.detail) {
						return;
					}

					instance.value = (e.detail[instance.property] == true);
				});

				instance.onclick = function(e) {
					Tracker.updateLayout(instance.property, !instance.value);
				};
			}
		}

		customElements.define("tr-toggle-class", ToggleClassElement);
	})();

	/////////////////////////////////////////////
	// Dual Split
	/////////////////////////////////////////////
	// Helpers
	function dsGetTimer(node) {
		let parent = node.closest("tr-ds") || node;
		return parent.getAttribute("timer");
	}

	function dsGetProperty() {
		return "tr-ds-stages";
	}

	function dsGetStage(node) {
		let parent = node.closest("tr-ds-stage") || node;
		return Number(parent.getAttribute("stage"));
	}

	// tr-ds-timestamp
	(function() {
		class LayoutDSTimestampProperty extends HTMLElement {
			constructor() {
				super();
			}

			get property() {
				return dsGetProperty();
			}

			get player() {
				return Number(this.getAttribute("player"));
			}

			get stage() {
				return dsGetStage(this) - 1;
			}

			connectedCallback() {
				const instance = this;

				document.addEventListener("tr-layout", function(e) {
					instance.textContent = "";

					if (!e.detail) {
						return;
					}

					const value = e.detail[instance.property];

					if (!value) {
						return;
					}

					if (!value[instance.stage]) {
						return;
					}

					let stage = value[instance.stage][instance.player];

					if (!stage) {
						return;
					}

					let elapsed = stage.elapsed;

					instance.textContent = Tracker.dateToText(Tracker.parseMS(elapsed));
				});
			}
		}

		customElements.define("tr-ds-timestamp", LayoutDSTimestampProperty);
	})();

	// tr-ds-timediff
	(function() {
		class LayoutDSTimedifffProperty extends HTMLElement {
			constructor() {
				super();
			}

			get property() {
				return dsGetProperty();
			}

			get player() {
				return Number(this.getAttribute("player"));
			}

			get stage() {
				return dsGetStage(this) - 1;
			}

			get negativeClass() {
				return Number(this.getAttribute("negative-class")) || "negative";
			}

			get positiveClass() {
				return Number(this.getAttribute("positive-class")) || "positive";
			}

			connectedCallback() {
				const instance = this;

				document.addEventListener("tr-layout", function(e) {
					instance.textContent = "";
					instance.classList.remove(instance.negativeClass);
					instance.classList.remove(instance.positiveClass);

					if (!e.detail) {
						return;
					}

					const value = e.detail[instance.property];

					if (!value) {
						return;
					}

					if (!value[instance.stage]) {
						return;
					}

					let stage = value[instance.stage][instance.player];

					if (!stage) {
						return;
					}

					let diff = stage.diff;

					if (!diff) {
						return;
					}

					if (diff < 0) {
						instance.classList.add(instance.negativeClass);
						instance.textContent = Tracker.dateToText(Tracker.parseMS(-diff));
					} else {
						instance.classList.add(instance.positiveClass);
						instance.textContent = Tracker.dateToText(Tracker.parseMS(diff));
					}
				});
			}
		}

		customElements.define("tr-ds-timediff", LayoutDSTimedifffProperty);
	})();

	// tr-ds-controls
	(function() {
		class LayoutDSControlsProperty extends HTMLElement {
			constructor() {
				super();
				this.isRunning = false;
				this.elapsed = 0;
				this.serverTime = 0;
				this.stages = [];
			}

			get property() {
				return dsGetProperty();
			}

			get timerProperty() {
				return Tracker.getPropertyAttribute(null, this.getAttribute("timer"));
			}

			get player() {
				return Number(this.getAttribute("player"));
			}

			get opponent() {
				return Number(this.getAttribute("opponent"));
			}

			get adjustments() {
				return (this.getAttribute("adjustments") || "1,10").split(",");
			}

			connectedCallback() {
				const instance = this;

				var calculateDiff = function(stage) {
					var split = instance.stages[stage] || {};

					if (split[instance.player] && split[instance.opponent]) {
						// Find diff between players
						let diff = split[instance.opponent].elapsed - split[instance.player].elapsed;
						split[instance.player].diff = -diff;
						split[instance.opponent].diff = diff;
					}

					instance.stages[stage] = split;
				};

				this.adjustments.reverse().forEach(function(adjustment) {
					var button = document.createElement("button");

					button.textContent = "-" + adjustment + "s";
					button.classList.add("adjustment");
					button.onclick = function() {
						let currentStage = -1;

						for (let i = 0; i < instance.stages.length; i++) {
							if (instance.stages[i][instance.player]) {
								currentStage = i;
							}
						}

						if (currentStage >= 0) {
							instance.stages[currentStage][instance.player].elapsed -= adjustment * 1000;
						}

						calculateDiff(currentStage);
						Tracker.updateLayout(instance.property, instance.stages);
					};
					instance.appendChild(button);
				});

				const splitButton = document.createElement("button");
				const reverseButton = document.createElement("button");

				splitButton.innerHTML = "Split";
				reverseButton.innerHTML = "Reverse";

				splitButton.classList.add("split");
				reverseButton.classList.add("reverse");

				splitButton.onclick = function() {
					if (!instance.stages) {
						instance.stages = [];
					}

					Tracker.getServerTime().then(function (data) {
						let currentStage = 0;

						for (let i = 0; i < instance.stages.length; i++) {
							if (instance.stages[i][instance.player]) {
								currentStage = i+1;
							}
						}

						if (!instance.stages[currentStage]) {
							instance.stages[currentStage] = {};
						}

						let newSplit = instance.stages[currentStage];

						newSplit[instance.player] = {
							elapsed: instance.elapsed + (data.val() - instance.serverTime)
						};

						calculateDiff(currentStage);
						Tracker.updateLayout(instance.property, instance.stages);
					});
				};
				reverseButton.onclick = function() {
					let currentStage = -1;

					for (let i = 0; i < instance.stages.length; i++) {
						if (instance.stages[i][instance.player]) {
							currentStage = i;
						}
					}

					if (currentStage >= 0) {
						instance.stages[currentStage][instance.player] = null;

						if (instance.stages[currentStage][instance.player]) {
							instance.stages[currentStage][instance.player].diff = null;
						}

						if (instance.stages[currentStage][instance.opponent]) {
							instance.stages[currentStage][instance.opponent].diff = null;
						}

						Tracker.updateLayout(instance.property, instance.stages);
					}
				};

				instance.appendChild(splitButton);
				instance.appendChild(reverseButton);

				this.adjustments.forEach(function(adjustment) {
					var button = document.createElement("button");

					button.textContent = "+" + adjustment + "s";
					button.classList.add("adjustment");
					button.onclick = function() {
						let currentStage = -1;

						for (let i = 0; i < instance.stages.length; i++) {
							if (instance.stages[i][instance.player]) {
								currentStage = i;
							}
						}

						if (currentStage >= 0) {
							instance.stages[currentStage][instance.player].elapsed += adjustment * 1000;
						}

						calculateDiff(currentStage);
						Tracker.updateLayout(instance.property, instance.stages);
					};
					instance.appendChild(button);
				});

				document.addEventListener("tr-layout", function(e) {
					if (!e.detail) {
						instance.stages = [];
						return;
					}

					const timerValue = e.detail[instance.timerProperty];
					
					if (!timerValue) {
						instance.isRunning = false;
						instance.elapsed = 0;
						instance.serverTime = 0;
					} else {
						instance.isRunning = timerValue.isRunning;
						instance.elapsed = timerValue.elapsed;
						instance.serverTime = timerValue.serverTime;
					}

					const value = e.detail[instance.property];

					if (!value) {
						return;
					}
					
					instance.stages = value;
				});

				document.addEventListener("tr-reset", function(e) {
					instance.stages = [];
					instance.isRunning = false;
					instance.elapsed = 0;
					instance.serverTime = 0;
					instance.stages = [];
				});
			}
		}

		customElements.define("tr-ds-controls", LayoutDSControlsProperty);
	})();
})();