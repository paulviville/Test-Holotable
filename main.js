import * as THREE from "./three/three.module.js";
import { OrbitControls } from "./three/controls/OrbitControls.js";
import DisplayWindow from "./DisplayWindow.js";

import { GUI } from './three/libs/lil-gui.module.min.js'; 

// const displayWindow = window.open('./display.html', "", "width=800, height=800");

// displayWindow.resizeTo(200, 200)



const canvas = document.createElement('canvas');
document.body.appendChild(canvas)
const scene = new THREE.Scene();

let fpv = false;

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 50 );
camera.position.set( 2, 2, 6 );
const cameraFPV = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 5 );
const dummyFPV = new THREE.PerspectiveCamera( 50, 1.6, 0.01, 0.35 );
const camera0 = new THREE.PerspectiveCamera( 50, 1, 0.01, 50 );
const camera1 = new THREE.PerspectiveCamera( 50, 1, 0.01, 50 );


const hologramBox = new THREE.LineSegments(
	new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
	new THREE.LineBasicMaterial({color: 0xff0000})
);

const viewBox = new THREE.LineSegments(
	new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
	new THREE.LineBasicMaterial({color: 0x0000ff})
);

const simulationBox = new THREE.LineSegments(
	new THREE.EdgesGeometry(new THREE.BoxGeometry(10, 10, 10)),
	new THREE.LineBasicMaterial({color: 0x000000})
);



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

// const torus = new 

console.log(new THREE.BoxGeometry(1, 1, 1));

const planeX = [new THREE.Vector3(0.5, -0.5, 0.5), new THREE.Vector3(0.5, -0.5, -0.5), new THREE.Vector3(0.5, 0.5, 0.5)];
const planeY = [new THREE.Vector3(0.5, 0.5, 0.5), new THREE.Vector3(0.5, 0.5, -0.5), new THREE.Vector3(-0.5, 0.5, 0.5)];
const planeZ = [new THREE.Vector3(-0.5, -0.5, 0.5), new THREE.Vector3(0.5, -0.5, 0.5), new THREE.Vector3(-0.5, 0.5, 0.5)];

const cameraX = new THREE.PerspectiveCamera();
const cameraY = new THREE.PerspectiveCamera();
const cameraZ = new THREE.PerspectiveCamera();
cameraX.matrixAutoUpdate = false;
cameraY.matrixAutoUpdate = false;
cameraZ.matrixAutoUpdate = false;

const cameraHelperX = new THREE.CameraHelper(cameraX);
const cameraHelperY = new THREE.CameraHelper(cameraY);
const cameraHelperZ = new THREE.CameraHelper(cameraZ);
cameraHelperX.visible = false;
cameraHelperY.visible = false;
cameraHelperZ.visible = false;

const cameraHelperFPV = new THREE.CameraHelper(dummyFPV);

const hologramScene = new THREE.Scene();
hologramScene.background = new THREE.Color(0xfff0f0);
hologramScene.add(hologramBox);
hologramScene.add(cameraHelperFPV);
hologramScene.add(sphere0);

const simulationScene = new THREE.Scene();
simulationScene.background = new THREE.Color(0xf0f0ff);
simulationScene.add(viewBox);
simulationScene.add(simulationBox);
simulationScene.add(sphere1);
simulationScene.add(cameraHelperX);
simulationScene.add(cameraHelperY);
simulationScene.add(cameraHelperZ);
let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
simulationScene.add(ambientLight);
let pointLight0 = new THREE.PointLight(0xffffff, 100);
pointLight0.position.set(5,4,5);
simulationScene.add(pointLight0);

const torus0 = new THREE.Mesh(new THREE.TorusKnotGeometry( 0.4, 0.08, 95, 20 ), new THREE.MeshLambertMaterial({color: 0x33AA33, side: THREE.DoubleSide}));
const torus1 = new THREE.Mesh(new THREE.TorusKnotGeometry( 4, 0.5, 95, 20 ), new THREE.MeshLambertMaterial({color: 0x33AAAA, side: THREE.DoubleSide}));
simulationScene.add(torus0);
simulationScene.add(torus1);

const gridHelper = new THREE.GridHelper(10, 10);
gridHelper.position.set(0, -5, 0);
// gridHelper.lookAt(new THREE.Vector3(0, 1, 0));
simulationScene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(10);
simulationScene.add(axesHelper);



