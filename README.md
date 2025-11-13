# TaskAPI - API Gateway Documentation

## 📋 Visão Geral

TaskAPI é uma aplicação baseada em arquitetura de microserviços usando NestJS, RabbitMQ e MongoDB. Este documento descreve todas as rotas disponíveis no API Gateway.

**URL de Produção:** `https://nibirutta-task-api.up.railway.app/`

> **⚠️ Atenção:** Esta API está em desenvolvimento ativo. Use com cautela em produção.

## 🏗️ Arquitetura

```
API Gateway (Port 3000)
├── Account Service (Microserviço de contas)
├── Task Service (Microserviço de tarefas)
└── Notification Service (Microserviço de notificações)
```

## 🔐 Autenticação

– Rotas com proteção usam dois tipos de token:

- Access Token: curta duração (1 min) — deve ser enviado no header Authorization: Bearer <token>
- Session Token: longa duração (3 dias) — enviado e renovado como Cookie HttpOnly chamado sessionToken
- Reset Token: token único (30 min) para reset de senha, enviado por e-mail

Observações:
- JwtGuard lê o Access Token do header Authorization
- SessionGuard lê o Session Token do cookie sessionToken

## 📚 Rotas Disponíveis

### 🔑 Account Routes (`/account`)

#### **POST** `/account/register`
Registra uma nova conta de usuário.

Autenticação: GuestGuard (bloqueia usuários já autenticados)

**Dados Necessários:**
```json
{
  "username": "string (3-20 caracteres)",
  "email": "string (email válido)", 
  "password": "string (senha forte)",
  "name": "string (1-20 caracteres)"
}
```

**Resposta:**
- ✅ Corpo: { profile, accessToken } e cookie sessionToken definido
- ❌ `400` - Dados inválidos
- ❌ `403` - Usuário já logado
- ❌ `409` - Username/email já existe

**Peculiaridades:**
- Cria automaticamente uma conta de usuário
- Define e retorna cookies de autenticação
- Retorna dados completos do perfil

---

#### **POST** `/account/login`
Autentica um usuário existente.

Autenticação: GuestGuard (bloqueia usuários já autenticados)

**Dados Necessários:**
```json
{
  "username": "string (opcional)",
  "email": "string (obrigatório se username não fornecido)",
  "password": "string"
}
```

**Resposta:**
- ✅ Corpo: { profile, accessToken } e cookie sessionToken definido
- ❌ `401` - Credenciais inválidas
- ❌ `403` - Usuário já logado
- ❌ `400` - Dados mal formatados

**Peculiaridades:**
- Aceita username OU email
- Retorna os tokens de sessão (**Access Token** & **Session Token**)
- Retorna perfil completo do usuário

---

#### **GET** `/account/refresh`
Renova a sessão usando o session token.

Autenticação: 🔒 SessionGuard (usa cookie de sessão)

**Dados Necessários:** Nenhum (usa cookie)

**Resposta:**
- ✅ Corpo: { profile, accessToken } e novo cookie sessionToken definido
- ❌ `401` - Session token inválido/expirado

**Peculiaridades:**
- Automaticamente lê session token do cookie
- Gera novo access token
- Atualiza cookies com novos tokens

---

#### **GET** `/account/logout`
Realiza logout do usuário.

**Dados Necessários:** Nenhum

**Peculiaridades:**
- Responde 204 No Content
- Limpa o cookie sessionToken
- Invalida o session token no servidor

---

#### **PATCH** `/account`
Pode atualizar qualquer informação da conta do usuário (email, senha, nome...).

Autenticação: 🔒 JwtGuard (usuário logado)

**Dados Necessários:**
```json
{
  "email": "string (opcional)",
  "password": "string (opcional)",
  "name": "string (1-20, opcional)",
  "language": "pt-br|en-us|... (opcional)",
  "theme": "default|dark|... (opcional)",
  "notification": {
    "notificationType": "email" ,
    "isActivated": true
  }
}
```

**Resposta:**
- ✅ Corpo: { profile, accessToken } e cookie sessionToken redefinido
- ❌ `401` - Não autorizado
- ❌ `400` - Dados inválidos
- ❌ `409` - Email já em uso

**Peculiaridades:**
- Todos os campos são opcionais (atualize apenas o que desejar)
- Gera novos tokens após alteração
- Username não pode ser alterado

