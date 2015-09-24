//the trailer object
function trailer(identifiers, genre, plot, director, actors, release) {
  
  identifiers = typeof identifiers !== 'undefined' ? identifiers : {title:'', filename:''};
  genre       = typeof genre       !== 'undefined' ? genre       : '';
  plot        = typeof plot        !== 'undefined' ? plot        : {line1:'', line2:'', line3:'', line4:'', line5:'', line6:''};
  director    = typeof director    !== 'undefined' ? director    : '';
  actors      = typeof actors      !== 'undefined' ? actors      : {1:'', 2:'', 3:'', 4:'', 5:''};
  release     = typeof release     !== 'undefined' ? release     : '';  
  
  this.identifiers = identifiers;
  this.genre       = genre;
  this.plot        = plot;
  this.director    = director;
  this.actors      = actors;
  this.release     = release;

  this.filesource = "https://files9.s3-us-west-2.amazonaws.com/hd_trailers/"+this.identifiers.filename+"/"+this.identifiers.filename;

  this.video = create("video");
    this.video.crossOrigin = 'anonymous';
    this.video.src = this.filesource+".mp4";

  this.canvas = create("canvas");
    this.canvas.width  = 1280;
    this.canvas.height = 720;

  this.context = this.canvas.getContext('2d');
    this.context.fillStyle = '0#000000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

  this.texture = new THREE.Texture(this.canvas);

  this.videoScreen = new THREE.Mesh( 
    new THREE.PlaneBufferGeometry(.16, .09, 1, 1), 
    new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture("/public_assets/t_c.png"), overdraw: true} )
  );

    this.videoScreen.visible = true;
};

trailer.prototype = {

  constructor: trailer,

  videoUpdate: function() {

    if(this.video.readyState === this.video.HAVE_ENOUGH_DATA) { this.context.drawImage(this.video, 0, 0) };

    this.texture.needsUpdate = true;
  }    
};


//the trailer data
var trailers = {

  avengers2: new trailer(  { title: "Avengers 2:  Age of Ultron", filename: 'avengers2' },

                           'Action/Adventure',

                           { line1: '   When Tony Stark (Robert Downey Jr.) jump-starts a dormant peacekeeping  program,',
                             line2: 'things go terribly awry, forcing him, Thor (Chris Hemsworth),  the Incredible  Hulk',
                             line3: '(Mark  Ruffalo) and the rest of the Avengers to reassemble.  As the  fate of  Earth',
                             line4: 'hangs in the balance, the team is put to the ultimate test as they battle Ultron, a',
                             line5: 'technological terror hell-bent on human extinction.  Along the way, they  encounter',
                             line6: 'two mysterious and powerful newcomers, Pietro and Wanda Maximoff.' },

                           'Joss Whedon',

                           { 1: 'Robert Downey, Jr.', 2: 'Chris Hemsworth', 3: 'Mark Ruffalo', 4: 'Scarlett Johansson', 5: 'Chris Evans' },

                           'May 1st, 2015'  ),

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
   furious7: new trailer(  { title: "Furious 7", filename: 'furious7' },

                           'Action/Adventure',

                           { line1: '   After defeating international terrorist Owen Shaw, Dominic Toretto (Vin Diesel),',
                             line2: 'Brian O\'Conner (Paul  Walker) and the rest of the crew have separated to return to',
                             line3: 'more normal lives. However, Deckard Shaw (Jason Statham), Owen\'s older brother, is',
                             line4: 'thirsty for revenge.  A slick government agent offers to help  Dom and company take',
                             line5: 'care of Shaw in exchange for their help in rescuing a kidnapped computer hacker who',
                             line6: 'has developed a powerful surveillance program.' },

                           'James Wan',

                           { 1: 'Vin Diesel', 2: 'Paul Walker', 3: 'Michelle Rodriguez', 4: 'Tyrese Gibson', 5: 'Jason Statham' },

                           'April 3rd, 2015'  )

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
};


//trailer locations - need a function to generate these dynamically
trailers.avengers2.location = new THREE.Vector3(-.42, .455, .51);

trailers.furious7.location  = new THREE.Vector3(-.25, .455, .51);


