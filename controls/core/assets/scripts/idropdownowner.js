/** * @author xuld */imports("Controls.Core.IDropDownOwner");using("System.Dom.Align");/** * 所有支持下拉菜单的组件实现的接口。 * @interface IDropDownOwner */var IDropDownOwner = {		/**	 * 获取或设置当前实际的下拉菜单。	 * @protected	 * @type {Control}	 */	dropDown: null,		/**	 * 下拉菜单的宽度。	 * @config {String}	 * @defaultValue 'auto'	 * @return 如果值为 'auto', 则和父容器有同样的宽度。如果设为 -1， 表示不处理宽度。	 */	dropDownWidth: 'auto',		onDropDownShow: function(){		this.trigger('dropdownshow');	},		onDropDownHide: function(){		this.trigger('dropdownhide');	},		/**	 * 获取当前控件的下拉菜单。	 * @return {Control} 	 */	getDropDown: function(){		return this.dropDown;	},	setDropDown: function(dom){				// 修正下拉菜单为 Control 对象。		dom = dom instanceof Dom ? dom : Dom.get(dom);				assert.notNull(dom, "IDropDown.setDropDown(dom): {dom} ~");				// 设置下拉菜单。		this.dropDown = dom.addClass('x-dropdown').hide();				// 如果当前节点已经添加到 DOM 树，则同时添加 dom 。		if(!dom.parent('body')){						// 给 div 和 span 更多关心。			if(/^(DIV|SPAN)$/.test(this.node.tagName)){				this.append(dom);			} else {				this.after(dom);			}						// IE6/7 无法自动在父节点无 z-index 时处理 z-index 。			if(navigator.isQuirks && dom.parent().getStyle('zIndex') === 0)				dom.parent().setStyle('zIndex', 1);		}				return this;	},		dropDownHidden: function () {		return Dom.isHidden(this.dropDown.node);	},		realignDropDown: function (offsetX, offsetY) {		this.dropDown.align(this, 'bl', offsetX, offsetY);		return this;	},		toggleDropDown: function(e){		if(e) this._dropDownTrigger = e.target;		return this[this.dropDownHidden() ? 'showDropDown' : 'hideDropDown']();	},		showDropDown: function(){				var dropDown = this.dropDown;				if(this.dropDownHidden()){			dropDown.show();			this.realignDropDown(0, -1);						var size = this.dropDownWidth;			if(size === 'auto') {				size = this.getSize().x;								// 不覆盖 min-width				if(size < Dom.styleNumber(dropDown.node, 'min-width'))					size = -1;			}						if(size >= 0) {				dropDown.setSize(size);			}						this.onDropDownShow();						document.on('mouseup', this.hideDropDown, this);		} else {			this.realignDropDown(0, -1);		}				return this;	},		hideDropDown: function (e) {				var dropDown = this.dropDown;				if(!this.dropDownHidden()){						// 如果是来自事件的关闭，则检测是否需要关闭菜单。			if(e){				e = e.target;				if([this._dropDownTrigger, dropDown.node, this.node].indexOf(e) >= 0 || Dom.has(dropDown.node, e) || Dom.has(this.node, e)) 					return this;			}						this.onDropDownHide();			dropDown.hide();			document.un('mouseup', this.hideDropDown);					}				return this;	}	};