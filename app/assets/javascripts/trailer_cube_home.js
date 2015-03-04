//check for browser support of WebGL
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
  };


//HTML tag function(s)
  function $( id ) {
    return document.getElementById( id );
  };

  function append( child, parent ) {
    return parent.appendChild(child);
  };
  

//some global vars, append verifications
  var clock = new THREE.Clock(),
      width = window.innerWidth,
      height = window.innerHeight,
      container = $("container");
    
  if(document.body != null) {
    append( container, document.body );
  };

  var scene = new THREE.Scene(), 
      camera = new THREE.PerspectiveCamera(45, (width/height), 0.01, 100),
      controls = new THREE.OrbitControls(camera, container),
      renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );
      
  if(container != null) {    
    append( renderer.domElement, container );
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);
    $( "loading" ).style.display = "block";   
  };

  var projector = new THREE.Projector(),
      raycaster = new THREE.Raycaster(),
      mouse = { x: 0, y:0 };

//listen for events
  window.addEventListener('mousedown', on_mouse_down, false);
  window.addEventListener('resize', on_window_resize, false);


function on_click() {
  for(a=0; a<trailers.length; a++) {
      videos[a].pause();
      video_screen_materials[a].map = image_stills[a];
  };
  
  videos[b].src = sources[b];
  videos[b].load();
  videos[b].play();
  
  video_images[b].width = dimensions[b][0];
  video_images[b].height = dimensions[b][1];
  
  video_image_contexts[b].fillStyle = '0#000000';
  video_image_contexts[b].fillRect(0, 0, video_images[b].width, video_images[b].height);

  video_textures[b].minFilter = THREE.LinearFilter;
  video_textures[b].magFilter = THREE.LinearFilter;

  video_screen_materials[b].map = video_textures[b];

  click = false;
};


function on_mouse_down(event) {  
  //prevent simultaneous OrbitControls functionality
    event.preventDefault();

  mouse.x = ( event.clientX / width ) * 2 - 1;
  mouse.y = - ( event.clientY / height ) * 2 + 1;

  var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    vector.unproject(camera);    
  
  raycaster.set(camera.position, vector.sub( camera.position ).normalize());
  
  var intersects = raycaster.intersectObjects(scene.children, true);  
    
    if( intersects.length > 0 ) {
      for(b=0; b<trailers.length; b++) {
        if ( intersects[0].object == video_screens[b] ) {
          click = true;
          return b;
        };
      };  
    };
  
  //console.log(intersects);
};


function on_window_resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = (width/height);
};


//global vars needed for the scene
  var delta, elapsed,
      load_mesh, load_light,
      trailer_cube, 
      load_time = 5, first_load = true,
      click = false, b = 0;

init();
animate();
//console.log(variable name(s) here);


function load_screen_mesh() {
  //the golden ratio
    var g_phi = (1+Math.sqrt(5))/2;
     
  //vertices
    var v1  = new THREE.Vector3(     0,         0,      2*g_phi^2   ),
        v11 = new THREE.Vector3(   g_phi^2,   g_phi^2,    g_phi^2   ),
        v13 = new THREE.Vector3( -(g_phi^2),  g_phi^2,    g_phi^2   ),
        v16 = new THREE.Vector3( -(g_phi^2), -(g_phi^2),  g_phi^2   ),
        v18 = new THREE.Vector3(  (g_phi^2), -(g_phi^2),  g_phi^2   ),
        v26 = new THREE.Vector3(  2*g_phi^2,     0,         0       ),
        v29 = new THREE.Vector3(     0,       2*g_phi^2,    0       ),
        v32 = new THREE.Vector3( -2*g_phi^2,     0,         0       ),
        v35 = new THREE.Vector3(     0,      -2*g_phi^2,    0       ),
        v45 = new THREE.Vector3(   g_phi^2,   g_phi^2,   -g_phi^2   ),
        v47 = new THREE.Vector3(  -g_phi^2,   g_phi^2,   -g_phi^2   ),
        v50 = new THREE.Vector3(  -g_phi^2,  -g_phi^2,   -g_phi^2   ),
        v52 = new THREE.Vector3(   g_phi^2,  -g_phi^2,   -g_phi^2   ),
        v62 = new THREE.Vector3(     0,          0,    -2*g_phi^2   );

  //faces
    var faces = [ 
                  [v11, v1, v29],  [v11, v1, v26],  [v11, v26, v29], [v13, v1, v29],  [v13, v1, v32],  [v13, v29, v32],
                  [v16, v1, v32],  [v16, v1, v35],  [v16, v35, v32], [v18, v1, v26],  [v18, v1, v35],  [v18, v26, v35],
                  [v45, v26, v29], [v45, v29, v62], [v45, v26, v62], [v52, v26, v35], [v52, v26, v62], [v52, v35, v62],
                  [v47, v29, v32], [v47, v29, v62], [v47, v32, v62], [v50, v32, v62], [v50, v35, v62], [v50, v32, v35] 
                ];
      
  //create the geometry 
    var load_geo = new THREE.Geometry();

      for(c=0; c<faces.length; c++) {
        var triangle_geo = new THREE.Geometry();
      
        for(d=0; d<3; d++) {
         triangle_geo.vertices.push(faces[c][d]);
        };
      
        triangle_geo.faces.push( new THREE.Face3( 0, 1, 2 ) );
        load_geo.merge(triangle_geo);
      };

    var load_mat = new THREE.MeshBasicMaterial( {color: 0x4B32AF, wireframe: true} );

    load_mesh = new THREE.Mesh(load_geo, load_mat);
      scene.add(load_mesh);
};


