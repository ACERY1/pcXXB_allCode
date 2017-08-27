/**
 * Created by Acery on 2017/8/25.
 */
function EventEmitter() {
	this.events = {}; // 多次事件
	this.onceEvents = {}; // 一次事件
}

EventEmitter.prototype.on = function(eventName, callback) {
	this.events[eventName] = this.events[eventName] || [];// **
	this.events[eventName].push(callback);
} // 绑定事件


EventEmitter.prototype.once = function(eventName, callback) {
	this.on(eventName, callback);
	this.onceEvents[eventName] = true;
} // 绑定一次事件

EventEmitter.prototype.emit = function(eventName, _) {
	var events = this.events[eventName],
		args = Array.prototype.slice.call(arguments, 1),
		i, m;
	
	if (!events) {
		return;
	}
	for (i = 0, m = events.length; i < m; i++) {
		events[i].apply(null, args);
	}
	if(this.onceEvents[eventName]){
		delete this.events[eventName];
		delete this.onceEvents[eventName];
	}
} // 发射事件