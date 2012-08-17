/** * @author  xuld */imports("Controls.Core.ScrollableControl");using("System.Data.Collection");using("Controls.Core.Base");/** * ��ʾһ�����й�������Ŀؼ��� * @class ScrollableControl * @extends Control * @abstract * @see ScrollableControl.ControlCollection * @see ListControl * @see ContainerControl * <p> * {@link ScrollableControl} �ṩ���������ӿؼ������ܡ� * {@link ScrollableControl} ͨ�� {@link ScrollableControl.ControlCollection} �������ӿؼ��� * ͨ�� {@link#controls} ���Կ��Ի�ȡ��ʵ������ * </p> * * <p> * ͨ�� {@link ScrollableControl.ControlCollection#add} * ������һ���ӿؼ����÷�����ӵ��� {@link ScrollableControl.ControlCollection#onControlAdded}���� * �� {@link ScrollableControl} �������Զ����������ӷ�ʽ�� * </p> * * <p> * �����Ҫ����һ�����ӿؼ��Ŀؼ�������� �̳� {@link ScrollableControl} �ഴ���� * ������Ҫ��д {@link #initChildControl} �������ڶ��ӿؼ���ʼ���� * ��д {@link #onControlAdded}ʵ���ӿؼ�����ӷ�ʽ��Ĭ��ʹ�� appendChild �����ڵ㣩�� * ��д {@link #onControlRemoved}ʵ���ӿؼ���ɾ����ʽ�� * ��д {@link #createChildCollection} ʵ�ִ����Զ������������ * </p> * * <p> * ����͵� {@link ScrollableControl} ������Ϊ {@link ListControl} �� {@link ContainerControl} �ṩ������ࡣ * </p> */var ScrollableControl = Control.extend({	/**	 * ���¿ؼ������ʱִ�С�	 * @param {Object} childControl ����ӵ�Ԫ�ء�	 * @param {Number} index Ԫ�ر���ӵ�λ�á�	 * @protected virtual	 */	onControlAdded: function(childControl, index) {
		index = this.controls[index];		assert(childControl && childControl.attach, "Control.prototype.onControlAdded(childControl, index): {childControl} \u5FC5\u987B\u662F\u63A7\u4EF6\u3002", childControl);		childControl.attach(this.container.node, index ? index.node : null);
	},	/**	 * ���¿ؼ����Ƴ�ʱִ�С�	 * @param {Object} childControl ����ӵ�Ԫ�ء�	 * @param {Number} index Ԫ�ر���ӵ�λ�á�	 * @protected virtual	 */	onControlRemoved: function(childControl, index) {
		assert(childControl && childControl.detach, "Control.prototype.onControlRemoved(childControl, index): {childControl} \u5FC5\u987B\u662F\u63A7\u4EF6\u3002", childControl);		childControl.detach(this.container.node);
	},	/**	 * ������������ʱ��ʵ�ִ���һ���ӿؼ��б�	 * @return {ScrollableControl.ControlCollection} �ӿؼ��б�	 * @protected virtual	 */	createControlsInstance: function() {
		return new ScrollableControl.ControlCollection(this);
	},	// /**	// * ��ȡ��ǰ�ؼ����ڴ���ӽڵ�������ؼ���	// * @protected virtual	// */	// getContainer: function(){	// return this;	// },	/**	 * �� DOM ������ controls ���ԡ�	 * @protected virtual	 */	init: function() {
		this.container = Dom.get(this.container.node);
	},	/**	 * �����û������봴��һ���µ��ӿؼ���	 * @param {Object} item ����ӵ�Ԫ�ء�	 * @return {Control} һ���ؼ��������û������������	 * @protected virtual	 * Ĭ�ϵأ���������ַ�����DOM�ڵ㣬��תΪ��Ӧ�Ŀؼ���	 */	initChild: Dom.parse,	removeChild: function(childControl) {
		return this.controls.remove(childControl);
	},	insertBefore: function(newControl, childControl) {
		return childControl === null ? this.controls.add(newControl) : this.controls.insert(this.controls.indexOf(childControl), newControl);
	},	/**	 * ��ȡĿǰ�����ӿؼ���	 * @type {Control.ControlCollection}	 * @name controls	 */	constructor: function() {
		this.container = this;		this.controls = this.createControlsInstance();		//   this.loadControls();		Control.prototype.constructor.apply(this, arguments);
	},	empty: function() {
		this.controls.clear();		return this;
	}
});///  #region ControlCollection/** * �洢�ؼ��ļ��ϡ� * @class * @extends Collection */ScrollableControl.ControlCollection = Collection.extend({	/**	 * ��ʼ�� Control.ControlCollection ����ʵ����	 * @constructor	 * @param {ScrollableControl} owner ��ǰ���ϵ������ؼ���	 */	constructor: function(owner) {
		this.owner = owner;
	},	/**	 * ����������дʱ����ʼ����Ԫ�ء�	 * @param {Object} item ��ӵ�Ԫ�ء�	 * @return {Object} ��ʼ����ɺ��Ԫ�ء�	 */	initItem: function(item) {
		return this.owner.initChild(item);
	},	/**	 * ֪ͨ����һ���µ�Ԫ�ر���ӡ�	 * @param {Object} childControl ����ӵ�Ԫ�ء�	 * @param {Number} index Ԫ�ر���ӵ�λ�á�	 */	onInsert: function(childControl, index) {		// ����ؼ��Ѿ��и��ؼ���		if (childControl.parentControl) {
			childControl.parentControl.controls.remove(childControl);
		}		childControl.parentControl = this.owner;		// ִ�пؼ���Ӻ�����		this.owner.onControlAdded(childControl, index);
	},	/**	 * ֪ͨ����һ��Ԫ�ر��Ƴ���	 * @param {Object} childControl ����ӵ�Ԫ�ء�	 * @param {Number} index Ԫ�ر���ӵ�λ�á�	 */	onRemove: function(childControl, index) {
		this.owner.onControlRemoved(childControl, index);		childControl.parentControl = null;
	}
});/// #endregion