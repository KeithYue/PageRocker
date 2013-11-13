console.log('this is css 3d page');
/*
 * delete the current page html and create basic html
 * */
/*jshint multistr: true */


console.log(chrome.extension.getURL("images/checkerboard.jpg"));
console.log(window.rock_state);


// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var time = Date.now();
// custom global variables
var rendererCSS;
var cameraDistance = 1000;
var extraUrls = [
    window.location.href
]; // urls needed to be displayed

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
    yawObject.position.z = cameraDistance;
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


// FUNCTIONS 
function init() 
{
	// SCENE
	scene = new THREE.Scene();
    // Fog
    setSceneFog(scene);
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
	if ( Detector.webgl ){
		renderer = new THREE.WebGLRenderer( {antialias:true} );
        renderer.setClearColor( scene.fog.color );
    }
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
    // controls = new PointerLockManager(camera);
    // console.log(controls);
    // scene.add(controls.getObject());
    // set the right controller for user
    console.log(window.rock_state.rotater.controller_id);
    switch(window.rock_state.rotater.controller_id){
        case '1':{
            controls = new PointerLockManager(camera);
            console.log(controls);
            scene.add(controls.getObject());
            }
            break;
        case '2':{
            // set camera position
            console.log('I am orbit!!!');
            camera.position.set(0,0,cameraDistance);
            camera.lookAt(scene.position);
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            }
            break;
        default:{
            break;
            }
        }
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	// var light = new THREE.PointLight(0xffffff);
	// light.position.set(0,250,0);
	// scene.add(light);
    addLights(scene);
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
	cssScene = new THREE.Scene();
	
    // add extra webpages
    var i = 0;
    var n = extraUrls.length;
    var radius = 540;
    for (i ; i < n; i++){
        var angle = Math.PI * 2 * (i) / n;
        var pagePosition =  new THREE.Vector3( radius * Math.sin(angle), 0, radius * Math.cos(angle));
        var pageRotation = new THREE.Vector3(0, angle , 0);
        addWebPage(extraUrls[i], scene, cssScene, pagePosition, pageRotation);
        }
	
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

// add a object which can display one webpage to scene
function addWebPage(url, scene, css_scene, position, rotation){
	var planeMaterial   = new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.1, side: THREE.DoubleSide });
	var planeWidth = 360;
    var planeHeight = 360;
	var planeGeometry = new THREE.PlaneGeometry( planeWidth, planeHeight );
	var planeMesh= new THREE.Mesh( planeGeometry, planeMaterial );
	// planeMesh.position.y += planeHeight/2;
    planeMesh.position = position;
    // rotate the page
    
    planeMesh.rotation = rotation;
    
	// add it to the standard (WebGL) scene
	scene.add(planeMesh);

	// create the iframe to contain webpage
	var element	= document.createElement('iframe');
	// webpage to be loaded into iframe
	element.src	= url;
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
	css_scene.add(cssObject);

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

// rm body class
function  removeBodyClass(){
    $('body').removeClass();
    $('body').css({
        background: 'transparent'
        });
    $('body').html('\
    <div id="ThreeJS" style="position: absolute; left:0px; top:0px">\
    </div>\
    ');
    }

function addGrassGround(scene){
    var initColor = new THREE.Color( 0x497f13 );
    var initTexture = THREE.ImageUtils.generateDataTexture( 1, 1, initColor );

    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: initTexture } );

    var groundUrl = chrome.extension.getURL("textures/grasslight-big.jpg");
    console.log(groundUrl);
    var groundTexture = THREE.ImageUtils.loadTexture( groundUrl, undefined, function() { groundMaterial.map = groundTexture;});
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;

    var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 20000, 20000 ), groundMaterial );
    mesh.position.y = -250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
    }

// add lights
function addLights(scene){
    var light, materials;

    scene.add( new THREE.AmbientLight( 0x666666 ) );

    light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );

    light.castShadow = true;
    //light.shadowCameraVisible = true;

    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;

    var d = 300;

    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraFar = 1000;
    light.shadowDarkness = 0.5;

    scene.add( light );

    light = new THREE.DirectionalLight( 0x3dff0c, 0.35 );
    light.position.set( 0, -1, 0 );

    scene.add( light );
    }

