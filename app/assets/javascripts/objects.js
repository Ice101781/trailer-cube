//global vars/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var dimensions = {
                   screenmesh:    {length: .16,  width: .09},
                   screenpixels:  {length: 1280, width: 720}
                 };

//objects/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//lights
function pointLights() {
  
  this.one   = new THREE.PointLight(0xFF0000);
    this.one.position.set(-175, 0, 0);

  this.two   = new THREE.PointLight(0x00FF00);
    this.two.position.set(175, 0, 0);

  this.three = new THREE.PointLight(0x0000FF);
    this.three.position.set(0, 0, 175); 
};


//loading screen animation
function rhombicDodecahedron() {

  this.geometry = new THREE.Geometry();
    this.geometry.vertices = [ new THREE.Vector3( 2.04772293123743050, -4.09327412386437040, -5.74908146957292670),
                               new THREE.Vector3( 7.02732984841516030,  1.40331541320251810, -1.62706516545639390),
                               new THREE.Vector3( 4.22549114271519950, -1.62031854283173550,  5.78962800381778210),
                               new THREE.Vector3( 0.75411577446253997,  7.11690807989861880, -1.66761169970125600),
                               new THREE.Vector3(-0.75411577446252998, -7.11690807989862510,  1.66761169970125020),
                               new THREE.Vector3(-4.22549114271518980,  1.62031854283173260, -5.78962800381778920),
                               new THREE.Vector3( -2.0477229312374288,  4.09327412386436950,  5.74908146957292670),
                               new THREE.Vector3(-7.02732984841515230, -1.40331541320252740,  1.62706516545639970),
                               new THREE.Vector3( 6.27321407395262300, -5.71359266669610030,  0.04054653424485652),
                               new THREE.Vector3( 2.80183870569996340,  3.02363395603425690, -7.41669316927418000),
                               new THREE.Vector3( 4.97960691717773150,  5.49658953706689160,  4.12201630411653590),
                               new THREE.Vector3(-2.80183870569996340, -3.02363395603425690,  7.41669316927418000),
                               new THREE.Vector3(-4.97960691717773150, -5.49658953706689160, -4.12201630411653590),
                               new THREE.Vector3(-6.27321407395262480,  5.71359266669610210, -0.04054653424485653) ];

    this.geometry.faces.push(  new THREE.Face3( 8, 0, 9 ),     new THREE.Face3( 9, 1, 8 ),
                               new THREE.Face3( 8, 1, 10 ),    new THREE.Face3( 10, 2, 8 ),  
                               new THREE.Face3( 8, 2, 11 ),    new THREE.Face3( 11, 4, 8 ),
                               new THREE.Face3( 8, 4, 12 ),    new THREE.Face3( 12, 0, 8 ),
                               new THREE.Face3( 12, 5, 9 ),    new THREE.Face3( 9, 0, 12 ),
                               new THREE.Face3( 13, 3, 9 ),    new THREE.Face3( 9, 5, 13 ),
                               new THREE.Face3( 10, 1, 9 ),    new THREE.Face3( 9, 3, 10 ),
                               new THREE.Face3( 10, 3, 13 ),   new THREE.Face3( 13, 6, 10 ),
                               new THREE.Face3( 11, 2, 10 ),   new THREE.Face3( 10, 6, 11 ),
                               new THREE.Face3( 11, 7, 12 ),   new THREE.Face3( 12, 4, 11 ),
                               new THREE.Face3( 12, 7, 13 ),   new THREE.Face3( 13, 5, 12 ),
                               new THREE.Face3( 13, 7, 11 ),   new THREE.Face3( 11, 6, 13 ) );

    this.geometry.computeVertexNormals();
    this.geometry.computeFaceNormals();

  this.material = new THREE.MeshLambertMaterial({color: 0x4B32AF, wireframe: false, shading: THREE.FlatShading});

  this.mesh = new THREE.Mesh(this.geometry, this.material);

  this.position = this.mesh.position;
  //this.position.set(0, 0, 0);
};

rhombicDodecahedron.prototype = {

  constructor: rhombicDodecahedron,

  animation: function(speed) {

    speed = typeof speed !== 'undefined' ? speed : 600;

    this.mesh.rotation.x += 2*Math.PI/speed;
    this.mesh.rotation.z -= 2*Math.PI/speed;
  }
};


//the cube
function wireFrameCube(segments) {

  segments = typeof segments !== 'undefined' ? segments : 100;

  this.geometry = new THREE.BoxGeometry(1, 1, 1, segments, segments, segments);
  
  this.material = new THREE.MeshBasicMaterial({color: 0x4B32AF, wireframe: true});
  
  this.mesh     = new THREE.Mesh(this.geometry, this.material);
    this.mesh.visible = false;
    //this.mesh.position.set(0, 0, 0);
};


function loadingProgressBar() {

  
};


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
  
  this.video  = create("video");
    this.video.crossOrigin = 'anonymous';

  this.canvas = create("canvas");
    this.canvas.getContext('2d');
    this.canvas.length = dimensions.screenpixels.length;
    this.canvas.width  = dimensions.screenpixels.width;
 
  this.videoScreen = new THREE.Mesh( new THREE.PlaneBufferGeometry(dimensions.screenmesh.length, dimensions.screenmesh.width, 1, 1), new THREE.MeshBasicMaterial({overdraw: true}) );
    this.videoScreen.visible = false;
    this.videoScreen.position.set(new THREE.Vector3());
    //videoCube.add(this.videoScreen);
};

