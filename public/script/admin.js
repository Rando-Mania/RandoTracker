(function(Admin) {
	var onchangeIsAdmin = function() {
		firebase.database().ref("/users").child(this.dataset.user).child("isApproved").set(this.checked);
	};

	var loadData = function() {
		firebase.database().ref("/users").once("value", function (data) {
			var users = data.val();
			var tbody = document.getElementById("tblUsers").querySelector("tbody");

			while (tbody.firstChild) {
				tbody.removeChild(tbody.firstChild);
			}

			Object.keys(users).forEach(function(key, index) {
				var user = users[key];
				var row = document.createElement("tr");
				var cell = document.createElement("td");
				cell.textContent = key;
				row.appendChild(cell);

				cell = document.createElement("td");
				cell.textContent = user.displayName;
				row.appendChild(cell);

				cell = document.createElement("td");
				cell.textContent = user.isAdmin ? "Yes" : "No";
				row.appendChild(cell);

				cell = document.createElement("td");
				var input = document.createElement("input");
				input.type = "checkbox";
				input.dataset.user = key;
				input.checked = user.isApproved;
				input.addEventListener("change", onchangeIsAdmin);
				cell.appendChild(input);

				row.appendChild(cell);
				tbody.appendChild(row);
			});
		});
	};

	Admin.init = function() {
		firebase.auth().onAuthStateChanged(function(user) {
			if (!user) {
				location.href = location.protocol.concat("//").concat(window.location.host);
			}

			if (user.isAnonymous) {
				location.href = location.protocol.concat("//").concat(window.location.host);
			}

			var profileRef = firebase.database().ref("/users").child(user.email.replace(new RegExp("\\.", "g"), "_"));

			profileRef.child("isAdmin").once("value", function (data) {
				if (!data.val()) {
					location.href = location.protocol.concat("//").concat(window.location.host);
					return;
				}

				loadData();
			}).catch (function (error) {
				location.href = location.protocol.concat("//").concat(window.location.host);
			});
		});
	};
}(window.Admin = window.Admin || {}));