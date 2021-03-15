

function Viz() {

  let vizObj;

  this.init = async function() {
    vizObj = new THREE.Object3D();
    return vizObj;
  }

  /**
  Method called every frame along with sampled audio data at the frame.
  Use this to update your viz environment.
  The passed in argument is an object containing sampled audio under following keys:
  FREQOBJ['allFreqArray'] = array;
  FREQOBJ['lowFreqArray'] = lowFreqArray;
  FREQOBJ['midFreqArray'] = midFreqArray;
  FREQOBJ['higFreqArray'] = higFreqArray;
  */
  this.renderFrame = async function(FREQOBJ) {
  }


}




function getRefs() {
  return  [
  ]
}




//-----------------------------------------------------------------------------



/**
Internal method used to load the visualization.
Do not change.
*/
function getObj() {
  return Viz;
}