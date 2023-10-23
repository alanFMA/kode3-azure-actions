# [Backstage](https://backstage.io)

### Bem vindo ao projeto kode3-azure-actions!

## Introdução

Este projeto foi desenvolvido para utilizar os serviços do Azure Devops dentro do backstage.

## 📋 Pré-requisitos

Para conseguir fazer esse projeto rodar de modo 100% funcional na sua máquina,
você deve possuir os seguintes **requisitos**:

- [NodeJS](https://nodejs.org/en/download/)
  - O link de download está disponível ao clicar no nome "NodeJS" acima.
  - A versão utilizada no projeto é a 18.18.0
- [YARN](https://yarnpkg.com/) - Gerenciador de Dependência 📥
- [Microsoft Azure Authentication Provider](https://backstage.io/docs/integrations/azure/locations/) - Acesse a documentação para configurar a autenticação do Azure Devops no backstage _(os dados devem ser configurados no arquivo **'app-config.yaml'**)_.


## 🚀 Preparando a aplicação

1. Abra o terminal e navegue até o diretório onde você deseja clonar o repositório, após isso faça um clone na sua máquina do repositório base [backstage-kode3tech](https://github.com/alanFMA/kode3tech) através do comando:

```sh
git clone https://github.com/alanFMA/kode3tech.git
```

2. Após clonar o repositório, instale o plugin de backend [azure-actions](https://www.npmjs.com/package/plugin-azure-actions-backend) através do comando:

```sh
yarn add --cwd packages/backend plugin-azure-actions-backend
```

3. Após instalar o plugin, vá para o a pasta 'packages/backend' e execute os seguintes comando:

```sh
yarn tsc
yarn build
```

4. Retorne para a pasta raíz do projeto e execute o seguinte comando:

```sh
yarn install
```

4. Instaladas as dependências, utilize o comando `yarn dev` para subir os packages de front-end e back-end mutuamente, ou se preferir, utilize os comandos `yarn start` e `yarn start-backend` em terminais separados.

## ✒️ Autor

- **Alan Andrade** - _Desenvolvedor Responsável_ - [Alan Andrade](https://github.com/AlanFMA)
