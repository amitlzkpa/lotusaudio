

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getPointInBetweenByLen(a, b) {
  let pp = new THREE.Vector3((a.x+b.x)/2, (a.y+b.y)/2, (a.z+b.z)/2);
  return pp;
}








function Viz() {
  


  let particles = null;
  let originalPos = [];
  let outwardVecs = [];

  // 3d radius (i.e 'physical' distance)
  let size = 400;
  let particleCount = 20000;

  let jump = size / 10;


  let freq = 'low';

  
  // these values are actually indexes into the particles array
  // it works because we incrementally add the particles from inside to out
  let lowerWindow = 0;
  let waveFrontWidth = 4000;
  let speed = 400;
  let speedMultiplier = 1;

  let upperWindow = lowerWindow + waveFrontWidth;

  let p = null;
  


  
  let v = [
    new THREE.Vector3(0,    0,    0),
    new THREE.Vector3(0,    0,    600),
    new THREE.Vector3(520,  0,    300),
    new THREE.Vector3(260,  600,  300),
    // new THREE.Vector3(400,  400,  200)
  ];

  let prev = new THREE.Vector3(200, 0, 340);

  

  this.init = async function() {

    let retObj = new THREE.Object3D();

    particles = new THREE.Geometry();
    let pMaterial = new THREE.PointsMaterial({ size: 2, vertexColors: THREE.VertexColors });

    for (let p = 0; p < particleCount; p++) {

      let pRat = p / particleCount;

      let r = pRat * size;


      let i = getRandomInt(v.length);
      let pP = prev.clone();
      let rP = v[i].clone();
      let np = getPointInBetweenByLen(pP, rP);
      particle = new THREE.Vector3(np.x, np.y, np.z);
      prev = np;

      // let phi = Math.random() * Math.PI,
      //     theta = Math.random() * Math.PI;
      // let pX = r * Math.sin(phi) * Math.cos(theta),
      //     pZ = r * Math.cos(phi),
      //     pY = r * Math.sin(phi) * Math.sin(theta),
      //     particle = new THREE.Vector3(pX, pY, pZ);

      particles.vertices.push(particle);
      let col = new THREE.Color(1 - pRat, 0, 1);
      particles.colors.push(col);

      originalPos.push(particle.clone());
      outwardVecs.push(particle.clone().normalize().multiplyScalar(jump * Math.random()));

    }

    let particleSystem = new THREE.Points(particles, pMaterial);

    retObj.add(particleSystem);

    return retObj;
  }


  this.renderFrame = async function(FREQOBJ) {
    let arr = (freq == 'hig') ? FREQOBJ['higFreqArray'] :
              (freq == 'mid') ? FREQOBJ['midFreqArray'] :
                                FREQOBJ['lowFreqArray'];

    for(let i=0; i<particles.vertices.length; i++) {

      if(lowerWindow < i && i < upperWindow) {

        // move outwards if within bounds of wavefront
        p = particles.vertices[i];
        p.x += outwardVecs[i].x;
        p.y += outwardVecs[i].y;
        p.z += outwardVecs[i].z;

      } else {

        // reset positions
        p = particles.vertices[i];
        p.x = originalPos[i].x;
        p.y = originalPos[i].y;
        p.z = originalPos[i].z;

      }

    }



    lowerWindow += (speed * speedMultiplier);
    upperWindow += (speed * speedMultiplier);


    // console.log(lowerWindow, upperWindow, particleCount);
    if(lowerWindow >= particleCount) {
      let c = 0;
      let sum = arr.reduce((previous, current) => {
        if(current > 0) {
          c++;
          return current += previous;
        }
        return previous;
      });
      let avg = sum / c;
      speedMultiplier = Math.pow(avg / 255, 2) * 4;
    }


    lowerWindow %= particleCount;
    upperWindow %= particleCount;





    particles.verticesNeedUpdate = true;

  }


}




// --------------------------




function getRefs() {
  return  [
  ]
}



function getObj() {
  return Viz;
}