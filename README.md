# VC Ensinos — InfinityFree

Site educacional com páginas institucionais, catálogo, cursos, perfis de aluno/colaborador/administrador e autenticação por PHP/MySQL. A implantação suportada é uma conta InfinityFree usando o subdomínio gratuito fornecido pela hospedagem; não configure domínio próprio.

## Implantação

Siga [docs/CONFIGURAR-AUTENTICACAO-PHP.md](docs/CONFIGURAR-AUTENTICACAO-PHP.md). Resumo:

1. Crie/ative o subdomínio gratuito e o certificado HTTPS no painel InfinityFree.
2. Envie os arquivos do site para a pasta `htdocs` da conta.
3. Crie o banco MySQL no painel InfinityFree, importe `database/schema.sql` pelo phpMyAdmin da hospedagem e configure `php/config/config.php` com os dados fornecidos no painel.
4. Acesse o subdomínio HTTPS atribuído à conta.

O site requer PHP 8.1 ou superior com `PDO MySQL`, MySQL/MariaDB e Apache. Não requer Composer ou npm.

Cadastro, login, confirmação de e-mail e recuperação de senha são implementados em `php/api/auth.php`, com envio SMTP via PHPMailer. O fluxo de confirmação e recuperação está em testes e ainda exige validação ponta a ponta com SMTP e banco configurados. Novas contas só podem entrar depois de confirmar o endereço; links são de uso único e expiram. Configure SMTP e a URL pública em `php/config/config.php` conforme o guia antes de habilitar cadastro em produção. Senhas são armazenadas com `password_hash`; formulários usam CSRF e a API limita tentativas.

O painel de aprendizagem e as permissões de turma/equipe usam `php/api/workspace.php`; perfis novos recebem automaticamente o papel `student` e o plano `free`. Papéis de equipe não podem ser escolhidos no cadastro: um administrador precisa atribuí-los. O catálogo organiza os módulos existentes em disciplinas como Banco de Dados, Java, Programação Web e Design Gráfico; a equipe administrativa pode cadastrar novas disciplinas, editar suas descrições e atribuí-las aos colaboradores no painel.

O plano Free permite visualizar as páginas das disciplinas; a inscrição em turmas exige Standard ou Pro, que estão indisponíveis, e não existe cobrança integrada. No Free, o perfil permite alterar nome e foto; a personalização avançada é reservada a Standard/Pro e à equipe. Perfis começam privados, e cada pessoa decide se os torna públicos. Turmas são abertas por administradores, colaboradores precisam receber atribuição por disciplina/turma, e os materiais enviados ficam pendentes até aprovação administrativa. Promova inicialmente uma conta confiável a `admin` diretamente no banco; depois, use o painel para administrar perfis e atribuições.

Para atualizar um banco que já possui a tabela `users`, faça backup e execute uma vez `database/migrations/20261012_profiles_and_learning.sql`, `database/migrations/20261012_profile_customization.sql`, `database/migrations/20261012_email_verification_password_reset.sql` e `database/migrations/20261012_subject_areas.sql`, nessa ordem, pelo phpMyAdmin antes de publicar o código. Se alguma migração já foi aplicada, execute somente as que ainda não foram. Novas instalações devem importar apenas `database/schema.sql`.

O código-fonte também inclui arquivos HTML estáticos para páginas e cursos. O Apache prioriza `index.php` para que a página inicial use os caminhos e recursos da aplicação.