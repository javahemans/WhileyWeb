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
 * Add a new message to the message list above the console.
 */
function addMessage(message_class, message, callback) {
    var message = $("<div class=\"" + message_class + "\">" + message + "</div>");
    $("#messages").append(message);
    message.fadeIn(500).delay(2000).fadeOut(500, function() {
        message.remove();
        if (callback !== undefined) {
            callback();
        }
    });
}

/**
 * Remove all messages from the message list above the console.
 */
function clearMessages() {
    $("#messages").children().remove();
}

/**
 * Compile a given snippet of Whiley code.
 */
function compile() {
    var console = document.getElementById("console");
    var verify = document.getElementById("verification");
    var request = { code: editor.getValue(), verify: verify.checked };
    $.post(root_url + "/compile",request, function(response) {
        clearMessages();
        clearAllMarkers();
        console.value = "";
        $("#spinner").css("visibility", "hidden");
        var response = $.parseJSON(response);
        if(response["result"] == "success") {
            addMessage("success", "Compiled successfully.");
        } else if(response["result"] == "errors") {
            var errors = response["errors"];
            for(var i=0;i!=errors.length;++i) {
               markError(errors[i]);
            }
            addMessage("error", "Compilation failed: " + errors.length + " error" + (errors.length > 1 ? "s." : "."));
        } else if(response["result"] == "error") {
            addMessage("error", response["error"]);
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
        clearMessages();
        clearAllMarkers();
        console.value = "";
        $("#spinner").css("visibility", "hidden");
        var response = $.parseJSON(response);
        if(response["result"] == "success") {
            addMessage("success", "Compiled successfully. Running...");
            setTimeout(function() {console.value = response["output"];}, 500);
        } else if(response["result"] == "errors") {
            var errors = response["errors"];
            for(var i=0;i!=errors.length;++i) {
               markError(errors[i]);
            }
            addMessage("error", "Compilation failed: " + errors.length + " error" + (errors.length > 1 ? "s." : "."));
        } else if(response["result"] == "error") {
            addMessage("error", response["error"]);
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
        clearMessages();
        var jr = $.parseJSON(response);
        $("#spinner").css("visibility", "hidden");
        addMessage("success", "Saved program as " + jr.id + ".", function() {
            window.location.replace("?id=" + jr.id);
        });
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
        var error_message = $("<div class=\"error\">" + error + "</div>");
        $("#content").prepend(error_message);
        error_message.show().delay(5000).fadeOut(500, function() {
            // If the user should be redirected to the main page (due to invalid ID for example), do so.
            if(redirect == "YES") {
                window.location.replace(root_url + "/");
            }
        });
    }
});
