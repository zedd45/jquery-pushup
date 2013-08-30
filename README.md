# jQuery Pushup

jQuery pushup is a direct port of "pushup":http://pushuptheweb.com/ by "Nick Stakenburg":http://www.nickstakenburg.com/. It's designed to use the built in features of jQuery to reduce file-size + unneeded duplication of functions (prototype opacity Vs. jQuery fade). 

## Installation

Download the jQuery pushup and place CSS, JS and images where needed. If you use a different file structure than the on provided than make sure you change the image URL in @jquery.pushup.js@.

*DO _NOT_ rename jquery.pushup.js, it's file name is used inside the script.*

## Changes between original

There are quite a few small diferences between this script and the original "pushup.js":http://pushuptheweb.com/

* Uses jQuery - duh; but this means smaller file, and easier to read.
* Allows for changing min browser, want FireFox 2 uesrs to upgrade to 3? Just change @jQuery.pushup.browsers@.
* HTML5 icon used [in place of Chrome icon](http://productforums.google.com/forum/#!topic/chrome/z70dwMeGCg4).

## Options

To change the options open up @js/jquery.pushup.js@ where the beginning of the file will have some options you can change.

* @appearDelay@: Delay in seconds before Pushup fades in.
* @fadeDelay@: Delay in seconds before Pushup fades out.
* @images@: Location of the images relative to @jQuery.pushup.js@ (absolute URL's are allowed; both @http://@ _and_ @/@)
* @message@: The update message users will see when their browser needs an update.
* @reminder.hours@: Time in hours used when clicked on the reminder message.
* @reminder.message@: The reminder message, @#{hours}@ will be replaced by reminder.hours.
* *Bonus* @jQuery.pushup.browsers@ is an easier way to change minimum browser versions.

## Functions

* @jQuery.pushup.init()@: This is called on document load, it tests to see if a pushup message should be shown and if so then shows one.
* @jQuery.pushup.show([browser, options])@: Shows the pushup message, you can overwrite the browser shown by using the @browser: String@ parameter.
* @jQuery.pushup.hide()@: Hides currently shown pushup message.
* @jQuery.pushup.setReminder(hours)@: Set a cookie that prevents pushup from showing for @hours@ amount of time.
* @jQuery.pushup.resetReminder()@: Resets the reminder time so that Pushup will show up on the next visit, if required.

## More:

If you don't want to have the @jQuery.pushup.init()@ called on DOM ready then remove it from the bottom of @jquery.pushup.js@.

## TODO:

 * Refactor more and reduce bloat.
 * Setup options for @show()@