const renderTargetX = new THREE.WebGLRenderTarget(512, 512, {
	minFilter: THREE.LinearFilter,
	magFilter: THREE.LinearFilter,
	format: THREE.RGBAFormat
});

const renderTargetY = new THREE.WebGLRenderTarget(512, 512, {
	minFilter: THREE.LinearFilter,
	magFilter: THREE.LinearFilter,
	format: THREE.RGBAFormat
});

const renderTargetZ = new THREE.WebGLRenderTarget(512, 512, {
	minFilter: THREE.LinearFilter,
	magFilter: THREE.LinearFilter,
	format: THREE.RGBAFormat
});


const planeXMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(1, 1),
	new THREE.MeshBasicMaterial({
		map: renderTargetX.texture,
		side: THREE.DoubleSide,
	}),
);

const planeYMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(1, 1),
	new THREE.MeshBasicMaterial({
		map: renderTargetY.texture,
		side: THREE.DoubleSide,
	}),
);

const planeZMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(1, 1),
	new THREE.MeshBasicMaterial({
		map: renderTargetZ.texture,
		side: THREE.DoubleSide,
	}),
);

planeXMesh.lookAt(1, 0 ,0)
planeYMesh.lookAt(0, 1 ,0)
planeZMesh.lookAt(0, 0 ,1)
planeXMesh.position.set(0.5, 0, 0)
planeYMesh.position.set(0, 0.5, 0)
planeYMesh.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2))
planeZMesh.position.set(0, 0, 0.5)

hologramScene.add(planeXMesh)
hologramScene.add(planeYMesh)
hologramScene.add(planeZMesh)








function computeCameraMatrices ( ) {

	const position = guiParams.head.clone();
	sphere0.position.copy(position);


	const transform = new THREE.Matrix4();
	transform.compose(viewBox.position, viewBox.quaternion, viewBox.scale);
	// transform.compose(translate, rotate, scale1);

	// const transform = viewBox.matrix.clone();
	const planeXt = planeX.map(corner => corner.clone().applyMatrix4(transform));
	const planeYt = planeY.map(corner => corner.clone().applyMatrix4(transform));
	const planeZt = planeZ.map(corner => corner.clone().applyMatrix4(transform));
	const ssX = computeScreenSpace(planeXt);
	const ssY = computeScreenSpace(planeYt);
	const ssZ = computeScreenSpace(planeZt);

	const eye = sphere1.position.clone();
	const matricesX = computeMatrix(eye, planeXt, ssX, guiParams.scale.x);
	const matricesY = computeMatrix(eye, planeYt, ssY, guiParams.scale.y);
	const matricesZ = computeMatrix(eye, planeZt, ssZ, guiParams.scale.z);

	cameraX.matrixWorld.copy(matricesX.view.clone().invert());
	cameraY.matrixWorld.copy(matricesY.view.clone().invert());
	cameraZ.matrixWorld.copy(matricesZ.view.clone().invert());
	cameraX.matrixWorldInverse.copy(matricesX.view.clone());
	cameraY.matrixWorldInverse.copy(matricesY.view.clone());
	cameraZ.matrixWorldInverse.copy(matricesZ.view.clone());
	cameraX.projectionMatrix.copy(matricesX.projection.clone());
	cameraY.projectionMatrix.copy(matricesY.projection.clone());
	cameraZ.projectionMatrix.copy(matricesZ.projection.clone());
	cameraX.projectionMatrixInverse.copy(matricesX.projection.clone().invert());
	cameraY.projectionMatrixInverse.copy(matricesY.projection.clone().invert());
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

	// console.log(dist, nearCP, farCP, ND)

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

	// console.log(eyes, view, projection, l, r, b, t)

	return {projection, view};
}

const gui = new GUI();
const guiParams = {
	fpv: false,
	head: new THREE.Vector3(1, 1, 1),
	translate: new THREE.Vector3(),
	scale: new THREE.Vector3(1, 1, 1),
	axis: new THREE.Vector3(1, 0, 0),
	angle: 0,
	helpers: () => {
		cameraHelperX.visible = !cameraHelperX.visible;
		cameraHelperY.visible = !cameraHelperY.visible;
		cameraHelperZ.visible = !cameraHelperZ.visible;
	}
}

