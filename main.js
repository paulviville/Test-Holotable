import * as THREE from "./three/three.module.js";
import { OrbitControls } from "./three/controls/OrbitControls.js";


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffeeee);

let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0xffffff, 100);
pointLight0.position.set(5,4,5);
scene.add(pointLight0);

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 50 );
camera.position.set( 2, 2, 6 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.autoClear = false;
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const orbitControls = new OrbitControls(camera, renderer.domElement);


const gridHelper = new THREE.GridHelper(10, 10);
// gridHelper.lookAt(new THREE.Vector3(0, 1, 0));
scene.add(gridHelper);

function animate() {
    renderer.render( scene, camera );
  }
  
  renderer.setAnimationLoop( animate );