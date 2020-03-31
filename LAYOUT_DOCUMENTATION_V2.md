# Layout Development

This details out all of the different components that you have available to you, along with all their options and interworkings.  Hopefully it's a useful resource for layout development.

# Tracker

`components/tracker.js` is the main driver for the layout system.  It has a few public methods & events that you can use for any custom development/features that are needed for specific layouts (See DWR and its ROM Parsing)

### Tracker.onUpdateLayout(data)

This is an callback that you can override in order to modify `data` that is about to be sent to the server to be updated.  Useful if you want multiple pieces of data to be updated at once based on one element changing.

### Tracker.getLayoutData(callback)

This is a method you can call, providing a `callback` that accepts a data object, in order to get the current state of the room's data.

```
Tracker.getLayoutData(function(data) {
    if (data["player-panels"] == "items") {
        ...
    } else {
        ...
    }
});
```

### Tracker.updateLayout(property, value)

Call this to update a specific data `property` with a specific `value`.

```
Tracker.updateLayout('commentators','Chewbacca\nJar Jar Binks');
```

If an attribute is player specific, then the property name should be pre-pended with `__p#__`, where # is the `player` attribute value. Double underscore is used to avoid collisions.

```
Tracker.updateLayout('__p1__player-name','AnakinSkywalker');
```

### Tracker.updateLayoutMultiple(updates)

Call this to send multiple data updates at once.  `updates` is an array of objects that contain a `property` and `value` attribute.

```
Tracker.updateLayoutMultiple([
    {property: 'commentators', value: 'Chewbacca\nJar Jar Binks'},
    {property: 'restreamers', value: 'R2D2'},
    {property: 'trackers', value: 'C3PO, BB-8'}
]);
```

If an attribute is player specific, then the property name should be pre-pended with `__p#__`, where # is the `player` attribute value. Double underscore is used to avoid collisions.

```
Tracker.updateLayoutMultiple([
    {property: '__p1__player-name', value: 'AnakinSkywalker'},
    {property: '__p2__player-final', value: '1:23:45'},
    {property: '__p2__toggle-winner', value: 1}
]);
```

### Tracker.getPropertyAttribute(node, propertyOverride, playerOverride)

Used extensively in components, this gets you what the property name is for a specific node.  Takes into account `player` attributes, parent `tr-player` tags, and so on.

If an attribute is player specific, then the property name should be pre-pended with `__p#__`, where # is the `player` attribute value. Double underscore is used to avoid collisions.

### Tracker.getLabelPropertyName(property)

Used to get the name of the label property that is tied to a specific property.  Used by components to avoid collisions.

### Tracker.getTimestampPropertyName(property)

Used to get the name of the timestamp property that is tied to a specific property   Used by components to avoid collisions.

### Tracker.parseMS(ms)

Used to take a millisecond value and return an object with `hours`, `minutes`, `seconds`, and `ms`.  Useful for timers.

### Tracker.dateToText(time, includePadding)

Used to return in plain text what the `time` object represents.  It is assumed that `time` is an object returned by `Tracker.parseMS`.  `includePadding` determines whether or not to padd out leading `0` on hours and minutes.

### Tracker.dateToTags(time, includePadding)

Used to return `span` elements that can be used to display the time that the `time` object represents.  It is assumed that `time` is an object returned by `Tracker.parseMS`.  This allows customization of the display as `:` and `.`, along with `ms` have classes that can be used to hide/customize these elements via CSS.

### Tracker.getServerTime `async`

async function that returns the timestamp the server is using for `now`.  Useful for timers, timestamps, etc.  AVOID USING LOCAL TIME IF AT ALL POSSIBLE.

### Tracker.timerToTimeValue(timer)

Parses a string into the number of `ms` that it represents.  Useful for manual input of times.  Example would be `1:00:00` for one hour.

### Tracker.resetRoom(trackingOnly)

Clears out all data in the current room.  `trackingOnly` removes all properties EXCEPT properties that contain `name`, `comm`, `restream`, `tracker`, or `best`.  Useful for best-of-3 matches/etc.  Fires a `tr-reset` event.

### Tracker.openView(view)

Redirects the browser to the specified `page` of the room.  Common examples include tracker/comms versions of the main view.

### Tracker.getCurrentView