function updateView ( ) {
	const translate = guiParams.translate.clone();
	const scale = guiParams.scale.clone();
	const scaleFactor = Math.max(scale.x, Math.max(scale.y, scale.z));

	const scale0 = scale.clone().multiplyScalar(1 / scaleFactor);
	const scale1 = new THREE.Vector3(1, 1, 1).multiplyScalar(scaleFactor);

	const rotate = new THREE.Quaternion().setFromAxisAngle(guiParams.axis, guiParams.angle);

	hologramBox.scale.copy(scale0);
	planeXMesh.scale.set(scale0.z, scale0.y, scale0.x);
	if(scale0.x <= 1)
		planeXMesh.position.set(scale0.x * 0.5, 0, 0);

	planeYMesh.scale.set(scale0.z, scale0.x, scale0.y);
	if(scale0.y <= 1)
		planeYMesh.position.set(0, scale0.y * 0.5, 0);

	planeZMesh.scale.set(scale0.x, scale0.y, scale0.z);
	if(scale0.z <= 1)
		planeZMesh.position.set(0, 0, scale0.z * 0.5);

	viewBox.position.copy(translate)
	viewBox.scale.copy(scale)
	viewBox.quaternion.copy(rotate);

	const position = guiParams.head.clone();
	sphere0.position.copy(position);
	cameraFPV.position.copy(sphere0.position);
	cameraFPV.lookAt(0, 0, 0);
	dummyFPV.position.copy(sphere0.position);
	dummyFPV.lookAt(0, 0, 0);
	// console.log(viewBox.matrix)

	const transform = new THREE.Matrix4();
	transform.compose(translate, rotate, scale1);
	sphere1.position.copy(position).applyMatrix4(transform);

	const target = new THREE.Vector3().applyMatrix4(transform);
	camera1.position.copy(sphere1.position);
	camera1.lookAt(target);
	// camera1.lookAt()



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
headFolder.add(guiParams, "fpv");

const translateFolder = gui.addFolder("translate");
translateFolder.add(guiParams.translate, "x").min(-5.0).max(5.0).step(0.0025).onChange(updateView);
translateFolder.add(guiParams.translate, "y").min(-5.0).max(5.0).step(0.0025).onChange(updateView);
translateFolder.add(guiParams.translate, "z").min(-5.0).max(5.0).step(0.0025).onChange(updateView);
const rotateFolder = gui.addFolder("rotate");
rotateFolder.add(guiParams.axis, "x").min(-1.0).max(1.0).step(0.0025).onChange(() => { updateAxes("x", "y", "z") }).listen();
rotateFolder.add(guiParams.axis, "y").min(-1.0).max(1.0).step(0.0025).onChange(() => { updateAxes("y", "z", "x") }).listen();
rotateFolder.add(guiParams.axis, "z").min(-1.0).max(1.0).step(0.0025).onChange(() => { updateAxes("z", "x", "y") }).listen();
rotateFolder.add(guiParams, "angle").min(-Math.PI).max(Math.PI).step(0.05).onChange(updateView);
const scaleFolder = gui.addFolder("scale");
scaleFolder.add(guiParams.scale, "x").min(0.1).max(5.0).step(0.05).onChange(updateView);
scaleFolder.add(guiParams.scale, "y").min(0.1).max(5.0).step(0.05).onChange(updateView);
scaleFolder.add(guiParams.scale, "z").min(0.1).max(5.0).step(0.05).onChange(updateView);
const helpersFolder = gui.addFolder("helpers");
helpersFolder.add(guiParams, "helpers").name("show helpers");
updateView();

function animate() {
	if(guiParams.fpv) {
		cameraHelperFPV.visible = false;
		renderer.render( hologramScene, cameraFPV );

	}
	else 
	{
		cameraHelperFPV.visible = true;
		renderer.render( hologramScene, camera );

	}
	
	renderer.setRenderTarget(renderTargetX);
	renderer.render( simulationScene, cameraX );
	renderer.setRenderTarget(renderTargetY);
	renderer.render( simulationScene, cameraY );
	renderer.setRenderTarget(renderTargetZ);
	renderer.render( simulationScene, cameraZ );
	
	renderer.setRenderTarget(null);
}

renderer.setAnimationLoop( animate );


let renderer0;

const displayWindow = new DisplayWindow(
	"simulation view",	
	{
		onLoad: ( window, canvas ) => {
			renderer0 = new THREE.WebGLRenderer({canvas});
			camera0.position.set( 5, 5, 10 );

			const orbitControls = new OrbitControls(camera0, renderer0.domElement);


			function animate() {
				renderer0.render( simulationScene, camera0 );
			}
			// const gui = new GUI();
			

			renderer0.setAnimationLoop( animate );

		},
		onResize: ( width, height ) => {
			camera0.aspect = width / height;
			camera0.updateProjectionMatrix();

			renderer0.setSize(width, height);
		}
	}
);
console.log(displayWindow)

displayWindow.open();


// camera1.position.set( 5, 5, 10 );

let renderer1;

const firstPersonSimulationWindow = new DisplayWindow(
	"first person simulation",
	{
		onLoad: ( window, canvas ) => {
			renderer1 = new THREE.WebGLRenderer({canvas});

			// const orbitControls = new OrbitControls(camera1, renderer1.domElement);


			function animate() {
				renderer1.render( simulationScene, camera1 );
			}
			// const gui = new GUI();
			

			renderer1.setAnimationLoop( animate );

		},

		onResize: ( width, height ) => {
			camera1.aspect = width / height;
			camera1.updateProjectionMatrix();

			renderer1.setSize(width, height);
		}
	}
);

firstPersonSimulationWindow.open();

// let renderer2;

// const firstPersonHologramWindow = new DisplayWindow(
// 	"first person hologram",
// 	{
// 		onLoad: ( window, canvas ) => {
// 			renderer2 = new THREE.WebGLRenderer({canvas});

// 			// const orbitControls = new OrbitControls(camera1, renderer1.domElement);


// 			function animate() {
// 				renderer2.render( hologramScene, camera1 );
// 			}
// 			// const gui = new GUI();
			

// 			renderer2.setAnimationLoop( animate );

// 		},

// 		onResize: ( width, height ) => {
// 			camera2.aspect = width / height;
// 			camera2.updateProjectionMatrix();

// 			renderer2.setSize(width, height);
// 		}
// 	}
// );

// firstPersonHologramWindow.open();

// let rendererX;
// const cameraXWindow = new DisplayWindow(
// 	"view X",
// 	{
// 		onLoad: ( window, canvas ) => {
// 			rendererX = new THREE.WebGLRenderer({canvas});

// 			// const orbitControls = new OrbitControls(camera1, renderer1.domElement);


// 			function animate() {
// 				rendererX.render( simulationScene, cameraX );
// 			}
// 			// const gui = new GUI();
			

// 			rendererX.setAnimationLoop( animate );

// 		},

// 		onResize: ( width, height ) => {
// 			// camera1.aspect = width / height;
// 			// camera1.updateProjectionMatrix();

// 			rendererX.setSize(width, height);
// 		}
// 	}
// );

// // cameraXWindow.open();

// let rendererY;
// const cameraYWindow = new DisplayWindow(
// 	"view Y",
// 	{
// 		onLoad: ( window, canvas ) => {
// 			rendererY = new THREE.WebGLRenderer({canvas});

// 			// const orbitControls = new OrbitControls(camera1, renderer1.domElement);


// 			function animate() {
// 				rendererY.render( simulationScene, cameraY );
// 			}
// 			// const gui = new GUI();
			

// 			rendererY.setAnimationLoop( animate );

// 		},

// 		onResize: ( width, height ) => {
// 			// camera1.aspect = width / height;
// 			// camera1.updateProjectionMatrix();

// 			rendererY.setSize(width, height);
// 		}
// 	}
// );

// // cameraYWindow.open();


// let rendererZ;
// const cameraZWindow = new DisplayWindow(
// 	"view Z",
// 	{
// 		onLoad: ( window, canvas ) => {
// 			rendererZ = new THREE.WebGLRenderer({canvas});

// 			// const orbitControls = new OrbitControls(camera1, renderer1.domElement);


// 			function animate() {
// 				rendererZ.render( simulationScene, cameraZ );
// 			}
// 			// const gui = new GUI();
			

// 			rendererZ.setAnimationLoop( animate );

// 		},

// 		onResize: ( width, height ) => {
// 			// camera1.aspect = width / height;
// 			// camera1.updateProjectionMatrix();

// 			rendererZ.setSize(width, height);
// 		}
// 	}
// );

// cameraZWindow.open();

updateView();

window.addEventListener("beforeunload", () => {
	displayWindow.close();
	firstPersonSimulationWindow.close();
	cameraXWindow.close();
	cameraYWindow.close();
	cameraZWindow.close();
});
