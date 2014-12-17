
//return a Amoeba object. (return is automatic) It can only gets its size. 
function Product(code, name, price, description){
    this.products = [];
	this.code = code; //save the size as part of this new Amoeba
	this.name = name;
	this.price = price;
	this.about = description;
	this.getProductVals = getProductVals; //save the getAmoebaVals function as part of this new Amoeba
	this.addProduct = addProduct;
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
