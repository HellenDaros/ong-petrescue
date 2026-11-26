# Como colocar o I🧡PET no ar

- **Telas (Next.js):** Vercel
- **Backend (Spring Boot) e banco (PostgreSQL):** Railway
- **E-mail de recuperação de senha:** Brevo (o Railway bloqueia o envio por SMTP, então usamos a API do Brevo)

Faça na ordem abaixo. O código precisa estar no GitHub antes de começar.

---

## 1. Brevo (envio de e-mail)

1. Crie uma conta grátis em https://www.brevo.com.
2. Vá em **Senders, Domains & Dedicated IPs → Senders → Add a sender**, cadastre `ilovepetoficial26@gmail.com` e confirme pelo e-mail que o Brevo mandar.
3. Vá em **SMTP & API → API Keys → Generate a new API key** e copie a chave (começa com `xkeysib-`).

## 2. Railway (backend e banco)

1. Em https://railway.com, clique em **New Project → Deploy from GitHub repo** e escolha o repositório.
2. Abra o serviço criado → **Settings → Root Directory** → escreva `/backend`. O Railway vai usar o `backend/Dockerfile`.
3. No projeto, clique em **+ Create → Database → PostgreSQL**.
4. Clique com o botão direito no serviço do backend → **Attach Volume** → em *Mount path* escreva `/data`. É aqui que as fotos ficam guardadas.
5. No serviço do backend, vá em **Settings → Networking → Generate Domain**. Anote o endereço (ex.: `https://backend-production-xxxx.up.railway.app`).
6. No serviço do backend, aba **Variables**, crie:

| Variável | Valor |
| --- | --- |
| `PGHOST` | `${{Postgres.PGHOST}}` |
| `PGPORT` | `${{Postgres.PGPORT}}` |
| `PGDATABASE` | `${{Postgres.PGDATABASE}}` |
| `PGUSER` | `${{Postgres.PGUSER}}` |
| `PGPASSWORD` | `${{Postgres.PGPASSWORD}}` |
| `JWT_SECRET` | uma frase longa e aleatória, só sua (é a chave dos logins e do cadastro do administrador) |
| `BREVO_API_KEY` | a chave do Brevo |
| `UPLOAD_DIR` | `/data/uploads` |
| `SHOW_SQL` | `false` |
| `FRONTEND_URL` | por enquanto `http://localhost:3000` (troca no passo 4) |
| `CORS_ALLOWED_ORIGINS` | por enquanto `http://localhost:3000` (troca no passo 4) |

> Se o banco tiver outro nome no painel do Railway, troque `Postgres` em `${{Postgres.PGHOST}}` pelo nome dele.

7. Espere o deploy terminar e abra `https://SEU-BACKEND.up.railway.app/swagger-ui/index.html` para conferir se está no ar.

## 3. Vercel (telas)

1. Em https://vercel.com, clique em **Add New → Project** e importe o repositório.
2. Deixe o *Root Directory* na pasta principal (onde está o `package.json`).
3. Em **Environment Variables**, crie `NEXT_PUBLIC_API_URL` com o endereço do backend no Railway, **sem barra no final**.
4. Clique em **Deploy** e anote o endereço (ex.: `https://ong-aula.vercel.app`).

## 4. Ligando um no outro

Volte no Railway, no serviço do backend, e troque:

- `FRONTEND_URL` → endereço da Vercel (vai no link do e-mail de recuperação)
- `CORS_ALLOWED_ORIGINS` → endereço da Vercel (pode ter mais de um, separados por vírgula)

O Railway reinicia o backend sozinho.

## 5. Primeiro acesso

O banco do Railway começa vazio. Crie o administrador da plataforma pelo Swagger do backend no ar (`POST /usuarios/adm`), usando como chave secreta o valor de `JWT_SECRET`. Depois siga o mesmo caminho de sempre: entrar, cadastrar a ONG etc.

---

## Rodando no computador

Nada muda: sem essas variáveis, o backend usa o banco local, a porta 8080, o envio de e-mail pelo Gmail (`MAIL_PASSWORD`) e a pasta `uploads/`. As telas usam `http://localhost:8080`.
