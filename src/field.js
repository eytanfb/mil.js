var Field = function(argsObject) {
  var self = this;
  var events = ["change", "keypress"];
  this.dom = argsObject.jqueryElement;
  this.domType = function() {
    var type = argsObject.jqueryElement.prop("tagName");
    if (type !== undefined) {
      return type.toLowerCase();
    }
  }();
  this.validations = argsObject.validations || [];
  this.fields = {};
  this.message = argsObject.message || "";
  this.subscribers = argsObject.subscribers || [];
  this.helpText = argsObject.helpText || "";
  this.helpTextDom = argsObject.helpTextDom || null;
  this.doOnValidationChanged = argsObject.doOnValidationChanged || null;
  var validationsEnabled = function() {
    if (argsObject.validationsEnabled !== undefined) {
      return argsObject.validationsEnabled;
    }
    return true;
  }();

  var init = function() {
    if (argsObject.helpTextDom !== undefined) {
      argsObject.helpTextDom.html(argsObject.helpText);
    }
  }();

  this.validate = function() {
    if (validationsEnabled) {
      var allValidated = this.validations.every(function(validation) {
        var valid = validation(self.dom, self, self.fields);
        return valid;
      });
      if (allValidated === false) {
        notifySubscribersOfValidation(false);
        return false;
      }
      notifySubscribersOfValidation(true);
      return true;
    } else {
      return true;
    }
  };

  var notifySubscribersOfValidation = function(result) {
    self.subscribers.forEach(function(field) {
      field.validationChanged(result);
    });
  };

  this.validationChanged = function(result) {
    if (result === false) {
      if (this.doOnValidationChanged !== null) {
        this.doOnValidationChanged(this.dom, self, this.fields);
      }
      self.dom.prop("disabled", true);
      notifySubscribersOfValidation(false);
      this.showDefault();
    } else {
      if (typeof this.doOnValidationChanged === 'function') {
        this.doOnValidationChanged(this.dom, self, this.fields);
      } else {
        self.dom.prop("disabled", false);
      }
    }
  };

  this.name = function() {
    return self.dom.attr("data-field-name");
  }();

  this.showError = function() {
    showBoxShadow("0px 0px 3px 0px #E74C3C");
    changeText(self.message, "red");
  };

  this.showSuccess = function() {
    showBoxShadow("0px 0px 2px 0px #27AE60");
    //changeText("<span class='glyphicon glyphicon-ok'></span>", "green");
  };

  this.showDefault = function() {
    showBoxShadow("");
    changeText(self.helpText, "black");
  };

  var showBoxShadow = function(details) {
    if (validationsEnabled) {
      self.dom.css("box-shadow", details);
      self.dom.css("-webkit-box-shadow", details);
      self.dom.css("-moz-box-shadow", details);
    }
  };

  var changeText = function(text, color) {
    if (self.helpTextDom !== null && self.helpTextDom !== undefined) {
      self.helpTextDom.css("color", color);
      self.helpTextDom.html(text);
    }
  };

  this.clear = function() {
    var tag = self.dom.prop("tagName").toLowerCase();
    if (tag === "input") {
      var type = self.dom.attr("type").toLowerCase();
      if (type === "file") {
        resetFileElement(self.dom);
      } else {
        this.val("");
      }
    } else if (tag === "select") {
      self.dom[0].selectedIndex = 0;
    }
  };

  var resetFileElement = function(e) {
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();
  };

  events.forEach(function(event) {
    self[event] = function(event) {
      return function(fn) {
        self.dom.on(event, fn);
      };
    }(event);
  });

  this.changeValidationsEnabled = function(isEnabled) {
    validationsEnabled = isEnabled;
  };
};

Field.prototype.find = function(selector) {
  return this.dom.find(selector);
};

Field.prototype.val = function(value) {
  if (this.domType === "label") {
    return this.text(value);
  }
  if (value !== undefined) {
    this.dom.val(value.trim());
    this.dom.trigger("change");
    return;
  }
  return this.dom.val();
};

Field.prototype.text = function(value) {
  if (value) {
    this.dom.text(value.trim());
    return;
  }
  return this.dom.text();
};

Field.prototype.html = function(value) {
  if (value) {
    this.dom.html(value);
    return;
  }
  return this.dom.html();
};

Field.prototype.subscribeTo = function(fieldToSubscribeTo) {
  fieldToSubscribeTo.subscribers.push(this);
};

Field.prototype.unsubscribeFrom = function(fieldToUnsubscribeFrom) {
  var subscribersOfFieldToUnsubscribeFrom = fieldToUnsubscribeFrom.subscribers;
  subscribersOfFieldToUnsubscribeFrom.find(function(field, index) {
    if (field === self) {
      fieldToUnsubscribeFrom.subscribers.splice(index, 1);
      return;
    }
  });
};

Field.prototype.append = function(value) {
  this.dom.append(value);
};

Field.prototype.trigger = function(event) {
  this.dom.trigger(event);
};

Field.prototype.enableValidations = function() {
  this.changeValidationsEnabled(true);
};

Field.prototype.disableValidations = function() {
  this.changeValidationsEnabled(false);
};

Field.prototype.disable = function() {
  this.dom.prop("disabled", true);
};
Field.prototype.enable = function() {
  this.dom.prop("disabled", false);
};