Used by components to determine what is the current view.

### Tracker.attemptToBeSuper(passcode, callback)

Attempts with the provided `passcode` for the current user to be super/elevated.  Useful for ROM dumping, etc.  `callback` is called with a true/false argument with the results of the attempt.

### Tracker.isUserSuper(callback)

Checks if the current user is already super.  `callback` is provided a true/false argument with the results.

### Tracker.setActiveTimer(property)

Specifies the property that represents which timer is considered 'active'.  Used to calculate timestamps.

### Tracker.downloadTemplate(href)

Queues the file to be downloaded by the Tracker.  A `tr-template` event will be fired when it is downloaded (or pulled from local cache).  The `detail` of the event will contain the `href` specified, along with the `content` of the download.  Any errors are printed to the console.

# Components

In addition to this document the components can be seen in action on the "Component Demos" linked on the RandoTracker homepage.

### tr-button-reset

Creates a `button` element that can be clicked by the user to reset the room via `Tracker.resetRoom`.

```
<tr-button-reset></tr-button-reset>
```

outputs...

```
<tr-button-reset>
    <button>Reset Room</button>
</tr-button-reset>
```

#### tracking

Set to true if you only want to reset tracking properties.  See `Tracker.resetRoom` for more details

```
<tr-button-reset tracking="true"></tr-button-reset>
```

outputs

```
<tr-button-reset tracking="true">
    <button>Reset Tracking</button>
</tr-button-reset>
```

### tr-button-timer

Creates three buttons (start, reset, pause) that can be used to control the timer.  Each has their own class for styling purposes.

- Start: A value is read from `tr-input-timer` with the same property name to initialize said timer.  Also used to resume a paused timer.
- Reset: Used to reset/stop said timer.  A confirmation will appear in a span with the `reset-confirm` class to avoid accidental resets.
- Pause: Used to pause said timer.

#### property

The property name representing the timer in question.

### tr-button-view

When clicked, with call `Tracker.openView` with the provided `view` attribute.  `title` can be set to control the content of the button.

```
<tr-button-view view="" title="Layout"></tr-button-view>
<tr-button-view view="tracker" title="Tracker"></tr-button-view>
<tr-button-view view="coms" title="Commentators"></tr-button-view>
```

outputs

```
<tr-button-view view="" title="Layout">
    <button class="active">Layout</button>
</tr-button-view>

<tr-button-view view="tracker" title="Tracker">
    <button>Tracker</button>
</tr-button-view>

<tr-button-view view="coms" title="Commentators">
    <button>Commentators</button>
</tr-button-view>
```

A class of `active` is added to the `button` related to the currently active view

### tr-class-if-full

An element that, if condition(s) are met, will add/remove the specified `toggle-class` class(es) to/from itself.

The condition in question is if all the elements that are found with the query string specified in the `target` attribute are not empty (textcontent).

### tr-hide-if-empty

Similar to `tr-class-if-full`, however also sets the `display` of itself to `none` or `initial` depending on the condition being met.

### tr-image

### tr-image-toggle

### tr-input-number

### tr-input-radio

### tr-input-text

For adding a networked text `input` element. Useful for imputing text such as player names, etc to the database. Pairs with a `tr-text` element with matching `property` attribute for output on layout.

Supports `list` attribute for use with `datalist`.

```
<tr-input-text class="coordinates" property="coordinates">
<tr-input-text player="1" class="name-input" property="player_name">
```

outputs

```
<tr-input-text class="coordinates" property="coordinates">
    <input type="text">
</tr-input-text>

<tr-input-text player="1" class="name-input" property="player_name">
    <input type="text">
</tr-input-text>
```

### tr-input-textarea

### tr-input-toggle

### tr-input-toggle-class

### tr-label

### tr-select

supports `size` attribute

### tr-select-toggle

### tr-template

Templates for reuseable content. Templates can be nested. There are 2 kinds:

Template from html element on the same page. Accepts the content of a `template` element with the associated id as its `source`.

```
<tr-template source="#player_info"></tr-template>

<template id="player_info">
    ...
    Template content goes here
    ...
</template>
```

Template from a separate .html file

html file does not need to include a `template` tag.

```
<tr-template href="tracking-icons.html"></tr-template>
```

### tr-text

