# VC Ensinos: estado atual

## Autenticação

O cadastro, o login e a sessão usam PHP e MySQL. O cadastro exige confirmação de e-mail enviada pelo PHPMailer via SMTP; a recuperação de senha envia links temporários de uso único. Senhas são protegidas com `password_hash` e `password_verify`, formulários usam token CSRF e a API limita tentativas.

A configuração do banco e do SMTP fica em `php/config/config.php`, ignorada pelo Git e protegida contra acesso web direto. Veja [CONFIGURAR-AUTENTICACAO-PHP.md](CONFIGURAR-AUTENTICACAO-PHP.md) para instalação, configuração de SMTP e migração de bancos existentes.

## Limites atuais

Cursos servidos como HTML estático continuam acessíveis diretamente pela URL. A verificação e recuperação por e-mail exigem configuração SMTP válida na instalação.
