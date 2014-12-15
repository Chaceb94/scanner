products = [];

//return a Amoeba object. (return is automatic) It can only gets its size. 
function Product(code, name, price, description){
	this.code = code; //save the size as part of this new Amoeba
	this.name = name;
	this.price = price;
	this.about = description;
	this.getProductVals = getProductVals; //save the getAmoebaVals function as part of this new Amoeba
	this.addProduct = addProduct;
	this.findMatch = findMatch;
	this.openDatabase = openDatabase;
}





function openDatabase() {
//codes
}

function readDatabase() {
    scanCode = prompt('scan a product to find a match');
    db.urbanProducts
        .where("code").equals(scanCode)
        .each(function(urbanProduct) {
            console.log("Found " + scanCode + JSON.stringify(urbanProduct));
        });
}

//return a string containing this Amoeba's variable name and value 
function getProductVals(){
    rtn = null;
	if(this.name.length >= 16){
		rtn = this.code + "\t" + this.name + "\t" + this.price;
	}
	else{
		rtn = this.code + "\t" + this.name + "\t\t" + this.price;
	}
	//rtn = "Amoeba size=" + this.size;    //create var rtn whose value is this Amoeba's size  
	//rtn = rtn + " name=" + this.name;
	//rtn = rtn + " color=" + this.color;
	return rtn;                           //return rtn's value
}

function findMatch(scan) {
    i = 0;
    rtn = null;
    while(i < products.length) {
        p = products[i];
        if(p.code == scan) {
            alert('yay');
            rtn = p.getProductVals();  
                  
        }
        i++;
    }

	return rtn;                           //return rtn's value
}

function addProduct(item){
	try{
		if(item != null){
			products.push(item);
			i = products.length;
			p = products[i-1];
			alert(p.getProductVals());
		}
		else{
		    alert("product value was 'null'.\nNo product added.");
		}
	}
	catch(errMsg){
		alert(errMsg);
	}
}
