1// Reads files and sends content for display
window.allRows = '';
window.singleRow = '';
window.rowCells = '';
window.final = [];
window.data = '';

window.source =  new Set();
window.target  = new Set();
window.sourceSelected =  new Set();
window.targetSelected  = new Set();
window.dictionary = {};
window.content = [];
window.data2 = [];
window.set = new Set();

window.doc = 0;

var fileInput = document.getElementById('fileInput');
var checkboxes = document.getElementById('checkboxes');
fileInput.addEventListener('change', function(e) {
	var file = fileInput.files[0];
	var textType = /text.*/;
	if (file.type.match(textType)) {
		var reader = new FileReader();
		reader.onload = function(e) {
			window.data = reader.result;
		}
		reader.readAsText(file);	
	} 
	else {
		fileDisplayArea.innerText = "File not supported!"
	}
});


$(document).ready(function() {
  $.ajax({
        type: "GET",
        url: "sample1.txt",
        dataType: "text",
        success: function(tempData) {
        window.dictionary.Fund = new Set();
        window.dictionary.Organ = new Set();
        window.dictionary.Name = new Set();
        window.dictionary.Company = new Set();

        window.allRows = $.csv.toArrays(tempData);
        window.content = window.allRows;
          for (window.singleRow = 0; window.singleRow < window.allRows.length; window.singleRow++) {
              if(window.singleRow != 0){
                   window.dictionary[window.allRows[window.singleRow][1]].add(window.allRows[window.singleRow][0]);               
            }
          }
        }
    });
});

$("#referesh").on('click', function() {
   window.sourceSelected =  new Set();
   window.targetSelected  = new Set();
   window.final = [];
   window.data2 = [];
   checkboxes.innerHTML = '';
});

$("#setint").on('click', function(){
  window.doc = document.getElementById("doc").value;
});

$("#generate").on('click', function() {
  window.final = [];
	matchStrings();
});

$('input[name="type"]').on('change', function(){
  $('.magicContent').toggle(+this.value === 1 && this.checked);
}).change();

$('a.hlink').click(function(){
  DisplayFields(window.data , $(this).attr('id'));
});

$('input[type=checkbox][name=types]').change(function() {
  if(window.set.has(this.value))
      window.set.delete(this.value);
  else
    window.set.add(this.value);
      
});

$(document).ready(function(e) {
    var $input = $('#refresh');
    $input.val() == 'yes' ? location.reload(true) : $input.val('yes');
});  

$("#checkboxes").on('change', 'input:checkbox',function() {
            if($(this).is(":checked")){
              if(this.name == "source")
                window.sourceSelected.add(this.id);
              else if(this.name == "target")
                window.targetSelected.add(this.id);   
            } 
            else{
              if(this.name == "source")
                window.sourceSelected.delete(this.id);
              else if(this.name == "target")
                window.targetSelected.delete(this.id);  
            }
});

