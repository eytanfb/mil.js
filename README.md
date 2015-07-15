# mil.js

This is a project to simplify using input fields on forms, that only requires jQuery.

###field.js

This file contains the logic for the input fields. You need to instantiate a Field object for every input.

`var username = new Field()`

The Field constructor takes an object parameter. Here are the things you can pass in the object:

* jQueryElement         - The DOM object that the Field should bind to
* validations           - An array of validation functions
* message               - Message to display on errors
* subscribers           - Array of Fields that subscribes to the validation action of the Field
* helpTextDom           - Help text DOM to display help text
* helpText              - Help text that displays if given a help text DOM
* doOnValidationChanged - function to execute on validation change
