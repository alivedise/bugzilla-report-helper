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
          self.element.find('.resolved_more').hide();
          self.element.find('.resolved_hide').show();
          self.element.find('.resolved_output').show();
        });
        self.element.find('.resolved_hide').click(function() {
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
          self.element.find('.assigned_more').hide();
          self.element.find('.assigned_hide').show();
          self.element.find('.assigned_output').show();
        });
        self.element.find('.assigned_hide').click(function() {
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
    this.element.find('.avatar').prop('src', 'http://www.gravatar.com/avatar/' + md5(this.config.email) + '?s=50');
    this._renderResolvedBugs();
    this._renderAssignedBugs();
    //this._renderCommentedBugs();
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


$('.template').hide();

var MozillaTaiwan = [
  {
    name: 'Alive',
    email: 'alive@mozilla.com'
  },
  {
    name: 'Yuren',
    email: 'yurenju.mozilla@gmail.com'
  },
  {
    name: 'Arthur',
    email: 'arthur.chen@mozilla.com'
  },
  {
    name: 'Gary',
    email: 'gchen@mozilla.com'
  },
  {
    name: 'John',
    email: 'johu@mozilla.com'
  },
  {
    name: 'Dominic',
    email: 'dkuo@mozilla.com'
  },
  {
    name: 'George',
    email: 'gduan@mozilla.com'
  },
  {
    name: 'Ian',
    email: 'iliu@mozilla.com'
  },
  {
    name: 'Steve',
    email: 'schung@mozilla.com'
  },
  {
    name: 'Rex',
    email: 'rexboy@mozilla.com'
  },
  {
    name: 'Evan',
    email: 'evanxd@mozilla.com'
  },
  {
    name: 'Rudy',
    email: 'rlu@mozilla.com'
  },
  {
    name: 'Fred',
    email: 'gasolin@mozilla.com'
  },
  {
    name: 'EJ',
    email: 'ejchen@mozilla.com'
  },
  {
    name: 'Luke',
    email: 'lchang@mozilla.com'
  },
  {
    name: 'dwi2',
    email: 'thuang@mozilla.com'
  },
  {
    name: 'Greg',
    email: 'gweng@mozilla.com'
  },
  {
    name: 'Kanru',
    email: 'kchen@mozilla.com'
  },
  {
    name: 'Henry',
    email: 'hchang@mozilla.com'
  },
  {
    name: 'Vincent Chang',
    email: 'vchang@mozilla.com'
  },
  {
    name: 'Edgar',
    email: 'echen@mozilla.com'
  },
  {
    name: 'Aknow',
    email: 'szchen@mozilla.com'
  },
  {
    name: 'Yoshi',
    email: 'allstars.chh@mozilla.com'
  },
  {
    name: 'Jessica',
    email: 'jjong@mozilla.com'
  },
  {
    name: 'Dimi',
    email: 'dlee@mozilla.com'
  },
  {
    name: 'Shao-Hang',
    email: 'skao@mozilla.com'
  },
  {
    name: 'Chuck',
    email: 'chulee@mozilla.com'
  },
  {
    name: 'Gene',
    email: 'gene.lian@mozilla.com'
  },
  {
    name: 'John(Stone)',
    email: 'jshih@mozilla.com'
  },
  {
    name: 'Hsinyi',
    email: 'htsai@mozilla.com'
  },
  {
    name: 'ChiaHung',
    email: 'ctai@mozilla.com'
  },
  /* {
    name: 'Bevis',
    email: 'btseng@mozilla.com'
  }, */
  {
    name: 'Georgia',
    email: 'gwang@mozilla.com'
  },
  {
    name: 'Patrick',
    email: 'pwang@mozilla.com'
  },
  {
    name: 'Vicamo',
    email: 'vyang@mozilla.com'
  },
  {
    name: 'Phoebe',
    email: 'phchang@mozilla.com'
  },
  {
    name: 'Peter',
    email: 'pchang@mozilla.com'
  },
  {
    name: 'Benjamin',
    email: 'bechen@mozilla.com'
  },
  {
    name: 'SC',
    email: 'schien@mozilla.com'
  },
  {
    name: 'Steven',
    email: 'slee@mozilla.com'
  },
  /*{
    name: 'John Lin',
    email: 'jolin@mozilla.com'
  },*/
  {
    name: 'Randy',
    email: 'rlin@mozilla.com'
  },
  {
    name: 'Shelly',
    email: 'slin@mozilla.com'
  },
  {
    name: 'Jerry',
    email: 'hshih@mozilla.com'
  },
  {
    name: 'Morris',
    email: 'mtseng@mozilla.com'
  },
  {
    name: 'JW',
    email: 'jwwang@mozilla.com'
  },
  {
    name: 'Alfredo',
    email: 'ayang@mozilla.com'
  },
  {
    name: 'Marco',
    email: 'mchen@mozilla.com'
  },
  {
    name: 'Eric',
    email: 'echou@mozilla.com'
  },
  {
    name: 'Gina',
    email: 'gyeh@mozilla.com'
  },
  {
    name: 'Ben',
    email: 'btian@mozilla.com'
  },
  {
    name: 'Bruce',
    email: 'brsun@mozilla.com'
  },
  {
    name: 'Alan',
    email: 'ahuang@mozilla.com'
  },
  {
    name: 'Shawn',
    email: 'shuang@mozilla.com'
  }
];

MozillaTaiwan.forEach(function(person) {
  new BZQuery(person.name, person.email);
}, this);
