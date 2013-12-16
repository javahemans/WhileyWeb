/**
 * Defines a Whiley Mode for CodeMirror.
 *
 * David J. Pearce, 2013
 */
CodeMirror.defineMode("whiley", function() {
    /**
     * Create a regepx which matches any of a sequence of words.
     */
    function regexp(words) {
	return new RegExp("^((" + words.join(")|(") + "))\\b");	
    }

   // var ops = /^(+|-)/;
    var identifiers = /^[A-Za-z_][A-Za-z0-9_]*/;   
 
    /**
     * The list of keywords in Whiley
     */ 
    var keywords = regexp([
	"all",
	"assume",
	"assert",
	"as",
	"break",
	"catch",
	"case",
	"debug",
	"default",
	"define",
	"do",
	"else",
	"ensures",
	"export",
	"extern",
	"false",
	"for",
	"from",
	"if",
	"import",
	"in",
	"is",
	"native",
	"new",
	"no",
	"null",
	"package",
	"public",
	"protected",
	"private",
	"requires",
	"return",
	"switch",
	"skip",
	"some",
	"str",
	"this",
	"throw",
	"throws",
	"true",
	"try",
	"where",
	"while"
    ]);
    
    /**
     * The Whiley mode is an object with a single token function which
     * tokenises a stream
     */
    return {
	token: function(stream) {
	    if(stream.match(/^\/\//)) {
		stream.skipToEnd();
		return "comment";
	    } else if(stream.match(keywords)) {
		return "keyword";
	    } else if(stream.match(identifiers)) {
		return "variable";
	    } else {
		stream.next();
		return null;
	    }
	}
    };  
});
