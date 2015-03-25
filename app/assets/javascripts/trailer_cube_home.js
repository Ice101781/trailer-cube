//some global vars, append verifications
  var clock     = new THREE.Clock(),
      width     = window.innerWidth,
      height    = window.innerHeight,
      container = $("container");
    
  if(document.body != null) {
    append( container, document.body );
  };

  var scene    = new THREE.Scene(), 
      camera   = new THREE.PerspectiveCamera(45, (width/height), 0.01, 100),
      controls = new THREE.OrbitControls(camera, container),
      renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );
      
      //camera positions
        cam_home = new THREE.Vector3( 2.5*Math.sin(0)*Math.cos(0), 2.5*Math.sin(0)*Math.sin(0), 2.5*Math.cos(0) );
        cam_load = new THREE.Vector3( 50*Math.sin(0)*Math.cos(0), 50*Math.sin(0)*Math.sin(0), 50*Math.cos(0) );

  if(container != null) {
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);
    $("loading").style.display = "block";
    append( renderer.domElement, container );   
  };

  var projector = new THREE.Projector(),
      raycaster = new THREE.Raycaster(),
      mouse = { x: 0, y:0 };
      
  var video_controls  = new THREE.Object3D(),
      button_geometry = new THREE.PlaneBufferGeometry(.0072, .00405, 4, 4),
      
      play_button_material             = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('public_assets/play_button.png')} ),
      pause_button_material            = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('public_assets/pause_button.png')} ),
      enter_fullscreen_button_material = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('public_assets/enter_fullscreen_button.png')} ),
      exit_fullscreen_button_material  = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('public_assets/exit_fullscreen_button.png')} ),
      exit_button_material             = new THREE.MeshBasicMaterial( {map: THREE.ImageUtils.loadTexture('public_assets/exit_button.png')} ),
      
      play_button             = new THREE.Mesh(button_geometry, play_button_material),
      pause_button            = new THREE.Mesh(button_geometry, pause_button_material),
      enter_fullscreen_button = new THREE.Mesh(button_geometry, enter_fullscreen_button_material),
      exit_fullscreen_button  = new THREE.Mesh(button_geometry, exit_fullscreen_button_material),
      exit_button             = new THREE.Mesh(button_geometry, exit_button_material);

      video_controls.visible = false;
      scene.add(video_controls);
        video_controls.add(pause_button);
        video_controls.add(enter_fullscreen_button);
        video_controls.add(exit_button);


//listen for events
  window.addEventListener('resize', on_window_resize, false);
  window.addEventListener('mousedown', on_mouse_down, false);

