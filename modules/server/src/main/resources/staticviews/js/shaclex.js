function getHost() {
 var port = window.location.port;
 return window.location.protocol + "//" + window.location.hostname + (port? ":" + port: "") ;
}

// "http://shaclex.herokuapp.com"
// var urlShaclex = "http://localhost:8080";
var urlShaclex = getHost();

console.log("urlShaclex: " + urlShaclex);

var codeMirrorData ;
var codeMirrorSchema ;


function changeMode(element,syntax) {
 var mode = "turtle";
 switch (syntax.toUpperCase()) {
  case "TURTLE": mode = "turtle" ;
                 break ;
  case "N-TRIPLES": mode = "turtle" ;
                 break ;
  case "RDF/XML": mode = "xml" ;
                 break ;
  case "TRIX": mode = "xml" ;
                   break ;
    case "SHEXJ" : mode = "javascript" ;
                 break ;
  case "RDF/JSON" : mode = "javascript" ;
                 break ;
  case "JSON-LD" : mode = "javascript" ;
                 break ;
  case "SHEXC": mode = "shex" ;
                break ;
 }
 element.setOption("mode",mode);
}

function changeTheme(theme) {
 codeMirrorData.setOption("theme",theme);
 codeMirrorSchema.setOption("theme",theme);
}

function changeSchemaEmbedded(value) {
 console.log("Changing schemaEmbedded: " + value);
 if (value==="schemaEmbedded") {
  $("#schemaDiv").hide();
 } else {
  $("#schemaDiv").show();
 }
}

function changeTriggerMode(value) {
 if (value) {
 console.log("Changing triggermode: " + value);
 switch (value.toUpperCase()) {
  case "TARGETDECLS":
    $("#nodeDiv").hide();
    $("#shapeDiv").hide();
    console.log("Hiding all: " + value);
    break;
  case "NODESHAPE":
    $("#nodeDiv").show();
    $("#shapeDiv").show();
    console.log("Showing all: " + value);
    break;
  case "NODESTART":
    $("#nodeDiv").show();
    $("#shapeDiv").hide();
    console.log("Showing node only: " + value);
    break;
  }
 }
}

function showResult(result) {
  console.log("Result: " + result);
  var validText;
  if (result.isValid) {
   $("#resultDiv").removeClass("notValid").addClass("valid");
   validText = "Valid";
  } else {
   $("#resultDiv").removeClass("valid").addClass("notValid");
   validText = "Not valid";
  }
  $("#resultDiv").empty();
  $("#resultDiv").append($("<h2>").text(validText));
  var pre = $("<pre/>").html(JSON.stringify(result,undefined,2));
  var details = $("<details/>").append(pre);
  $("#resultDiv").append(details);
}

function getDataFormat(element) {
 var format = element.options[element.selectedIndex].value;
 window.alert("Data format of " + element + " format: " + format);
}