Used to output text based database entries onto a layout. Pairs with a `tr-input-text`. property

```
<tr-text property="player-name"></tr-text>
```

```
<tr-text property="player-name">
    [Database entry for the property `player-name` will be output here]
</tr-text>
```

### `scale-to-fit`

`scale-to-fit` is an attribute for horizontally scaling overflowing text to fit in a fixed width container. Accomplished through a `transform: scaleX();` and a `margin-left`.

Trouble shooting:

- Container must be a block element (components.css takes care of this)
- must have a width?
- `player-name:empty{ display: none;}` will cause a `transform: scaleX(0)'

```
<tr-text scale-to-fit property="player-name"></tr-text>
```

```
<tr-text scale-to-fit property="player-name" style="margin-left: -28.7335px; transform: scaleX(0.845103);">
    AlbusPercivalWulfricBrianDumbledore
</tr-text>
```

### tr-timer

```
<tr-timer property="timer-test"></tr-timer>
```

```
<tr-timer property="timer-test">
    <span class="colon">:</span>
    <span>0</span>
    <span>0</span>
    <span class="dot">.</span>
    <span class="ms">0</span>
</tr-timer>
```

##### target/toggle-class

Adds a class to an element when the timer is running:

```
<tr-timer property="timer-test" target=".panel h2" toggle-class="italics"></tr-timer>
```

#### include-padding="true"

adds padding zeros in the hours and minutes places

```
<tr-timer property="timer-test" include-padding="true"></tr-timer>
```

```
<tr-timer property="timer-test" include-padding="true">
    <span>0</span>
    <span class="colon">:</span>
    <span>0</span>
    <span>0</span>
    <span class="colon">:</span>
    <span>0</span>
    <span>0</span>
    <span class="dot">.</span>
    <span class="ms">0</span>
</tr-timer>
```

#### tr-button-timer

Used for adding start, pause, and reset buttons to the `tr-timer`. Linked to a `tr-timer` through the `property` attribute.

```
<tr-button-timer property="timer-test"></tr-button-timer>
```

```
<tr-button-timer property="timer-test">
    <button class="start" style="display: initial;">Start</button>
    <button class="pause" style="display: none;">Pause</button>
    <button class="reset">Reset</button>
    <span class="reset-confirm" style="display: none;">Click Reset again to confirm.</span>
</tr-button-timer>
```

#### tr-input-timer

Allows manual changes to the `tr-timer`

```
<tr-input-timer property="timer-test"></tr-input-timer>
```

```
<tr-input-timer property="timer-test">
    <input type="text">
</tr-input-timer>
```

### tr-timestamp

Outputs the `tr-timer` value at the time an icon was selected. The icons is specified by a `property`.

```
<tr-timestamp property="flute"></tr-timestamp>
```

```
<tr-timestamp property="flute">
    :06.3
</tr-timestamp>
```

### tr-toggle

Toggles the visibility of this specific element by setting the display to `none` or whatever it defaulted to.  Logic is based on whether or not the value for the property is 'truthy'.

### tr-toggle-class

Similar to `tr-toggle`, but rather than toggling visibility outright, it adds/removes the specified class in the `toggle-class` attribute using similar logic.  Allows the ability to click said element to toggle.


# Dual Split Components

All Dual Split related components start with `tr-ds`.

### tr-ds-timestamp

Displays the time for the specified player/stage of Dual Split.  Player number is specified via the `player` attribute and stage is via the `stage` attribute, starting at `1` as the first stage.

### tr-ds-timediff

Displays the difference of time that this stage provided for said player/stage against their component as configured via `tr-ds-controls`.  Player is specified via `player`, stage is specified via `state`, starting at `1`.  The `negative` or `positive` classes are applied as appropriate depending on whether or not the player is ahead/behind of their opponent, but thse classes can be overriden via the `negative-class`/`positive-class` attributes.

### tr-ds-controls

This creates the Split/Reverse buttons that control splitting for the two players specified (henceforce known as `player` and `opponent`).  Set the `timer` attribute to the name of the timer to use for split timings.  Set `player` and `opponent` to the ids of the two players that are competing.  Set `adjustments` to the increments that you want to allow the user to use to adjust.  Defaults to `1,10`.  Comma delimited values are acceptable.
