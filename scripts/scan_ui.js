//project variables

             
//Main function runs as soon as body loads
function pageLoaded(){
    input = document.getElementById("inputBox"); //assign scanner textbox as input
    output = document.getElementById("outputBox"); //assign output textbox as such
    nameVal = document.getElementById("nameBox");
    model = document.getElementById("numBox");
    price = document.getElementById("priceBox");
    cost = document.getElementById("costBox");
    stock = document.getElementById("stockBox");
    about = document.getElementById("aboutBox");
    barcode = document.getElementById("codeBox");
    total = 0;
    transList = [];

    //load and open database    
    this.db = new Dexie("Urban_City_Product_Database");
    db.version(1).stores({urbanProducts: 'code, nombre, model, price, cost, qty, notes'});
    db.open();
    radioClicked();

    output.value = ""; //initiate output box
    
    //set event listener to check for keypress 'ENTER' inside scanbox
    input.addEventListener("keypress", function (e) {
        var key = e.which || e.keyCode;
        if (key == 13) { // 13 is enter
            scanVal = input.value; //get scanned value
            input.value = ''; //reset scanbox for new scan
            if(trans.checked) {
                db.transaction('r', db.urbanProducts, function() {
	                db.urbanProducts.where('code').equals(scanVal).each(function(item){
                        total = total + Number(item.price);   
	                    var product = {
	                        code: item.code,
	                        name: item.nombre,
	                        price: item.price,
	                        qty: 1
	                    };
	                    i = 0;
	                    isMatch = false;
	                    while(i < transList.length) {
	                        var t = transList[i];
	                        if(product.code == t.code) {
	                            t.qty++;
	                            isMatch = true;
	                        }
	                        i++;
	                    }
	                    if(!isMatch) {
	                        transList.push(product);
	                    }
	                }).then(function() {
	                    i = 0;
	                    result = 'Barcode\t\t|Name\t\t|Each\t\t|Qty\t|Sub-Total\n' + 
	                    '\t\t|\t\t|\t\t|\t|\n';
	                    while(i < transList.length) {
	                        t = transList[i];
	                        
	                        if(t.code.length > 6) { result = result + t.code + '\t|' }
	                        else { result = result + t.code + '\t\t|' }
	                        
	                        if(t.name.length > 6) {result = result + t.name + '\t|' }
	                        else { result = result + t.name + '\t\t|' }
	                        
	                        if(t.price.length > 6) {result = result + t.price + '\t|' }
	                        else { result = result + t.price + '\t\t|' }
	                        
	                        
	                        
	                        result = result + t.qty + '\t|';
	                        
	                        result = result + (t.price*t.qty).toFixed(2) + '\n';
	                        i++;
	                    }
	                    
	                    output.value = result + "\nTotal = " + total.toFixed(2);
	                });
	            }).catch(function(err) {
                    console.error(err); //throw error if transaction fails
                });
            }
            if(edit.checked) {
                barcode.value = '';
                db.transaction('rw', db.urbanProducts, function() {
	                db.urbanProducts.where('code').equals(scanVal).each (function(item){
	                    barcode.value = item.code;
	                    nameVal.value = item.nombre;
	                    price.value = item.price;
	                    cost.value = item.cost;
	                    model.value = item.model;
	                    stock.value = item.qty;
	                    about.value = item.notes;
	                    document.getElementById('submitChanges').style.display = 'block';
	                    document.getElementById('deleteProduct').style.display = 'block';
	                    document.getElementById('submitNew').style.display = 'none';
	                }).then(function() {
	                    if(barcode.value == ''){
	                        barcode.value = scanVal;
	                        
	                        nameVal.value = '';
	                        price.value = '';
	                        cost.value = '';
	                        model.value = '';
	                        stock.value = '';
	                        about.value = '';
	                        
	                        nameVal.placeholder = 'name';
	                        price.placeholder = 'price';
	                        cost.placeholder = 'cost';
	                        model.placeholder = 'model';
	                        stock.placeholder = 'stock';
	                        about.placeholder = 'notes';
	                        document.getElementById('submitChanges').style.display = 'none';
	                        document.getElementById('submitNew').style.display = 'block';
	                    }
	                });
	            }).catch(function(err) {
                    console.error(err); //throw error if transaction fails
                });
            }
        }
    });
}

