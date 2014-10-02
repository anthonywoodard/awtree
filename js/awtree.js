(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery', 'widget'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    return $.widget('aw.awtree', {
		version: '1.0.0-alpha',		
		defaultElement: '<ul>',
		options: {			
			checkbox: false, //true
			expandedImage: 'aw-caret-down',
			collapsedImage: 'aw-caret-right',
			folderImage: 'aw-folder-o',
			nodeImage: 'aw-file-o',
			expandAll: false, //true
			nodeClicked: $.noop,
			nodeChecked: $.noop,
			nodeUnChecked: $.noop,
			nodeCollapsed: $.noop,
			nodeExpanded: $.noop,
			childNodeChecked: $.noop,
			childNodeUnChecked: $.noop,
			loaded: $.noop,
			data: {},
			labelKey: 'name',
			childrenKey: 'children',
			lazyLoad: false, //true
			hide: { effect: 'slideUp', duration: 'fast' },
			show: { effect: 'slideDown', duration: 'fast' }
		},
		_create: function () {
			var el = this.element[0];
			var data = this.options.data;
			if (el.tagName.toLowerCase() == 'ul' && !this.element.hasClass('aw-tree')) {
				this.element.addClass('aw-tree');
			}			
			if ($.isPlainObject(data) && !$.isEmptyObject(data)) {			
				var li = $('<li></li>').text(data[this.options.labelKey]);
				for (var d in data) {
					if (d != this.options.childrenKey) {
						li.attr('data-' + d, data[d])	
					}
				}
				if (data[this.options.childrenKey]) {
					li = this._transformDataList(li, data[this.options.childrenKey]);
				}									
				this.element.empty().append(li);
			}
			this._addClickEvents();			
			this._atreeify(el);			
			this._doTreeLoaded();						
		},
		_doTreeLoaded: function () {
			this.options.loaded.call(this, 'loaded', this.element);
		},
		_transformDataList: function (el, data) {	
			if ($.isArray(data)) {
				var ul = $('<ul></ul>');
				el.append(ul);
				for (var i = 0; i < data.length; i++) {
					this._transformDataList(ul, data[i]);
				}
			} else {
				var li = $('<li></li>').text(data[this.options.labelKey]);
				for (var d in data) {
					if (d != 'children') {
						li.attr('data-' + d, data[d])	
					}
				}				
				if (data[this.options.childrenKey]) {
					this._transformDataList(li, data[this.options.childrenKey]);
				}
				el.append(li);
			}
			return el;
		},		
		_atreeify: function (node) {
			var that = this;
			var children = $(node).children();
			if (children.length > 0) {
				children.map(function (i) {
					var child = children[i];				
					if (child.tagName.toLowerCase() == 'li') {					
						child = $(child).addClass('aw-node');
						var textNodes = child.contents().filter(function () { return this.nodeType === 3; });						
						$.each(textNodes, function () {
							var s = $.trim($(this).text());
							if (s != '') {
								if (child.children('ul').length > 0 || child.data('hasChildren') == true) {
									$(this).replaceWith('<span class="aw-node-image ' + that.options.folderImage + '"></span><a>' + s + '</a>');
								} else {
									$(this).replaceWith('<span class="aw-node-image ' + that.options.nodeImage + '"></span><a>' + s + '</a>');									
								}
							}	
						});																										
						if (that.options.checkbox == true) {
							var cbox = $('<input type="checkbox"/>');
							child.prepend(cbox);
							if (child.data('isChecked') == true) {
								cbox.prop('checked', true);
							} else {
								var immediateParent = $(child.parents('li')[0]).children('input[type="checkbox"]')[0];
								var isIndeterminate = $(immediateParent).prop('indeterminate');
								if (isIndeterminate == false) {
									cbox.prop('indeterminate', false);
									cbox.prop('checked', $(immediateParent).prop('checked'));
								}
							}
						}						
						var exp = $('<span class="aw-expander"></span>');																				
						var ulChildren = child.children('ul');					
						if (ulChildren.length > 0) {
							child.prepend(exp);
							if (that.options.expandAll == true) {
								ulChildren.addClass('aw-open');
							}
							if (ulChildren.hasClass('aw-open')) {														
								that._toggleExpander(exp, 'expanded');
							} else {
								that._toggleExpander(exp);
							}
						} else {
							if (child.data('hasChildren') == true) {
								child.prepend(exp);
								that._toggleExpander(exp);
							}
						}						
						var aselected = child.children('a.aw-selected');					
						if (aselected.length > 0) {
							child.trigger('click', child);
						}					
					}
					that._atreeify(child);
				});				
			}			
		},
		_clearSelection: function () {
			$('a.aw-selected').removeClass('aw-selected');
		},
		_addClickEvents: function () {
			var that = this;
			this._on(this.element, {
				'click a': function ( event ) {
					event.stopPropagation();
					var el = $(event.target);
					var parent = el.parent('li');
					this._clearSelection();	
					el.addClass('aw-selected');
					this.options.nodeClicked.call(this, 'nodeClicked', parent);
					el.trigger('nodeClicked', parent);
				},
				'click span.aw-expander': function ( event ) {
					event.stopPropagation();
					//this._clearSelection();
					this._showChildren($(event.target).parent('li'));
				},
				'click input[type="checkbox"]': function ( event ) {					
					event.stopPropagation();		
					var el = event.target;
					var parent = $(el).parent();
					if (el.checked) {
						this.options.nodeChecked.call(this, 'nodeChecked', parent);
						$(el).trigger('nodeChecked', parent);
					} else {
						this.options.nodeUnChecked.call(this, 'nodeUnChecked', parent);
						$(el).trigger('nodeUnChecked', parent);
					}						
					this._checkChildren(parent, el);
					this._checkParents(parent, el);
				}
			});			
		},		
		_toggleExpander: function (node, state) {
			var c = 'aw-collapsed', e = 'aw-expanded';
			var cImg = this.options.collapsedImage + ' ' + c;
			var eImg = this.options.expandedImage + ' ' + e;
			var img = cImg;			
			if ((node.hasClass(c) || state == 'expanded') && state != 'collapsed') {
				img = eImg;
			}			
			node.removeClass(cImg + ' ' + eImg).addClass(img);
		},		
		_showChildren: function (obj, toggleState) {
			var that = this;
			var children = $(obj).children();
			var foundChild = false;
			var child;
			var exp = $(obj).children('span.aw-expander');
			if (children.length > 0) {				
				children.map(function (i) {				
					child = children[i];					
					if (child.tagName.toLowerCase() == 'ul') {	
						foundChild = true;
					}				
				});			
			}
			if (foundChild == false) {
				if (this.options.lazyLoad == true) {
					$(obj).trigger('lazyLoad', obj);
				} else {
					that._toggleExpander(exp, toggleState);
				}
			} else {				
				if ($(child).hasClass('aw-open')) {
					that._hide($(child), that.options.hide, function () {
						$(this).removeClass('aw-open');
						that.options.nodeCollapsed.call(this, 'nodeCollapsed', $(obj));
						$(child).trigger('nodeCollapsed', $(obj));
					});																																
				} else {												
					that._show($(child), that.options.show, function () {
						$(this).addClass('aw-open');	
						that.options.nodeExpanded.call(this, 'nodeExpanded', $(obj));
						$(child).trigger('nodeExpanded', $(obj));
					});																									
				}
				that._toggleExpander(exp, toggleState);
			}
		},
		_checkChildren: function (obj, srcObj) {
			var that = this;
			var children = obj.find('input');
			children.map(function (i) {
				var child = children[i];
				if (child != srcObj) {
					child.checked = srcObj.checked;
					$(child).prop('indeterminate', srcObj.indeterminate);
					if (srcObj.checked == true) {
						that.options.childNodeChecked.call(this, 'childNodeChecked', $(child).parent());
						$(child).trigger('childNodeChecked', $(child).parent());
					} else {
						that.options.childNodeUnChecked.call(this, 'childNodeUnChecked', $(child).parent());
						$(child).trigger('childNodeUnChecked', $(child).parent());
					}
				}			
				that._checkChildren($(child), srcObj);
			});        
		},
		_checkParents: function (obj, srcObj) {			
			var parents = obj.parents('li');			
			parents.map(function (i) {
				var parent = parents[i];
				var checkbox = $(parent).children('input:checkbox');
				checkbox.prop('checked', srcObj.checked);
				checkbox.prop('indeterminate', srcObj.indeterminate);
				var checkboxes = $(parent).find('input:checkbox').length;
				var checked = $(parent).find('input:checked').length;
				
				if (checkboxes != checked && checked > 0) {
					checkbox.prop('indeterminate', true);
					checkbox.prop('checked', false);
				}										
			});
		},
		addNode: function (el, node) {
			if ($.isArray(node)) {
				el = this._transformDataList(el, node);
				this._atreeify(el.children('ul'));
				this._showChildren(el);
			}
		},
		removeNode: function (el, node) {
			if ($.isPlainObject(node) && !$.isEmptyObject(node)) {
				var ul = this._transformDataList($('<ul></ul>'), node);
				this._atreeify(ul);
				var li = ul.children('li');
				$(el).replaceWith(li);
				if (this.options.checkbox == true) {
					this._checkParents(li, $(li).children('input[type="checkbox"]').get(0));
				}				
			} else {
				var ul = $(el).parent('ul');
				var exp = ul.parent('li').children('span.aw-expander');
				$(el).remove();
				if (ul.children('li').length == 0) {
					ul.remove();
					this._toggleExpander(exp);
				}
			}
		},
		selectNode: function (dataAttr, value) {
			var that = this;
			var li;
			if (!value) {
				li = this.element.find('li[' + dataAttr + ']');
			} else {
				li = this.element.find('li[' + dataAttr + '="' + value + '"]');
			}			
			$.each(li, function (i) {
				if (i == 0) {			
					if ($(this).parents('ul').length > 0) {
						$.each($(this).parents('ul'), function (i) {
							if (!$(this).hasClass('aw-open')) {
								that._showChildren($(this).parent('li'), 'expanded')
							}
						});						
					}
					$(this).children('a').trigger('click');						
				}
			});
			if (li.length > 0) {
				return li;
			}
			return false;
		},
		expandAll: function () {
			var that = this;
			var li = this.element.find('li');
			var doLazyLoadFlip = false;
			if (this.options.lazyLoad == true) {
				doLazyLoadFlip = true;
				this.options.lazyLoad = false;
			}
			$.each(li, function () {				
				if ($(this).children('ul').length > 0) {
					if (!$(this).children('ul').hasClass('aw-open')) {
						that._showChildren(this, 'expanded');
					} else {
						that._toggleExpander($(this).children('span.aw-expander'), 'expanded');
					}
				}
			});
			if (doLazyLoadFlip == true) {
				this.options.lazyLoad = true;
			}
		},
		collapseAll: function () {
			var that = this;
			var li = this.element.find('li');			
			$.each(li, function () {				
				if ($(this).children('ul').length > 0) {
					$.each($(this).children('ul'), function () {
						$(this).addClass('aw-open');
					});
					that._showChildren(this, 'collapsed');					
				}				
			});
		}
	});
}));