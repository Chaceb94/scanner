//project variables, project event processing functions, and project general use functions 

//project variables
         
//this.products = [];
//Main function runs as soon as body loads
function pageLoaded(){
    //load and open database    
    this.db = new Dexie("Urban_City_Product_Database");
    db.version(1).stores({urbanProducts: 'code, nombre, model, price, cost, qty, description'});
    db.open();
    radioClicked();

    active = document.activeElement; //find the element active on page
    input = document.getElementById("inputBox"); //assign scanner textbox as input
    output = document.getElementById("outputBox"); //assign output textbox as such
    nameVal = document.getElementById("nameBox");
    model = document.getElementById("numBox");
    price = document.getElementById("priceBox");
    cost = document.getElementById("costBox");
    stock = document.getElementById("stockBox");
    about = document.getElementById("aboutBox");
    barcode = document.getElementById("codeBox");
    
    output.value = ""; //initiate output box
    
    //set event listener to check for keypress 'ENTER' inside scanbox
    input.addEventListener("keypress", function (e) {
        var key = e.which || e.keyCode;
        if (key == 13) { // 13 is enter
            scanVal = input.value; //get scanned value
            input.value = ''; //reset scanbox for new scan
            if(trans.checked) {
                db.transaction('r', db.urbanProducts, function() {
	                db.urbanProducts.where('code').equals(scanVal).each (function(item){
                        rtn = output.value;
                        bar = item.code;
	                    n = "\t" + item.nombre;
	                    price = "\t" + item.price;
	                    cost = "\t" + item.cost;
	                    desc = "\t" + item.description;
	                    rtn = rtn + bar + n + price + desc + "\n";
	                    outputBox.value = rtn;
	                });
	            }).catch(function(err) {
                    console.error(err); //throw error if transaction fails
                });
            }
            if(edit.checked) {
                db.transaction('rw', db.urbanProducts, function() {
	                db.urbanProducts.where('code').equals(scanVal).each (function(item){
	                
	                    barcode.value = item.code;
	                    nameVal.value = item.nombre;
	                    price.value = item.price;
	                    cost.value = item.cost;
	                    model.value = item.model;
	                    stock.value = item.qty;
	                    about.value = item.description;
	                    
	                });
	            }).catch(function(err) {
                    console.error(err); //throw error if transaction fails
                });
            }
            
            
            //if scanVal already has match in DB then add it to transaction
            //isMatch = findMatch(scanVal)
            
            //input.value = ''; //reset scanbox for new scan
            //displayClicked(); //refresh output to show current transaction or new entry in DB
        }
    });
}

function clearClicked() {
    output.value = '';
}



function radioClicked(){
    trans = document.getElementById("trans");
    edit = document.getElementById("edit");
	if(trans.checked){
	    document.getElementById("trans-mode").style.display	= 'block';
	    document.getElementById("edit-mode").style.display	= 'none';
	    document.getElementById("displayProductButton").style.display = 'none';
	}
	else if(edit.checked){
		document.getElementById("trans-mode").style.display	= 'block';
	    document.getElementById("edit-mode").style.display	= 'block';
	    document.getElementById("displayProductButton").style.display = 'block';
	}
}

//Read it dummy. What do you think it does?
function displayClicked() {
    output.value = '';
    i = 0;
    items = null;
    while(i < results.length) {
        items = items + results[i] + "\n";
        i++;
    }
    output.value = "items in list:\n\n" + items;
}

function displayProductClicked() {
    output.value = '';
    result = "All of urban City's Products\n\nBarcode:\tModel Number:\tName:\tPrice:\tCost:\tStock:\tDescription:\n\n";
	db.urbanProducts.each(function(item){
        var bar = item.code;
        var model = "\t" + item.model;
	    var n = "\t" + item.nombre;
	    var price = "\t" + item.price;
	    var cost = "\t" + item.cost;
	    var stock = "\t" + item.qty;
	    var desc = "\t" + item.description;
	    result = result + bar + model + n + price + cost + stock + desc + "\n";
		outputBox.value = result;
	});
}


//pass scanned code to function which prompts user for info about product
//and then adds a DB entry for the product
function createProduct(barcode) {
    //db.transaction('rw', db.urbanProducts, function() {
    try {
    	//var barcode = prompt("Scan the barcode on the product you want to add.");
    	var inputName = prompt("What is the name of this product?");
    	var inputPrice = prompt("What is the price of this product?");
    	var inputDescription = prompt("Please write a short description for this item.");
    	db.urbanProducts.add({
    	    code: barcode,
    	    nombre: inputName,
    	    cost: inputPrice,
    	    description: inputDescription
    	}).then(function() {
    	    //item = new Product(barcode, name, price, desc);
            //addProduct(item);
            displayProductClicked();
        });
    }
    catch(err) {
        console.error(err); //throw error if transaction fails
    }
}



function createProductClicked() {
    db.transaction('rw', db.urbanProducts, function() {
    	//retrieve new wheel user input data into the string variable "line"
    	var barcode = prompt("Scan the barcode on the product you want to add.");
    	var inputName = prompt("What is the name of this product?");
    	var inputPrice = prompt("What is the price of this product?");
    	var inputDescription = prompt("Please write a short description for this item.");
    	db.urbanProducts.add({
    	    code: barcode,
    	    nombre: inputName,
    	    cost: inputPrice,
    	    description: inputDescription
    	});
    	//item = new Product(barcode, name, price, desc);
        //addProduct(item);
        displayProductClicked();
    }).catch(function(err) {
        console.error(err); //throw error if transaction fails
    });
}

function modProductClicked() {
    db.transaction('rw', db.urbanProducts, function() {
      	var barcode = prompt("Scan the barcode on the product you want to modify.");
      	
        db.urbanProducts
        .where("code")
        .equals(barcode)
        .modify(function(item){
    	    item.nombre = prompt("What is the name of this product?",  item.nombre);
    	    item.cost = prompt("What is the price of this product?", item.cost);
    	    item.description = prompt("Please write a short description for this item.", item.description);
    	});
    }).catch(function(err) {
        console.error(err); //throw error if transaction fails
    });
}

function createFromForm() {
    db.transaction('rw', db.urbanProducts, function() {
        scan = barcode.value;
        db.urbanProducts
        .where("code")
        .equals(scan)
        .modify(function(item){
    	    item.nombre = nameVal.value;
            item.price = price.value;
            item.cost = cost.value;
            item.model = model.value;
            item.qty = stock.value;
            item.description = about.value;
        }).then(function() {
            displayProductClicked();
        });
    }).catch(function(err) {
        console.error(err); //throw error if transaction fails
    });
}

