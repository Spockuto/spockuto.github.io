// Reads files and sends content for display
window.allRows = '';
window.singleRow = '';
window.rowCells = '';
window.final = [];
window.data = '';

window.pension =  new Set();
window.person  = new Set();
window.pensionSelected =  new Set();
window.personSelected  = new Set();

var fileInput = document.getElementById('fileInput');
var checkboxes = document.getElementById('checkboxes');
fileInput.addEventListener('change', function(e) {
	var file = fileInput.files[0];
	var textType = /text.*/;
	if (file.type.match(textType)) {
		var reader = new FileReader();
		reader.onload = function(e) {
			DisplayFields(reader.result)
			window.data = reader.result;
		}
		reader.readAsText(file);	
	} 
	else {
		fileDisplayArea.innerText = "File not supported!"
	}
});

$("#referesh").on('click', function() {
   checkboxes.innerHTML = '';
   DisplayFields(window.data); 
});

$("#generate").on('click', function() {
	matchStrings();
});

$(document).ready(function(e) {
    var $input = $('#refresh');

    $input.val() == 'yes' ? location.reload(true) : $input.val('yes');
});

function matchStrings(){
	var originalArray = window.allRows;
	for ( var i = 0; i < originalArray.length; i++) {
  		originalArray[i] = originalArray[i][0] + ',' +originalArray[i][1];
  	}
  	var original = new Set(originalArray);

  	var selected = new Set();
	window.pensionSelected.forEach(function(value1) {
		window.personSelected.forEach(function(value2) {
			selected.add(value1 + ',' +value2)
		});
	});

	selected.forEach(function(value) {
		if (original.has(value)){
			var dict = new Object;
			dict['source'] = value.split(',')[0];
			dict['target'] = value.split(',')[1];
			dict['group'] = '1';
			window.final.push(dict);}
	});
	localStorage.setItem("graphContent",JSON.stringify(window.final));
}

function recordSelection(){
	$('input:checkbox').change(function () {
            if($(this).is(":checked")){
            	if(this.name == "pension")
            		window.pensionSelected.add(this.id);
            	else if(this.name == "person")
            		window.personSelected.add(this.id);  
            	else if (this.id == "selectAllPension" )  {
            		window.pension.forEach(function(value) {
            			window.pensionSelected.add(value);
            		});       

            	}
            	else if (this.id == "selectAllPerson" )  {
            		window.person.forEach(function(value) {
            			window.personSelected.add(value);
            		});       
            	}
            } 

            else{
            	
            	if(this.name == "pension")
            		window.pensionSelected.delete(this.id);
            	else if(this.name == "person")
            		window.personSelected.delete(this.id);  

            	else if (this.id == "selectAllPension" )  {
            		window.pension.forEach(function(value) {
            			window.pensionSelected.delete(value);
            		}); 
            		checkbox = document.getElementsByName('pension');
  					for(var i=0, n=checkbox.length;i<n;i++) {
    					checkbox[i].checked = false; 
    				}
            	}
            	else if (this.id == "selectAllPerson" )  {
            		window.person.forEach(function(value) {
            			window.personSelected.delete(value);
            		});  
            		checkbox = document.getElementsByName('person');
  					for(var i=0, n=checkbox.length;i<n;i++) {
    					checkbox[i].checked = false;
					}     
            	}   
            }
	 });
}

function DisplayFields(data) {
  window.allRows = data.split(/\r?\n|\r/);
  for (window.singleRow = 0; window.singleRow < window.allRows.length; window.singleRow++) {
  	window.allRows[window.singleRow] = window.allRows[window.singleRow].split(',');
  	if(window.singleRow != 0){
  	window.pension.add(window.allRows[window.singleRow][0]);
  	window.person.add(window.allRows[window.singleRow][1]);
  	}
  }
  if(window.pension){
 	var heading =  document.createElement("h3");
 	var headingContent = document.createTextNode("Pension");
 	heading.appendChild(headingContent);
 	checkboxes.appendChild(heading);}

	window.pension.forEach(function(value) {
		var description = document.createTextNode("\u00A0\u00A0\u00A0" + value + "\u00A0\u00A0\u00A0" );
		checkboxes.appendChild(createNewCheckboxPension(value));
		checkboxes.appendChild(description)
   		
	});
  if(window.person){
	var heading =  document.createElement("h3");
 	var headingContent = document.createTextNode("Person");
 	heading.appendChild(headingContent);
 	checkboxes.appendChild(heading);}
  		
	window.person.forEach(function(value) {
		var description = document.createTextNode("\u00A0\u00A0\u00A0" + value + "\u00A0\u00A0\u00A0");
		checkboxes.appendChild(createNewCheckboxPerson(value));
		checkboxes.appendChild(description);
	});
	recordSelection();
}

function createNewCheckboxPension(id){
    var checkbox = document.createElement('input'); 
    checkbox.type= 'checkbox';
    checkbox.name = 'pension';
   	checkbox.id = id;
    return checkbox;
}

function createNewCheckboxPerson(id){
    var checkbox = document.createElement('input'); 
    checkbox.type= 'checkbox';
    checkbox.name = 'person';
   	checkbox.id = id;
    return checkbox;
}

  
