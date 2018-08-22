/**
 * Created by Dillance on 16/8/26.
 */
define(function(require, exports, module) {
	'use strict';

	var THREE = require('three@78-0-x');

	var Demo = {
		init: function(){

			var canvas = document.querySelector('#main-canvas');

			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			canvas.style.background = '#000';

			var scene = new THREE.Scene();

			var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);

			var renderer = new THREE.WebGLRenderer({
				canvas: canvas,
				antialias : true
			});

			renderer.setSize(window.innerWidth, window.innerHeight);

			var geometry = new THREE.CubeGeometry(1,1,1);
			var material = new THREE.MeshLambertMaterial({color: 0x00ff00});
			var cube = new THREE.Mesh(geometry, material);

			scene.add(cube);
			camera.position.z = 5;

			var light = new THREE.PointLight(0xffffff);
			light.position.set(100, 100, 200);
			var light2 = new THREE.PointLight(0xffffff,0.3);
			light2.position.set(-100, -100, 200);
			scene.add(light);
			scene.add(light2);

			function render() {
				requestAnimationFrame(render);
				cube.rotation.x += 0.01;
				cube.rotation.y += 0.01;
				renderer.render(scene, camera);
			}
			render();
		}
	};

	return Demo;

});