# Password Manager

Este é um projeto simples de um gerenciador de senhas construído com Next.js, TypeScript e Tailwind CSS.

## Visão Geral

O objetivo deste projeto é criar um cofre de senhas seguro e fácil de usar. Atualmente, a aplicação possui:
-   Uma tela de autenticação com formulários para login e cadastro.
-   Uma rota protegida para o cofre de senhas.
-   Uma tela de cofre (placeholder) que é exibida após o login bem-sucedido.

## Tecnologias Utilizadas

-   **Framework**: [Next.js](https://nextjs.org/) (com App Router)
-   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
-   **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes de UI**: [shadcn/ui](https://ui.shadcn.com/)
-   **Ícones**: [Lucide React](https://lucide.dev/)

## Configurando o Ambiente

Para rodar este projeto localmente, siga os passos abaixo.

### Pré-requisitos

-   [Node.js](https://nodejs.org/) (versão 18.x ou superior)
-   [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

### Instalação

1.  **Clone o repositório** (ou, no seu caso, certifique-se de estar na pasta raiz do projeto).
    ```bash
    # Se estivesse clonando:
    # git clone <url-do-repositorio>
    # cd password-manager
    ```

2.  **Instale as dependências** do projeto. O gerenciador de pacotes utilizado é o `npm`.
    ```bash
    npm install
    ```

## Rodando o Projeto

1.  **Inicie o servidor de desenvolvimento**:
    ```bash
    npm run dev
    ```

2.  **Abra a aplicação** no seu navegador, acessando http://localhost:3000.

## Como Funciona (Estado Atual)

-   **Autenticação**: A aplicação simula um login de usuário.
    -   A página de login (`/`) permite alternar entre as visões de "Login" e "Cadastro".
    -   Para fins de demonstração, o login é bem-sucedido com qualquer e-mail, desde que a senha seja `123`.
-   **Rota Protegida**: A página `/vault` é protegida.
    -   Só pode ser acessada após um login bem-sucedido.
    -   A proteção é implementada no lado do cliente usando `sessionStorage`. **Atenção**: este método não é seguro para produção e serve apenas como demonstração.
-   **Logout**: Na página do cofre, o botão "Sair" limpa a sessão (`sessionStorage`) e redireciona o usuário de volta para a página de login.