var  customerTransformer = function(customer) {
    if (customer?.dataValues?.password) {
        delete customer.dataValues.password
    }
    // delete customer ["dataValues"]["createdAt"]
    //delete customer ["dataValues"]["updatedAt"]
    
    customer.image = `${process.env.API_URL + "/uploads/" + customer.image}`;


    return customer;

};
const customersTransformer = (customers)=> {
    return customers.map(customer => customerTransformer(customer))
}

module.exports = {
    customerTransformer,
    customersTransformer
}