/** * @author  *//** * ��ʾһ��������ʱ�Ĳ����� */var Deferred = Class({

	state: 'inited',

	queue: 0,
	/**	 * ʵ��ִ�еĺ�����	 */	run: Function.empty,

	then: function (fn, bind) {
		return this.once('done', fn, bind);
	},	start: function () {
		this.state = 'running';		this.run();		return this;
	},	pause: function () {
		this.state = 'pause';
	},	stop: function () {
		this.pause();
		this.state = 'stopped';		this.trigger('done');
	},	defer: function(timeout){		var me = this;		return setTimeout(function () {
			me.start();
		}, timeout || 0);	},	concat: function(deferred){		if (!this.queue) {
			this.queue = [];		}		this.queue.push(deferred);	},	/**	 * ������һ�������� Deferred ����	 */	progress: function () {		if (this.queue.length) {
			this.queue.shift()
				.once('alldone', function () {
					this.progress();
				}, this)
				.start();
		} else {
			this.trigger('alldone');		}	},	abort: function () {
		this.state = 'abort';
		this.un('done');
		this.progress();
	},	done: function (args) {
		this.state = 'done';
		this.trigger('done', args);
		this.progress();	}
});Deferred.instances = {};
/**
 * �������ͬʱ������Ĵ�������
 * wait - �ȴ��ϸ�������ɡ�
 * ignore - ���Ե�ǰ������
 * stop - �����ж��ϸ��������ϸ������Ļص�������ִ�У�Ȼ��ִ�е�ǰ������
 * abort - �Ƿ�ֹͣ�ϸ��������ϸ������Ļص������ԣ�Ȼ��ִ�е�ǰ������
 * replace - �滻�ϸ�����Ϊ�µĲ������ϸ������Ļص��������ơ�
 */Deferred.link = function (deferredA, deferredB, linkType, type) {
	if (deferredA && deferredA.state === 'running') {
		switch (linkType) {
			case 'wait':
				// �� deferred �ŵ��ȴ����С�
				deferredA.then(function () {
					Deferred.instances[type] = this;
					this.start();
				}, deferredB);
				return deferredB;
			case 'stop':
				deferredA.stop();
				break;
			case 'abort':
				deferredA.abort();
				break;
				//case 'replace':
				//	deferredA.pause();
				//	deferredA.run = deferredB.run;
				//	deferredA.start();
				//	break;
			default:
				assert(!linkType || linkType === 'ignore', "Deferred.link(data): ��Ա {link} ������ wait��cancel��ignore ֮һ��", linkType);
				return deferredB;
		}

	}
	//    Deferred.instances[type] = deferredB;	return deferredB.start();};