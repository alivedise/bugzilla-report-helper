(function(window) {
  'use strict';
  var _id = 0;

  var BZQuery = function(email, password) {
    this._id = _id++;
    this.config.email = email;
    this.config.password = password;
    this.bugzilla = new BugzillaClient(this.config);
    this.render();
  };

  BZQuery.prototype.config = {};

  BZQuery.prototype._renderResolvedBugs = function() {
    /* Rendering resolving bugs */
    var resolve = jQuery.extend({}, this.config);
    resolve['email1'] = this.config.email;
    resolve['email1_assigned_to'] = 1;
    resolve['changed_after'] = moment().utc().day(-75).format('YYYY-MM-DD');
    resolve['changed_field'] = 'status';
    resolve['changed_field_to'] = 'RESOLVED';
    this.bugzilla.searchBugs(resolve, function(error, bugs) {
      console.log(error);
      if (!error) {
        console.log(bugs);
        self.bugs = bugs;
        var outcome = '<ul>';
        bugs.sort(self.sorters.byLastChangeTime);
        for (var i = 0; i < bugs.length; i++) {
          console.log(bugs[i]);
          outcome += self.formatBug(bugs[i], true);
        }
        outcome += '</ul>';
        self.element.find('.resolved_output').html($(outcome));
      }
    });
  };

  BZQuery.prototype.render = function bzq_render() {
    var self = this;
    $(new EJS({ 'url': 'person.ejs' }).render({
      id: this._id,
      email: this.config.email
    })).appendTo(this.containerElement);
    this.element = $('#bqz' + this._id);
    // this._renderResolvedBugs();
    this._renderCommentedBugs();
  };

  BZQuery.prototype._renderCommentedBugs = function() {
    /* Rendering commented bugs */
    var comment = jQuery.extend({}, this.config);
    comment['email1'] = this.config.email;
    comment['email1_type'] = 'equals_any';
    comment['email1_comment_author'] = 1;
    comment['changed_after'] = moment().utc().day(-75).format('YYYY-MM-DD');

    this.bugzilla.searchBugs(comment, function(error, bugs) {
      console.log(error);
      if (!error) {
        console.log(bugs);
        self.bugs = bugs;
        var outcome = '<ul>';
        bugs.sort(self.sorters.byLastChangeTime);
        for (var i = 0; i < bugs.length; i++) {
          console.log(bugs[i]);
          outcome += self.formatBug(bugs[i], true);
        }
        outcome += '</ul>';
        self.element.find('.commented_output').html($(outcome));
      }
    });
  };

  BZQuery.prototype.containerElement = $('#container');

  BZQuery.prototype.formatBug = function bzq_formatBug(bug, mine_flag) {
    var HOT_FLAG = false;
    // find hot bugs
    var create_time = moment(bug.creation_time);
    var last_change_time = moment(bug.last_change_time);

    var item = '<li id="bug_' + bug.id;
    // if (INACTIVE_FLAG) {
    //   item += '" class="inactive';
    // }
    item += '">';
    item += '<a href="http://bugzil.la/' + bug.id + '" target="_blank">' +
            bug.id + '</a> - ';

    item += bug.summary;

    item += '</li>\n';
    return item;
  };

  BZQuery.prototype.sorters = {
    byIdDesc: function(a, b) {
      return (b.id - a.id);
    },
    byLastChangeTime: function(a, b) {
      var a_last = moment(a.last_change_time);
      var b_last = moment(b.last_change_time);
      return a_last.isBefore(b_last);
    }
  };

  window.BZQuery = BZQuery;
})(this);

var MozillaTaiwan = [
  'alive@mozilla.com'
  /*'rlu@mozilla.com',
  'rexboy@mozilla.com',
  'evanxd@mozilla.com',
  'gasolin@mozilla.com',
  'yurenju.mozilla@gmail.com',
  'arthur.chen@mozilla.com',
  'gchen@mozilla.com',
  'johu@mozilla.com',
  'dkuo@mozilla.com',
  'gduan@mozilla.com',
  'iliu@mozilla.com',
  'schung@mozilla.com'*/
];

MozillaTaiwan.forEach(function(person) {
  new BZQuery(person, '');
}, this);
