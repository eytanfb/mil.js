var Validations = (function() {
  var notEmpty = function() {
    return function(dom, self) {
      if (self.message === "")
        self.message = self.name + " cannot be empty";
      return dom.val() !== "";
    };
  }();

  var somethingSelected = function() {
    return function(dom, self) {
      self.message = self.name + " is not selected";
      return self.find(":selected").text().toLowerCase().indexOf("select") < 0 && self.find(":selected").text() !== "" && self.find(":selected").val() !== "";
    };
  }();

  var greaterThanZero = function() {
    return function(dom, self) {
      self.message = self.name + " has to be greater than 0";
      return parseFloat(dom.val()) > 0;
    };
  }();

  var onlyNumbers = function() {
    return function(dom, self) {
      self.message = self.name + " can only have numbers";
      var match = dom.val().match(/^\d{1,}$/);
      return match !== null && match.index === 0;
    };
  }();

  var decimals = function() {
    return function(dom, self) {
      self.message = self.name + " can only have integers or decimal numbers";
      var match = dom.val().match(/^[0-9]+([\,\.][0-9]+)?$/);
      return match !== null && match.index === 0;
    };
  }();

  var mustMatch = function() {
    return function(dom, self, fields) {
      self.message = self.name + " should match the password";
      return dom.val() === fields.password.val();
    };
  }();

  var latinChars = function() {
    return function(dom, self) {
      var value = dom.val();
      var match = value.match(/^[A-Za-z0-9\-\/\.\,\s]+$/);
      self.message = self.name + " can only have English characters, numbers and the following characters (-./,)";
      return match !== null && match.index === 0;
    };
  }();

  var isEmail = function() {
    return function(dom, self) {
      self.message = "Not a valid email format(e.g. ics@example.com)";
      var regex = /^([a-zA-Z0-9_'.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      var email = dom.val();
      return regex.test(email);
    };
  }();

  var validPassword = function() {
    return function(dom, self) {
      self.message = "Password must contain at least 8 characters, with one uppercase letter, one lowercase letter and a numeric digit";
      var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      var password = dom.val();
      return regex.test(password);
    };
  }();

  return {
    icsWarrantyValidations: [

      function(dom, self) {
        self.message = "ICS Warranty No has to be 13 characters";
        return dom.val().length === 13;
      }
    ],
    productNameValidations: [
      somethingSelected
    ],
    siteAddressValidations: [
      notEmpty, latinChars
    ],
    registrationNoValidations: [
      notEmpty, latinChars
    ],
    installationDateValidations: [

      function(dom, self) {
        self.message = "Please select a valid date";
        var date = dom.val();
        var format = "DD/MM/YYYY";
        var valid = moment(date, format).isValid();
        return valid;
      },
      function(dom, self) {
        var now = moment(new Date());
        var date = moment(dom.val(), "DD/MM/YYYY");
        self.message = "Installation date can't be after today";
        return now > date;
      }
    ],
    endUserNameValidations: [
      somethingSelected
    ],
    distributorNameValidations: [
      somethingSelected
    ],
    detailsOfProjectValidations: [
      somethingSelected
    ],
    countryValidations: [
      somethingSelected
    ],
    cityValidations: [
      somethingSelected
    ],
    lotNumberValidations: [
      notEmpty, latinChars
    ],
    emailValidations: [notEmpty, isEmail],
    lengthValidations: [notEmpty, decimals, greaterThanZero],
    widthValidations: [notEmpty, decimals, greaterThanZero],
    passwordValidations: [notEmpty, validPassword],
    passwordConfirmationValidations: [notEmpty, mustMatch],
    phoneValidations: [notEmpty, onlyNumbers],
    listOfProductsValidations: [

      function(dom, self) {
        self.message = self.name + " have to have at least one product";
        return self.find(":selected").text().toLowerCase().indexOf("select") < 0 && self.find(":selected").text() !== "";
      }
    ],
    notEmpty: notEmpty,
    somethingSelected: somethingSelected,
    isEmail: isEmail,
    onlyNumbers: onlyNumbers,
    projectDocumentsValidations: [

      function(dom, self) {
        self.message = "Size of " + self.name + " can't be more than 5MB";
        var files = dom[0].files;
        var size = 0;
        for (var i = 0, l = files.length; i < l; i++) {
          var file = files[i];
          size += file.size;
        }
        return size < 5000000;
      }
    ]
  };
}());

var CommonValidations = (function() {
  return {
    notEmpty: [Validations.notEmpty],
    somethingSelected: [Validations.somethingSelected],
    onlyNumbers: [Validations.onlyNumbers]
  };
}());