---

#### **POST** `/account/request-reset`
Solicita reset de senha via email.

Autenticação: pública (bloqueada para autenticados via GuestGuard)

**Dados Necessários:**
```json
{
  "email": "string"
}
```

- ✅ `{ "success": true }`
- ❌ `400` - Email inválido
- ❌ `403` - Usuário já logado
- ❌ `404` - Email não encontrado

**Peculiaridades:**
- Sempre retorna sucesso (por segurança)
- Envia email com link de reset
- Token tem validade limitada

---

#### **POST** `/account/reset-password?token={resetToken}`
Redefine a senha usando token de reset.

**Autenticação:** Nenhuma (usa token via query)

**Dados Necessários:**
- **Query Param:** `token` (string)
- **Body:**
```json
{
  "password": "string (senha forte)"
}
```

- ✅ `{ "success": true }`
- ❌ `400` - Token inválido/expirado
- ❌ `403` - Usuário já logado
- ❌ `400` - Senha não atende critérios

**Peculiaridades:**
- Token é de uso único
- Token expira automaticamente
- Senha deve atender políticas de segurança

---

#### **DELETE** `/account`
Remove a conta do usuário permanentemente.

**Autenticação:** 🔒 **JwtGuard** (usuário logado)

**Dados Necessários:** Nenhum

- ✅ 204 No Content (logout automático e sessão invalidada)
- ❌ `401` - Não autorizado

**Peculiaridades:**
- Remove todos os dados relacionados
- Faz logout automático via `LogoutInterceptor`
- Ação irreversível

---

### ✅ Task Routes (`/task`)

> **Nota:** Todas as rotas de tarefas requerem autenticação (`JwtGuard`) e são automaticamente associadas ao usuário logado.

#### **GET** `/task`
Obtém lista de tarefas do usuário com filtros opcionais.

**Autenticação:** 🔒 **JwtGuard**

**Dados Necessários:** Nenhum (filtros via query parameters)

**Query Parameters (opcionais):**
```
?title=string                    // Filtrar por título
&status=to-do|in-progress|in-review|done
&priority=low|medium|high|urgent|optional
&from=2024-01-01T00:00:00.000Z   // Data inicial
&to=2024-12-31T23:59:59.000Z     // Data final
```