function setSceneFog(scene){
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );
    }

// begin render
// <img src="'+chrome.extension.getURL("images/sky_grass.png") + '" alt="" style="width:90px; height:120px;"/>\
function setUpConfigDialog(){
    var modal_html = '\
    <div id="css3d-dialog" title="Configuration for 3D Controller">\
    <h5>Config How You Want to Control Your Webpage</h5>\
    <form action="">\
        <fieldset id="controllerRadios">\
            <legend>Way of Controlling</legend>\
            <input type="radio" name="controller" id="PointLocker" value="1" />\
            <label for="PointLocker">Pointer Lock Control</label><br/>\
            <input type="radio" name="controller" id="OrbitControl" value="2" checked/>\
            <label for="OrbitControl">Orbit Control</label>\
        </fieldset>\
        <fieldset id="sceneSelector">\
            <legend>Choose a Scene</legend>\
            <div style="display: inline-block; width:120px; height:200px; border:1px; margin:5px;">\
                <img src="'+chrome.extension.getURL("images/sky_grass.png") + '" alt="" style="width:100px; height:120px;"/>\
                <input type="radio" name="scene" id="grassRadio" value="1" checked/>\
                <label for="grassRadio">Sky Grass</label><br/>\
            </div>\
            <div style="display: inline-block; width:120px; height:200px; border:1px; margin:5px;">\
                <img src="'+chrome.extension.getURL("images/sky.jpg") + '" alt="" style="width:100px; height:120px;"/>\
                <input type="radio" name="scene" id="grassRadio" value="2"/>\
                <label for="grassRadio">Stars</label><br/>\
            </div>\
            <div style="display: inline-block; width:120px; height:200px; border:1px; margin:5px;">\
                <img src="'+chrome.extension.getURL("images/sea.jpg") + '" alt="" style="width:100px; height:120px;"/>\
                <input type="radio" name="scene" id="grassRadio" value="3"/>\
                <label for="grassRadio">Sea</label><br/>\
            </div>\
        </fieldset>\
        <fieldset id="extra-urls">\
            <legend>Other Pages Shown at the Same Time</legend>\
            <p>\
                <label for="pageNumberInput">Number of Pages</label>\
                <input type="" name="pageNumber" id="pageNumberInput"/>\
            </p>\
        </fieldset>\
    </form>\
    </div>\
    ';

    // add to body
    $('body').append($(modal_html));
    // spinner the number of pages
    $('#pageNumberInput').spinner({
        spin:function(event, ui){
            // console.log(ui.value);
            var number = ui.value;
            var urlInput = '\
                <div class="urlInputBox">\
                    <label for="urlInput">Webpage URL: </label>\
                    <input type="text" name="webUrl"/>\
                    <br/>\
                </div>\
            ';
            // remove current inputs
            $('#extra-urls .urlInputBox').remove();
            var i = 0;
            for (i;i<number;i++){
                // append the extra urls input
                $('#extra-urls').append(urlInput);
                }
            }
        });

    // add radio event listener
    $('#controllerRadios input[name=controller]').click(function(e){
        console.log($(this)[0].value);
        rock_state.rotater.controller_id = $(this)[0].value;
        });

    // add scene listener
    $('#sceneSelector input[name=scene]').click(function(e){
        var scene_id = $(this)[0].value;
        console.log(scene_id);
        });

    $('#css3d-dialog').dialog({
        modal: true,
        width: 500,
        beforeClose:function(event, ui){
            },
        close: function(event, ui){
            // do nothing
            },
        buttons:[{
            text:'Rotate Your Page',
            click: function(){
                // collect input webpages
                $('.urlInputBox input[type=text]').each(function(){
                    // console.log($(this)[0].value);
                    extraUrls.push($(this)[0].value);
                    console.log(extraUrls);
                    });

                removeBodyClass();
                init();

                // add grassground land
                addGrassGround(scene);
                
                animate();
                $(this).dialog('close');
                }},
            {
                text: 'Cancel',
                click: function(){
                $(this).dialog('close');
                }
            }]
        });
    $('#css3d-dialog').dialog('open');
    }

setUpConfigDialog();
// init();
// animate();
