/**
 * Created by Dillance on 16/8/12.
 */
define(function(require, exports, module) {
	'use strict';

	var THREE = require('three@78-0-x'),
		ColladaLoader = require('three/78-0-x/modules/ColladaLoader');

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer({
		antialias : true
	});

	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);
	var geometry = new THREE.CubeGeometry(1,1,1);
	var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
	var cube = new THREE.Mesh(geometry, material);
	var light = new THREE.PointLight(0xffffff);
	light.position.set(100, 100, 200);
	var light2 = new THREE.PointLight(0xffffff,0.3);
	light2.position.set(-100, -100, 200);

	scene.add(cube);
	scene.add(light);
	scene.add(light2);
	camera.position.z = 5;

	var loader = new ColladaLoader(),
		dae;
	loader.options.convertUpAxis = true;
	loader.load( '/dev/images/pages/pc/demo/three/monster/monster.dae', function ( collada ) {

		dae = collada.scene;

		//dae.traverse( function ( child ) {
		//
		//	if ( child instanceof THREE.SkinnedMesh ) {
		//
		//		var animation = new THREE.Animation( child, child.geometry.animation );
		//		animation.play();
		//
		//	}
		//
		//} );

		dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
		dae.updateMatrix();

		//scene.add(dae);
	} );



	function render() {
		requestAnimationFrame(render);
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		renderer.render(scene, camera);
	}
	render();

});