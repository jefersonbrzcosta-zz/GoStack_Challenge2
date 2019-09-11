import Sequelize, { Model } from "sequelize";
{/* IMPORTAR BCRYPT para criar password_hash */}
import bcrypt from "bcryptjs";

{/* Criar classe puxando Model do Sequilize, dar um init do Model usando super */}
class User extends Model {
    static init(sequelize){
        super.init(
            {/* Dados sobre o usuário, assim que receber o req.body vai comparar com estes dados aqui */}
            {
                nome: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN
            },
            {
                sequelize
            }
        );
        {/* rodar função antes de Salvar com o addHook. criptografar o que receber de password e salvar em password_hash */}
        this.addHook("beforeSave", async user => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8);
            }
        });
        {/* retornar sempre a instancia do objeto */}
        return this;
    }
    {/* função para verificar senha que será usada no controller toda vez que o usuário tentar modificar senha ou fazer o login */}
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;