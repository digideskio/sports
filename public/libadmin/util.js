// Generated by CoffeeScript 1.8.0
(function() {
  var Error, Util;

  Util = (function() {
    function Util() {}

    Util.host = "http://172.24.222.54:8080";

    Util._get = function(url, data, callback) {
      return $.getJSON(url, data, callback);
    };

    Util._post = function(url, data, callback) {
      return $.ajax(url, {
        type: "POST",
        url: url,
        data: JSON.stringify(data),
        dataType: "json",
        success: callback
      });
    };

    Util._formatDate = function(date) {
      var d, t;
      d = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
      t = [date.getHours(), date.getMinutes(), date.getSeconds()].join(":");
      return [d, t].join(" ");
    };

    Util._birth2Age = function(birth) {
      return new Date().getFullYear() - birth.getFullYear();
    };

    return Util;

  })();

  Error = (function() {
    function Error(error_id, error_desc) {
      this.error_id = error_id;
      this.error_desc = error_desc;
    }

    Error._hasError = function(data) {
      if ((data.error_id != null) && data.error_id > 0) {
        return true;
      } else {
        return false;
      }
    };

    Error.prototype.String = function() {
      return "" + this.error_id + ": " + this.error_desc;
    };

    return Error;

  })();

}).call(this);

//# sourceMappingURL=util.js.map