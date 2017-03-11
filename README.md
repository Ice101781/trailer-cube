<a href="http://trailer-cube.herokuapp.com/">trailer_cube</a>
===

&nbsp; This project is a <a href="https://github.com/rails/rails">Ruby on Rails</a>-based application which depends on <a href="https://github.com/mrdoob/three.js/">Three.js</a>. All media are stored on <a href="https://aws.amazon.com/s3/">Amazon S3</a>, are copyright of any respective owners, and have been presented only for instructional purposes.

&nbsp; The entirety of the user interface, with the exception of the header and footer, is rendered in 3D and contained within a single `<div>` element. In the load screen below, the icon and progress bar are geometric objects that share the same space. The camera is "closest" to the user, followed by the progress bar, and finally the icon. The approach is unconventional, and yet the experience is still very familiar.

<br>
<img width="" alt="load screen" src="https://drive.google.com/uc?export=download&id=0B3rehuqgDPeVY0s3VUhFT2xYSnM">
<br>

&nbsp; Once the necessary media have loaded, a grid of images is revealed. Mouse over any one of these and a transparent panel containing information about the trailer is displayed on either the top or bottom-half of the screen, depending on the location of the image. As the cursor is shifted around the grid, the panel updates with the relevant info. Move the cursor beyond the edges of the grid and the panel disappears. 

<br>
<img width="" alt="main page" src="https://drive.google.com/uc?export=download&id=0B3rehuqgDPeVRnhaT2IxdUlZWVU">
<br>

&nbsp; Click an image to lock on a trailer. 

<br>
<img width="" alt="trailer selected" src="https://drive.google.com/uc?export=download&id=0B3rehuqgDPeVd1NTSU1HUS1yZ1U">
<br>
