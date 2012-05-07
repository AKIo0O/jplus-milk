/** * @author  *//** * ��ʾһ��������ʱ�Ĳ����� */var Deferred = Class({    constructor: function() {        this._funs = [];        this._nextDef = null;        this._preDef = null;        this.isRunning = false;    },        then: function(f, arg) {        this._funs.push([f, arg]);    },        stop: function() {        //        this.pause();    },        abort: function() {        //        this.isRunning = false;        this._funs.length = 0;        this.pause();    },        pause: function() {        //        clearTimeout(this.timer);    },        done: function() {        //    },        run: function(args) {        this.timer = setTimeout(function(){trace(args);  this.next();}.bind(this), 1000);    },        start: function(args) {        this.then(this.run, args);        if (!this.isRunning) this.next();    },        next: function() {        if (this._funs.length)        {            this.isRunning = true;            var d2 = this._funs.shift();            d2[0].call(this, d2[1]);        }        else if (this._nextDef)        {            this.isRunning = false;            this.done();            this._nextDef.next();        }    },});Deferred.instances = {};
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