//user functions
  function on_window_resize() {
    width  = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = (width/height);
  };


  function on_mouse_down(event) {  
    event.preventDefault();
    mouse.x = ( event.clientX / width ) * 2 - 1;
    mouse.y = - ( event.clientY / height ) * 2 + 1;

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
      vector.unproject(camera);    
  
    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
  
    var intersects = raycaster.intersectObjects(scene.children, true);

      if( intersects[0] == undefined || intersects[0].object == trailer_cube ) {
        //do nothing
        return;
      };

      if( intersects[0].object == play_button ) {
        videos[b].play();
        video_controls.remove(play_button);
        video_controls.add(pause_button);
        return;    
      };

      if( intersects[0].object == pause_button ) {
        videos[b].pause();
        video_controls.remove(pause_button);
        video_controls.add(play_button);
        return;
      };

      if( intersects[0].object == enter_fullscreen_button ) {
        container.webkitRequestFullscreen();
        on_window_resize();
        return;
      };

      if( intersects[0].object == exit_fullscreen_button ) {
        document.webkitExitFullscreen();
        on_window_resize();
        return;
      };

      if( intersects[0].object == exit_button ) {
        videos[b].pause();        
        videos[b].currentTime = 0;
        video_screen_materials[b].map = image_stills[b];
      
        if( play_button.visible == true ) {
          video_controls.remove(play_button);
          video_controls.add(pause_button);
        };
      
        video_controls.visible = false;      
        controls.target = new THREE.Vector3();
        camera.position.set( locations[b][0], locations[b][1], locations[b][2]+(1) );
        controls.enabled = true;
        return;
      };

      for( b=0; b<trailers.length; b++ ) {    
        if ( intersects[0].object == video_screens[b] ) {
          click = true;
          return b; 
        };
      };
      
    //console.log(intersects);
  };


  function on_click() {
    if ( controls.enabled == true ) {
      controls.enabled = false;
    };

    if( video_controls.visible == false ) {
      //pause any videos that are currently playing
        for(a=0; a<trailers.length; a++) {
          videos[a].pause();
          video_screen_materials[a].map = image_stills[a];
        };

      //position the camera in front of the video screen that's been clicked
        controls.target = video_screens[b].position;
        camera.position.set( locations[b][0], locations[b][1], locations[b][2]+(.0994) );

      //load and play the video
        videos[b].src = sources[b];
        videos[b].load();
        videos[b].play();

        video_images[b].width  = dimensions[b][0];
        video_images[b].height = dimensions[b][1];
  
        video_image_contexts[b].fillStyle = '0#000000';
        video_image_contexts[b].fillRect(0, 0, video_images[b].width, video_images[b].height);

        video_textures[b].minFilter = THREE.LinearFilter;
        video_textures[b].magFilter = THREE.LinearFilter;

        video_screen_materials[b].map = video_textures[b];
     
      //display video controls
        pause_button.position.set(            locations[b][0]+(.059), locations[b][1]-(.036), locations[b][2]+(.0001) );
        enter_fullscreen_button.position.set( locations[b][0]+(.067), locations[b][1]-(.036), locations[b][2]+(.0001) );
        exit_button.position.set(             locations[b][0]+(.075), locations[b][1]-(.036), locations[b][2]+(.0001) );
        play_button.position.copy(pause_button.position);
        exit_fullscreen_button.position.copy(enter_fullscreen_button.position);

        video_controls.visible = true;  
    };
    
    if( click == true ) {
      click = false;
    };  
  };


//global vars needed for the scene
  var delta, elapsed,
      load_mesh, load_light,
      trailer_cube, 
      load_time = 2, first_load = true,
      click = false, b = 0;


function load_screen() {
  camera.position.copy(cam_load);

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


function init() {
  //add light
    light = new THREE.AmbientLight(0xFFFFFF);
      scene.add(light);

  //initialize load screen
    load_screen();

  //add the cube
    var trailer_cube_geo = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
    var trailer_cube_mat = new THREE.MeshBasicMaterial( {color: 0x4B32AF, wireframe: true} );
        trailer_cube     = new THREE.Mesh(trailer_cube_geo, trailer_cube_mat); 
          trailer_cube.visible = false;
          scene.add(trailer_cube);        
          trailer_cube.position.set(0, 0, 0);
    
    //add video screens to the cube
      for(e=0; e<trailers.length; e++) {
        video_screens[e].visible = false;
        scene.add(video_screens[e]);
        video_screens[e].position.set( locations[e][0], locations[e][1], locations[e][2] );
      };
};


function loaded() {
  scene.remove(load_mesh); 

  camera.position.copy(cam_home);
  //controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  //object visibility
    $( "loading" ).style.display = "none";
    trailer_cube.visible = true;
    
    for(f=0; f<trailers.length; f++) {
      video_screens[f].visible = true;
    };
};


function render() {
  delta = clock.getDelta();
  elapsed = clock.getElapsedTime();

  controls.update(delta);
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

  //fullscreen button check
    if( document.webkitIsFullScreen ) {
      video_controls.remove(enter_fullscreen_button);
      video_controls.add(exit_fullscreen_button);
    }
    else {
      video_controls.remove(exit_fullscreen_button);
      video_controls.add(enter_fullscreen_button);
    };

  requestAnimationFrame(animate);
  render();   
};


init();
animate();
//console.log(variable name(s) here);

