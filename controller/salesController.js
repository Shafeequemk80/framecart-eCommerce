const loadsales =async (req, res) => {


    try {
        
res.render('salesreport')

    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
    loadsales
}