function cancelClicked() {
    output.value = '';
    total = 0;
    transList = [];
}



function radioClicked(){
    trans = document.getElementById("trans");
    edit = document.getElementById("edit");
    document.getElementById('submitChanges').style.display = 'none';
    document.getElementById('deleteProduct').style.display = 'none';
	document.getElementById('submitNew').style.display = 'none';               
	if(trans.checked){
	    document.getElementById("trans-mode").style.display	= 'block';
	    document.getElementById("edit-mode").style.display	= 'none';
	    document.getElementById("displayProductButton").style.display = 'none';
	    output.value = '';
	}
	else if(edit.checked){
		document.getElementById("trans-mode").style.display	= 'block';
	    document.getElementById("edit-mode").style.display	= 'block';
	    document.getElementById("displayProductButton").style.display = 'block';
	    displayProductClicked();
	}
}

function completeClicked() {

    i = 0;
    while(i < transList.length) {
        t = transList[i];
        
        db.urbanProducts.where('code').equals(t.code).modify(function(item){
            item.qty = item.qty - t.qty;
        }).then(function () {
            output.value = "Transaction Completed";
            transList = [];
            total = 0;
        }).catch(function(err) {
            console.error(err); //throw error if transaction fails
        });
        
        i++;
    }

}

function displayProductClicked() {
    output.value = '';
    result = "All of urban City's Products\n\nBarcode\t\t|Model Number\t|Name\t\t|Price\t\t|Cost\t\t|Stock\t|Notes\n\n";
	db.urbanProducts.each(function(item){
        if(item.code.length > 6) { var bar = item.code + "\t|"}
        else { var bar = item.code + "\t\t|" }
        
        if(item.model.length > 6) { var model = item.model + "\t|"}
        else { var model = item.model + "\t\t|" }
        
        if(item.nombre.length > 6) { var n = item.nombre + "\t|"}
        else { var n = item.nombre + "\t\t|" }
       
        if(item.price.length > 6) { var price = item.price + "\t|"}
        else { var price = item.price + "\t\t|" }
       
        if(item.cost.length > 6) { var cost = item.cost + "\t|"}
        else { var cost = item.cost + "\t\t|" }
        
        var stock = item.qty + "\t|";
	    var desc = item.notes;
	    result = result + bar + model + n + price + cost + stock + desc + "\n";
		output.value = result;
	}).catch(function(err) {
        console.error(err); //throw error if transaction fails
    });
}

function modifyFromForm() {
    db.transaction('rw', db.urbanProducts, function() {
        scan = barcode.value;
        db.urbanProducts.where("code").equals(scan).modify(function(item){
            item.code = scan
    	    item.nombre = nameVal.value;
            item.price = price.value;
            item.cost = cost.value;
            item.model = model.value;
            item.qty = stock.value;
            item.notes = about.value;
        }).then(function() {
            displayProductClicked();
        });
    }).catch(function(err) {
        console.error(err); //throw error if transaction fails
    });
}

function deleteFromForm() {
    db.transaction('rw', db.urbanProducts, function() {
        db.urbanProducts.where("code").equals(scanVal).delete().then(function() {
            displayProductClicked();
        });
    }).catch(function(err) {
        console.error(err); //throw error if transaction fails
    });
}


function createFromForm() {
    db.transaction('rw', db.urbanProducts, function() {
        scan = barcode.value;
        db.urbanProducts.add({
            code: barcode.value,
    	    nombre: nameVal.value,
            price: price.value,
            cost: cost.value,
            model: model.value,
            qty: stock.value,
            notes: about.value
        }).then(function() {
            displayProductClicked();
        });
    }).catch(function(err) {
        console.error(err); //throw error if transaction fails
    });
}