function load_screen() {
  //add a light to the load scene
    load_light = new THREE.AmbientLight(0xFFFFFF);
      scene.add(load_light);
  
  camera.position.z = 30;
  load_screen_mesh();
};


function init() {
  load_screen();

  //add a light to the home page
    homepage_light = new THREE.PointLight(0xFFFFFF);
      homepage_light.visible = false;
      scene.add(homepage_light);
      //the homepage light's spherical coordinates parameters
        var homepage_light_r = 10;
        var homepage_light_theta = Math.PI/4;
        var homepage_light_phi = Math.PI/2;
      //set the homepage light's position at page load
        homepage_light.position.setX(homepage_light_r*Math.sin(homepage_light_theta)*Math.cos(homepage_light_phi));
        homepage_light.position.setY(homepage_light_r*Math.sin(homepage_light_theta)*Math.sin(homepage_light_phi));
        homepage_light.position.setZ(homepage_light_r*Math.cos(homepage_light_theta));

  //add the cube
    var trailer_cube_geo = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
           
    var trailer_cube_mat = new THREE.MeshBasicMaterial(
      {
        color: 0x4B32AF,
        wireframe: true,          
      }
    );

    trailer_cube = new THREE.Mesh(trailer_cube_geo, trailer_cube_mat); 
      trailer_cube.visible = false;
      scene.add(trailer_cube);        
      //the cube's spherical coordinates parameters
        var trailer_cube_r = 0;
        var trailer_cube_theta = 0;
        var trailer_cube_phi = 0;
      //set the cube's position at page load
        trailer_cube.position.setX(trailer_cube_r*Math.sin(trailer_cube_theta)*Math.cos(trailer_cube_phi));
        trailer_cube.position.setY(trailer_cube_r*Math.sin(trailer_cube_theta)*Math.sin(trailer_cube_phi));
        trailer_cube.position.setZ(trailer_cube_r*Math.cos(trailer_cube_theta));

  //add video screens to the scene
    for(e=0; e<trailers.length; e++) {
      video_screens[e].visible = false;
      scene.add(video_screens[e]);
      video_screens[e].position.set( locations[e][0], locations[e][1], locations[e][2] );
    };
};


function loaded() {
  scene.remove(load_light);
  scene.remove(load_mesh); 

  //the camera's spherical coordinates parameters
    var cam_r = 2;
    var cam_theta = 0;
    var cam_phi = 0;
  //set the camera's position at page load
    camera.position.setX(cam_r*Math.sin(cam_theta)*Math.cos(cam_phi));
    camera.position.setY(cam_r*Math.sin(cam_theta)*Math.sin(cam_phi));
    camera.position.setZ(cam_r*Math.cos(cam_theta));

  //camera rotation
    //controls.autoRotate = true;
    //controls.autoRotateSpeed = 0.125;

  $( "loading" ).style.display = "none";
  
  homepage_light.visible = true;
  trailer_cube.visible = true;
  for(f=0; f<trailers.length; f++) {
    video_screens[f].visible = true;
  };
};


function render() {
  delta = clock.getDelta();
  elapsed = clock.getElapsedTime();

  controls.update(delta);
  controls.target = new THREE.Vector3(0,0,0);
  renderer.render(scene, camera);
  
  //update the video texture
    if ( videos[b] != undefined && videos[b].readyState === videos[b].HAVE_ENOUGH_DATA ) {
      video_image_contexts[b].drawImage( videos[b], 0, 0 );
    
      if ( video_textures[b] ) { 
        video_textures[b].needsUpdate = true;
      };
    };
    
  //console.log(variable name(s) here);
};


function animate() {
  //loading screen mesh's rotation
    if (elapsed < load_time) {
      load_mesh.rotation.x += 2*Math.PI/300;
      load_mesh.rotation.y += 2*Math.PI/300;
    };

  //load the home page
    if (elapsed >= load_time && first_load == true) {
      loaded();
      first_load = false;
    };

  //click logic
    if(click == false) {
    }  
    else { 
      on_click();
    };  

  requestAnimationFrame(animate);
  render();   
};

