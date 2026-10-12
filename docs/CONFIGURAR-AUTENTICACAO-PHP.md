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

O esquema cria usuários, rate limits, disciplinas principais (como Banco de Dados, Java, Programação Web e Design Gráfico), módulos, turmas, matrículas, atribuições de equipe e fila de aprovação de conteúdo. Ele não tenta criar o banco, que deve ser provisionado pelo painel.

## 3. Configurar os arquivos

1. Duplique `php/config/config.example.php` como `php/config/config.php`.
2. Em `database`, coloque os quatro valores copiados do painel. Não use `localhost`, `root` ou os valores de exemplo.
3. Em `app_url`, informe a URL HTTPS pública exata da aplicação, incluindo o caminho da pasta se ela não estiver na raiz do subdomínio.
4. Em `mail`, configure o SMTP do Gmail: host `smtp.gmail.com`, porta `587`, criptografia `tls`, endereço Gmail, senha de app do Google e o mesmo endereço como remetente.
5. Mantenha `config.php` privado: o arquivo está no `.gitignore` e a pasta tem regra Apache para negar acesso web. Nunca publique credenciais em Git, capturas de tela ou mensagens.

Os links internos são gerados relativamente à raiz do projeto e não precisam de domínio configurado no PHP. Acesse sempre pelo subdomínio HTTPS gratuito da InfinityFree.

Para Gmail, ative a verificação em duas etapas na conta remetente e gere uma **senha de app** para o site. Use essa senha no campo `mail.password`, não a senha normal da conta Google. O PHPMailer já está incluído no repositório; não é necessário instalar Composer nem habilitar `mail()` do PHP. Não envie o arquivo de exemplo no lugar da configuração real nem publique uma cópia local de `config.php`.

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

Para uma instalação anterior à gestão de perfis, faça backup e execute uma única vez as migrações nesta ordem: `database/migrations/20261012_profiles_and_learning.sql`, `database/migrations/20261012_profile_customization.sql`, `database/migrations/20261012_email_verification_password_reset.sql` e `database/migrations/20261012_subject_areas.sql`, antes de publicar a nova versão. A primeira migração mantém as contas atuais como alunos Free e cria as tabelas de aprendizagem; as seguintes adicionam campos de perfil, confirmação por e-mail e, por último, disciplinas principais e seus vínculos aos módulos existentes. Se alguma migração já foi aplicada, execute somente as que ainda faltam. Não execute uma migração novamente: os `ALTER TABLE` não são repetíveis. Se `users.email_verified_at` já existir por uma instalação antiga, remova apenas a instrução `ADD COLUMN email_verified_at` da migração de confirmação e execute as demais instruções. As contas existentes ficarão pendentes de confirmação; elas podem solicitar um novo link na tela de login.

O plano Free permite visualizar as páginas das disciplinas, mas não permite inscrição em turmas; esse acesso exige Standard ou Pro. Os planos Standard e Pro ainda não podem ser adquiridos e nenhum pagamento é processado. As aulas ao vivo, suporte por dúvidas e benefícios exclusivos dependem da disponibilização futura dos planos e de seus respectivos serviços.

No plano Free, cada usuário pode alterar o nome de exibição e enviar/remover a própria foto. Capa, biografia, pronomes, links e controle de visibilidade são recursos avançados para Standard/Pro; administradores e colaboradores recebem acesso como parte da equipe. Os planos pagos ainda estão indisponíveis. A foto aceita JPG, PNG ou WebP até 2 MB; a capa, até 3 MB. O perfil é privado por padrão, não exibe e-mail e só se torna acessível publicamente quando o próprio usuário seleciona essa opção. Imagens são armazenadas no próprio site, sem carregar recursos de serviços externos.

As informações públicas devem ser respeitosas e não podem incluir conteúdo ofensivo, discriminatório ou dados pessoais de terceiros. A biografia é texto simples, escapado na exibição; arquivos SVG e GIF não são aceitos nos uploads. As imagens ficam em armazenamento não acessível diretamente pela web; a rota de exibição verifica se o perfil é público ou se a pessoa que pediu a imagem é a dona da conta.

## Limites

O cadastro envia um link de verificação válido por 24 horas; a recuperação envia link válido por 30 minutos. Ambos são aleatórios, de uso único e armazenados no banco somente como hash. As mensagens de recuperação são genéricas para não identificar contas cadastradas; falhas de SMTP são registradas no log e retornam indisponibilidade temporária. O envio exige SMTP autorizado e corretamente configurado; não compartilhe a senha de app em Git ou mensagens. As operações administrativas e de equipe são validadas no servidor. O painel permite cadastrar e editar disciplinas principais e associá-las a colaboradores; a atribuição concede acesso aos módulos já associados à disciplina. A migração amplia as atribuições anteriores aos outros módulos daquela mesma disciplina. Cadastrar uma disciplina não cria módulos, aulas ou materiais automaticamente; disciplinas sem módulos ainda não podem ser atribuídas à equipe. Os leitores dos cursos ainda são arquivos HTML/JavaScript estáticos e seus materiais gratuitos podem ser abertos diretamente por URL; não publique neles conteúdo privado ou exclusivo de um plano.
