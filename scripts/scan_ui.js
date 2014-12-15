//project variables, project event processing functions, and project general use functions 

//project variables
var results = [];
var items = "";
            

//Main function
function pageLoaded(){
    //load and open database
    this.db = new Dexie("Urban_City_Product_Database");
    db.version(1).stores({urbanProducts: 'code, name, cost, description'});
    db.open();

    active = document.activeElement;
    box = document.getElementById('inputBox'); box.style.backgroundColor = 'green';
    input = document.getElementById("inputBox");	
    output = document.getElementById("outputBox");
    
    output.value = "";
    
    document.addEventListener("click", function () {
        active = document.activeElement;
        if(box == active) {
            box.style.backgroundColor = 'green'; 
        }
        else {
            box.style.backgroundColor = 'red';
        }
    });
    input.addEventListener("keypress", function (e) {
        result = input.value;
        var key = e.which || e.keyCode;
        if (key == 13) { // 13 is enter
            a = findMatch(result);
            if(a != null) {
                results.push(a);
            }
            else {
                alert('Error: Product does not exist in database. Please use "Create Product" tool to remedy this.');
            }
            input.value = '';
            //displayClicked();
        }
    });
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
    rtn = '';
	db.urbanProducts.each(function(item){
        bar = item.code;
	    n = "\t" + item.name;
	    price = "\t" + item.cost;
	    desc = "\t" + item.description;
	    rtn = rtn + bar + n + price + desc + "\n";
		outputBox.value = rtn;
	});
}

function createProductClicked() {
    try{
    	//retrieve new wheel user input data into the string variable "line"
    	var barcode = prompt("Scan the barcode on the product you want to add.");
    	var inputName = prompt("What is the name of this product?");
    	var inputPrice = prompt("What is the price of this product?");
    	var inputDescription = prompt("Please write a short description for this item.");
    	db.urbanProducts.add({code: barcode, name: inputName, cost: inputPrice, description: inputDescription});
    	//item = new Product(barcode, name, price, desc);
        //addProduct(item);
        displayProductClicked();
    }
    catch (errMsg) { alert (errMsg); }
}

function modProductClicked() {
    try{
      	var barcode = prompt("Scan the barcode on the product you want to modify.");
      	
        db.urbanProducts
        .where("code")
        .equals(barcode)
        .modify(function(item){
    	    item.name = prompt("What is the name of this product?",  item.name);
    	    item.cost = prompt("What is the price of this product?", item.cost);
    	    item.description = prompt("Please write a short description for this item.", item.description);
    	});
    }
    catch (errMsg) { alert (errMsg); }
}



