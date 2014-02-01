// Global reference to the code editor.
var editor;

/**
 * Clear all markers (including those in the gutter) from the editor.
 * This is to prevent markers from a previous compilation from hanging
 * around.
 */
function clearAllMarkers() {
    var markers = editor.getAllMarks();
    for(var i=0;i!=markers.length;++i) {
        markers[i].clear();
    }
    editor.clearGutter("errorGutter");
}

/**
 * Add an appropriate marker for a given JSON error object, as
 * returned from the server.
 */
function markError(error) {
    var start = {line: error.line-1, ch: error.start};
    var end = {line: error.line-1, ch: error.end+1};
    editor.markText(start,end,{className: "errorMarker",title:error.text});
    var marker = document.createElement("img");
    marker.src = "images/cross.png";
    marker.width = 10;
    editor.setGutterMarker(error.line-1,"errorGutter",marker);
}

/**
 * Compile a given snippet of Whiley code.
 */
function compile() {
    var console = document.getElementById("console");
    var verify = document.getElementById("verification");
    var request = { code: editor.getValue(), verify: verify.checked };
    console.value = "";
    $.post(root_url + "/compile",request, function(response) {
        clearAllMarkers();
        $("#spinner").css("visibility", "hidden");
        var errors = $.parseJSON(response);
        if(typeof errors == 'string') {
            console.value = errors;
        } else if(errors.length > 0) {
            for(var i=0;i!=errors.length;++i) {
               markError(errors[i]);         
            }
            console.value = errors.length + " error(s).";
        } else {
            console.value = "Compiled OK.";
        }
    });
    $("#spinner").css("visibility", "visible");
}

/**
 * Compile and run a given snippet of Whiley code.
 */
function run() {
    var console = document.getElementById("console");
    var request = { code: editor.getValue() };
    $.post(root_url + "/run",request, function(response) {
        clearAllMarkers();
        var jr = $.parseJSON(response);
        $("#spinner").css("visibility", "hidden");
        for(var i=0;i!=jr.errors.length;++i) {
            markError(jr.errors[i]);         
        }
        if(jr.errors.length == 0) {
            console.value = jr.output;
        } else {
            console.value = jr.errors.length + " error(s).";
        }
    });
    $("#spinner").css("visibility", "visible");
}

/**
 * Save a given snippet of Whiley code.
 */
function save() {
    var console = document.getElementById("console");
    var request = { code: editor.getValue() };
    $.post(root_url + "/save" ,request, function(response) {
        var jr = $.parseJSON(response);
        $("#spinner").css("visibility", "hidden");
        window.location.replace("?id=" + jr.id);     
    });
    $("#spinner").css("visibility", "visible");
}

// Run this code when the page has loaded.
$(document).ready(function() {
    // Enable the editor with Whiley syntax.
    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        indentUnit: 4,
        lineNumbers: true,
        gutters: ["CodeMirror-linenumbers","errorGutter"],
        matchBrackets: true,
        mode: "whiley"    
    });

    // If there is an error, display the error message for 5 seconds.
    if(error != "") {
        $("#error").show().delay(5000).fadeOut(500, function() {
            // If the user should be redirected to the main page (due to invalid ID for example), do so.
            if(redirect == "YES") {
                window.location.replace(root_url + "/");
            }
        });
    }
});
