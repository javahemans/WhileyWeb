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

    function parseBlockComment(stream,state) {
	var lookahead;
	state.blockComment = true;
	while (lookahead = stream.next()) {
	    if(lookahead == "*" && stream.eat('/')) {
		state.blockComment = false;
	     	return;
	    }
	}
    }

    /**
     * Identifiers are used for the names of methods, functions,
     * types, constants, variables, fields, etc
     */
    var identifiers = /^[a-zA-Z][\w]*/;   

    /**
     * Numbers are either integers or decimals (for now).
     */
    var numbers = /^\d+(.\d+)?/;

    /**
     * Predefined types.
     */
    var types = regexp([
	"void",
	"any",	
	"bool",
	"byte",
	"char",
	"int",
	"real",
	"string"
    ]);

    /**
     * The list of operators used in Whiley
     */
    var operators = /^(==|!=?|>=?|<=?|&&?|\|\|?|[+|-|*|%|\/])/;

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
	startState: function() {
	    return { 
		blockComment: false 
	    };
	},

	token: function(stream,state) {
	    if(state.blockComment || stream.match(/^\/\*/)) {
		parseBlockComment(stream,state);
		return "comment";
	    } else if(stream.match(/^\/\//)) {
	    	stream.skipToEnd();
	    	return "comment";
	    } else if(stream.match(operators)) {
		return "operator";
	    } else if(stream.match(keywords)) {
		return "keyword";
	    } else if(stream.match(numbers)) {
		return "number";
	    } else if(stream.match(types)) {
		return "type";
	    } else if(stream.match(identifiers)) {
		return "variable";
	    } else {
		stream.next();
		return null;
	    }
	}
    };  
});
