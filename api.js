
const winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'logs/debug.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: 'logs/error.log',
            level: 'error'
        })
    ]
});

const logInfo = req =>
    logger.info(`method: ${req.method}, path: ${req.path}, origem: ${req.info.remoteAddress}`);

const logError = (req, error) =>
    logger.error(`method: ${req.method}, path: ${req.path}, origem: ${req.info.remoteAddress}, mensagem: ${error}`);

// importamos o dotenv
const { config } = require('dotenv');
if (process.env.NODE_ENV === 'production')
    config({ path: './config/.env.prod' });
else
    config({ path: './config/.env.dev' });

console.log('MONGO_URL', process.env.MONGO_URL);

const Hapi = require('hapi');


// instalamos o CORS para liberar acessos a uso externo
// npm i --save hapi-cors
const HapiCors = require('hapi-cors');
const HapiJwt = require('hapi-auth-jwt2');
const Jwt = require('jsonwebtoken');

// instalamos o JOI para validar todos os nossos requests
// npm i --save joi
const Joi = require('joi');

// instalamos o BOOM para manipular erros de HTTP Status
// npm i --save boom
const Boom = require('boom');

const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

const Carro = require('./ent/carro');
const KEY = process.env.KEY_JWT;

const USUARIO_VALIDO = {
    email: 'xuxadasilva@xuxa.org',
    senha: 1234
};

