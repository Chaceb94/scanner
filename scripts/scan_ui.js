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
    c = 0;
    total = 0;
    transList = [];

    //load and open database    
    this.db = new Dexie("Urban_City_Product_Database");
    db.version(1).stores({urbanProducts: 'code, nombre, model, price, cost, qty, notes'});
    db.open();
    radioClicked();

    output.innerHTML = "<caption>Current Transaction</caption><th>Barcode</th><th>Name</th><th>Each</th><th>Qty</th><th>Sub-Total</th><tr><td>No Products Scanned.</td><td></td><td></td><td></td><td></td><tr>"; //initiate output box
    
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
	                    output.innerHTML = "<caption>Current Transaction</caption><th>Barcode</th><th>Name</th><th>Each</th><th>Qty</th><th>Sub-Total</th>";
	                    while(i < transList.length) {
	                        t = transList[i];
                            var bar = "<td>" + t.code + "</td>";
                            var n = "<td>" + t.name + "</td>";
                            var price = "<td>" + t.price + "</td>";
	                        var qty = '<td>' + t.qty + '</td>';
                            var subT = '<td>' + (t.price*t.qty).toFixed(2) + '</td>';

                            result = bar + n + price + qty + subT;
                            output.innerHTML = output.innerHTML + '<tr>' + result + '</tr>';
                            result = '';
	                        i++;
	                    }
	                    
	                    output.innerHTML = output.innerHTML + "\nTotal = " + total.toFixed(2);
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

    output.addEventListener("click", function () {
        if (output != null) {
            for (var i = 0; i < output.rows.length; i++) {
                output.rows[i].onclick = function () {
                    
                    outputText(this.cells[0]);
                };
            }
        }
    });
}




function outputText(outputCell) {
    barcodeVal = outputCell.innerHTML;

    db.transaction('r', db.urbanProducts, function() {
        db.urbanProducts.where('code').equals(barcodeVal).each (function(item){
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
        }).catch(function(err) {
          console.error(err); //throw error if transaction fails
        });
    });
}

function cancelClicked() {
    output.innerHTML = "<caption>Current Transaction</caption><th>Barcode</th><th>Name</th><th>Each</th><th>Qty</th><th>Sub-Total</th><tr><td>No Products Scanned.</td><td></td><td></td><td></td><td></td><tr>";
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
	    //document.getElementById("displayProductButton").style.display = 'none';
	    document.getElementById("cancelButton").style.display = 'block';
	    document.getElementById("completeButton").style.display = 'block';
	    output.innerHTML = "<caption>Current Transaction</caption><th>Barcode</th><th>Name</th><th>Each</th><th>Qty</th><th>Sub-Total</th><tr><td>No Products Scanned.</td><td></td><td></td><td></td><td></td><tr>";
	}
	else if(edit.checked){
		document.getElementById("trans-mode").style.display	= 'block';
	    document.getElementById("edit-mode").style.display	= 'block';
	    //document.getElementById("displayProductButton").style.display = 'block';
	    document.getElementById("cancelButton").style.display = 'none';
	    document.getElementById("completeButton").style.display = 'none';
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
            output.innerHTML = "<caption>Current Transaction</caption><th>Barcode</th><th>Name</th><th>Each</th><th>Qty</th><th>Sub-Total</th><tr><td>Transaction Completed.</td><td></td><td></td><td></td><td></td><tr>";
            transList = [];
            total = 0;
        }).catch(function(err) {
            alert(err); //throw error if transaction fails
        });
        
        i++;
    }

}

function displayProductClicked() {
    output.innerHTML = "<caption>All of urban City's Products</caption><th>Barcode</th><th>Model Number</th><th>Name</th><th>Price</th><th>Cost</th><th>Stock</th><th>Notes</th>";
	db.urbanProducts.each(function(item){
        var bar = "<td>" + item.code + "</td>";       
        var model = "<td>" + item.model + "</td>";
        var n = "<td>" + item.nombre + "</td>";
        var price = "<td>" + item.price + "</td>";
        var cost = "<td>" + item.cost + "</td>";
        var stock = "<td>" + item.qty + "</td>";
	    var desc = "<td>" + item.notes + "</td>";
        
	    result = bar + model + n + price + cost + stock + desc;
        output.innerHTML = output.innerHTML + '<tr>' + result + '</tr>';
        result = '';
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
                	    
            if(isNaN(price.value) || isNaN(cost.value) || isNaN(stock.value)) {
    	        throw 'Please only use numbers and decimals for cost/price/stock.';
            }
            else {
                item.price = price.value;
                item.cost = cost.value;
                item.qty = stock.value;
            }
            item.model = model.value;
            item.notes = about.value;
        }).then(function() {
            displayProductClicked();
        });
    }).catch(function(err) {
        alert(err); //throw error if transaction fails
    });
}

function deleteFromForm() {
    db.transaction('rw', db.urbanProducts, function() {
        db.urbanProducts.where("code").equals(barcode.value).delete().then(function() {
            displayProductClicked();
        });
    }).catch(function(err) {
        console.error(err); //throw error if transaction fails
    });
}


function createFromForm() {
    db.transaction('rw', db.urbanProducts, function() {
        scan = barcode.value;
        if(isNaN(price.value) || isNaN(cost.value) || isNaN(stock.value))  {
    	    throw 'Please only use numbers and decimals for cost/price/stock.';
        }
        else {
        
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
        }
    }).catch(function(err) {
        alert(err); //throw error if transaction fails
    });
}