function matchStrings(){
  
  window.allRows = window.data.split(/\r?\n|\r/);
  var sourceTarget = [];

  for (window.singleRow = 0; window.singleRow < window.allRows.length; window.singleRow++) {
    window.allRows[window.singleRow] = window.allRows[window.singleRow].split(',');
    sourceTarget.push(window.allRows[window.singleRow]);
    if(window.singleRow != 0){
    window.source.add(window.allRows[window.singleRow][0]);
    window.target.add(window.allRows[window.singleRow][1]);
    }
  }
	var originalArray = window.allRows;
	for ( var i = 0; i < originalArray.length; i++) {
  		originalArray[i] = originalArray[i][0] + ',' +originalArray[i][1];
  	}
  
  var original = new Set(originalArray);
  var selected = new Set();
  var tempSourceTarget = new Set();
  var iterator = new Set();
  if(window.sourceSelected.size == 2 || window.targetSelected.size == 2 || window.targetSelected + window.sourceSelected == 2)
    window.doc = window.doc / 2 ;
  
  
  window.targetSelected.forEach(function(value){
      iterator.add(value);
  });
  window.sourceSelected.forEach(function(value){
      iterator.add(value);
  });
  
  if(window.doc > 0){
    for(var step = 0; step < parseInt(window.doc); step++){
      iterator.forEach(function(iteratorValue){
        window.sourceSelected.add(iteratorValue);
        var filter = sourceTarget.filter(function(value,index){ 
          if(iteratorValue == value[0])
            return value[1];
        });    
        var finalFilter = filter.map(function(value,index){ return value[1]});    
        finalFilter.forEach(function(value){  
          window.targetSelected.add(value);
          tempSourceTarget.add(value);
        });
      });
      iterator = tempSourceTarget;
      tempSourceTarget = new Set();
    }
  }

  var sourceTemp = new Set();
  var targetTemp = new Set();

  window.sourceSelected.forEach(function(value){
    if(!window.source.has(value))
      sourceTemp.add(value);
  });
  window.targetSelected.forEach(function(value){
    if(!window.target.has(value))
      targetTemp.add(value);
  });
  
  sourceTemp.forEach(function(value){
    window.sourceSelected.delete(value);
  });
  targetTemp.forEach(function(value){
    window.targetSelected.delete(value);
  });


	window.sourceSelected.forEach(function(value1) {
		window.targetSelected.forEach(function(value2) {
			selected.add(value1 + ',' +value2)
		});
	});

  var names = window.content.map(function(value,index){ return value[0]});
  var checker = new Set(window.data2.map(function(value,index){ return value['name']}));
  
  window.sourceSelected.forEach(function(value){ 
    if(!checker.has(value)){
      var index = names.indexOf(value);
      if(!window.set.has(window.content[index]['2'])){
      var dict = new Object;
      dict['name'] = window.content[index]['0'];
      dict['color'] = window.content[index]['2'];
      dict['radius'] = window.content[index]['3'];
      dict['url'] = window.content[index]['4'];
      window.data2.push(dict);
      checker.add(window.content[index]['0']);
      }
    }
  });
  window.targetSelected.forEach(function(value){
    if(!checker.has(value)){
      var index = names.indexOf(value);
      if(!window.set.has(window.content[index]['2'])){
      var dict = new Object;
      dict['name'] = window.content[index]['0'];
      dict['color'] = window.content[index]['2'];
      dict['radius'] = window.content[index]['3'];
      dict['url'] = window.content[index]['4'];
      window.data2.push(dict);
      checker.add(window.content[index]['0']);
      }

    }
  });

  var names2 = window.data2.map(function(value,index){ return value['name']});
  selected.forEach(function(value) {
  if (original.has(value) && names2.indexOf(value.split(',')[0]) >= 0 && names2.indexOf(value.split(',')[1]) >= 0){
			var dict = new Object;
			dict['source'] = names2.indexOf(value.split(',')[0]);
			dict['target'] = names2.indexOf(value.split(',')[1]);
			dict['group'] = '1';
			window.final.push(dict);}
	});

  var dict = new Object;
  dict['links'] = window.final;
  dict['nodes'] = window.data2;
  console.log(dict);
	localStorage.setItem("graphContent",JSON.stringify(dict));
}
 
