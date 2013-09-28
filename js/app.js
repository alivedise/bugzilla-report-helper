 (function(window) {
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
    },
    {
      name: 'Shawn Ku',
      email: 'sku@mozilla.com'
    },
    {
      name: 'Vincent Lin',
      email: 'vlin@mozilla.com'
    },
    {
      name: 'Vincent Liu',
      email: 'vliu@mozilla.com'
    },
    {
      name: 'Viral',
      email: 'vwang@mozilla.com'
    },
    {
      name: 'TingYuan',
      email: 'thuang@mozilla.com'
    },
    {
      name: 'Thinker',
      email: 'tlee@mozilla.com'
    },
    {
      name: 'Cervantes',
      email: 'cyu@mozilla.com'
    },
    {
      name: 'CJ',
      email: 'cku@mozilla.com'
    },
    {
      name: 'Tim',
      email: 'timdream@gmail.com'
    },
    {
      name: 'Evelyn',
      email: 'ehung@mozilla.com'
    }
  ];

  var PeopleList = [];

  MozillaTaiwan.forEach(function(person) {
    PeopleList.push(new BZQuery(person.name, person.email));
    return false;
  });

  $('#reload').click(function() {
    PeopleList.forEach(function(person) {
      person.reload();
    });
  });

}(this));