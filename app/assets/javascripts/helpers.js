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

  function create( id ) {
    return document.createElement( id );
  };

