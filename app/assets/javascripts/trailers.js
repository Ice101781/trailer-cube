//the trailer data/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var trailers = {

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  starwars7: new trailer(  { title: { name: 'Star Wars: Episode VII', link: 'http://www.rottentomatoes.com/m/star_wars_episode_vii_the_force_awakens/' }, filename: 'starwars7' },

                           'Action/Adventure',

                           { line1: '   The Star Wars saga continues after the events of Return of the Jedi.',
                             line2: '',
                             line3: '',
                             line4: '',
                             line5: '',
                             line6: '' },

                           { name: 'J.J. Abrams', link: imdb('0009190') },

                           { one: { name: 'Mark Hamill', link: imdb('0000434') }, two: { name: 'Harrison Ford', link: imdb('0000148') }, three: { name: 'Daisy Ridley', link: imdb('5397459') }, four: { name: 'Adam Driver', link: imdb('3485845') }, five: { name: 'Oscar Isaac', link: imdb('1209966') } },

                           { one: { name: 'Daniel Mindel', link: imdb('0591053') }, two: { name: '', link: '' } },

                           { one: { name: 'Lawrence Kasdan', link: imdb('0001410') }, two: { name: 'J.J. Abrams', link: imdb('0009190') }, three: { name: 'Michael Arndt', link: imdb('1578335') } },

                           '12/18/2015',

                           true,

                           '2.35:1'  ),

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  joy: new trailer(  { title: { name: 'Joy', link: 'http://www.rottentomatoes.com/m/joy_2014/' }, filename: 'joy' },

                     'Drama',

                     { line1: '   Joy is the wild story of a family across four generations centered on the girl',
                       line2: 'who becomes the woman who founds a business dynasty and becomes a matriarch in',
                       line3: 'her own right.',
                       line4: '',
                       line5: '',
                       line6: '' },

                     { name: 'David O. Russell', link: imdb('0751102') },

                     { one: { name: 'Jennifer Lawrence', link: imdb('2225369') }, two: { name: 'Bradley Cooper', link: imdb('0177896') }, three: { name: 'Robert De Niro', link: imdb('0000134') }, four: { name: 'Virginia Madsen', link: imdb('0000515') }, five: { name: 'Isabella Rossellini', link: imdb('0000618') } },

                     { one: { name: 'Linus Sandgren', link: imdb('0761874') }, two: { name: '', link: '' } },

                     { one: { name: 'David O. Russell', link: imdb('0751102') }, two: { name: 'Annie Mumolo', link: imdb('1754239') }, three: { name: '', link: '' } },

                     '12/25/2015',

                     false,

                     '1.85:1'  ),

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  batmanvsuperman: new trailer(  { title: { name: 'Batman v Superman', link: 'http://www.rottentomatoes.com/m/batman_v_superman_dawn_of_justice/' }, filename: 'batmanvsuperman' },

                                 'Action/Adventure',

                                 { line1: '   Following the detruction of Metropolis, Batman (Ben Affleck) embarks on a ',
                                   line2: 'personal vendetta against Superman (Henry Cavill).',
                                   line3: '',
                                   line4: '',
                                   line5: '',
                                   line6: '' },

                                 { name: 'Zack Snyder', link: imdb('0811583') },

                                 { one: { name: 'Henry Cavill', link: imdb('0147147') }, two: { name: 'Ben Affleck', link: imdb('0000255') }, three: { name: 'Amy Adams', link: imdb('0010736') }, four: { name: 'Jeremy Irons', link: imdb('0000460') }, five: { name: 'Jesse Eisenberg', link: imdb('0251986') } },

                                 { one: { name: 'Larry Fong', link: imdb('0284583') }, two: { name: '', link: '' } },

                                 { one: { name: 'Chris Terrio', link: imdb('0006516') }, two: { name: 'David S. Goyer', link: imdb('0333060') }, three: { name: '', link: '' } },

                                 '03/25/2016',

                                 true,

                                 '2.35:1'  )//,

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//the template/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      //key: new trailer(  { title: { name: '', link: '' }, filename: '' },

                         //'',

                         //{ line1: '',
                           //line2: '',
                           //line3: '',
                           //line4: '',
                           //line5: '',
                           //line6: '' },

                         //{ name: '', link: imdb('') },

                         //{ one: { name: '', link: imdb('') }, two: { name: '', link: imdb('') }, three: { name: '', link: imdb('') }, four: { name: '', link: imdb('') }, five: { name: '', link: imdb('') } },

                         //{ one: { name: '', link: imdb('') }, two: { name: '', link: imdb('') } },

                         //{ one: { name: '', link: imdb('') }, two: { name: '', link: imdb('') }, three: { name: '', link: imdb('') } },

                         //'',

                         //boolean,

                         //''  )//,

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
};

