define(["three@78-0-x"],function(t,e,i){"use strict";var s=t("three@78-0-x"),h=function(t,e){function i(t){t.preventDefault()}function h(t,e){return function(){e.apply(t,arguments)}}this.object=t,this.target=new s.Vector3(0,0,0),this.domElement=void 0!==e?e:document,this.enabled=!0,this.movementSpeed=1,this.lookSpeed=.005,this.lookVertical=!0,this.autoForward=!1,this.activeLook=!0,this.heightSpeed=!1,this.heightCoef=1,this.heightMin=0,this.heightMax=1,this.constrainVertical=!1,this.verticalMin=0,this.verticalMax=Math.PI,this.autoSpeedFactor=0,this.mouseX=0,this.mouseY=0,this.lat=0,this.lon=0,this.phi=0,this.theta=0,this.moveForward=!1,this.moveBackward=!1,this.moveLeft=!1,this.moveRight=!1,this.mouseDragOn=!1,this.viewHalfX=0,this.viewHalfY=0,this.domElement!==document&&this.domElement.setAttribute("tabindex",-1),this.handleResize=function(){this.domElement===document?(this.viewHalfX=window.innerWidth/2,this.viewHalfY=window.innerHeight/2):(this.viewHalfX=this.domElement.offsetWidth/2,this.viewHalfY=this.domElement.offsetHeight/2)},this.onMouseDown=function(t){if(this.domElement!==document&&this.domElement.focus(),t.preventDefault(),t.stopPropagation(),this.activeLook)switch(t.button){case 0:this.moveForward=!0;break;case 2:this.moveBackward=!0}this.mouseDragOn=!0},this.onMouseUp=function(t){if(t.preventDefault(),t.stopPropagation(),this.activeLook)switch(t.button){case 0:this.moveForward=!1;break;case 2:this.moveBackward=!1}this.mouseDragOn=!1},this.onMouseMove=function(t){this.domElement===document?(this.mouseX=t.pageX-this.viewHalfX,this.mouseY=t.pageY-this.viewHalfY):(this.mouseX=t.pageX-this.domElement.offsetLeft-this.viewHalfX,this.mouseY=t.pageY-this.domElement.offsetTop-this.viewHalfY)},this.onKeyDown=function(t){switch(t.keyCode){case 38:case 87:this.moveForward=!0;break;case 37:case 65:this.moveLeft=!0;break;case 40:case 83:this.moveBackward=!0;break;case 39:case 68:this.moveRight=!0;break;case 82:this.moveUp=!0;break;case 70:this.moveDown=!0}},this.onKeyUp=function(t){switch(t.keyCode){case 38:case 87:this.moveForward=!1;break;case 37:case 65:this.moveLeft=!1;break;case 40:case 83:this.moveBackward=!1;break;case 39:case 68:this.moveRight=!1;break;case 82:this.moveUp=!1;break;case 70:this.moveDown=!1}},this.update=function(t){if(this.enabled!==!1){if(this.heightSpeed){var e=s.Math.clamp(this.object.position.y,this.heightMin,this.heightMax),i=e-this.heightMin;this.autoSpeedFactor=t*(i*this.heightCoef)}else this.autoSpeedFactor=0;var h=t*this.movementSpeed;(this.moveForward||this.autoForward&&!this.moveBackward)&&this.object.translateZ(-(h+this.autoSpeedFactor)),this.moveBackward&&this.object.translateZ(h),this.moveLeft&&this.object.translateX(-h),this.moveRight&&this.object.translateX(h),this.moveUp&&this.object.translateY(h),this.moveDown&&this.object.translateY(-h);var o=t*this.lookSpeed;this.activeLook||(o=0);var a=1;this.constrainVertical&&(a=Math.PI/(this.verticalMax-this.verticalMin)),this.lon+=this.mouseX*o,this.lookVertical&&(this.lat-=this.mouseY*o*a),this.lat=Math.max(-85,Math.min(85,this.lat)),this.phi=s.Math.degToRad(90-this.lat),this.theta=s.Math.degToRad(this.lon),this.constrainVertical&&(this.phi=s.Math.mapLinear(this.phi,0,Math.PI,this.verticalMin,this.verticalMax));var n=this.target,m=this.object.position;n.x=m.x+100*Math.sin(this.phi)*Math.cos(this.theta),n.y=m.y+100*Math.cos(this.phi),n.z=m.z+100*Math.sin(this.phi)*Math.sin(this.theta),this.object.lookAt(n)}},this.dispose=function(){this.domElement.removeEventListener("contextmenu",i,!1),this.domElement.removeEventListener("mousedown",a,!1),this.domElement.removeEventListener("mousemove",o,!1),this.domElement.removeEventListener("mouseup",n,!1),window.removeEventListener("keydown",m,!1),window.removeEventListener("keyup",r,!1)};var o=h(this,this.onMouseMove),a=h(this,this.onMouseDown),n=h(this,this.onMouseUp),m=h(this,this.onKeyDown),r=h(this,this.onKeyUp);this.domElement.addEventListener("contextmenu",i,!1),this.domElement.addEventListener("mousemove",o,!1),this.domElement.addEventListener("mousedown",a,!1),this.domElement.addEventListener("mouseup",n,!1),window.addEventListener("keydown",m,!1),window.addEventListener("keyup",r,!1),this.handleResize()};return h});