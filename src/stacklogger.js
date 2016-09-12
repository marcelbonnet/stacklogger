/* ========================================================================
 * Stack Logger
 * An Agnostic and Bootstrap 3 compatible (for default) plugin to log messages in a stack	
 * to the user (i.e. using a root DIV element).
 * I use it after ajax calls and other events.
 * 2016-05-01 https://github.com/marcelbonnet
 * ========================================================================
 * Copyright 2016 Marcel Bonnet
 * Licensed under MIT (http://opensource.org/licenses/MIT)
 * ======================================================================== */
(function( $ ) {
  	var $root = null;
    var opts = {};
		var instance = null;
    // Plugin definition.
    var StackLogger = function(element, options){
    	instance = this;
      //return this.init(element, options); //retorna um DIV
      this.init(element, options);
    };
    
    /*
    //private
    StackLogger.VERSION 	= '0.0.1';
    StackLogger.DEFAULT		= 1;
    StackLogger.INFO			= 2;
    StackLogger.WARN			= 3;
    StackLogger.ERR				= 4;
    StackLogger.OK				= 5;
    */
    
    //public
    StackLogger.prototype.VERSION 	= '0.0.1';
    StackLogger.prototype.DEFAULT	= 1;
    StackLogger.prototype.INFO		= 2;
    StackLogger.prototype.WARN		= 3;
    StackLogger.prototype.ERR		= 4;
    StackLogger.prototype.OK		= 5;
    
    
    

	StackLogger.prototype.init = function(element, options){
    /*
    	opts = $.extend( {}, StackLogger.DEFAULTS, options );
      var $elem = $(element);
      addListeners($elem, 'fade', opts.onFade);
      $elem.html( this.format( $elem.html() + this.INFO ) );//test OK
      $root = $elem;//.data('stackLogger');
      debug("INIT");
      debug($root);
      return $root; //return itself so we can chain its methods , not ok?????
      */
      $root = $(element);
      return $(element).each(function() {
      			debug(this);
            var elem = $( this );

             // Extend our default options with those provided.
            // Note that the first argument to extend is an empty
            // object – this is to keep from overriding our "defaults" object.
            //opts = $.extend( {}, StackLogger.DEFAULTS, options );
            opts = $.extend( true, {
            	onFade	: function(event, node, delay){ instance.fade(event, node, delay) },
              neverFadeOut	: [ instance.ERR ],
            }, StackLogger.DEFAULTS, options );
            debug(opts)
						addListeners(elem, 'fade', opts.onFade);
            
      			//elem.html( instance.format( elem.html() + instance.INFO ) );//test OK
            elem.css({
            	color : opts.foreground,
              backgroundColor : opts.background
            });
			
      			//elem.on('click', opts.onFade );
						elem.on('fade', opts.onFade );
            //elem.trigger('fade');
      });
    };

    function addListeners($elem, event, callback){
    	$elem.on(event, callback );
    }
    
    //log a message onto the stack
    StackLogger.prototype.l = function(msg, level, fadeOut){
    	//this: instanceof StackLogger
   		//var elem = $(this);//FIXME era pra ser o div.l().l().l() ...
      var stack = $root.find('> div');//FIXME: usar outro seletor para poder permitir adicionar DIVs/HTML dentro do stack e não apenas texto
      var elem = $root;
      debug($(stack).length)
      /*
      var elem = this;
      if (this instanceof StackLogger)
      	elem = $root;
      */
      elem.data('level', level);
      var $new = $('<div></div>');// elem.append('<div></div>');
      $new.hide();
      elem.append($new);
    	$new.html(msg);
        //var stack = this.bar.find('> div');
        //var $last = $( stack[stack.length - 1] );
        //$last.html(msg);

        //não funciona, mas pelo console funciona.
        //if ($.type(kill) === "object" ) { console.log("KILL"); console.log($(kill)); $(kill).hide(500) }

        //this.bar.html(msg);
        
        switch (level){
            case this.INFO :
                //this.bar.removeClass().addClass("alert alert-info");
                $new.removeClass().addClass(opts.classes.info);
                break;
            case this.WARN :
                //this.bar.removeClass().addClass("alert alert-warning");
                $new.removeClass().addClass(opts.classes.warn);
                break;
            case this.ERR :
                //this.bar.removeClass().addClass("alert alert-danger");
                $new.removeClass().addClass(opts.classes.err);
                break;
            case this.OK :
                //this.bar.removeClass().addClass("alert alert-success");
                $new.removeClass().addClass(opts.classes.ok);
                break;
            case this.DEFAULT :
                //this.bar.removeClass().addClass("alert label-default");
                $new.removeClass().addClass(opts.classes.default);
            default:
        }
        
        $new.show(opts.fadeIn);
        
        //if ( fadeOut === undefined || fadeOut > 0 )
        
        if ( $.inArray(level, opts.neverFadeOut) ) {
        	$new.trigger('fade', [ $new, (fadeOut === undefined ? opts.fadeOut : fadeOut) ]);
        } else {
        	var html = $new.html();
        	$new.html(html+"<button type=\"button\" style=\"text-align:right\" onclick=\"$(this).parent().hide("+opts.fadeOut+");\">"+opts.closeButtonLabel+"</button>");
        	//$new.append(html);
        }
        	

        //return $new;
        return this;//allows chain l().l().l() ...
    };
    
    //alias to log a message to the stack
    StackLogger.prototype.log = StackLogger.l;
    
    StackLogger.prototype.fade = function(event, node, delay) {
    		if (delay > 0)
    			$(node).hide(delay);
    };
    
    $.fn.stackLogger00 = function( options ) {
    		//markup = $.fn.hilight.format( this.html() );
        //this.html(markup);
				
        // Iterate and reformat each matched element.
        return this.each(function() {
						debug(this);
            var elem = $( this );

             // Extend our default options with those provided.
            // Note that the first argument to extend is an empty
            // object – this is to keep from overriding our "defaults" object.
            var opts = $.extend( {}, StackLogger.DEFAULTS, options );

            var markup = elem.html();

            // Call our format function.
            markup = self.format( markup );

            elem.html( markup );
            elem.css({
            	color : opts.foreground,
              backgroundColor : opts.background
            });
			
      			//elem.on('click', opts.onFade );
						elem.on('fade', opts.onFade );
            elem.trigger('fade');
        });
				
    };

    // Define our format function.
    StackLogger.prototype.format = function( txt ) {
    		debug(this);
        return "<strong>" + txt + "</strong>";
    };
 
    // Private function for debugging.
    function debug( obj ) {
        if ( opts.debug === true && window.console && window.console.log ) {
            window.console.debug( "DEBUG: " );
            window.console.debug(obj);
        }
    };
    
  	
    // Plugin defaults – added as a property on our plugin function.
    StackLogger.DEFAULTS = {
        classes : {
        	default 		: "alert label-default",
        	info 				: "alert alert-info",
          ok 					: "alert alert-success",
          warn 				: "alert alert-warning",
          err 				: "alert alert-danger"
        },
        closeButtonLabel	: 'Close',
        fadeIn				: 1000,
        fadeOut				: 4000,//fadeOut : 0 to not fade out
        debug				: false,
        //neverFadeOut	: [ StackLogger.ERR ],
        //onFade	: function(event, node, delay){console.log($(node).html())},
        
    };
    
  /** 
  * PLUGIN DEFINITION
  */
  // if extending from another plugin, merge in new options like so: 
  // $.fn.[PLUGIN_NAME].defaults = $.extend({} , $.fn.otherPlugin.defaults, {
  function Plugin(options) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data('stackLogger');
      if (!data) {
      	debug('Plugin: no data');
   			$this.data('stackLogger', (data = new StackLogger(this, options)))
        debug('Lendo do Plugin: ' + data.INFO);
        }
    });
  }
    
  $.fn.stackLogger							= Plugin;
  $.fn.stackLogger.Constructor 	= StackLogger;
 
// End of closure.
 
})( jQuery );