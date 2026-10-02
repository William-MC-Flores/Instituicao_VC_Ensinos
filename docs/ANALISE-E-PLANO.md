# VC Ensinos: análise e plano de modernização

## Diagnóstico atual

O projeto está em migração de uma aplicação estática com 22 páginas HTML para uma aplicação PHP híbrida. A autenticação continua usando Firebase Authentication diretamente no navegador. O `package.json` declara apenas `firebase`; ainda não há suíte de testes, bundler ou pipeline de build.

### Pontos positivos

- O conteúdo educacional já está organizado por disciplinas e módulos.
- A autenticação existente pode ser mantida durante a transição.
- Os cursos são representados por objetos JavaScript, o que facilita uma futura fonte de dados no backend.
- O layout já possui alguns pontos responsivos e utiliza imagens próprias do projeto.

### Problemas encontrados

- A página inicial estava na raiz, mas referenciava CSS, imagens e scripts com `../`, quebrando vários recursos.
- A configuração Firebase estava duplicada em quatro módulos.
- O painel confiava em `localStorage` para mostrar um usuário e não verificava a sessão atual.
- Páginas e scripts misturam responsabilidades de navegação, autenticação, dados e renderização.
- Há links vazios, estilos inline e textos sem acentuação consistente.
- O catálogo está codificado no JavaScript e usa filtros com categorias inconsistentes (`front-end` e `Front-end`).
- A aplicação injeta strings de cursos via `innerHTML`; o conteúdo atual é local, mas a estratégia precisa mudar quando os dados vierem do servidor.
- Não existe validação automatizada de links, acessibilidade, responsividade ou fluxo de autenticação.
- PHP não está instalado no ambiente atual, então as páginas PHP criadas ainda não puderam ser servidas ou validadas com `php -l`.

## Alterações já feitas

- Corrigidos os caminhos da home e seus links de rodapé.
- Corrigidos os caminhos dos cards exibidos na home.
- Melhorados textos alternativos e alguns rótulos de navegação.
- Criado `js/cadastro/firebase.js` como ponto único de inicialização do Firebase.
- Migrados login, cadastro, catálogo e dashboard para usar a instância compartilhada.
- O painel passou a validar o usuário autenticado antes de exibir o nome.
- Adicionada checagem de sintaxe dos módulos JavaScript envolvidos.
- Criada uma home PHP em `index.php` e páginas PHP de catálogo, créditos e políticas.
- Criados includes PHP compartilhados para cabeçalho, rodapé, URLs e escape de saída.
- Mantidas as páginas HTML antigas como fallback; autenticação e cursos ainda não foram convertidos.

## Arquitetura recomendada

### Fase 1: estabilizar o frontend atual

1. Normalizar caminhos e componentes compartilhados.
2. Normalizar categorias e transformar o catálogo em um único arquivo de dados.
3. Substituir `innerHTML` por criação segura de elementos ou sanitização quando dados externos entrarem.
4. Adicionar estados de carregamento, erro e vazio.
5. Corrigir acessibilidade: foco visível, labels, contraste, navegação por teclado e `alt` informativo.
6. Adicionar testes simples de links, scripts e dados do catálogo.

### Fase 2: PHP sem quebrar o conteúdo

Em andamento: home, catálogo e páginas institucionais usam includes compartilhados. Próximas páginas candidatas: login/cadastro após escolher autenticação, painel e então conteúdo de cursos.

A migração deve começar por páginas de estrutura, não pela autenticação:

- `php/includes/bootstrap.php`: utilitários de URL e escape HTML já criados.
- `php/includes/header.php`: navegação compartilhada já criada.
- `php/includes/footer.php`: rodapé compartilhado já criado.
- `php/includes/catalogo.php`: leitura do catálogo a partir de JSON ou banco.
- Páginas públicas PHP: início, catálogo, créditos e políticas já criadas.

As páginas de disciplina podem continuar como conteúdo estático no primeiro momento. Depois, seus metadados e progresso podem ir para um banco SQLite ou MySQL.

### Fase 3: autenticação e dados no servidor

Há duas opções válidas:

1. Manter Firebase Auth e validar tokens no backend PHP usando o SDK oficial, caso a base de usuários já seja relevante.
2. Migrar para sessões PHP com `password_hash`, `password_verify`, proteção CSRF, cookies `HttpOnly`, `Secure` e `SameSite`, caso o objetivo seja independência do Firebase.

A segunda opção só deve acontecer com uma migração explícita de usuários e testes de recuperação de conta. Nunca se deve copiar senhas existentes do Firebase.

## Prioridade visual e de eficiência

- Criar tokens CSS para cores, espaçamento, tipografia e largura máxima.
- Remover regras globais que afetam todas as páginas sem necessidade.
- Usar `loading="lazy"` em imagens fora da primeira viewport e dimensões estáveis para evitar deslocamento de layout.
- Reduzir dependência de fontes externas ou definir fallback apropriado.
- Melhorar mobile do cabeçalho, catálogo e formulários.
- Usar uma grade de cards consistente, com estados de hover e foco equivalentes.
- Evitar carregar Firebase em páginas que não precisam de autenticação.

## Infraestrutura necessária

Para executar a próxima fase localmente, instalar PHP 8.2 ou superior e habilitar SQLite ou MySQL conforme a escolha do backend. Também será útil adicionar scripts npm para validações, por exemplo:

- checagem de sintaxe JavaScript;
- verificação de links e assets;
- servidor local frontend;
- testes de navegador com Playwright.

A implementação deve ocorrer em etapas pequenas, mantendo a versão estática funcionando enquanto cada página PHP é validada.
