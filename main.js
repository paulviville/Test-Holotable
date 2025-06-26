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
	new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
	new THREE.LineBasicMaterial({color: 0xff0000})
);
scene.add(box0);

const box1 = new THREE.LineSegments(
	new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
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

console.log(new THREE.BoxGeometry(1, 1, 1));

const planeX = [new THREE.Vector3(0.5, -0.5, 0.5), new THREE.Vector3(0.5, -0.5, -0.5), new THREE.Vector3(0.5, 0.5, 0.5)];
const planeY = [new THREE.Vector3(0.5, 0.5, 0.5), new THREE.Vector3(0.5, 0.5, -0.5), new THREE.Vector3(-0.5, 0.5, 0.5)];
const planeZ = [new THREE.Vector3(-0.5, -0.5, 0.5), new THREE.Vector3(0.5, -0.5, 0.5), new THREE.Vector3(-0.5, 0.5, 0.5)];

const cameraX = new THREE.PerspectiveCamera();
const cameraY = new THREE.PerspectiveCamera();
const cameraZ = new THREE.PerspectiveCamera();

const cameraHelperX = new THREE.CameraHelper(cameraX);
const cameraHelperY = new THREE.CameraHelper(cameraY);
const cameraHelperZ = new THREE.CameraHelper(cameraZ);

scene.add(cameraHelperX);
scene.add(cameraHelperY);
scene.add(cameraHelperZ);

function computeCameraMatrices ( ) {
	const transform = box1.matrix.clone();
	const planeXt = planeX.map(corner => corner.clone().applyMatrix4(transform));
	const planeYt = planeY.map(corner => corner.clone().applyMatrix4(transform));
	const planeZt = planeZ.map(corner => corner.clone().applyMatrix4(transform));
	const ssX = computeScreenSpace(planeXt);
	const ssY = computeScreenSpace(planeYt);
	const ssZ = computeScreenSpace(planeZt);
	console.log(planeXt, ssX)

	const eye = sphere1.position.clone();
	const matricesX = computeMatrix(eye, planeXt, ssX, guiParams.scale.x);
	const matricesY = computeMatrix(eye, planeYt, ssY, guiParams.scale.y);
	const matricesZ = computeMatrix(eye, planeZt, ssZ, guiParams.scale.z);
	console.log(matricesX);

	cameraX.matrixWorld.copy(matricesX.view.clone().invert());
	cameraX.projectionMatrixInverse.copy(matricesX.projection.clone().invert());
	cameraY.matrixWorld.copy(matricesY.view.clone().invert());
	cameraY.projectionMatrixInverse.copy(matricesY.projection.clone().invert());
	cameraZ.matrixWorld.copy(matricesZ.view.clone().invert());
	cameraZ.projectionMatrixInverse.copy(matricesZ.projection.clone().invert());
	cameraHelperX.update();
	cameraHelperY.update();
	cameraHelperZ.update();
}

function computeScreenSpace ( screen ) {
	const ss = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ]
	ss[0].subVectors(screen[1], screen[0]).normalize();
	ss[1].subVectors(screen[2], screen[0]).normalize();
	ss[2].crossVectors(ss[0], ss[1]).normalize();

	return ss;
}

function computeMatrix ( eye, screen, ss, scale = 1 ) {
	const projection = new THREE.Matrix4();
	const view = new THREE.Matrix4();
	const eyes = [
		screen[0].clone().sub(eye),
		screen[1].clone().sub(eye),
		screen[2].clone().sub(eye)
	]

	const dist = -eyes[0].dot(ss[2]);

	// const nearCP = 0.1;
	const nearCP = dist;
	const farCP = nearCP + scale;
	// const farCP = 50.0;
	const ND = nearCP / dist;

	console.log(dist, nearCP, farCP, ND)

	const l = ss[0].dot(eyes[0]) * ND;
	const r = ss[0].dot(eyes[1]) * ND;
	const b = ss[1].dot(eyes[0]) * ND;
	const t = ss[1].dot(eyes[2]) * ND;

	projection.set(
		(2.0 * nearCP) / (r - l), 0.0, (r + l) / (r - l), 0.0,
		0.0, (2.0 * nearCP) / (t - b), (t + b) / (t - b), 0.0, 
		0.0, 0.0, -(farCP + nearCP) / (farCP - nearCP), -(2.0 * farCP * nearCP) / (farCP - nearCP),
		0.0, 0.0, -1.0, 0.0
	);

	const E = new THREE.Matrix4().makeTranslation(-eye.x, -eye.y, -eye.z);

	const ssRotation = new THREE.Matrix4(
		ss[0].x, ss[0].y, ss[0].z, 0.0,
		ss[1].x, ss[1].y, ss[1].z, 0.0,
		ss[2].x, ss[2].y, ss[2].z, 0.0,
		0.0, 0.0, 0.0, 1.0
	);
	view.multiplyMatrices(ssRotation, E);

	console.log(eyes, view, projection, l, r, b, t)

	return {projection, view};
}

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

	console.log(box1.matrix)

	const transform = new THREE.Matrix4();
	transform.compose(translate, rotate, scale1);
	sphere1.position.copy(position).applyMatrix4(transform);



	computeCameraMatrices();
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
translateFolder.add(guiParams.translate, "x").min(-5.0).max(5.0).step(0.01).onChange(updateView);
translateFolder.add(guiParams.translate, "y").min(-5.0).max(5.0).step(0.01).onChange(updateView);
translateFolder.add(guiParams.translate, "z").min(-5.0).max(5.0).step(0.01).onChange(updateView);
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
