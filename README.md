# JSON RPC Tools for Javascript #

I wrote a handy JSON-RPC function in for jQuery that:

* Lets you treat the RPC more like a function
* Uses the promise interface
* Routes JSON errors to your fail() handler

## JSON-RPC Example ##

	$.jsonRPC('hello.php', 'hello', 'Joe')
	 .done(function(data) { alert(data); })
	 .fail(function(jqhx, message, exceptionObj) {
	 	if (exceptionObj instanceof JSONRPCError)
	 		alert("JSON error: " + exceptionObj)
	 	else
	 		alert("Error: " + exceptionObj);
	 });

### The RPC Call ###

When you call jsonRPC() you give it the URL, the method name, and then as many additional parameters
as you want to. The extra params are all passed to the remote method.  The parameters can be
anything that will JSON-encode (scalars, arrays, and objects).

The return value is a jqxHDR object.  It implements the promise interface, which you use to add various
handlers.

### The Done Handler ###

You can register as many done handlers as you want.  The parameters received are the data (the
results of your function call), a status string, and the jqxHDR object from jQuery.

### Error Handling ###

You may register as many error handlers as you want.  

There are always at least two error cases: there is the case where the request fails, and the case
where the remote method runs and returns an error.  I've set this up so you can test for both error
conditions from within the failure handler.  Just test to see if the exception received is an
instance of JSONRPCError.

### Always Hanlder ###

You can also add .always() handlers.  They take a jqxHDR object and a status message as parameters.

## Library Dependencies ##

jQuery 1.5 or above.  For the example, we pull it in from Google.

## Example Dependencies ##

You must have a web server and permission to execute PHP scripts.

## Longer-Term Notes ##

Over the last couple of years I've found myself wandering away from the usual model of web
application programming.  In this model your PHP code dynamically generates some HTML, often using
form data. Then the user will do something like click on a link or submit a form, and the whole
process repeats itself.  There's nothing unsatisfactory with this model most of the time.

When you start building more dynamic applications you run into issues that would annoy most software
professionals.

1.	It is quite common to find yourself using server-side template libraries (Twig, Smarty, et al)
to format rows of table data or groups of form elements, only to have the client _duplicate_ much of
that work to respond dynamically to user clicks.  You end up with _two_ entities in charge of
rendering HTML, depending on when it is rendered: the server (PHP) and the client (JavaScript).

	It would be better if just one piece of code was responsible for rendering the user's view,
	instead of two.

1.	POST arguments are not very expressive.  We play a lot of games with form element names just
so we can build data structures with them later.  This works pretty well up to a point.  As the data
gets more complex, and you let users add to the complexity by expanding the data set arbitrarily
(see issue #1 above) then you end up with a mess.

	JSON RPC is much expressive than simple post data, and much more concise than XML.  It is also
	faster to create and parse.

1.  JSON RCP is already used by some libraries for progressive form choices, such as when choosing a
country causes a state/province list to be populated.  Why not take advantage of the same mechanism
for everything?

Overall, I've been moving more towards the one-page application.  Form submissions are turned into
JSON-RPC requests, and the responses are used by the client to repopulate the UI.

The biggest missing piece is a really elegant template library.  I have yet to find something I 
truly like.

Anyway, this is just the first of several tools planned to make life better for me on the client
side.
