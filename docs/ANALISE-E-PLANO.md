# VC Ensinos: estado atual

## Autenticação

O cadastro, o login e a sessão usam PHP e MySQL. O cadastro não exige confirmação de e-mail; a recuperação de senha foi removida. Senhas são protegidas com `password_hash` e `password_verify`, formulários usam token CSRF e a API limita tentativas.

A configuração do banco fica em `php/config/config.php`, ignorada pelo Git e protegida contra acesso web direto. Veja [CONFIGURAR-AUTENTICACAO-PHP.md](CONFIGURAR-AUTENTICACAO-PHP.md) para instalação e migração de bancos existentes.

## Limites atuais

O banco não armazena progresso dos cursos, perfis ou papéis administrativos. Cursos servidos como HTML estático continuam acessíveis diretamente pela URL. Usuários que esquecerem a senha precisam de suporte administrativo para uma redefinição manual segura.
