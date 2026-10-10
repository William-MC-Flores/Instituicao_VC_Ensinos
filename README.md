# VC Ensinos — InfinityFree

Site educacional com páginas institucionais, catálogo, cursos e autenticação simples por PHP/MySQL. A implantação suportada é uma conta InfinityFree usando o subdomínio gratuito fornecido pela hospedagem; não configure domínio próprio.

## Implantação

Siga [docs/CONFIGURAR-AUTENTICACAO-PHP.md](docs/CONFIGURAR-AUTENTICACAO-PHP.md). Resumo:

1. Crie/ative o subdomínio gratuito e o certificado HTTPS no painel InfinityFree.
2. Envie os arquivos do site para a pasta `htdocs` da conta.
3. Crie o banco MySQL no painel InfinityFree, importe `database/schema.sql` pelo phpMyAdmin da hospedagem e configure `php/config/config.php` com os dados fornecidos no painel.
4. Acesse o subdomínio HTTPS atribuído à conta.

O site requer PHP 8.1 ou superior com `PDO MySQL`, MySQL/MariaDB e Apache. Não requer Composer, npm, envio de e-mail ou domínio próprio.

Cadastro, login, sessão e painel são implementados em `php/api/auth.php` e `pages/painel.php`. Não há confirmação de e-mail nem recuperação de senha. Senhas são armazenadas com `password_hash`; formulários usam CSRF e a API limita tentativas.

O código-fonte também inclui arquivos HTML estáticos para páginas e cursos. O Apache prioriza `index.php` para que a página inicial use os caminhos e recursos da aplicação.