function DisplayFields(data , character) {
  
  checkboxes.innerHTML = '';

  var sourceFund = new Set();
  var sourceOrgan = new Set();
  var sourcePerson = new Set();
  var sourceCompany = new Set();
  var targetFund = new Set();
  var targetOrgan = new Set();
  var targetPerson = new Set();
  var targetCompany = new Set();
  
  window.allRows = data.split(/\r?\n|\r/);
  for (window.singleRow = 0; window.singleRow < window.allRows.length; window.singleRow++) {
  	window.allRows[window.singleRow] = window.allRows[window.singleRow].split(',');
  	if(window.singleRow != 0){
  	window.source.add(window.allRows[window.singleRow][0]);
  	window.target.add(window.allRows[window.singleRow][1]);
  	}
  }
  if(window.source){
 	
    var heading =  document.createElement("h2");
 	  var headingContent = document.createTextNode("Source");
 	  heading.appendChild(headingContent);
 	  checkboxes.appendChild(heading);
 }

  window.source.forEach(function(value){
    if(window.dictionary.Fund.has(value))
      sourceFund.add(value);
     else if(window.dictionary.Organ.has(value))
      sourceOrgan.add(value);
     else if(window.dictionary.Company.has(value))
      sourceCompany(value);
     else if(window.dictionary.Name.has(value))
      sourcePerson.add(value);
  });	

  window.target.forEach(function(value){
      if(window.dictionary.Fund.has(value))
      targetFund.add(value);
     else if(window.dictionary.Organ.has(value))
      targetOrgan.add(value);
     else if(window.dictionary.Company.has(value))
      targetCompany.add(value);
     else if(window.dictionary.Name.has(value))
      targetPerson.add(value);

  });

    var heading =  document.createElement("h4");
    var headingContent = document.createTextNode("Fund");
    heading.appendChild(headingContent);
    checkboxes.appendChild(heading);

    sourceFund.forEach(function(value) {  
    if(value.startsWith(character)){
		  var description = document.createTextNode("\u00A0\u00A0\u00A0" + value + "\u00A0\u00A0\u00A0" );
		  checkboxes.appendChild(createNewCheckboxSource(value));
		  checkboxes.appendChild(description)
      
      if(window.sourceSelected.has(value)){
        document.getElementById(value).checked = true ;
      }
    }		
	});

    var heading =  document.createElement("h4");
    var headingContent = document.createTextNode("Organ");
    heading.appendChild(headingContent);
    checkboxes.appendChild(heading);

  sourceOrgan.forEach(function(value) {       
    if(value.startsWith(character)){
      var description = document.createTextNode("\u00A0\u00A0\u00A0" + value + "\u00A0\u00A0\u00A0" );
      checkboxes.appendChild(createNewCheckboxSource(value));
      checkboxes.appendChild(description)
      
      if(window.sourceSelected.has(value)){
        document.getElementById(value).checked = true ;
      }
    }   
  });


    var heading =  document.createElement("h4");
    var headingContent = document.createTextNode("Person");
    heading.appendChild(headingContent);
    checkboxes.appendChild(heading);
  
  sourcePerson.forEach(function(value) {   
    if(value.startsWith(character)){
      var description = document.createTextNode("\u00A0\u00A0\u00A0" + value + "\u00A0\u00A0\u00A0" );
      checkboxes.appendChild(createNewCheckboxSource(value));
      checkboxes.appendChild(description)
      
      if(window.sourceSelected.has(value)){
        document.getElementById(value).checked = true ;
      }
    }   
  });


    var heading =  document.createElement("h4");
    var headingContent = document.createTextNode("Company");
    heading.appendChild(headingContent);
    checkboxes.appendChild(heading);

  sourceCompany.forEach(function(value) {   
    if(value.startsWith(character)){
      var description = document.createTextNode("\u00A0\u00A0\u00A0" + value + "\u00A0\u00A0\u00A0" );
      checkboxes.appendChild(createNewCheckboxSource(value));
      checkboxes.appendChild(description)
      
      if(window.sourceSelected.has(value)){
        document.getElementById(value).checked = true ;
      }
    }   
  });

  if(window.target){
	   var heading =  document.createElement("h2");
 	   var headingContent = document.createTextNode("Target");
 	   heading.appendChild(headingContent);
 	   checkboxes.appendChild(heading);
   }

    var heading =  document.createElement("h4");
    var headingContent = document.createTextNode("Fund");
    heading.appendChild(headingContent);
    checkboxes.appendChild(heading);
  		
	 targetFund.forEach(function(value) {
    if(value.startsWith(character)){
		var description = document.createTextNode("\u00A0\u00A0\u00A0" + value + "\u00A0\u00A0\u00A0");
		checkboxes.appendChild(createNewCheckboxTarget(value));
		checkboxes.appendChild(description);
    if(window.targetSelected.has(value)){
      document.getElementById(value).checked = true ;
    }
  }
	});

   var heading =  document.createElement("h4");
    var headingContent = document.createTextNode("Organ");
    heading.appendChild(headingContent);
    checkboxes.appendChild(heading);


    targetOrgan.forEach(function(value) {
    if(value.startsWith(character)){
    var description = document.createTextNode("\u00A0\u00A0\u00A0" + value + "\u00A0\u00A0\u00A0");
    checkboxes.appendChild(createNewCheckboxTarget(value));
    checkboxes.appendChild(description);
    if(window.targetSelected.has(value)){
      document.getElementById(value).checked = true ;
    }
  }
  });

    var heading =  document.createElement("h4");
    var headingContent = document.createTextNode("Person");
    heading.appendChild(headingContent);
    checkboxes.appendChild(heading);


    targetPerson.forEach(function(value) {
    if(value.startsWith(character)){
    var description = document.createTextNode("\u00A0\u00A0\u00A0" + value + "\u00A0\u00A0\u00A0");
    checkboxes.appendChild(createNewCheckboxTarget(value));
    checkboxes.appendChild(description);
    if(window.targetSelected.has(value)){
      document.getElementById(value).checked = true ;
    }
  }
  });

    var heading =  document.createElement("h4");
    var headingContent = document.createTextNode("Company");
    heading.appendChild(headingContent);
    checkboxes.appendChild(heading);

    targetCompany.forEach(function(value) {
  
    if(value.startsWith(character)){
    var description = document.createTextNode("\u00A0\u00A0\u00A0" + value + "\u00A0\u00A0\u00A0");
    checkboxes.appendChild(createNewCheckboxTarget(value));
    checkboxes.appendChild(description);
    if(window.targetSelected.has(value)){
      document.getElementById(value).checked = true ;
    }
  }
  });

}

function createNewCheckboxSource(id){
    var checkbox = document.createElement('input'); 
    checkbox.type= 'checkbox';
    checkbox.name = 'source';
   	checkbox.id = id;
    return checkbox;
}

function createNewCheckboxTarget(id){
    var checkbox = document.createElement('input'); 
    checkbox.type= 'checkbox';
    checkbox.name = 'target';
   	checkbox.id = id;
    return checkbox;
}