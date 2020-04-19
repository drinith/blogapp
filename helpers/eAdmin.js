module.exports ={

    //Verifica se esse cara estpa autenticado
    eAdmin: function(req,res,next){
        //Ver se o usuário está autenticado e se ele é administrador no caso eu deixei 0 que é qualquer um
        if(req.isAuthenticated() && req.user.eAdmin==0){
            return next();
        }

        req.flash('error_msg','Você precisa ser um Admin!')
         res.redirect('/')
    }
}