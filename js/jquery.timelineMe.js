/*--------------------------------------------------------------------
 *JAVASCRIPT "timeline.js"
 *Version:    0.0.1 - 2015
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
            if(this.settings.items && this.settings.items.length > 0) {
                this.content = this.settings.items;

                for(var i = 0; i < this.content.length; i++) {
                    this.$el.append(this._createItemElement(this.content[i]));
                }
                this._refreshItems();
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
        _createItemElement: function(itemOptions) {
            switch(itemOptions.type) {
                case 'milestone':
                    return this._buildMilestoneElement(itemOptions);
                    break;
                case 'smallItem':
                    return this._buildSmallItemElement(itemOptions);
                    break;
                case 'bigItem':
                    return this._buildBigItemElement(itemOptions);
                    break;
            }
        },
        //
        _buildMilestoneElement: function(item) {
            var milestoneElm = $('<div>');
            milestoneElm.addClass('timeline-item timeline-milestone');
            item.element = milestoneElm;
            return milestoneElm;
        },
        //
        _buildSmallItemElement: function(item) {
            var smallItemElm = $('<div>');
            smallItemElm.addClass('timeline-item timeline-smallitem');
            item.element = smallItemElm;
            return smallItemElm;
        },
        //
        _buildBigItemElement: function(item) {
            var bigItemElm = $('<div>');
            bigItemElm.addClass('timeline-item timeline-bigitem');
            item.element = bigItemElm;
            return bigItemElm;
        },
        //
        _refreshItems: function() {
            for(var i = 0; i < this.content.length; i++) {
                if(!this.content[i].element || !this._isItemClassCorrespondingToType(this.content[i])) {
                    this._createItemElement(this.content[i])
                }
                this.content[i].element.html(this.content[i].shortContent);
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
    var myPrivateMethod = function() {};
    
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