**Resposta:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "status": "to-do|in-progress|in-review|done",
    "priority": "low|medium|high|urgent|optional",
    "dueDate": "2024-10-25T10:30:00.000Z",
    "createdAt": "2024-10-21T15:00:00.000Z",
    "updatedAt": "2024-10-21T15:00:00.000Z"
  }
]
```

**Peculiaridades:**
- Retorna apenas tarefas do usuário autenticado
- Filtros podem ser combinados
- Lista vazia se nenhuma tarefa encontrada

---

#### **POST** `/task`
Cria uma nova tarefa para o usuário.

**Autenticação:** 🔒 **JwtGuard**

**Dados Necessários:**
```json
{
  "title": "string (obrigatório)",
  "description": "string (opcional)",
  "status": "to-do" | "in-progress" | "in-review" | "done",
  "priority": "low" | "medium" | "high" | "urgent" | "optional",
  "dueDate": "2024-10-25T10:30:00.000Z (obrigatório)"
}
```

**Resposta:**
- ✅ Tarefa criada com dados completos + ID gerado
- ❌ `400` - Dados inválidos
- ❌ `401` - Não autorizado

**Peculiaridades:**
- `status` padrão: `"to-do"` se não especificado
- `priority` padrão: `"medium"` se não especificado
- `owner` automaticamente definido pelo usuário logado
- `dueDate` deve ser uma data válida no futuro

---

#### **PATCH** `/task/:id`
Atualiza uma tarefa existente do usuário.

**Autenticação:** 🔒 **JwtGuard**

**Parâmetros de URL:**
- `id`: ID da tarefa a ser atualizada

**Dados Necessários:**
```json
{
  "title": "string (opcional)",
  "description": "string (opcional)",
  "status": "to-do" | "in-progress" | "in-review" | "done",
  "priority": "low" | "medium" | "high" | "urgent" | "optional",
  "dueDate": "2024-10-25T10:30:00.000Z (opcional)"
}
```

**Resposta:**
- ✅ Tarefa atualizada com dados completos
- ❌ `400` - Dados inválidos
- ❌ `401` - Não autorizado
- ❌ `404` - Tarefa não encontrada

**Peculiaridades:**
- Apenas campos fornecidos são atualizados
- Usuário só pode atualizar suas próprias tarefas
- `updatedAt` automaticamente atualizado

---

#### **DELETE** `/task/:id`
Remove uma tarefa do usuário permanentemente.

**Autenticação:** 🔒 **JwtGuard**

**Parâmetros de URL:**
- `id`: ID da tarefa a ser removida

**Dados Necessários:** Nenhum

**Resposta:**
- ✅ `{ "message": "Task deleted successfully" }`
- ❌ `401` - Não autorizado
- ❌ `404` - Tarefa não encontrada

**Peculiaridades:**
- Usuário só pode deletar suas próprias tarefas
- Ação irreversível
- Remove completamente do banco de dados

---

## 📋 Estados e Prioridades das Tarefas

### **Status Disponíveis:**
| Status | Descrição |
|--------|-----------|
| `to-do` | Tarefa pendente para iniciar |
| `in-progress` | Tarefa em andamento |
| `in-review` | Tarefa em revisão/validação |
| `done` | Tarefa concluída |

### **Prioridades Disponíveis:**
| Prioridade | Descrição |
|------------|-----------|
| `optional` | Tarefa opcional/baixa urgência |
| `low` | Prioridade baixa |
| `medium` | Prioridade média (padrão) |
| `high` | Prioridade alta |
| `urgent` | Tarefa urgente |

---

## 🍪 Gerenciamento de Cookies

### Cookies Definidos Automaticamente:

| Cookie | Tipo | Duração | Uso |
|--------|------|---------|-----|
| `sessionToken` | JWT | 3 dias | Renovação de sessão (SessionGuard) |

Observações:
- Access Token NÃO é cookie; ele vem no corpo da resposta e deve ser enviado no header Authorization em chamadas protegidas

### Características:
- HttpOnly: Não acessível via JavaScript
- Secure: Apenas HTTPS (produção)
- SameSite: `none` (para funcionar com front-ends em domínios diferentes)
- Path: `/` (toda a aplicação)

---

## 🔒 Guards e Interceptors

### Guards Disponíveis:

#### JwtGuard
- Lê e valida o Access Token do header Authorization: Bearer <token>
- Popula `req.user` com o payload do token
- Usado nas rotas protegidas (task, update/delete account, logout)

#### SessionGuard 
- Lê e valida o Session Token do cookie `sessionToken`
- Usado no endpoint `/account/refresh`

#### GuestGuard
- Bloqueia acesso de usuários já autenticados a rotas públicas (register, login, reset)

### Interceptors Automáticos:

#### SendCookieInterceptor
- Define/renova o cookie `sessionToken` e remove `sessionToken` do corpo da resposta
- Usado em register, login e refresh

#### LogoutInterceptor
- Limpa o cookie `sessionToken` e invalida o token de sessão no servidor
- Usado em logout e delete account

---

## 🌐 CORS Configuration

### Configurações:
- `credentials: true` (cookies permitidos)
- `optionsSuccessStatus: 200`

---

## 🐛 Tratamento de Erros

### Códigos de Status Comuns:

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| `200` | Sucesso | Operação realizada |
| `201` | Criado | Registro/Login bem-sucedido |
| `400` | Bad Request | Dados inválidos |
| `401` | Unauthorized | Token inválido/expirado |
| `403` | Forbidden | Acesso negado |
| `404` | Not Found | Recurso não encontrado |
| `409` | Conflict | Dados duplicados |
| `500` | Server Error | Erro interno |

### Estrutura de Erro:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

---

## 📜 Implementações futuras

- Logger customizado
- Rate limiting (limitação de acesso)
- Health checks (verificação de status do servidor)
- AI assistant (auxilio da IA para que o usuário possa se organizar melhor)
- Outros meios de notificação
- Pequenas otimizações e manutenção do código

---

## 🔄 Versionamento

**Versão Atual**: `1.0.0` (Early Access)  
**Branch**: `main`  
**Última Atualização**: Novembro 2025

---

## 👥 Contribuição

1. Crie feature branch
2. Implemente testes
3. Documente mudanças
4. Submeta PR

---

*Última atualização: 13/11/2025*
