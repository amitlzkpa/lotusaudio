

export const getMedia = async function(constraints) {
  constraints = constraints || { audio: true, video: false };
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch(err) {
    console.log(err);
  }
  return stream;
}


export default {
  getMedia
};