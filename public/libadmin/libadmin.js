// Generated by CoffeeScript 1.8.0
(function() {
  var Article, Error, Tag, User, Util;

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

  User = (function() {
    function User(userid) {
      this.userid = userid;
    }

    User.login = function(userid, password, callback) {
      return Util._post(Util.host + "/admin/login", {
        username: userid,
        password: password
      }, function(resp) {
        if (Error._hasError(resp)) {
          return callback(new Error(resp.error_id, resp.error_desc));
        } else {
          return callback(resp);
        }
      });
    };

    User.logout = function(token, callback) {
      return Util._post(Util.host + "/admin/logout", {
        access_token: token
      }, function(resp) {
        if (Error._hasError(resp)) {
          return callback(new Error(resp.error_id, resp.error_desc));
        } else {
          return callback(resp);
        }
      });
    };

    User.list = function(token, sort, callback, pageIndex, pageCount) {
      if (pageIndex == null) {
        pageIndex = 0;
      }
      if (pageCount == null) {
        pageCount = 50;
      }
      return Util._get(Util.host + "/admin/user/list", {
        sort: sort,
        page_index: pageIndex,
        page_count: pageCount,
        access_token: token
      }, (function(_this) {
        return function(resp) {
          var info, users, _i, _len, _ref;
          if (Error._hasError(resp)) {
            return callback(new Error(resp.error_id, resp.error_desc));
          } else {
            users = [];
            _ref = resp.users;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              info = _ref[_i];
              users.push(new User(info.userid)._update(info));
            }
            return callback(users, resp.page_index, resp.page_total, resp.total_number);
          }
        };
      })(this));
    };

    User.search = function(token, keyword, gender, age, ban_status, sort, callback, pageIndex, pageCount) {
      if (pageIndex == null) {
        pageIndex = 0;
      }
      if (pageCount == null) {
        pageCount = 50;
      }
      return Util._get(Util.host + "/admin/user/search", {
        keyword: keyword,
        gender: gender,
        age: age,
        ban_status: ban_status,
        sort: sort,
        page_index: pageIndex,
        page_count: pageCount,
        access_token: token
      }, (function(_this) {
        return function(resp) {
          var info, users, _i, _len, _ref;
          if (Error._hasError(resp)) {
            return callback(new Error(resp.error_id, resp.error_desc));
          } else {
            users = [];
            _ref = resp.users;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              info = _ref[_i];
              users.push(new User(info.userid)._update(info));
            }
            return callback(users, resp.page_index, resp.page_total, resp.total_number);
          }
        };
      })(this));
    };

    User.prototype.getInfo = function(token, callback) {
      return Util._get(Util.host + "/admin/user/info", {
        userid: this.userid,
        access_token: token
      }, (function(_this) {
        return function(resp) {
          if (Error._hasError(resp)) {
            return callback(new Error(resp.error_id, resp.error_desc));
          } else {
            return callback(_this._update(resp));
          }
        };
      })(this));
    };

    User.prototype.ban = function(token, duration, callback) {
      return Util._post(Util.host + "/admin/user/ban", {
        userid: this.userid,
        duration: duration,
        access_token: token
      }, function(resp) {
        if (Error._hasError(resp)) {
          return callback(new Error(resp.error_id, resp.error_desc));
        } else {
          return callback(resp);
        }
      });
    };

    User.prototype._update = function(data) {
      var birth;
      this.nickname = data.nickname;
      this.role = data.role;
      this.profile = "";
      if (data.profile.search("http://") === 0) {
        this.profile = data.profile;
      }
      this.gender = "未知";
      if (data.gender != null) {
        if (data.gender.search("f") === 0) {
          this.gender = "女";
        }
        if (data.gender.search("m") === 0) {
          this.gender = "男";
        }
      }
      this.phone = data.phone;
      this.about = data.about;
      this.address = data.address;
      if (data.photos != null) {
        this.photos = data.photos;
      }
      this.hobby = data.hobby;
      this.birthday = "";
      this.age = "未知";
      if ((data.birthday != null) && data.birthday !== 0) {
        birth = new Date(data.birthday * 1000);
        this.birthday = Util._formatDate(birth);
        this.age = Util._birth2Age(birth);
      }
      this.reg_time = "";
      if ((data.reg_time != null) && data.reg_time > 0) {
        this.reg_time = Util._formatDate(new Date(data.reg_time * 1000));
      }
      if ((data.last_login_time != null) && data.last_login_time > 0) {
        this.last_login_time = Util._formatDate(new Date(data.last_login_time * 1000));
      } else {
        this.last_login_time = "未知";
      }
      this.height = data.height;
      this.weight = data.weight;
      this.loc_latitude = data.loc_latitude;
      this.loc_longitude = data.loc_longitude;
      this.equips = {
        shoes: "",
        hardwares: "",
        softwares: ""
      };
      if (data.equips != null) {
        if (data.equips.shoes !== null && data.equips.shoes.length > 0) {
          this.equips.shoes = data.equips.shoes.join(",");
        }
        if (data.equips.hardwares !== null && data.equips.hardwares.length > 0) {
          this.equips.hardwares = data.equips.hardwares.join(",");
        }
        if (data.equips.softwares !== null && data.equips.softwares.length > 0) {
          this.equips.softwares = data.equips.softwares.join(",");
        }
      }
      this.physique_value = data.physique_value;
      this.literature_value = data.literature_value;
      this.magic_value = data.magic_value;
      this.coin_value = data.coin_value / 100000000;
      this.score = data.score;
      this.level = data.level;
      this.wallet = data.wallet;
      this.articles_count = data.articles_count;
      this.follows_count = data.follows_count;
      this.followers_count = data.followers_count;
      this.friends_count = data.friends_count;
      this.blacklist_count = data.blacklist_count;
      this.ban_time = "";
      this.ban_status = "normal";
      if (data.ban_time != null) {
        if (data.ban_time < 0) {
          this.ban_status = "ban";
        }
        if (data.ban_time > 0) {
          this.ban_time = Util._formatDate(new Date(data.ban_time * 1000));
          this.ban_status = "lock";
        }
      }
      return this;
    };

    return User;

  })();

  Article = (function() {
    function Article() {}

    Article.list = function(token, callback, sort, pageIndex, pageCount) {
      if (sort == null) {
        sort = '';
      }
      if (pageIndex == null) {
        pageIndex = 0;
      }
      if (pageCount == null) {
        pageCount = 50;
      }
      return Util._get(Util.host + "/admin/article/list", {
        sort: sort,
        page_index: pageIndex,
        page_count: pageCount,
        access_token: token
      }, (function(_this) {
        return function(resp) {
          var articles, info, _i, _len, _ref;
          if (Error._hasError(resp)) {
            return callback(new Error(resp.error_id, resp.error_desc));
          } else {
            articles = [];
            _ref = resp.articles;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              info = _ref[_i];
              articles.push(new Article()._update(info));
            }
            return callback(articles, resp.page_index, resp.page_total, resp.total_number);
          }
        };
      })(this));
    };

    Article.lists = function(token, sort, pageIndex, pageCount) {
      if (sort == null) {
        sort = '';
      }
      if (pageIndex == null) {
        pageIndex = 0;
      }
      if (pageCount == null) {
        pageCount = 50;
      }
      return $http.get(Util.host + '/admin/article/list', {
        params: {
          sort: sort,
          page_index: pageIndex,
          page_count: pageCount,
          access_token: token
        }
      }).then((function(_this) {
        return function(response) {
          if (typeof response.data === 'object') {
            return response.data;
          } else {
            return $q.reject(response.data);
          }
        };
      })(this), function(response) {
        return $q.reject(response.data);
      });
    };

    Article.timeline = function(userid, token, callback, pageIndex, pageCount) {
      if (pageIndex == null) {
        pageIndex = 0;
      }
      if (pageCount == null) {
        pageCount = 50;
      }
      return Util._get(Util.host + "/admin/article/timeline", {
        userid: userid,
        page_index: pageIndex,
        page_count: pageCount,
        access_token: token
      }, (function(_this) {
        return function(resp) {
          var articles, info, _i, _len, _ref;
          if (Error._hasError(resp)) {
            return callback(new Error(resp.error_id, resp.error_desc));
          } else {
            articles = [];
            _ref = resp.articles;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              info = _ref[_i];
              articles.push(new Article()._update(info));
            }
            return callback(articles, resp.page_index, resp.page_total, resp.total_number);
          }
        };
      })(this));
    };

    Article.search = function(token, keyword, callback, sort, pageIndex, pageCount) {
      if (sort == null) {
        sort = '';
      }
      if (pageIndex == null) {
        pageIndex = 0;
      }
      if (pageCount == null) {
        pageCount = 50;
      }
      return Util._get(Util.host + "/admin/article/search", {
        keyword: keyword,
        sort: sort,
        page_index: pageIndex,
        page_count: pageCount,
        access_token: token
      }, (function(_this) {
        return function(resp) {
          var articles, info, _i, _len, _ref;
          if (Error._hasError(resp)) {
            return callback(new Error(resp.error_id, resp.error_desc));
          } else {
            articles = [];
            _ref = resp.articles;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              info = _ref[_i];
              articles.push(new Article()._update(info));
            }
            return callback(articles, resp.page_index, resp.page_total, resp.total_number);
          }
        };
      })(this));
    };

    Article.prototype.getInfo = function(article_id, token, callback) {
      return Util._get(Util.host + "/admin/article/info", {
        article_id: article_id,
        access_token: token
      }, (function(_this) {
        return function(resp) {
          if (Error._hasError(resp)) {
            return callback(new Error(resp.error_id, resp.error_desc));
          } else {
            return callback(_this._update(resp));
          }
        };
      })(this));
    };

    Article.prototype.post = function(token, callback) {
      return Util._post(Util.host + "/admin/article/post", {
        article_id: this.article_id,
        author: this.author,
        contents: this.contents,
        tags: [],
        access_token: token
      }, (function(_this) {
        return function(resp) {
          if (Error._hasError(resp)) {
            return callback(new Error(resp.error_id, resp.error_desc));
          } else {
            return callback(resp);
          }
        };
      })(this));
    };

    Article.prototype["delete"] = function(token, callback) {
      return Util._post(Util.host + "/admin/article/delete", {
        article_id: this.article_id,
        access_token: token
      }, function(resp) {
        if (Error._hasError(resp)) {
          return callback(new Error(resp.error_id, resp.error_desc));
        } else {
          return callback(resp);
        }
      });
    };

    Article.prototype._update = function(data) {
      var tag, _i, _len, _ref;
      this.article_id = data.article_id;
      this.parent = data.parent;
      if ((data.author != null) && (data.author.userid != null)) {
        this.author = new User(data.author.userid)._update(data.author);
      }
      this.cover_image = data.cover_image;
      this.cover_text = data.cover_text;
      if (data.cover_text === '') {
        this.cover_text = '无标题文章';
      }
      this.time = Util._formatDate(new Date(data.time * 1000));
      this.thumbs_count = data.thumbs_count;
      this.comments_count = data.comments_count;
      this.rewards_value = data.rewards_value / 100000000;
      this.rewards_users = [];
      if (data.rewards_users !== null) {
        this.rewards_users = data.rewards_users;
      }
      this.tags = [];
      if (data.tags != null) {
        _ref = data.tags;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tag = _ref[_i];
          switch (tag) {
            case 'SPORT_LOG':
              this.tags.push(new Tag(tag, '运动日志'));
              break;
            case 'SPORT_THEORY':
              this.tags.push(new Tag(tag, '跑步圣经'));
              break;
            case 'EQUIP_BLOG':
              this.tags.push(new Tag(tag, '我爱装备'));
              break;
            case 'SPORT_LIFE':
              this.tags.push(new Tag(tag, '运动生活'));
              break;
            case 'PRODUCT_PROPOSAL':
              this.tags.push(new Tag(tag, '产品建议'));
          }
        }
      }
      if (this.tags.length === 0) {
        this.tags.push(new Tag('SPORT_LOG', '运动日志'));
      }
      this.contents = data.contents;
      this._comments(data.comments);
      return this;
    };

    Article.prototype._comments = function(data) {
      var a, art, _i, _len, _results;
      this.comments = [];
      if (data !== null) {
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          a = data[_i];
          art = new Article()._update(a);
          art._comments(a.comments);
          _results.push(this.comments.push(art));
        }
        return _results;
      }
    };

    return Article;

  })();

  Tag = (function() {
    function Tag(id, name) {
      this.id = id;
      this.name = name;
    }

    return Tag;

  })();

}).call(this);
