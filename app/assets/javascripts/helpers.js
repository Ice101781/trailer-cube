//check for browser support of WebGL
  if(!Detector.webgl) {
    Detector.addGetWebGLMessage();
  };


//HTML tag function(s)
  function $(id) {
    return document.getElementById(id);
  };

  function append(child, parent) {
    return parent.appendChild(child);
  };

  function create(id) {
    return document.createElement(id);
  };


//convert number of seconds to a 'minutes-seconds' string
  function sec_to_string(seconds) {
    var mins_decimal = seconds/60,
        seconds_only_base60 = Math.round((mins_decimal-Math.floor(mins_decimal))*60);
        
    if(seconds%60==0) {return (mins_decimal)+':00'}
    else if(seconds>60) { 
      if(seconds_only_base60<10) {return Math.floor(mins_decimal)+':0'+seconds_only_base60}
      else                       {return Math.floor(mins_decimal)+':'+seconds_only_base60};
    }
    else {
      if(seconds<10) {return '0:0'+seconds} 
      else           {return '0:'+seconds};
    };
  };


//RicassoRegular text helper
  function ricasso(textSize) {
    return textSize + 'px RicassoRegular';
  };


//IMDB link helper
  function imdb(stringNum) {
    return 'http://www.imdb.com/name/nm' + stringNum + '/';
  };


//the trailer object (placed here for compile reasons)
  function trailer(identifiers, genre, plot, director, cast, cinematography, writing, release, videoHeightError, aspectRatio) {
  
    identifiers      = typeof identifiers      !== 'undefined' ? identifiers      : { title: { name:'', link:'' }, filename:'' };
    genre            = typeof genre            !== 'undefined' ? genre            : '';
    plot             = typeof plot             !== 'undefined' ? plot             : { line1:'', line2:'', line3:'', line4:'', line5:'', line6:'' };
    director         = typeof director         !== 'undefined' ? director         : { name:'', link:'' };
    cast             = typeof cast             !== 'undefined' ? cast             : { one: { name:'', link:'' }, two: { name:'', link:'' }, three: { name:'', link:'' }, four: { name:'', link:'' }, five: { name:'', link:'' } };
    cinematography   = typeof cinematography   !== 'undefined' ? cinematography   : { one: { name:'', link:'' }, two: { name:'', link:'' } };
    writing          = typeof writing          !== 'undefined' ? writing          : { one: { name:'', link:'' }, two: { name:'', link:'' }, three: { name:'', link:'' } };
    release          = typeof release          !== 'undefined' ? release          : '';
    videoHeightError = typeof videoHeightError !== 'undefined' ? videoHeightError : false;
    aspectRatio      = typeof aspectRatio      !== 'undefined' ? aspectRatio      : '';

    this.identifiers      = identifiers;
    this.genre            = genre;
    this.plot             = plot;
    this.director         = director;
    this.cast             = cast;
    this.cinematography   = cinematography;
    this.writing          = writing;
    this.release          = release;
    this.videoHeightError = videoHeightError;
    this.aspectRatio      = aspectRatio;

    this.filesource       = "https://files9.s3-us-west-2.amazonaws.com/hd_trailers/"+this.identifiers.filename+"/"+this.identifiers.filename;

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

