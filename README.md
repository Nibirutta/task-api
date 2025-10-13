# TaskAPI - API Gateway Documentation

## 📋 Visão Geral

TaskAPI é uma aplicação baseada em arquitetura de microserviços usando NestJS, RabbitMQ e MongoDB. Este documento descreve todas as rotas disponíveis no API Gateway.

**URL de Produção:** `https://nibirutta-task-api.up.railway.app/`

> **⚠️ Atenção:** Esta API está em desenvolvimento ativo. Use com cautela em produção.

## 🏗️ Arquitetura

```
API Gateway (Port 3000)
├── Auth Service (Microserviço de autenticação)
├── Profile Service (Microserviço de perfil)  
├── Users Service (Microserviço de usuários)
└── Email Service (Microserviço de emails)
```

## 🔐 Autenticação

A API usa **JWT Tokens** com **cookies HttpOnly**:
- **Access Token**: Autenticação de curta duração (1 min)
- **Session Token**: Refresh token de longa duração (3 dias)
- **Reset Token**: Token único para reset de senha

## 📚 Rotas Disponíveis

### 🔑 Account Routes (`/account`)

#### **POST** `/account/register`
Registra uma nova conta de usuário.

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
- ✅ Conta criada + cookies de autenticação + dados do perfil
- ❌ `400` - Dados inválidos
- ❌ `409` - Username/email já existe

**Peculiaridades:**
- Cria automaticamente credencial e perfil
- Define cookies de autenticação
- Retorna dados completos do perfil

---

#### **POST** `/account/login`
Autentica um usuário existente.

**Dados Necessários:**
```json
{
  "username": "string (opcional)",
  "email": "string (obrigatório se username não fornecido)",
  "password": "string"
}
```

**Resposta:**
- ✅ Login realizado + cookies de autenticação + dados do perfil
- ❌ `401` - Credenciais inválidas
- ❌ `400` - Dados mal formatados

**Peculiaridades:**
- Aceita username OU email
- Define cookies HttpOnly automaticamente
- Retorna perfil completo do usuário

---

#### **GET** `/account/refresh`
Renova a sessão usando o session token.

**Autenticação:** 🔒 **SessionGuard** (cookie de sessão)

**Dados Necessários:** Nenhum (usa cookie)

**Resposta:**
- ✅ Novo access token + dados atualizados do perfil
- ❌ `401` - Session token inválido/expirado

**Peculiaridades:**
- Automaticamente lê session token do cookie
- Gera novo access token
- Atualiza cookies com novos tokens

---

#### **GET** `/account/logout`
Realiza logout do usuário.

**Autenticação:** Nenhuma (público)

**Dados Necessários:** Nenhum

**Resposta:**
- ✅ `{ "message": "Logout successful" }`

**Peculiaridades:**
- Remove cookies automaticamente
- Invalida tokens no servidor

---

#### **PATCH** `/account/credential`
Atualiza credenciais da conta (email/senha).

**Autenticação:** 🔒 **JwtGuard** (usuário logado)

**Dados Necessários:**
```json
{
  "email": "string (opcional)",
  "password": "string (opcional)"
}
```

**Resposta:**
- ✅ Credenciais atualizadas + novos cookies + dados do perfil
- ❌ `401` - Não autorizado
- ❌ `400` - Dados inválidos
- ❌ `409` - Email já em uso

**Peculiaridades:**
- Campos opcionais (atualize apenas o que desejar)
- Gera novos tokens após alteração
- Username não pode ser alterado

---

#### **POST** `/account/request-reset`
Solicita reset de senha via email.

**Autenticação:** Nenhuma (público)

**Dados Necessários:**
```json
{
  "email": "string"
}
```

**Resposta:**
- ✅ `{ "message": "Reset email sent" }`
- ❌ `400` - Email inválido
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

**Resposta:**
- ✅ `{ "message": "Password updated successfully" }`
- ❌ `400` - Token inválido/expirado
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

**Resposta:**
- ✅ Conta removida + logout automático
- ❌ `401` - Não autorizado

**Peculiaridades:**
- Remove todos os dados relacionados
- Faz logout automático via `LogoutInterceptor`
- Ação irreversível

---

### 👤 Profile Routes (`/profile`)

