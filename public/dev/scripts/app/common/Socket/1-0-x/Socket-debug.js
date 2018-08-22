/**
 * Created by Dillance on 16/3/30.
 */
define(function(require, exports, module) {
	'use strict';

	var Socket = {
		events: {},
		on: function(name, callback) {
			var self = this;

			name = name.split(' ');

			name.forEach(function(n){
				var list = self.events[n] || (self.events[n] = []);
				list.push(callback);
			});

			return this
		},
		off: function(name, callback) {
			// Remove *all* events
			if (!(name || callback)) {
				this.events = {};
				return this;
			}

			var list = this.events[name];
			if (list) {
				if (callback) {
					for (var i = list.length - 1; i >= 0; i--) {
						if (list[i] === callback) {
							list.splice(i, 1)
						}
					}
				}
				else {
					delete this.events[name]
				}
			}

			return this;
		},
		emit: function(name, data) {
			var list = this.events[name];

			if (list) {
				// Copy callback lists to prevent modification
				list = list.slice();

				// Execute event callbacks, use index because it's the faster.
				for(var i = 0, len = list.length; i < len; i++) {
					list[i](data)
				}
			}

			return this
		},
		isSupportWebSocket: !!window.WebSocket,
		init: function(url){
			if(!Socket.isSupportWebSocket) return;
			this._ws = new WebSocket('ws://' + url);
			this.bindSocketEvents();
			this.heartbeat();

		},
		bindSocketEvents: function(){
			var self = this;
			this._ws.onopen = function() {
				console.log('------socket opened------');
				self.emit('open');
			};
			this._ws.onmessage = function(event) {
				var data = JSON.parse(event.data);
				console.log(data);
				self.emit(data.respType,data);
			};
			this._ws.onclose = function() {
				console.log('------socket closed------');
				self.emit('close');
			};
			this._ws.onerror = function() {
				console.log('------socket error------');
				self.emit('error');
			};
		},
		heartbeat: function(){
			var heartbeat = new Date().getTime();
			setInterval(Socket.send({
				"t": heartbeat
			}), 50000);
		},
		send: function(data){
			var self = this;
			if(this._ws.readyState == WebSocket.OPEN){
				console.log(data);
				this._ws.send(JSON.stringify(data));
			}else{
				setTimeout(function(){
					self.send(data);
				},500);
			}
		},
		close: function(){
			this._ws.close();
		}
	};

	return Socket;

});