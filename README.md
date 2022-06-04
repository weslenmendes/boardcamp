# Boardcamp

Essa aplicação consiste em um sistema de gestão de uma locadora de jogos de tabuleiro.

## Modelagem do Banco

<img src="./assets/database-model.jpg" width="100%" alt="Modelagem do banco" />

O banco de dados usado nessa aplicação foi um banco SQL, mais especificamente o PostgreSQL.

## Rotas

```
games
  GET /games          # Retorna todos os jogos inseridos
  POST /games         # Insere um novo jogo na aplicação

categories
  GET /categories     # Retorna todas ascategorias inseridos
  POST /categories    # Insere uma nova categoria na aplicação

customers
  GET /customers      # Retorna todos os clientes da aplicação
  GET /customers/:id  # Retorna um cliente pelo id
  POST /customers     # Insere um cliente na aplicação
  PUT /customers/:id  # Edita um cliente pelo id

rentals
  GET /rentals        # Retorna todos os aluguéis
  GET /rentals/metrics # Retorna algumas métricas sobre os alugueis
  POST /rentals       # Insere um novo aluguel
  POST /rentals/:id/return # Insere uma devolução no banco
  DELETE /rentals/:id  # Remove um aluguel da aplicação



```
