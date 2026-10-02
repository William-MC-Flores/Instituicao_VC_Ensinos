# VC Ensinos

Plataforma educacional com conteúdo de cursos de tecnologia. A migração para PHP começou pelas páginas públicas de início e catálogo; as páginas HTML antigas continuam disponíveis enquanto a conversão acontece por etapas.

## Requisitos

- PHP 8.2 ou superior com a extensão padrão `cli`.
- Node.js 18 ou superior para os scripts de autenticação Firebase.

## Executar localmente

Na raiz do projeto, inicie o servidor PHP embutido:

```powershell
php -S localhost:8000
```

Abra `http://localhost:8000/`. O PHP embutido é para desenvolvimento local, não para produção.

Valide sintaxe PHP antes de publicar:

```powershell
Get-ChildItem -Recurse -Filter *.php | ForEach-Object { php -l $_.FullName }
```

## Estrutura PHP atual

- `index.php`: página inicial.
- `pages/disciplinas.php`: catálogo.
- `pages/creditos.php` e `pages/politicas.php`: páginas institucionais.
- `php/includes/bootstrap.php`: utilitários de URL e escape HTML.
- `php/includes/header.php` e `footer.php`: estrutura compartilhada.

## Migração em andamento

Login, cadastro, painel e conteúdo dos cursos ainda usam as páginas HTML existentes. As páginas institucionais convertidas mantêm os arquivos HTML antigos como fallback. A autenticação permanece no Firebase; não há migração de senhas ou criação de sessões PHP nesta etapa. Não armazene credenciais ou segredos em arquivos servidos publicamente.

Consulte [docs/ANALISE-E-PLANO.md](docs/ANALISE-E-PLANO.md) para o diagnóstico e a sequência recomendada de modernização.