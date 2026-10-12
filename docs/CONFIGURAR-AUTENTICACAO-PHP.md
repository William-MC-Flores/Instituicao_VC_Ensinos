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

O esquema cria usuários, rate limits, disciplinas, turmas, matrículas, atribuições de equipe e fila de aprovação de conteúdo. Ele não tenta criar o banco, que deve ser provisionado pelo painel.

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

## Primeiro administrador e atualização do banco

Novos cadastros sempre recebem o perfil `student` e o plano `free`. Não há cadastro público de administradores ou colaboradores. Para inicializar a equipe, crie primeiro uma conta confiável e, no phpMyAdmin, promova somente o endereço escolhido:

```sql
UPDATE users
SET role = 'admin', plan = 'free'
WHERE email = 'SEU-EMAIL-EXATO';
```

Confirme que a consulta afetou exatamente uma conta. Depois entre novamente para carregar o painel administrativo. A API impede remover o último administrador.

Para uma instalação anterior à gestão de perfis, faça backup e execute uma única vez `database/migrations/20261012_profiles_and_learning.sql` e, em seguida, `database/migrations/20261012_profile_customization.sql` no banco antes de enviar a nova versão. A primeira migração mantém as contas atuais como alunos Free e cria as tabelas de disciplinas, turmas, atribuições, matrículas e revisão de conteúdos; a segunda adiciona os campos de personalização. Se a primeira migração já foi aplicada, execute somente a segunda. Não execute uma migração novamente: os `ALTER TABLE` não são repetíveis.

O plano Free permite visualizar as páginas das disciplinas, mas não permite inscrição em turmas; esse acesso exige Standard ou Pro. Os planos Standard e Pro ainda não podem ser adquiridos e nenhum pagamento é processado. As aulas ao vivo, suporte por dúvidas e benefícios exclusivos dependem da disponibilização futura dos planos e de seus respectivos serviços.

No plano Free, cada usuário pode alterar o nome de exibição e enviar/remover a própria foto. Capa, biografia, pronomes, links e controle de visibilidade são recursos avançados para Standard/Pro; administradores e colaboradores recebem acesso como parte da equipe. Os planos pagos ainda estão indisponíveis. A foto aceita JPG, PNG ou WebP até 2 MB; a capa, até 3 MB. O perfil é privado por padrão, não exibe e-mail e só se torna acessível publicamente quando o próprio usuário seleciona essa opção. Imagens são armazenadas no próprio site, sem carregar recursos de serviços externos.

As informações públicas devem ser respeitosas e não podem incluir conteúdo ofensivo, discriminatório ou dados pessoais de terceiros. A biografia é texto simples, escapado na exibição; arquivos SVG e GIF não são aceitos nos uploads. As imagens ficam em armazenamento não acessível diretamente pela web; a rota de exibição verifica se o perfil é público ou se a pessoa que pediu a imagem é a dona da conta.

## Atualizar uma instalação anterior

Faça backup pelo phpMyAdmin antes de alterar o banco. Se a instalação antiga tiver sido criada com confirmação/recuperação por e-mail, execute uma vez:

```sql
DROP TABLE IF EXISTS auth_tokens;
ALTER TABLE users DROP COLUMN email_verified_at;
```

Isso preserva usuários e senhas. Não execute o `ALTER TABLE` se a coluna já não existir.

## Limites

Cadastro não exige confirmação de e-mail e não há recuperação de senha. Usuários que esquecerem a senha precisarão de suporte administrativo para redefinição. As operações administrativas e de equipe são validadas no servidor. Os leitores dos cursos ainda são arquivos HTML/JavaScript estáticos e seus materiais gratuitos podem ser abertos diretamente por URL; não publique neles conteúdo privado ou exclusivo de um plano.