(async () => {

    try {
        const Database = require('./databaseMongooseModelCrud');

        const app = new Hapi.Server();
        app.connection({ port: process.env.PORT });

        await app.register({
            register: HapiCors,
            options: {
                origins: ["*"],
                methods: ["GET", "POST", "PATCH", "DELETE"]
            }
        });

        // registramos o swagger
        await app.register([
            Inert,
            Vision,
            {
                register: HapiSwagger,
                options: {
                    info: { version: "v1.0", title: "API PigLet" },
                    documentationPath: "/docs"
                }

            }
        ]);

        // registramos o json web token
        await app.register(HapiJwt);

        // criamos uma estratégia de autenticação
        app.auth.strategy('jwt', 'jwt', {
            key: KEY,
            //antes de qualquer requisição esse método é
            // chamado para validar seu token
            validateFunc: (tokenDescriptografado, request, callback) => {
                // aqui podemos fazer validações customizadas
                return callback(null, true);
            },
            verifyOptions: { algorithms: ["HS256"] }
        });

        app.auth.default('jwt');

        // definimos as rotas para a aplicação
        app.route([
            {
                method: 'POST',
                path: '/Login',
                handler: (req, reply) => {

                    logInfo(req);

                    const { email, senha } = req.payload;

                    if (USUARIO_VALIDO.email.toLowerCase() !== email.toLowerCase() || USUARIO_VALIDO.senha !== senha)
                        return reply(Boom.unauthorized());

                    // geramos um token de acesso, para o usuário logado com o tempo de expiração 12horas
                    const token = Jwt.sign({ usuario: email }, KEY, { expiresIn: "12h" });
                    return reply({ token });
                },
                config: {
                    auth: false, //desativamos a autenticação para esse método
                    notes: 'Login',
                    description: 'Autenticação do usuário para obter TOKEN',
                    tags: ['api'],
                    validate: {
                        payload: {
                            email: Joi.string()
                                .email()
                                .required()
                                .default('xuxadasilva@xuxa.org'),
                            senha: Joi.number()
                                .required()
                        }
                    }
                }
            },
            {
                method: 'GET',
                path: '/PDV/produtos',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Listar produtos disponiveis para PDV',
                    description: 'Retorna os produtos disponiveis para o PDV',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                }
            },
            {
                method: 'GET',
                path: '/PDV/produto/{id}',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Busca produto para o PDV',
                    description: 'Retorna um produto pelo ID para o PDV',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        query: {
                            id: Joi.number()
                                .max(100)
                                .default(10)
                        }
                    }
                }
            },
            {
                method: 'GET',
                path: '/PDV/produto/contratados',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Listar produtos contratados para PDV',
                    description: 'Retorna os produtos que foram contratados pelo estabelecimento comercial para o PDV',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                }
            },
            {
                method: 'GET',
                path: '/PDV/produto/cancelados',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Listar produtos cancelados para PDV',
                    description: 'Retorna os produtos que foram cancelados pelo estabelecimento comercial para o PDV',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                }
            },
            {
                method: 'DELETE',
                path: '/PDV/produto/cancelar/{id}',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Cancela um produto para PDV',
                    description: 'Cancela um produto para estabelecimento comercial pelo ID para o PDV',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        query: {
                            id: Joi.number()
                                .max(100)
                                .default(10)
                        }
                    }
                }
            },
            {
                method: 'POST',
                path: '/PDV/produto/contratar',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Contratar um produto pelo ID para PDV',
                    description: 'Contrata um produto para estabelecimento comercial pelo ID para o PDV',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        query: {
                            id: Joi.number()
                                .max(100)
                                .default(10)
                        }
                    }
                }
            },
            {
                method: 'GET',
                path: '/InstituicaoFinanceira/produto/contratados',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Listar Produtos contratados da IF',
                    description: 'Retorna os produtos que foram contratados pelo estabelecimento comercial para a Instituição Financeira',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                }
            },
            {
                method: 'GET',
                path: '/InstituicaoFinanceira/produto/contratados/{idEc}',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Listar Produtos contratados por uma EC na IF',
                    description: 'Retorna os produtos que foram contratados pelo estabelecimento comercial para a Instituição Financeira',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        query: {
                            idEc: Joi.number()
                                .max(100)
                                .default(10)
                        }

                    }
                }
            },
            {
                method: 'GET',
                path: '/InstituicaoFinanceira/produto/cancelados',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Listar Produtos cancelados da IF',
                    description: 'Retorna os produtos que foram cancelados pelo estabelecimento comercial para a Instituição Financeira',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                }
            },
            {
                method: 'GET',
                path: '/InstituicaoFinanceira/produto/cancelados/{idEc}',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Listar Produtos cancelados de uma ED na IF',
                    description: 'Retorna os produtos que foram cancelados pelo estabelecimento comercial para a Instituição Financeira',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        query: {
                            idEc: Joi.number()
                            .max(100)
                            .default(10)
                        }
                    }
                }
            },
            {
                method: 'GET',
                path: '/EstabelecimentoComercial/detalhe/{id}',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Lista Detalhes da Estabelecimento Comercial',
                    description: 'Retorna os dados detalhados do Estabelecimento Comercial',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        query: {
                            id: Joi.number()
                                .max(100)
                                .default(10)
                        }
                    }
                }
            },
            {
                method: 'GET',
                path: '/EstabelecimentoComercial/fluxocaixa/{id}',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Lista Detalhes de um determinado fluxo de caixa do EC',
                    description: 'Retorna os dados do fluxo de caixa selecionado do Estabelecimento Comercial',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        query: {
                            id: Joi.number()
                                .max(100)
                                .default(10)
                        }
                    }
                }
            },
            {
                method: 'GET',
                path: '/EstabelecimentoComercial/fluxocaixa',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Listar Fluxo de Caixa do EC',
                    description: 'Retorna o fluxo de caixa completo do estabelecimento comercial',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown()
                    }
                }
            },
            {
                method: 'POST',
                path: '/EstabelecimentoComercial/fluxocaixa/salvar',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Salva informações de fluxo de caixa do EC',
                    description: 'Salva os dados diariamente do fluxo de caixa do saldo final do dia no PDV do Estabelecimento Comercial',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        query: {
                            id: Joi.number()
                                .max(100)
                                .default(10)
                        }
                    }
                }
            },
            {
                method: 'POST',
                path: '/EstabelecimentoComercial/ofx/upload',
                handler: async (req, reply) => {
                    try {
                        //throw new Error('TESTE');
                        logInfo(req);

                        const { query } = req;
                        const { limit, skip, nome } = query;

                        const resultado = await Database.listar({ nome, limit, skip });
                        return reply(resultado);

                    } catch (error) {
                        logError(req, error);
                        return reply(Boom.internal(error));
                    }
                },
                config: {
                    // adicionamos a configuração da autenticação (jwt)

                    notes: 'Realiza upload do extrato bancário OFX',
                    description: 'Salva os dados de extrato bancário do EC via upload do extrato em formato OFX',
                    tags: ['api'],
                    validate: {
                        headers: Joi.object({
                            authorization: Joi.string().required()
                        }).unknown(),
                        query: {
                            id: Joi.number()
                                .max(100)
                                .default(10)
                        }
                    }
                }
            },
        ]);

        // inicializamos nossa API
        await app.start();

        console.log('Servidor rodando...MANOWWWWW', process.env.PORT);
    } catch (error) {
        logError(req, error);
        //console.error('erro inesperado', error);
    }

})();