> **Nota:** Todas as rotas de perfil requerem autenticação (`JwtGuard`) e retornam dados do perfil atualizados (`SendProfileInterceptor`).

#### **GET** `/profile`
Obtém dados completos do perfil do usuário.

**Autenticação:** 🔒 **JwtGuard**

**Dados Necessários:** Nenhum

**Resposta:**
```json
{
  "name": "string",
  "ownerId": "string",
  "preferences": {
    "theme": "light|dark|lofi",
    "language": "pt-BR|en-US", 
    "notification": {
      "email": true | false
    }
  }
}
```

**Peculiaridades:**
- Dados são obtidos automaticamente via token JWT
- Retorna preferências completas do usuário

---

#### **POST** `/profile/name`
Altera o nome de exibição do usuário.

**Autenticação:** 🔒 **JwtGuard**

**Dados Necessários:**
```json
{
  "name": "string (1-20 caracteres)"
}
```

**Resposta:**
- ✅ Perfil atualizado com novo nome
- ❌ `400` - Nome inválido

---

#### **POST** `/profile/language`
Altera o idioma preferido do usuário.

**Autenticação:** 🔒 **JwtGuard**

**Dados Necessários:**
```json
{
  "language": "pt-BR" | "en-US"
}
```

**Resposta:**
- ✅ Perfil atualizado com novo idioma
- ❌ `400` - Idioma não suportado

---

#### **POST** `/profile/theme`
Altera o tema visual preferido.

**Autenticação:** 🔒 **JwtGuard**

**Dados Necessários:**
```json
{
  "theme": "light" | "dark" | "lofi"
}
```

**Resposta:**
- ✅ Perfil atualizado com novo tema
- ❌ `400` - Tema não suportado

---

#### **POST** `/profile/notification`
Altera configurações de notificação.

**Autenticação:** 🔒 **JwtGuard**

**Dados Necessários:**
```json
{
  "notificationType": "email",
  "activate": boolean
}
```

**Resposta:**
- ✅ Preferências de notificação atualizadas
- ❌ `400` - Tipo de notificação inválido

**Peculiaridades:**
- Atualmente apenas suporte para notificações por email
- Permite ativar/desativar tipos específicos

---

## 🍪 Gerenciamento de Cookies

### Cookies Definidos Automaticamente:

| Cookie | Tipo | Duração | Uso |
|--------|------|---------|-----|
| `access_token` | JWT | 1 min | Autenticação de requisições |
| `session_token` | JWT | 3 dias | Renovação de sessão |

### Características:
- **HttpOnly**: Não acessível via JavaScript
- **Secure**: Apenas HTTPS (produção)
- **SameSite**: Proteção CSRF
- **Path**: `/` (toda a aplicação)

---

## 🔒 Guards e Interceptors

### Guards Disponíveis:

#### `JwtGuard`
- Valida access token do cookie
- Extrai dados do usuário para `req.user`
- Usado em rotas protegidas

#### `SessionGuard` 
- Valida session token do cookie
- Usado apenas no endpoint de refresh
- Permite renovação de sessão

### Interceptors Automáticos:

#### `SendCookieInterceptor`
- Define cookies de autenticação automaticamente
- Usado em login, register, refresh

#### `SendProfileInterceptor`
- Busca e adiciona dados do perfil à resposta
- Usado em rotas que retornam perfil

#### `LogoutInterceptor`
- Remove cookies de autenticação
- Invalida tokens no servidor
- Usado em logout e delete account

---

## 🌐 CORS Configuration

### Origins Permitidas:
- `http://localhost:3000` (React dev)
- `http://localhost:5173` (Vite dev)  
- `http://127.0.0.1:5500` (Live Server)

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
- Tasks routes (rotas de gerenciamento de tarefas)
- AI assistant (auxilio da IA para que o usuário possa se organizar melhor)
- Outros meios de notificação
- Pequenas otimizações e manutenção do código

---

## 🔄 Versionamento

**Versão Atual**: `0.1.0` (Early Access)  
**Branch**: `main`  
**Última Atualização**: Outubro 2025

---

## 👥 Contribuição

1. Crie feature branch
2. Implemente testes
3. Documente mudanças
4. Submeta PR

---

*Última atualização: 13/10/2025*
