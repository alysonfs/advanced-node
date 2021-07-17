# Autenticaçao com Facebook

> ## Dados:
* Token de Acesso

> ## Fluxo Primário
1. Obter Dados (nome, email e facebook ID) da Api do Facebook;
2. Consultar se existe um suuário com email recebido acima;
3. Criar uma conta para o usuário com os dados recebidos do Facebok;
4. Criar um token de acesso, a partir do ID do usuário, com expiração de 30 min;
5. Retornar o token de acesso gerado;

> ## Fluxo alternativo: Usuário já existe
3. Atualizar a conta do usuário com dados rebeidos do Facebook ( Facebook ID e nome - só atualizar o nome caso a conta do usuário não possua nome)

> ## Fluxo de excessão: Token inválido ou expirado
1. Retornar um erro de autentição
