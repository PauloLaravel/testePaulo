
# passos para rodar a aplicação:

  Partindo do principio que a sua Máquina contem node e npm instalado

# Acessar diretório raiz do projeto:
  cd testePaulo  

# Instalar dependencias do projeto:
  npm install  

# Iniciar projeto:
  npm run start  

# Acessando Endpoints no swagger:
  http://localhost:3000/swagger/ 

# Busca de produtos parametros: products/nutrition/nova
  http://localhost:3000/products/A/1  

# Busca dos detalhes de um produto parametros:  product/id/search_value
  http://localhost:3000/product/8011780000922/nudeln-spaghetti-riscossa 

# Principais desafios:
  O meu principal desafio nesse projeto foi tentar implementar busca de 
  de detalhes de produto so por meio de id, assim como mostra no
  formulario de teste ( http://localhost/products/3155250349793 ).
  isso me levou a ter muita redundâcia no código e assim provocando
  lentidão na resposta da requisição.
  Para resolver este problema tive que adotar um novo parametro que
  correponde url do proprio detalhes de produto, 
  (https://br.openfoodfacts.org/produto/11117780/nestor-nestle),
  Denoninando como search_value. 


