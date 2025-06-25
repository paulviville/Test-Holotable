import * as THREE from "./three/three.module.js";
import { OrbitControls } from "./three/controls/OrbitControls.js";
import DisplayWindow from "./DisplayWindow.js";

import { GUI } from './three/libs/lil-gui.module.min.js'; 

// const displayWindow = window.open('./display.html', "", "width=800, height=800");

// displayWindow.body.title("debug window")
// displayWindow.resizeTo(200, 200)



const canvas = document.createElement('canvas');
document.body.appendChild(canvas)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfff9f9);

let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0xffffff, 100);
pointLight0.position.set(5,4,5);
scene.add(pointLight0);

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 50 );
camera.position.set( 2, 2, 6 );
const gridHelper = new THREE.GridHelper(10, 10);
// gridHelper.lookAt(new THREE.Vector3(0, 1, 0));
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

const box0 = new THREE.LineSegments(
	new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2)),
	new THREE.LineBasicMaterial({color: 0xff0000})
);
scene.add(box0);

const box1 = new THREE.LineSegments(
	new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2)),
	new THREE.LineBasicMaterial({color: 0x0000ff})
);
scene.add(box1);



const renderer = new THREE.WebGLRenderer({canvas});
// renderer.autoClear = false;
// renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

const orbitControls = new OrbitControls(camera, renderer.domElement);




const material0 = new THREE.MeshBasicMaterial({color: 0xFF0000});
const material1 = new THREE.MeshBasicMaterial({color: 0x0000FF});
const geometry = new THREE.SphereGeometry(0.1);
const sphere0 = new THREE.Mesh(geometry, material0);
const sphere1 = new THREE.Mesh(geometry, material1);

scene.add(sphere0);
scene.add(sphere1);



const gui = new GUI();
const guiParams = {
	head: new THREE.Vector3(1, 1, 1),
	translate: new THREE.Vector3(),
	scale: new THREE.Vector3(1, 1, 1),
	axis: new THREE.Vector3(1, 0, 0),
	angle: 0,
}

function updateView ( ) {
	const translate = guiParams.translate.clone();
	const scale = guiParams.scale.clone();
	const scaleFactor = Math.max(scale.x, Math.max(scale.y, scale.z));

	const scale0 = scale.clone().multiplyScalar(1 / scaleFactor);
	const scale1 = new THREE.Vector3(1, 1, 1).multiplyScalar(scaleFactor);

	const rotate = new THREE.Quaternion().setFromAxisAngle(guiParams.axis, guiParams.angle);

	box0.scale.copy(scale0);


	box1.position.copy(translate)
	box1.scale.copy(scale)
	box1.quaternion.copy(rotate);

	const position = guiParams.head.clone();
	sphere0.position.copy(position);

	const transform = new THREE.Matrix4();
	transform.compose(translate, rotate, scale1);
	sphere1.position.copy(position).applyMatrix4(transform);
}


function normalizeLockedX ( vector ) {
	const length = vector.length();
	
	const lengthRemain = Math.sqrt(length - vector.x*vector.x);
	const lengthOther = Math.hypot(vector.y, vector.z);
	if(lengthOther != 0) {
		vector.y = vector.y / lengthOther * lengthRemain; 
		vector.z = vector.z / lengthOther * lengthRemain; 
	} else {
		vector.y = lengthRemain; 
		vector.z = 0; 
	}
}

function updateAxes ( a0, a1, a2 ) {
	const axis = new THREE.Vector3(guiParams.axis[a0], guiParams.axis[a1], guiParams.axis[a2])
	normalizeLockedX(axis);
	guiParams.axis[a0] = axis.x;
	guiParams.axis[a1] = axis.y;
	guiParams.axis[a2] = axis.z;
	updateView();
}

const headFolder = gui.addFolder("head");
headFolder.add(guiParams.head, "x").min(-5.0).max(5.0).step(0.05).onChange(updateView);
headFolder.add(guiParams.head, "y").min(-5.0).max(5.0).step(0.05).onChange(updateView);
headFolder.add(guiParams.head, "z").min(-5.0).max(5.0).step(0.05).onChange(updateView);

const translateFolder = gui.addFolder("translate");
translateFolder.add(guiParams.translate, "x").min(-5.0).max(5.0).step(0.05).onChange(updateView);
translateFolder.add(guiParams.translate, "y").min(-5.0).max(5.0).step(0.05).onChange(updateView);
translateFolder.add(guiParams.translate, "z").min(-5.0).max(5.0).step(0.05).onChange(updateView);
const rotateFolder = gui.addFolder("rotate");
rotateFolder.add(guiParams.axis, "x").min(-1.0).max(1.0).step(0.01).onChange(() => { updateAxes("x", "y", "z") }).listen();
rotateFolder.add(guiParams.axis, "y").min(-1.0).max(1.0).step(0.01).onChange(() => { updateAxes("y", "z", "x") }).listen();
rotateFolder.add(guiParams.axis, "z").min(-1.0).max(1.0).step(0.01).onChange(() => { updateAxes("z", "x", "y") }).listen();
rotateFolder.add(guiParams, "angle").min(-Math.PI).max(Math.PI).step(0.05).onChange(updateView);
const scaleFolder = gui.addFolder("scale");
scaleFolder.add(guiParams.scale, "x").min(0.1).max(5.0).step(0.05).onChange(updateView);
scaleFolder.add(guiParams.scale, "y").min(0.1).max(5.0).step(0.05).onChange(updateView);
scaleFolder.add(guiParams.scale, "z").min(0.1).max(5.0).step(0.05).onChange(updateView);

updateView();

function animate() {
	renderer.render( scene, camera );
}

renderer.setAnimationLoop( animate );

const displayWindow = new DisplayWindow({
	onLoad: ( canvas ) => {
		console.log(canvas);
		const renderer = new THREE.WebGLRenderer({canvas});
		// renderer.autoClear = false;
		// renderer.setPixelRatio( window.devicePixelRatio );
		// renderer.setSize( window.innerWidth, window.innerHeight );

		const orbitControls = new OrbitControls(camera, renderer.domElement);


		function animate() {
			renderer.render( scene, camera );
		}
		
		renderer.setAnimationLoop( animate );

	}
});
console.log(displayWindow)

// displayWindow.open();

window.addEventListener("beforeunload", () => {
	displayWindow.close();
});
