/* Padrão MVC
store => Cadastrar / Adiconar
index => Listar vários
show => Listar apenas UM
update => Atualizar
delete => Deletar
*/
import { v4 } from 'uuid'
import * as Yup from 'yup'
import User from '../models/User'

class UserController {
    async store(request, response) {

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            admin: Yup.boolean(),
        })

        /*Uma das formas de validar informação do usuário, se der algum erro já responde pro usuário que deu erro
         if (!(await schema.isValid(request.body))) { 
            return response
                .status(400)
                .json({ error: 'Make sure your date is corret' })
        } */

        /* Esse forma abaixo trycatch descrevi melhor quais são os erros pra validar infomações do usuário */

        try {
            await schema.validateSync(request.body, {abortEarly: false})
        } catch (err) {
            return response.status(400).json({ error: err.errors })
        }

        const { name, email, password, admin } = request.body

        const userExist = await User.findOne({
            where: { email },
        })

        if (userExist){
            return response.status(400).json({ error: 'User already exists'})
        }
        console.log(userExist)

        const user = await User.create({
            id: v4(),
            name,
            email,
            password,
            admin,
        })

        return response.status(201).json({ id: user.id, name, email, admin })
    }
}

export default new UserController()