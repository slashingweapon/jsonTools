function JSONRPCError(obj) {
	jQuery.extend(this, obj);
	this.toString = function() { return this.message; }
}

 jQuery.extend({
	/**
	 *	Given a URL, method name, and any other arbitrary parameters, creates a JSON request
	 *	and sends it off to the server.  The return value is a jQuery jqXHR object.  You may
	 *	attach completion functions to it via:
	 *	
	 *	.done(function(data, statusString, jqx) {...} )
	 *	.fail(function(jqx, statusString, exc) {...} )
	 *	.always(function(jqx, statusString) {...} )
	 *
	 *	For example, you can do this:
	 *	var jqx = jsonRPC('/words/json', 'someMethod', 'param1', 'param2', 'param3')
	 *		.done(function(data) {
	 *			console.log(data.result);
	 *		});
	 *
	 *	For convenience/debugging, we set jqx.jsonRequestObject to be the un-serialized 
	 *	request object.
	 *
	 *	You can easily have a situation where the JSON call succeeded, but the method
	 *	you called returned an error.  Traditionally, what you ended up doing is detecting
	 *	errors both in your fail() handler (for protocol-level errors) and in your
	 *	done() handler (for method-level errors)  I have extended the parsing function 
	 *	for jsonRPC requests so method errors gets passed to your fail() handler.  You 
	 *	can easily detect this situation because your fail()
	 *	handler is called and the third parameter  (exc in our examples above) an 
	 *	instance of JSONRPCError.
	 */
	jsonRPC: function(url, method) {
		// Keep a static counter, so we can give a unique ID to each request.  This technique
		// even survives a function name change.
		arguments.callee.requestCount = arguments.callee.requestCount || 0;
		arguments.callee.requestCount++;
		
		var req = {
			jsonrpc: "2.0",
			id: arguments.callee.requestCount,
			method: method,
			params: []
		};
		
		// take the extra parameters and push them onto the params array.
		for (var idx=2; idx<arguments.length; idx++)
			req.params.push(arguments[idx]);
		
		var retval = jQuery.ajax({
			type:'post',
			url: url,
			contentType: 'application/json',
			data: JSON.stringify(req),
			dataType: 'json_rpc_response',
			converters: {
				"text json_rpc_response": function(textValue) {
					var retval = jQuery.parseJSON(textValue);
					
					if (typeof(retval) == 'object') {
						if (typeof(retval.error) == 'object') {
							retval = new JSONRPCError(retval.error);
							throw retval;
						} else if (typeof(retval.result) != 'undefined') {
							retval = retval.result;
						} else
							throw "Invalid JSON response";
					} else
						throw "Invalid JSON response";
					
					return retval;
				}
			}
		});
		retval.jsonRequestObject = req;
		
		return retval;
	}
});
