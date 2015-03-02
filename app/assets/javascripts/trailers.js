var trailers = [],
    titles = [],
    images = [],
    sources = [],
    dimensions = [],
    locations = [],
    video_screen_geometry = new THREE.PlaneBufferGeometry(.16, .09, 4, 4),
    video_screen_materials = [],
    video_screens = [];

trailers[0] = [
                titles[0] = "Furious7",
                images[0] = THREE.ImageUtils.loadTexture("hd_trailers/furious7/furious7.jpg"),
                sources[0] = "hd_trailers/furious7/furious7.mp4",
                dimensions[0] = [1280, 720],
                locations[0] = [-.42, .455, .51],
                video_screen_materials[0] = new THREE.MeshBasicMaterial( {map: images[0], overdraw: true} ),
                video_screens[0] = new THREE.Mesh( video_screen_geometry, video_screen_materials[0] )
              ];

              