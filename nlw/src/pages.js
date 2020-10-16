const Database = require('./database/db');
const saveOrphanage = require('./database/saveOrphanage')

module.exports = {
    
    index(request, response) {
        return response.render('index')
    },
    
    async orphanage(request, response){
        const id = request.query.id
        try {
            const db = await Database;
            const results = await db.all(`SELECT * FROM orphanages WHERE id ="${id}"`)
            const orphanage = results[0]

            orphanage.images = orphanage.images.split(',')
            orphanage.firstImage = orphanage.images[0]
            
            orphanage.open_on_weekends = (orphanage.open_on_weekends == "1")? true : false;
            return response.render('orphanage', {orphanage})
        } catch (error) {
            console.log(error)
            return response.send('Erro no banco de dados!')
        }
    },

    async orphanages(request, response){
        try {
            const db = await Database;
            const orphanages = await db.all('SELECT * FROM orphanages')
            return response.render('orphanages', {orphanages})
        } catch (error) {
            console.log(error)
            return response.send('Erro no banco de dados!')
        } 
    },

    createOrphanage(request, response){
        return response.render('create-orphanage')
    },

    async saveOrphanage(request, response){
        const field = request.body

        if(Object.values(field).includes('')){
            return response.send('Todos os campos devem ser Preenchidos')
        }
        //salvar um orfanato
        try {
            const db = await Database
            await saveOrphanage(db, {
            lat: field.lat,
            lng: field.lng,
            name: field.name,
            about: field.about,
            whatsapp: field.whatsapp,
            images: field.images.toString(),
            instructions: field.instructions,
            opening_hours: field.opening_hours,
            open_on_weekends: field.open_on_weekends,
        })
            //redirecionar 
            return response.redirect('/orphanages')
        } catch (error) {
            console.log(error)
            return response.send('Erro no banco de dados!')
        }
    }
}