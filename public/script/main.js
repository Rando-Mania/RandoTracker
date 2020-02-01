(function(Main) {
	var elLogin = null;
	var elAuth = null;

	Main.init = function() {
		elLogin = document.getElementById("login");
		elNotApproved = document.getElementById("not_approved");
		elAuth = document.getElementById("auth");
		elControls = document.getElementById("controls");

		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				// User is signed in.
				var displayName = user.displayName || "User";
				var email = user.email;
				var emailVerified = user.emailVerified;
				var photoURL = user.photoURL;
				var isAnonymous = user.isAnonymous;
				var uid = user.uid;
				var providerData = user.providerData;
				
				if (isAnonymous) {
					elLogin.style.display = "initial";
					elAuth.style.display = "none";
				} else {
					var profileRef = firebase.database().ref("/users").child(email.replace(new RegExp("\\.", "g"), "_"));

					profileRef.child("displayName").set(displayName);
					profileRef.once("value", function (data) {
						var user = data.val();
						var isApproved = user.isApproved || user.isAdmin;

						elControls.style.display = "initial";
						document.getElementById("user_name").textContent = displayName;

						if (!isApproved) {
							elNotApproved.style.display = "initial";
							elLogin.style.display = "none";
						} else {
							if (user.isAdmin) {
								document.getElementById("btnAdmin").style.display = "initial";
							}

							elLogin.style.display = "none";
							elAuth.style.display = "initial";
						}
					});
				}
			} else {
				// User is signed out.
				elLogin.style.display = "initial";
				elAuth.style.display = "none";
			}
		});

		var ui = new firebaseui.auth.AuthUI(firebase.auth());

		ui.start('#firebaseui-auth-container', {
			signInOptions: [
				firebase.auth.EmailAuthProvider.PROVIDER_ID,
				{
					provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
					customParameters: {
						prompt: "select_account"
					}
				}
			],
			callbacks: {
				signInSuccessWithAuthResult: function (authResult, redirectUrl) {
					location.reload(true);
					return false;
				}
			}
		});
	};

	Main.logout = function() {
		firebase.auth().signOut().then(function() {
			location.reload(true);
		}, function() {
			alert("Error logging out.");
		});
	};

	Main.showAdmin = function() {
		location.href = location.protocol.concat("//").concat(window.location.host) + "/admin.html"; 
	};
}(window.Main = window.Main || {}));