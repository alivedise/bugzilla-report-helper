(function(window) {
  'use strict';
  var _id = 0;

  var BZQuery = function(name, email) {
    this._id = _id++;
    this.config.name = name;
    this.config.email = email;;
    this.bugzilla = new BugzillaClient(this.config);
    this.render();
  };

  BZQuery.prototype.config = {
    username: 'autonome+bztest@gmail.com',
    password: 'bztest1A'
  };

  BZQuery.prototype.state = 'inited';

  BZQuery.prototype.reload = function bzq_reload() {
    this._renderResolvedBugs();
    this._renderAssignedBugs();
  };

  BZQuery.prototype._renderResolvedBugs = function() {
    var self = this;
    /* Rendering resolving bugs */
    var resolve = jQuery.extend({}, this.config);
    resolve['email1'] = this.config.email;
    resolve['email1_assigned_to'] = 1;
    resolve['changed_after'] = moment().utc().day(-75).format('YYYY-MM-DD');
    resolve['changed_field'] = 'status';
    resolve['changed_field_to'] = 'RESOLVED';
    this.bugzilla.searchBugs(resolve, function(error, bugs) {
      if (!error) {
        //self.bugs = bugs;
        var outcome = '<ul>';
        bugs.sort(self.sorters.byLastChangeTime);
        for (var i = 0; i < bugs.length; i++) {
          outcome += self.formatBug(bugs[i], true);
        }
        outcome += '</ul>';
        self.element.find('.resolved_count').text(bugs.length);
        self.element.find('.resolved_output').html($(outcome));
        self.element.find('.resolved_output').hide();
        self.element.find('.resolved_more').click(function() {
          self.element.removeClass('col-md-4').addClass('col-md-12');
          self.element.find('.resolved_more').hide();
          self.element.find('.resolved_hide').show();
          self.element.find('.resolved_output').show();
        });
        self.element.find('.resolved_hide').click(function() {
          self.element.removeClass('col-md-12').addClass('col-md-4');
          self.element.find('.resolved_more').show();
          self.element.find('.resolved_hide').hide();
          self.element.find('.resolved_output').hide();
        });
      }
    });
  };

  BZQuery.prototype._renderAssignedBugs = function() {
    var self = this;
    /* Rendering resolving bugs */
    var assign = jQuery.extend({}, this.config);
    assign['email1'] = this.config.email;
    assign['email1_assigned_to'] = 1;
    assign['bug_status'] = ['NEW', 'UNCONFIRMED', 'ASSIGNED', 'REOPENED', 'READY'];
    this.bugzilla.searchBugs(assign, function(error, bugs) {
      if (!error) {
        //self.bugs = bugs;
        var outcome = '<ul>';
        bugs.sort(self.sorters.byLastChangeTime);
        for (var i = 0; i < bugs.length; i++) {
          outcome += self.formatBug(bugs[i], true);
        }
        outcome += '</ul>';
        self.element.find('.assigned_count').text(bugs.length);
        self.element.find('.assigned_output').html($(outcome));
        self.element.find('.assigned_output').hide();
        self.element.find('.assigned_more').click(function() {
          self.element.removeClass('col-md-4').addClass('col-md-12');
          self.element.find('.assigned_more').hide();
          self.element.find('.assigned_hide').show();
          self.element.find('.assigned_output').show();
        });
        self.element.find('.assigned_hide').click(function() {
          self.element.removeClass('col-md-12').addClass('col-md-4');
          self.element.find('.assigned_more').show();
          self.element.find('.assigned_hide').hide();
          self.element.find('.assigned_output').hide();
        });
      }
    });
  };

  BZQuery.prototype.render = function bzq_render() {
    this.containerElement.append($('#person-template').clone().prop('id', 'bqz' + this._id).removeClass('template'));
    this.element = $('#bqz' + this._id);
    this.element.show();
    this.element.find('.name').html(this.config.name);
    this.element.find('.email').html(this.config.email);
    this.element.find('.resolved_hide').hide();
    this.element.find('.assigned_hide').hide();
    this.element.find('.avatar').prop('src',
      'http://www.gravatar.com/avatar/' + md5(this.config.email) + '?' +
      this.bugzilla.urlEncode({
        d: 'http://blogdotappsfueldotcom.files.wordpress.com/2013/04/firefoxos.png?w=70',
        s: 70
      }));
    this.reload();
  };

  BZQuery.prototype._renderCommentedBugs = function() {
    var self = this;
    /* Rendering commented bugs */
    var comment = jQuery.extend({}, this.config);
    comment['email1'] = this.config.email;
    comment['email1_type'] = 'exact';
    comment['email1_long_desc'] = 1;
    comment['email1_long_desc1'] = 1;
    comment['email_long_desc'] = 1;
    comment['changed_after'] = moment().utc().day(-1).format('YYYY-MM-DD');

    this.bugzilla.searchBugs(comment, function(error, bugs) {
      if (!error) {
        //self.bugs = bugs;
        var outcome = '<ul>';
        bugs.sort(self.sorters.byLastChangeTime);
        for (var i = 0; i < bugs.length; i++) {
          outcome += self.formatBug(bugs[i], true);
        }
        outcome += '</ul>';
        self.element.find('.commented_count').text(bugs.length);
        self.element.find('.commented_output').html($(outcome));
      }
    });
  };

  BZQuery.prototype.containerElement = $('#container');

  BZQuery.prototype.formatBug = function bzq_formatBug(bug, mine_flag) {
    var item = '<li id="bug_' + bug.id;
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