$(document).ready(function(){

console.log("Main Url = " + urlShaclex);

var schemaEmbeddedValue = $("#toggleSchemaEmbedded").val();
console.log("Schema embedded = " + schemaEmbeddedValue);
changeSchemaEmbedded(schemaEmbeddedValue);

var triggerModeValue = $("#triggerMode").val();
console.log("Trigger mode = " + triggerModeValue);
changeTriggerMode(triggerModeValue);

var rdfData = document.getElementById("rdfData");
if (rdfData) {
 codeMirrorData = CodeMirror.fromTextArea(rdfData, {
  lineNumbers: true,
  mode: "turtle",
  viewportMargin: Infinity,
  matchBrackets: true,
 });
// codeMirrorData.setSize("48%",null);
}
var schema = document.getElementById("schema")
if (schema) {
 codeMirrorSchema = CodeMirror.fromTextArea(schema, {
   lineNumbers: true,
   mode: "shex",
   viewportMargin: Infinity,
   matchBrackets: true
 });
// codeMirrorSchema.setSize("48%",null);
}

// Don't allow newline before change in CodeMirror
function noNewLine(instance,change) {
    var newtext = change.text.join("").replace(/\n/g, ""); // remove ALL \n !
    change.update(change.from, change.to, [newtext]);
    return true;
}

var nodeId = document.getElementById("node");
if (nodeId) {
var codeMirrorNode = CodeMirror.fromTextArea(nodeId, {
 lineNumbers: false,
 mode: "turtle",
 scrollbarStyle: "null",
 height: 1,
 });
 codeMirrorNode.on("beforeChange", noNewLine);
 codeMirrorNode.setSize(null,"1.5em");
}

var shapeId = document.getElementById("shape");
if (shapeId) {
var codeMirrorShape = CodeMirror.fromTextArea(shapeId, {
 lineNumbers: false,
 mode: "turtle",
 scrollbarStyle: "null",
 height: 1,
});
codeMirrorShape.on("beforeChange", noNewLine);
codeMirrorShape.setSize(null,"1.5em");
}


 console.log("Document ready...");
  $("#validateButton").click(function(e){
    e.preventDefault();
    console.log("click on validating...");
    var data = codeMirrorData.getValue();
    var schema = codeMirrorSchema.getValue();
    var dataFormat = $("#dataFormat").find(":selected").text();
    var schemaFormat = $("#schemaFormat").find(":selected").text();
    var node = codeMirrorNode.getValue();
    var shape = codeMirrorShape.getValue();
    var schemaEngine = $("#schemaEngine").find(":selected").text();
    var triggerMode = $("#triggerMode").find(":selected").text();
     console.log("Trigger mode in AJAX query:" + triggerMode);
     var location = "/validate?" +
                    "data=" + encodeURIComponent(data) +
                    "&dataFormat=" + encodeURIComponent(dataFormat) +
                    "&schema=" + encodeURIComponent(schema) +
                    "&schemaFormat=" + encodeURIComponent(schemaFormat) +
                    "&schemaEngine=" + encodeURIComponent(schemaEngine) +
                    "&triggerMode=" + encodeURIComponent(triggerMode) +
                    "&node=" + encodeURIComponent(node) +
                    "&shape=" + encodeURIComponent(shape);

     $.ajax({ url: urlShaclex + "/api/validate",
      data: {
        data: data,
        schema: schema,
        dataFormat: dataFormat,
        schemaFormat: schemaFormat,
        node: node,
        shape: shape,
        schemaEngine: schemaEngine,
        triggerMode: triggerMode
     },
    type: "GET",
    dataType : "json"
  })
  .done(function(result) {
     console.log("Done!: " + JSON.stringify(result));
     showResult(result);
     history.pushState({},"validate",location);
  })
  .fail(function( xhr, status, errorThrown ) {
    $("#resultDiv").html("<h2>" + errorThrown + "</h2><pre>" + xhr.responseText + "</pre><p>" + status + "</p>" );
    console.log( "Error: " + errorThrown );
    console.log( "Status: " + status );
    console.dir( xhr );
  })
  });

  $("#permalink").click(function(e){
    e.preventDefault();
    console.log("generating permalink");
    var data = codeMirrorData.getValue();
    var schema = codeMirrorSchema.getValue();
    var dataFormat = $("#dataFormat").find(":selected").text();
    var schemaFormat = $("#schemaFormat").find(":selected").text();
    var node = codeMirrorNode.getValue();
    var shape = codeMirrorShape.getValue();
    var schemaEngine = $("#schemaEngine").find(":selected").text();
    var triggerMode = $("#triggerMode").find(":selected").text();
    console.log("Trigger mode in permalink generation:" + triggerMode);
    var location = "/validate?" +
                    "data=" + encodeURIComponent(data) +
                    "&dataFormat=" + encodeURIComponent(dataFormat) +
                    "&schema=" + encodeURIComponent(schema) +
                    "&schemaFormat=" + encodeURIComponent(schemaFormat) +
                    "&schemaEngine=" + encodeURIComponent(schemaEngine) +
                    "&triggerMode=" + encodeURIComponent(triggerMode) +
                    "&node=" + encodeURIComponent(node) +
                    "&shape=" + encodeURIComponent(shape);
    console.log("Permalink: " + location);
    window.location = location;
  });

 });
