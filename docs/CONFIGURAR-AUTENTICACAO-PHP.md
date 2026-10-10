# Publicação na InfinityFree

Este projeto é configurado para uma conta InfinityFree usando o subdomínio gratuito fornecido pelo painel. Não use domínio próprio nem valores locais na configuração publicada.

## 1. Preparar domínio e PHP

1. Crie ou selecione a conta InfinityFree e ative o subdomínio gratuito atribuído pelo painel.
2. Ative o certificado SSL gratuito e aguarde o painel indicar que o HTTPS está disponível.
3. No painel, selecione PHP 8.1 ou superior para o domínio.

## 2. Criar o banco

1. Crie o banco na seção **MySQL Databases** do painel InfinityFree.
2. Copie exatamente o host, o nome do banco, o usuário e a senha mostrados ali. O host MySQL **não** é `localhost`; nomes e usuários frequentemente incluem um prefixo da conta.
3. Abra o phpMyAdmin pelo link daquele banco no painel, selecione o banco e importe `database/schema.sql`.

O esquema cria as tabelas `users` e `auth_rate_limits`. Ele não tenta criar o banco, que deve ser provisionado pelo painel.

## 3. Configurar os arquivos

1. Duplique `php/config/config.example.php` como `php/config/config.php`.
2. Em `database`, coloque os quatro valores copiados do painel. Não use `localhost`, `root` ou os valores de exemplo.
3. Mantenha `config.php` privado: o arquivo está no `.gitignore` e a pasta tem regra Apache para negar acesso web. Nunca publique credenciais em Git, capturas de tela ou mensagens.

Os links internos são gerados relativamente à raiz do projeto e não precisam de domínio configurado no PHP. Acesse sempre pelo subdomínio HTTPS gratuito da InfinityFree.

Não envie o arquivo de exemplo no lugar da configuração real nem publique uma cópia local de `config.php`: crie o arquivo privado diretamente no servidor a partir do modelo e use os dados MySQL da InfinityFree. Não é necessário configurar SMTP, PHPMailer, Composer ou npm.

## 4. Enviar o site

1. No gerenciador de arquivos InfinityFree ou por FTP, envie o conteúdo do projeto para a pasta `htdocs` da conta — não crie uma pasta adicional com o nome do repositório dentro dela.
2. Preserve a estrutura e a capitalização dos diretórios (`Pagina_disciplina`, `php`, `pages`, `js`, `css`, `img`, `apostilas`).
3. Confirme que `.htaccess` e `php/config/.htaccess` foram enviados; arquivos iniciados por ponto podem ficar ocultos no gerenciador.
4. Abra a URL HTTPS do subdomínio e teste cadastro, login, saída, painel, catálogo e cursos.

O `.htaccess` da raiz define `index.php` como página inicial, bloqueia arquivos ocultos e desativa a listagem de diretórios. O diretório do banco também nega acesso HTTP aos arquivos SQL.

## Atualizar uma instalação anterior

Faça backup pelo phpMyAdmin antes de alterar o banco. Se a instalação antiga tiver sido criada com confirmação/recuperação por e-mail, execute uma vez:

```sql
DROP TABLE IF EXISTS auth_tokens;
ALTER TABLE users DROP COLUMN email_verified_at;
```

Isso preserva usuários e senhas. Não execute o `ALTER TABLE` se a coluna já não existir.

## Limites

Cadastro não exige confirmação de e-mail e não há recuperação de senha. Usuários que esquecerem a senha precisarão de suporte administrativo para redefinição. O painel exige sessão, mas os cursos que permanecem em HTML estático são acessíveis diretamente pela URL.
