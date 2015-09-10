/*--------------------------------------------------------------------
 *JAVASCRIPT "timelineMe.js"
 *Version:    0.0.2 - 2015
 *author:     Mickaël Roy
 *website:    http://www.mickaelroy.com
 *Licensed MIT 
-----------------------------------------------------------------------*/

(function ($){
 
    var pluginName = 'timelineMe';
 
    /**
     * The plugin constructor
     * @param {DOM Element} element The DOM element where plugin is applied
     * @param {Object} options Options passed to the constructor
     */
    function TimelineMe(element, options) {
        // Store a reference to the source element
        this.el = element;

        // Store a jQuery reference  to the source element
        this.$el = $(element);

        // Set a random (and normally unique) id for the object
        this.instanceId = Math.round(new Date().getTime() + (Math.random() * 100));

        // Set the instance options extending the plugin defaults and
        // the options passed by the user
        this.settings = $.extend({}, $.fn[pluginName].defaults, options);
            
        // Initialize the plugin instance
        this.init();
    }
    
    /**
     * Set up your Plugin protptype with desired methods.
     * It is a good practice to implement 'init' and 'destroy' methods.
     */
    TimelineMe.prototype = {
        
        /**
         * Initialize the plugin instance.
         * Set any other attribtes, store any other element reference, register 
         * listeners, etc
         *
         * When bind listerners remember to name tag it with your plugin's name.
         * Elements can have more than one listener attached to the same event
         * so you need to tag it to unbind the appropriate listener on destroy:
         * 
         * @example
         * this.$someSubElement.on('click.' + pluginName, function() {
         *      // Do something
         * });
         *         
         */
        init: function() {
            this.$el.addClass('timeline-me-container');

            if(this.settings.items && this.settings.items.length > 0) {
                this.content = this.settings.items;

                for(var i = 0; i < this.content.length; i++) {
                    this.$el.append(this._createItemElement(this.content[i]));
                }
            }
        },

        /**
         * The 'destroy' method is were you free the resources used by your plugin:
         * references, unregister listeners, etc.
         *
         * Remember to unbind for your event:
         *
         * @example
         * this.$someSubElement.off('.' + pluginName);
         *
         * Above example will remove any listener from your plugin for on the given
         * element.
         */
        destroy: function() {

            // Remove any attached data from your plugin
            this.$el.removeData();
        },


        // To call a call a pseudo private method: 
        //this._pseudoPrivateMethod();

        // To call a real private method from those public methods, you need to use 'call' or 'apply': 
        //privateMethod.call(this);

        /**
         * getItem method
         *
         * @example
         * $('#element').pluginName('getItem');
         * 
         * @return {item} corresponding to the specified index
         */
        getItem: function(index) {
            return this.content[index];
        },

        /**
         * You can use the name convention functions started with underscore are
         * private. Really calls to functions starting with underscore are 
         * filtered, for example:
         * 
         *  @example
         *  $('#element').jqueryPlugin('_pseudoPrivateMethod');  // Will not work
         */
        //
        _createItemElement: function(item) {
            var itemElm;
            switch(item.type) {
                case 'milestone':
                    itemElm = this._buildMilestoneElement(item);
                    break;
                case 'smallItem':
                    itemElm = this._buildSmallItemElement(item);
                    break;
                case 'bigItem':
                    itemElm = this._buildBigItemElement(item);
                    break;
            }
            item.element = itemElm;
            item.element.on('timelineMe.heightChanged timelineMe.itemFlipped', function(event) { 
                console.log(event); 
            });

            this._buildItemContent(item);
            this._fillItem(item);

            return itemElm;
        },
        //
        _buildMilestoneElement: function(item) {
            var milestoneElm = $('<div class="timeline-me-item timeline-me-milestone">');
            return milestoneElm;
        },
        //
        _buildSmallItemElement: function(item) {
            var smallItemElm = $('<div class="timeline-me-item timeline-me-smallitem">');  
            return smallItemElm;
        },
        //
        _buildBigItemElement: function(item) {
            var bigItemElm = $('<div class="timeline-me-item timeline-me-bigitem">');
            return bigItemElm;
        },
        //
        _buildItemContent: function(item) {
            if(!item || !item.element)
                return;

            var labelElm = $('<div class="timeline-me-label">');
            item.element.append(labelElm);
            item.labelElement = labelElm;

            if(item.type == 'smallItem' || item.type == 'bigItem') {
                var contentContainer = $('<div class="timeline-me-content-container">');

                var shortContentElm = $('<div class="timeline-me-shortcontent">');
                contentContainer.append(shortContentElm);
                item.shortContentElement = shortContentElm;

                var fullContentElm = $('<div class="timeline-me-fullcontent">');
                contentContainer.append(fullContentElm);
                item.fullContentElement = fullContentElm;
            
                var showMoreElm = $('<div class="timeline-me-showmore">');
                item.showMoreElement = showMoreElm;

                var showLessElm = $('<div class="timeline-me-showless">');
                item.showLessElement = showLessElm;

                item.element.append(contentContainer);
            }
        },
        //
        _fillItem: function(item) {
            if(item.label && item.labelElement)
                item.labelElement.html(item.label);

            if(item.shortContent && item.shortContentElement) {
                item.shortContentElement.html(item.shortContent);
                /*
                // Two solutions to get element's height:
                resolveElementHeight(item.shortContentElement).then(function(data) {
                    console.log('resolved');
                    console.log(data);
                });
                eventElementHeight(item.shortContentElement, {eventName: 'timelineMe.heightChanged'});
                */

                // Test height watcher:
                heightWatcher(item.shortContentElement, function(data) {
                    if(data && data.element) {
                        var container = data.element.closest('.timeline-me-content-container');
                        if(data.newVal)
                            container.height(data.newVal);
                    }
                });
            }

            if(item.fullContent && item.fullContentElement) {
                item.fullContentElement.html(item.fullContent);
            }

            if(item.showMore && item.showMoreElement) {
                item.showMoreElement.html(item.showMore);
                if(item.shortContentElement)
                    item.shortContentElement.append(item.showMoreElement);
                item.showMoreElement.on('click', function() {
                    item.element.toggleClass('flip');
                    item.element.trigger('timelineMe.itemFlipped');
                });
            }

            if(item.showLess && item.showLessElement) {
                item.showLessElement.html(item.showLess);
                if(item.fullContentElement)
                    item.fullContentElement.append(item.showLessElement);
                item.showLessElement.on('click', function() {
                    item.element.toggleClass('flip');
                    item.element.trigger('timelineMe.itemFlipped');
                });
            }
        },
        //
        _refreshItems: function() {
            for(var i = 0; i < this.content.length; i++) {
                if(!this.content[i].element || !this._isItemClassCorrespondingToType(this.content[i])) {
                    this._createItemElement(this.content[i])
                }
                this._fillItem(this.content[i]);
            }
        },
        //
        _isItemClassCorrespondingToType: function(item) {
            if(!item || !item.type || !item.element)
                return false;

            switch(item.type) {
                case 'milestone':
                    return (item.element.hasClass('timeline-milestone'));
                    break;
                case 'smallItem':
                    return (item.element.hasClass('timeline-smallitem'));
                    break;
                case 'bigItem':
                    return (item.element.hasClass('timeline-bigitem'));
                    break;
                default:
                    return false;
                    break;
            }
        }
    };

    /**
     * These are real private methods. A plugin instance has access to them
     * @return {[type]}
     */
    // 
    var resolveElementHeight = function(element, args) {
        if(!args) 
            args = {};
        var refreshDelay = args.refreshDelay ? args.refreshDelay : 500;
        var ret = new $.Deferred();
        var elmHeight;

        if(element)
            elmHeight = element.height();
        if(elmHeight && elmHeight > 0) {
            ret.resolve(elmHeight);
        } else {
            setTimeout(function () {
                resolveElementHeight(element, args).then(function(heightData) {
                    ret.resolve(heightData);
                });
            }, refreshDelay);
        }
        
        return ret;
    }
    //
    var eventElementHeight = function(element, args) {
        if(!args) 
            args = {};
        var eventName = args.eventName ? args.eventName : 'onElementHeight';
        var refreshDelay = args.refreshDelay ? args.refreshDelay : 500;
        var elmHeight;

        if(element)
            elmHeight = element.height();
        if(elmHeight && elmHeight > 0) {
            var e = jQuery.Event(eventName, {elementHeight: elmHeight});
            element.trigger(e);
        } else {
            setTimeout(function () {
                eventElementHeight(element, args);
            }, refreshDelay);
        }
    }
    //
    var resolveElementHeightChange = function(element, args) {
        if(!args) 
            args = {};
        var refreshDelay = args.refreshDelay ? args.refreshDelay : 500;
        var previousHeight = args.previousHeight;
        var level = args.level ? args.level : 0;
        var ret = new $.Deferred();
        var elmHeight;

        if(element)
            elmHeight = element.outerHeight() ? element.outerHeight() : element.height();
        if(elmHeight && (!previousHeight || previousHeight != elmHeight)) {
            //console.log('resolved at level: ' + level);
            ret.resolve(elmHeight, previousHeight, level);
        } else {
            args.previousHeight = elmHeight;
            setTimeout(function () {
                resolveElementHeightChange(element, {previousHeight: elmHeight, refreshDelay: refreshDelay, level: (level + 1)}).then(function(newHeightVal, previousHeightVal, levelVal) {
                    //console.log('resolved promise ' + level + ' from level ' + levelVal);
                    ret.resolve(newHeightVal, previousHeightVal, level);
                });
            }, refreshDelay);
        }
        
        return ret;
    }

    var heightWatcher = function(element, callback) {
        resolveElementHeightChange(element).then(function(newVal, oldVal) {
            var heightEvent = jQuery.Event('timelineMe.itemHeightChanged', {elementHeight: newVal, previousHeight: oldVal});
            element.trigger(heightEvent);
        });
        element.on('timelineMe.itemHeightChanged', function(e) {
            callback({element: element, newVal: e.elementHeight, oldVal: e.previousHeight});
            resolveElementHeightChange($(e.target), {previousHeight: e.elementHeight}).then(function(newVal, oldVal) {
                var heightEvent = jQuery.Event('timelineMe.itemHeightChanged', {elementHeight: newVal, previousHeight: oldVal});
                $(e.target).trigger(heightEvent);
            });
        });
    }
    
    $.fn[pluginName] = function(options) {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            // Creates a new plugin instance, for each selected element, and
            // stores a reference withint the element's data
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new TimelineMe(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a public pluguin method (not starting with an underscore) for each 
            // selected element.
            if (Array.prototype.slice.call(args, 1).length === 0 && $.inArray(options, $.fn[pluginName].getters) !== -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability so we can return a value
                // instead the element reference.
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof TimelineMe && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    };
    
    /**
     * Names of the pluguin methods that can act as a getter method.
     * @type {Array}
     */
    //$.fn[pluginName].getters = ['getDate'];

    /**
     * Default options
     */
    $.fn[pluginName].defaults = {
        orientation         : 'vertical',
        smallItemWidth      : '200px',
        bigItemWidth        : '600px',
        smallItemTemplate   : undefined,
        bigItemTemplate     : undefined,
        items               : []
    };
 
}(jQuery));

