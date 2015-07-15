var FieldValidator = (function() {
  var _validateForm = function(fields, options) {
    var valid = false;
    options = options || {};
    var shouldBreak = true;
    if(options.shouldBreak !== undefined) shouldBreak = false;
    if (validateFields(fields, shouldBreak, options.invalidHook)) {
      valid = true;
      if (options.additionalValidation !== undefined && typeof options.additionalValidation === 'function') {
        valid = options.additionalValidation();
      }
    } else {
      valid = false;
    }
    return valid;
  };

  var validateFields = function(fields, shouldBreak, invalidHook) {
    var valid = true;
    var result = true;
    for (var i = 0, l = fields.length; i < l; i++) {
      var field = fields[i];
      valid = field.validate();
      if (!valid) {
        result = false;
        if (invalidHook !== undefined && typeof invalidHook === 'function') {
          invalidHook(field);
        }
        field.showError();
        if (shouldBreak) {
          break;
        }
      } else {
        field.showSuccess();
      }
    }
    return result;
  };

  var validateField = function(field) {
    var valid = field.validate();
    if (!valid) {
      field.showError();
    } else {
      field.showSuccess();
    }
  };

  var addValidationOnEvent = function(event, field) {
    field.dom.on(event, function() {
      field.showDefault();
      validateField(field);
    });
  };

  var _addEventToFields = function(event, fields) {
    var len = fields.length;
    while (len--) {
      var field = fields[len];
      addValidationOnEvent(event, field);
    }
  };

  return {
    validateForm: _validateForm,
    addEventToFields: _addEventToFields
  };
}());
