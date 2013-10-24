console.log('this is css 3d page');
/*
 * delete the current page html and create basic html
 * */
/*jshint multistr: true */
$('body').html('\
<div id="ThreeJS" style="position: absolute; left:0px; top:0px">\
</div>\
');
console.log(chrome.extension.getURL("images/checkerboard.jpg"));


// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var time = Date.now();
// custom global variables
var rendererCSS;

// PointerLock
// setupPointerLock();
// setup pointer lock
PointerLockManager = function (camera){
    var scope = this;
    var pitchObject = new THREE.Object3D();
    pitchObject.add(camera);
    var yawObject = new THREE.Object3D();
    yawObject.position.x = 0;
    yawObject.position.y = 0;
    yawObject.position.z = 200;
    yawObject.add(pitchObject);
	var zoomIn = false;
	var zoomOut = false;
	var moveLeft = false;
	var moveRight = false;
    var moveUp = false;
    var moveDown = false;
	var velocity = new THREE.Vector3();
	var PI_2 = Math.PI / 2;
	this.getObject = function () {
		return yawObject;
	};
	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};
	var onKeyDown = function ( event ) {
        console.log(event.keyCode);
		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveUp = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveDown = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 10;
				canJump = false;
				break;
            case 74: // j -- zoom in
                zoomIn = true;
                break;
            case 75:
                zoomOut = true;
                break;

		}

	};
	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveUp = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveDown = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;
            case 74: // j
                zoomIn = false;
                break;
            case 75:// k
                zoomOut = false;
                break;

		}

	};
    document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
    this.update = function(delta){
        delta *= 0.1;
		velocity.x += ( - velocity.x ) * 0.08 * delta;
		velocity.z += ( - velocity.z ) * 0.08 * delta;
		velocity.y += ( - velocity.y ) * 0.08 * delta;

		// velocity.y -= 0.25 * delta;
		if ( moveUp ) velocity.y += 0.12 * delta;
		if ( moveDown ) velocity.y -= 0.12 * delta;

		if ( moveLeft ) velocity.x -= 0.12 * delta;
		if ( moveRight ) velocity.x += 0.12 * delta;
        if (zoomIn) velocity.z -= 0.12 * delta;
        if (zoomOut) velocity.z +=  0.12 * delta;

		yawObject.translateX( velocity.x );
		yawObject.translateY( velocity.y ); 
		yawObject.translateZ( velocity.z );
        // if(yawObject.position.y < 0){
        //     velocity.y = 0;
        //     yawObject.position.y = 0;
        //     }

        };
    };

// begin render
init();
animate();

// FUNCTIONS 
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    // custome
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	// camera.position.set(0,0,500);
	// camera.lookAt(scene.position);	
    // 
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
    // controls = new THREE.OrbitControls(camera, renderer.domElement);
    // pointerlock control
    controls = new PointerLockManager(camera);
    console.log(controls);
    scene.add(controls.getObject());
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
	// FLOOR
	// var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
	// floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	// floorTexture.repeat.set( 10, 10 );
	// var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
    //
    var floorMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe:true
        });
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.position.y = -0.5;
	floor.rotation.x = Math.PI / 2;
	// scene.add(floor);

	////////////
	// CUSTOM //
	////////////
	
	var planeMaterial   = new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.1, side: THREE.DoubleSide });
	var planeWidth = 360;
    var planeHeight = 360;
	var planeGeometry = new THREE.PlaneGeometry( planeWidth, planeHeight );
	var planeMesh= new THREE.Mesh( planeGeometry, planeMaterial );
	// planeMesh.position.y += planeHeight/2;
    planeMesh.position.y = 0;
	// add it to the standard (WebGL) scene
	scene.add(planeMesh);
	
	// create a new scene to hold CSS
	cssScene = new THREE.Scene();
	// create the iframe to contain webpage
	var element	= document.createElement('iframe');
	// webpage to be loaded into iframe
	element.src	= window.location.href;
	// width of iframe in pixels
	var elementWidth = 1024;
	// force iframe to have same relative dimensions as planeGeometry
	var aspectRatio = planeHeight / planeWidth;
	var elementHeight = elementWidth * aspectRatio;
	element.style.width  = elementWidth + "px";
	element.style.height = elementHeight + "px";
	
	// create a CSS3DObject to display element
	var cssObject = new THREE.CSS3DObject( element );
	// synchronize cssObject position/rotation with planeMesh position/rotation 
	cssObject.position = planeMesh.position;
	cssObject.rotation = planeMesh.rotation;
	// resize cssObject to same size as planeMesh (plus a border)
	var percentBorder = 0.05;
	cssObject.scale.x /= (1 + percentBorder) * (elementWidth / planeWidth);
	cssObject.scale.y /= (1 + percentBorder) * (elementWidth / planeWidth);
	cssScene.add(cssObject);
	
	// create a renderer for CSS
	rendererCSS	= new THREE.CSS3DRenderer();
	rendererCSS.setSize( window.innerWidth, window.innerHeight );
	rendererCSS.domElement.style.position = 'absolute';
	rendererCSS.domElement.style.top  = 0;
	rendererCSS.domElement.style.margin  = 0;
	rendererCSS.domElement.style.padding  = 0;
	document.body.appendChild( rendererCSS.domElement );
	// when window resizes, also resize this renderer
	THREEx.WindowResize(rendererCSS, camera);

	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top      = 0;
	// make sure original renderer appears on top of CSS renderer
	renderer.domElement.style.zIndex   = 1;
	rendererCSS.domElement.appendChild( renderer.domElement );
	
}

function animate() 
{
    requestAnimationFrame( animate );
	render();		
	update();
}

function update()
{
	if ( keyboard.pressed("a") ) 
	{ 
	}
	
    controls.update(Date.now() - time);
	stats.update();
    time = Date.now();
}

function render() 
{
	// remember to call both renderers!
	rendererCSS.render( cssScene, camera );
	renderer.render( scene, camera );
}

// function to setup pointerlock contrl
document.addEventListener('keydown',function(e){
    // console.log(e);
    },false);

