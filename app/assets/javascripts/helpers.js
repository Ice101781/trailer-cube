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


//media source helper
  //function media(title) {
    //return [ "https://files9.s3-us-west-2.amazonaws.com/hd_trailers/"+title+"/"+title+".jpg",
             //"https://files9.s3-us-west-2.amazonaws.com/hd_trailers/"+title+"/"+title+".mp4" ];
  //};

