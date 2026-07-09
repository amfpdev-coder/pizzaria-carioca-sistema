const bcrypt = require("bcryptjs");
const db = require("../connection");

function pareceHashBcrypt(valor) {
    return typeof valor === "string" && /^\$2[aby]\$/.test(valor);
}

function migrarSenhaAntiga(usuarioEncontrado) {
    bcrypt.hash(usuarioEncontrado.senha, 10).then((senhaCriptografada) => {
        const sqlAtualizar = `UPDATE usuarios SET senha = ? WHERE id = ?`;

        db.run(sqlAtualizar, [senhaCriptografada, usuarioEncontrado.id], (erroUpdate) => {
            if (erroUpdate) {
                console.error("Erro ao migrar senha do administrador:", erroUpdate.message);
                return;
            }

            console.log("Senha do administrador migrada para hash com sucesso.");
        });
    });
}

function criarUsuarioAdministrador() {
    const sqlVerificar = `
        SELECT id, senha
        FROM usuarios
        WHERE usuario = ?
        LIMIT 1
    `;

    db.get(sqlVerificar, ["admin"], (erro, usuarioEncontrado) => {
        if (erro) {
            console.error("Erro ao verificar usuário administrador:", erro.message);
            return;
        }

        if (usuarioEncontrado) {
            if (!pareceHashBcrypt(usuarioEncontrado.senha)) {
                migrarSenhaAntiga(usuarioEncontrado);
            } else {
                console.log("Usuário administrador já existe.");
            }
            return;
        }

        bcrypt.hash("123456", 10).then((senhaCriptografada) => {
            const sqlInserir = `
                INSERT INTO usuarios (
                    nome,
                    usuario,
                    senha,
                    tipo,
                    ativo
                ) VALUES (?, ?, ?, ?, ?)
            `;

            db.run(
                sqlInserir,
                ["Juliene", "admin", senhaCriptografada, "admin", 1],
                (erroInserir) => {
                    if (erroInserir) {
                        console.error("Erro ao criar usuário administrador:", erroInserir.message);
                        return;
                    }

                    console.log("Usuário administrador criado com sucesso.");
                }
            );
        });
    });
}

module.exports = criarUsuarioAdministrador;
