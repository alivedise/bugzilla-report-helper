(function(window) {
  'use strict';
  var _id = 0;

  var Functional = {
    'free': {
      icon: '<i class="icon-beaker"></i>',
      name: 'Free Agent'
    },
    'media': {
      icon: '<span class="glyphicon glyphicon-music"></span>',
      name: 'Media'
    },
    'recording': {
      icon: '<span class="glyphicon glyphicon-camera"></span>',
      name: 'Recording/Streaming'
    },
    'performance': {
      icon: '<span class="glyphicon glyphicon-time"></span>',
      name: 'Performance'
    },
    'browser': {
      icon: '<span class="glyphicon glyphicon-globe"></span>',
      name: 'Browser'
    },
    'system-frontend': {
      icon: '<span class="glyphicon glyphicon-wrench"></span>',
      name: 'Recording/Streaming'
    },
    'telephony': {
      icon: '<span class="glyphicon glyphicon-signal"></span>',
      name: 'Telephony,RIL,BT,Provisioning,CDMA'
    },
    'device': {
      icon: '<span class="glyphicon glyphicon-phone"></span>',
      name: 'Device'
    },
    'nfc': {
      icon: '<i class="icon-share"></i>',
      name: 'NFC'
    },
    'communications': {
      icon: '<i class="icon-comments"></i>',
      name: 'Comms'
    },
    'productivity': {
      icon: '<span class="glyphicon glyphicon-tasks"></span>',
      name: 'Productivity'
    },
    'system-platform': {
      icon: '<i class="icon-cogs"></i>',
      name: 'System Platform'
    }
  };

  var BZQuery = function(settings) {
    this.config = {
      username: 'autonome+bztest@gmail.com',
      password: 'bztest1A'
    };
    this._id = _id++;
    for (var k in settings) {
      this.config[k] = settings[k];
      this[k] = settings[k];
    }
    this.bugzilla = new BugzillaClient(jQuery.extend({}, this.config));
    this.render();
    BZQuery.manager.push(this);
    return this;
  };

  BZQuery.manager = [];

  BZQuery.prototype.loadingIndicator = '<i class="icon-cog icon-spin"></i>';
  BZQuery.prototype.progressingIndicator =
    '<div class="progress active progress-striped">' +
      '<div class="progress-bar progress-bar-info" role="progressbar" aria-valuetransitiongoal="100">' +
      '</div>' +
    '</div>';

  BZQuery.prototype.filter = function bzq_filter(keyword, type) {
    if (keyword === '' || keyword === 'all') {
      this.show();
      return;
    }
    if (!type || type !== 'functional') {
      if (this.team && this.team.search(keyword) === 0) {
        this.show();
      } else {
        this.hide();
      }
    } else {
      if (this.functional) {
        if (Array.isArray(this.functional)) {
          if (this.functional.indexOf(keyword) >= 0) {
            this.show();
          } else {
            this.hide();
          }
        } else if (this.functional.search(keyword) === 0) {
          this.show();
        } else {
          this.hide();
        }
      } else {
        this.hide();
      }
    }
  };

  BZQuery.prototype.show = function bzq_show() {
    console.log('show');
    this.element.stop().show();
  };


  BZQuery.prototype.hide = function bzq_hide() {
    console.log('hide');
    this.element.stop().hide();
  };

  BZQuery.prototype.commented = '';
  BZQuery.prototype.assigned = '';
  BZQuery.prototype.resolved = '';

  BZQuery.prototype.renderTags = function bzq_renderTags() {
    if (this.functional) {
      if (!Array.isArray(this.functional)) {
        this.functional = [ this.functional ];
      }

      this.functional.forEach(function(team) {
        this.element.append($('<div class="label label-success label-sm team">' + Functional[team].icon + ' ' + Functional[team].name + '</div>'));
      }, this);
    }
  }

  BZQuery.prototype.downloadBugs = function bzq_downloadBugs(config, type, count) {
    var self = this;
    var progress = this.element.find('.' + type + '_output .progress');

    this.element.removeClass('col-md-4').addClass('col-md-12');
    this.element.find('.' + type + '_more').hide();
    this.element.find('.' + type + '_hide').show();
    this.element.find('.' + type + '_output').show();

    if (this[type] && this[type].deferred) {
      if (this[type].deferred.state() == 'pending') {
        if (this[type].deferred._start === config.start &&
            this[type].deferred._end === config.end) {
          // Conig is the same, don't worry.
          if (progress) {
            progress.show();
            if (!progress.data('bs.progressbar')) {
              this.setDuration(progress.find('.progress-bar'), count);
              progress.find('.progress-bar').progressbar();
            }
          }
        } else {
          // New config, throw the old away.
          this[type].deferred.reject('throwaway');
          if (progress) {
            progress.show();
            if (!progress.data('bs.progressbar')) {
              this.setDuration(progress.find('.progress-bar'), count);
              progress.find('.progress-bar').progressbar();
            }
          } else {
            this.element.find('.' + type + '_output').html(this.progressingIndicator);
            progress = this.element.find('.' + type + '_output .progress');
            this.setDuration(progress.find('.progress-bar'), count);
            progress.find('.progress-bar').progressbar();
          }
        }
      }
    } else {
      if (progress) {
        progress.show();
        if (!progress.data('bs.progressbar')) {
          this.setDuration(progress.find('.progress-bar'), count);
          progress.find('.progress-bar').progressbar();
        }
      } else {
        this.element.find('.' + type + '_output').html(this.progressingIndicator);
        progress = this.element.find('.' + type + '_output .progress');
        this.setDuration(progress.find('.progress-bar'), count);
        progress.find('.progress-bar').progressbar();
      }
    }

    var d = $.Deferred();
    if (!this[type])
      this[type] = {};

    d._start = config.start;
    d._end = config.end;
    this[type].deferred = d;
    this.bugzilla.searchBugs(config, function(error, bugs) {
      if (!error && d.state() !== 'rejected') {
        var outcome = '<ul>';
        bugs.sort(self.sorters.byLastChangeTime);
        for (var i = 0; i < bugs.length; i++) {
          outcome += self.formatBug(bugs[i], true);
        }
        outcome += '</ul>';
        self.element.find('.' + type + '_count').text(bugs.length);
        self.element.find('.' + type + '_output').html($(outcome));
        d.resolve('finished');
      }
    });
    return d.promise();
  };

  BZQuery.prototype.setDuration = function bzq_setDuration(target, t) {
    if (target) {
      target.css('-webkit-transition-duration', t + 's');
      target.css('-moz-transition-duration', t + 's');
      target.css('-ms-transition-duration', t + 's');
      target.css('-o-transition-duration', t + 's');
      target.css('transition-duration', t + 's');
    }
  };

  BZQuery.prototype.reload = function bzq_reload(config) {
    this.config = jQuery.extend(this.config, config);
    
    this._renderResolvedBugs();
    this._renderAssignedBugs();
    this._renderCommentedBugs();
  };

  BZQuery.prototype._renderResolvedBugs = function() {
    var self = this;
    this.element.find('.resolved_count').html(this.loadingIndicator);
    this.element.find('.resolved_output').html('');

    /* Rendering resolving bugs */
    var resolve = jQuery.extend({}, this.config);
    resolve['email1'] = this.config.email;
    resolve['email1_assigned_to'] = 1;
    resolve['changed_after'] = this.config.start;
    resolve['changed_before'] = this.config.end;
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
    var deferred = $.Deferred();
    this.element.find('.assigned_count').html(this.loadingIndicator);
    this.element.find('.assigned_output').html('');
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
    this.element.find('.commented_hide').hide();
    this.element.find('.avatar').prop('src',
      'http://www.gravatar.com/avatar/' + md5(this.config.email) + '?' +
      this.bugzilla.urlEncode({
        d: 'http://blogdotappsfueldotcom.files.wordpress.com/2013/04/firefoxos.png?w=70',
        s: 70
      }));
    var self = this;
    this.renderTags();
    this.reload();
  };

  BZQuery.prototype._renderCommentedBugs = function() {
    var self = this;
    this.element.find('.commented_count').html(this.loadingIndicator);
    /* Rendering commented bugs */
    var comment = jQuery.extend({}, this.config);
    comment['email1'] = this.config.email;
    comment['email1_type'] = 'exact';
    comment['email1_comment_creator'] = 1;
    comment['changed_after'] = this.config.start;
    comment['changed_before'] = this.config.end;
    this.element.find('.commented_more').hide();
    this.element.find('.commented_output').hide();

    this.bugzilla.countBugs(comment, function(error, count) {
      if (!error) {
        self.element.find('.commented_count').text(count);
        self.element.find('.commented_more').show().click(function() {
          self.downloadBugs(comment, 'commented', count);
        });
      }
    });

    this.element.find('.commented_hide').click(function() {
      self.element.removeClass('col-md-12').addClass('col-md-4');
      self.element.find('.commented_more').show();
      self.element.find('.commented_hide').hide();
      self.element.find('.commented_output').hide();
      var progress = self.element.find('.commented_output .progress');
      if (progress)
        progress.hide();
    });
  };

  BZQuery.prototype.containerElement = $('#all');

  BZQuery.prototype.formatBug = function bzq_formatBug(bug, mine_flag) {
    var item = '<li id="bug_' + bug.id;
    item += '">';
    item += '<a href="http://bugzil.la/' + bug.id + '" target="_blank">' +
            bug.id + '</a> - ';

    item += '<h6><span class="label label-primary">' + bug.component + '</span></h6> ';

    var s = bug.summary.replace(/\[/g, '<span class="label label-info">');
    s = s.replace(/\]/g, '</span> ');

    item += s;

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
