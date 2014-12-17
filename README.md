This is an webapp which utilizes a barcode scanner to build and read from a database of products.
product values are: name, model number, price, cost, qty in stock, barcode number, and description <-- may change to notes.

Currently Working:
    --scanbox turns green to indicate ready.
    --Radio buttons change from transact to edit.
            -in edit mode you can scan a product and then modify its values
            -in transact mode you can scan a product and it will be added to output.
            
TODO:
    --In transact mode
        -duplicate products must increment existing line instead of creating new line.
        -prices must be totalled
        -items not in DB must throw error to user.
        -need to be able to remove product from transaction
        
    --In edit mode
        -need to add functionality for adding products
        -need to be able to remove product
        
        
--maybe more i cannot think of...
