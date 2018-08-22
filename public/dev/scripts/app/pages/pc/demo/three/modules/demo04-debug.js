/**
 * Created by Dillance on 16/8/20.
 */
define(function(require, exports, module) {
	'use strict';

	var THREE = require('three@78-0-x');

	var canvas = document.querySelector('#main-canvas');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.background = '#000';

	var renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias : true
	});
	//renderer.setPixelRatio(window.devicePixelRatio);
	renderer.shadowMap.enabled = true; //辅助线
	renderer.shadowMapSoft = true; //柔和阴影
	renderer.setClearColor(0x000000, 0);

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1 ,2000);
	camera.position.set(0,20,60);
	camera.lookAt(new THREE.Vector3(0,0,0));

	scene.add(camera);

	//环境光
	var ambient = new THREE.AmbientLight(0x999999);
	scene.add(ambient);

	/*太阳光*/
	var sunLight = new THREE.PointLight(0xddddaa,1.5,500);
	scene.add(sunLight);

	/*太阳皮肤*/
	var sunSkinPic = THREE.ImageUtils.loadTexture('/dev/images/pages/pc/demo/three/texture/sun.jpg');

	var initPlanet = function(name,revolutionSpeed,color,distance,volume,map) {
		var material;

		if(name == 'Sun'){
			material = new THREE.MeshLambertMaterial({
				emissive: 0xdd4422,
				map: map || ''
			});
		}else{
			material = new THREE.MeshLambertMaterial({
				color: color,
				map: map || ''
			});
		}

		var mesh = new THREE.Mesh( new THREE.SphereGeometry( volume, 50,50 ), material);
		mesh.position.x = -distance;
		mesh.receiveShadow = true;
		mesh.castShadow = true;

		mesh.name = name;

		var star = {
			name: name,
			angle: 0,
			revolutionSpeed: revolutionSpeed,
			distance: distance,
			volume: volume,
			Mesh : mesh
		};

		scene.add(mesh);

		var track = new THREE.Mesh( new THREE.RingGeometry(distance - 0.2, distance + 0.2, 100, 1),
			new THREE.MeshBasicMaterial( { color: 0xffffff,transparent: true, opacity: 0.1, side: THREE.DoubleSide } )
		);
		track.rotation.x = - Math.PI / 2;

		scene.add(track);

		return star;
	};

	var stars = {
		Sun: initPlanet('Sun',0,'rgb(237,20,0)',0,12,sunSkinPic)
	};


	window.addEventListener( 'resize', function(){
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}, false );


	(function render(timestamp) {
		requestAnimationFrame(render);
		/*太阳自转*/
		stars.Sun.Mesh.rotation.y = (stars.Sun.Mesh.rotation.y == 2*Math.PI ? 0.0008*Math.PI : stars.Sun.Mesh.rotation.y+0.0008*Math.PI);
		renderer.render(scene, camera);
	}());


});