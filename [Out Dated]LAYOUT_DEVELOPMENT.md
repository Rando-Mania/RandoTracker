# Don't use this file

This is documentation for RandoTracker 1.0 and is therefore out of date. Use 2.0 documentation instead.

# Layout Development

This file is for all you layout developers out there.  It will detail how to setup your local development environment, along with what features are available to you so you create all the layouts that you want!  

NOTE: If it seems like there's a feature that you would like implemented, please don't hesitate and make an Issue on Gitlab.  It never hurts to ask!

## Setting up Firebase Locally

1. Go to [Google Firebase](https://console.firebase.google.com/) and login with a Google account.  Ta-da, you now have free access to Google Firebase!
1. Create your own free instance of a Firebase project.  Note the name of this project as you'll need it to run your local instance.
1. Follow the instructions at [this link](https://firebase.google.com/docs/cli/?authuser=0#setup) and [this link](https://firebase.google.com/docs/web/setup?authuser=0#run_a_local_web_server_for_development) to get your local instance setup.
1. Run `firebase serve --project {project name}` in your cloned repository and you're live!

## Creating a new layout

So here's the directory structure that we need to try and adhere to.

- public
	- game
		- fonts
			- ttf files go here
		- images
			- all images for the game go here
		- script
			- all scripts (if any) for the game go here
		- player_count.html (one/two/three/four)
		- player_count.css
		- player_count_tracker.html
		- player_count_tracker.css

`player_count` can really be anything, but let's try and keep it obvious by making it the number of players the layout supports.

The `_tracker` is necessary if you want to support a Tracker view for your layout.  You really should as Trackers with a single monitor really need the real estate.

It helps to have a separate css file for the tracker and restream views as there can be differences, such as the background image, player name size, and so on.

Try and follow the naming scheme and structure of existing layouts where it makes sense.  Also include the necessary library files, such as 

	<link rel="stylesheet" type="text/css" href="../content/tracker.css"> 

and 

	<script defer src="/__/firebase/5.2.0/firebase-app.js"></script>
    <script defer src="/__/firebase/5.2.0/firebase-auth.js"></script>
    <script defer src="/__/firebase/5.2.0/firebase-database.js"></script>
    <script defer src="/__/firebase/init.js"></script>
    <script defer src="../script/tracker.js"></script>

For example, this is a good basic, working template to start from

	<!DOCTYPE html>
	<html>
	<head profile="http://www.w3.org/2005/10/profile">
		<meta charset="utf-8">
		<title>Game Name Tracker</title>
		<link rel="stylesheet" type="text/css" href="../content/tracker.css">
		<link rel="stylesheet" type="text/css" href="four.css">
		<link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
		<link rel="icon item" type="image/x-icon" href="favicon.ico">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>
	<body>
		<!-- Layout goes here -->
	    <script defer src="/__/firebase/5.2.0/firebase-app.js"></script>
	    <script defer src="/__/firebase/5.2.0/firebase-auth.js"></script>
	    <script defer src="/__/firebase/5.2.0/firebase-database.js"></script>
	    <script defer src="/__/firebase/init.js"></script>
	    <script defer src="../script/tracker.js"></script>
	        <script defer type="text/javascript">
	    	(function(Tracker) {
	    		Tracker.loaded = function() {
	    			// This might not be necessary considering the complexity of your layout
	    			Module.init(4);
	    		}
	    	})(window.Tracker = window.Tracker || {});
	    </script>
	</body>
	</html>

## Standard elements

There are a number of elements that the Tracker library will try and automatically update for you, including Player Names, the Timer, Commentary, and more!  What you need to do is specify an element with the proper ID.  None of these are absolutely required.  Here is what's currently supported.

### `player_name_#`

This element will be populated with the Player's Name.  The # should be replaced with the number of the player you want this to represent.  Player IDs start counting at 1.

### `player_speaker_#`

This element will be shown/hidden by manipulating the `hidden` class.  It's usually a good idea to put the hidden class in yourself to make sure all speakers are disabled at the start.  The # should be replaced with the number of the player you want this to represent.  Player IDs start counting at 1.

### `player_final_#`

This element will be filled with the final time for said Player.  If not set or empty, the hidden class will be applied.  The # should be replaced with the number of the player you want this to represent.  Player IDs start counting at 1.

### `commentators`

This element represents the names of all commentators.  Depending on your layout, you can support multi-line text or single-line text.  The Tracker library will insert a `<br />` tag if specified by the tracker.

### `timer`

This elements represents the timer.

## data attributes available

So there are a number of attributes available to you in order to make your layout work with the tracker.js library.

### `data-child-player`

This element will set the `data-player` attribute of every child element with the value specified.  Very useful for icons that relate to particular players and is used pretty extensively by the Tracker library.  Supported on all elements.

### `data-toggle`

Set to `true` if you plan to use this.  This tells the Tracker library that this icon is to be toggled on and off by clicking on it.  This can be displayed by multiple images, or by CSS rules related to a class.  It depends on which of the below attributes you also set.

### `data-class-toggle`

If this is set, the Tracker library will add/remove the class specified as the value of this attribute.  This way you can add CSS rules to visually distinguish whether or not the Icon is active. (Controlling the opacity is a common option here)

### `data-on-image/data-off-image`

Both of these should be specified.  If CSS rules aren't your thing, you can specify the on/off images used here.  If this is on an `img` element, it will update the `src`.  If it's not an `img`, it will find the first `img` child and update the `src` on that element instead.

### `data-image`

It tends to make sense to wrap `img` tags in `span` or `div`, considering the situation.  It's quite tedious to then make children `img` tags for all those elements.  There's a way around that though with this data attribute.  If this is set, a child `img` tag will be created and the `src` will be set to the value specified here.  Supported on all elements.

### `data-property`

The name of the property that this element will be updating.  It doesn't realy matter what it is (within reason.  No special characters/spaces/etc) just as long as you're consistent about it between the Restream and Tracker layouts.

### `data-open-dialog`

This is used if the element is a multi-state versus an on/off state.  Then you can define a dialog to appear with the various options defined there and the value will be set on this element.  See the Dialogs item below for more details
.
### `data-copy-from`

Layouts tend to be repetitive, especially with the same item grid shared across players.  To avoid the manual work of doing the exact same positioning and keeping it all in sync, you can use this data attribute.  You specify a query string (ex. "#player-1-item-grid") as the value and this will clone every child contained in the element you defined and add them to the element this is defined on.  This work is done before the `data-child-player` attribute takes affect so don't worry about getting your Player IDs crossed here.  Supported on all elements.

### `data-repeat`

Sometimes you have A LOT of almost identical elements that need to be created, especially for layouts that contain maps (I'm looking at you Z1R).  To avoid all the manual work, set this attribute to a number and it will clone this element and add a sibling for the count you specify.  To help uniquely identify them in your code, the `data-index` attribute is set accordingly so the are all unique.  Supported on all elements.

### `data-final-hide`

Set this data attribute to `true` if you happen to have a `player_final_#` element contained in another element that you want to hide/show alongside the `player_final_#`.

### `data-label`

Set this to a value in order for a label element to be created.  It will have the `label` class specified.  Also requires a `data-label-top/data-label-bottom` attribute to be specified.  This value can be dynamically by a dialog element with the `data-label` attribute specified.

### `data-label-top/data-label-bottom`

Set either of these to true to determine if the `label-top` or `label-bottom` class is applied to the label element created if `data-label` is specified.

### `data-scale-to-fit`

Set to true if you want the content of said element to scale horizontally to fit the specified width.

## Dialogs

This is an element that should be hidden by default.  The Tracker library knows to attempt to use this element as a dialog another element leveraging the `data-open-dialog` attribute defined above.  This element currently required the class `dialog` to be added to it for some internal logic, but this requirement may be removed in the future.

There are some data attributes to set on the children elements of a dialog that help the Tracker library know which property to update and which value to assign said property.

### `data-set-prop`

This tells the Tracker that this element is something that can be clicked to set a property value on the element that opened the dialog.  Set to `true`.

### `data-property`

The name of the property to update.  Seems kind of redundant now as it should be using the property of the element that was clicked, but that work isn't complete yet.

### `data-value`

The value to set the property.  This is usually the path to the image that should be displayed on the icon what was selected.

### `data-label`

The value to set the label of a property that has `data-label` set on it.

## Tracker.init

You can provide a single number to this method that specifies the number of players for said layout (helps setup Settings menu).  However, you can pass in an object instead that has the following properties for more advanced features.

### `playerCount`

Used to specify the number of players for said layout.

### `enableComsLayout`

Add a 'Coms' button to the Settings menu that navigates to a `_coms.html` layout, much like a `_tracker.html` layout.  Useful if you have information that's relevant to just Commentary, such as ROM spoilers.

### `freetext`

An array of objects that define what free text fields you want available to you in this layout.  Each object in the array need to have the following fields defined to be used correctly.

#### `label`

Label to display alongside the input field in the settings menu.  Useful for multiple freetext fields.

#### `type`

Determines the type of input to add.  Currently supported: `text`, `textarea`, `button`, `select`.  Defaults to `text` if not specified.

#### `property`

Name of the layout property that this field will update.  Must like specifying `data-property` on an element.  Not used for `button` freetext inputs.

#### `event`

Function to call when the button is clicked.  Only used for `button` freetext inputs.

#### `rows`

Number of rows to display for the specified textarea.  Only used for `textarea` freetext inputs.

#### `options`

Array of objects that contain `value` and `text` properties.  Each will be added to the configured select input as an `option` tag.  Only used for `select` freetext inputs.

#### `onblur`

Set to true if you want to use the onblur vs oninput event for the input.  Only used for `text` and `textarea` freetext inputs.

### `additionalLoads`

An array of objects that define external html files to load and insert into the document.  Each object in the array are able to have the following values.

#### `path`

The path to use to load the html file.  By default is relative to the layout file, but absolute paths can be specified.  Required.

#### `parentElementQuery`

The query selector to use to find the element to insert the file into.  If not specified, the file is appended to the body of the document.

#### `callback`

Optional function that will be called once the file is inserted into the document.

## Custom JavaScript

There are some layouts that might need some custom code.  Hopefully the Tracker library gives you everything you need, but it's hard to plan ahead when you don't know the feature is needed.

Reach out to Datyedyeguy if you have questions as this requires some good knowledge of the Firebase Database API.  You can use Tracker.RoomReference to get the reference to the current room.  See more documentation [here](https://firebase.google.com/docs/database/web/read-and-write?authuser=0).
