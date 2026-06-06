# Roadmap — Rede Social de Mapas

## Conceito

Um aplicativo onde cada pessoa tem seu **mapa pessoal de viagens** — cidades visitadas, fotos, timeline — e pode descobrir outros viajantes, ver quem esteve nos mesmos lugares e conectar conteúdo de outras plataformas (Instagram, Telegram) num único lugar geográfico.

**Diferencial:** não é mais uma rede social. É uma **camada geográfica** sobre a vida das pessoas.

---

## Stack (zero custo)

| Serviço | Uso | Custo |
|---|---|---|
| Firebase Auth | Login (Google, Telegram) | Gratuito |
| Firestore | Banco de dados | Gratuito (50K leituras/dia) |
| Firebase Storage | Fotos e vídeos | Gratuito (5GB) |
| Firebase Hosting | Deploy do app | Gratuito (10GB/mês) |
| Leaflet.js | Mapas | Gratuito, open source |
| Nominatim | Geocodificação | Gratuito |
| Instagram Basic Display API | Integração Instagram | Gratuito |
| Telegram Bot API | Integração Telegram | Gratuito |

> **Sem Cloud Functions** (requer plano pago). Toda lógica roda no cliente ou via APIs externas.

---

## Modelo de dados

### Usuário
```
users/{uid}
  ├── username        (único, ex: "amanda")
  ├── displayName
  ├── bio
  ├── avatarUrl
  ├── isPublic        (true/false)
  ├── createdAt
  ├── instagramToken  (opcional, criptografado)
  └── telegramId      (opcional)
```

### Cidades (por usuário)
```
users/{uid}/cities/{slug}
  ├── name
  ├── slug
  ├── country
  ├── coords          ([lat, lng])
  ├── yearMonths      (["2026-5", "2026-4"])
  ├── liveFrom        (opcional, ano que passou a morar)
  ├── subtitle        (opcional, "Casa desde 2024")
  └── pinOnly         (true/false)
```

### Fotos (por usuário e cidade)
```
users/{uid}/photos/{slug}/entries/{id}
  ├── url
  ├── year
  ├── month
  ├── eventTitle
  ├── title
  ├── order
  ├── createdAt
  ├── userId          (para queries no collectionGroup)
  └── source          ("manual" | "instagram" | "telegram")
```

### Social
```
users/{uid}/followers/{followerUid}
  └── followedAt

users/{uid}/following/{followingUid}
  └── followedAt

likes/{photoId}/users/{uid}
  └── likedAt

comments/{photoId}/entries/{id}
  ├── uid
  ├── text
  └── createdAt
```

---

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Perfil público: qualquer um lê, só o dono escreve
    match /users/{uid} {
      allow read: if resource.data.isPublic == true
                  || request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
    }

    // Cidades: mesma lógica do perfil pai
    match /users/{uid}/cities/{slug} {
      allow read: if get(/databases/$(database)/documents/users/$(uid))
                    .data.isPublic == true
                  || request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
    }

    // Fotos: mesma lógica do perfil pai
    match /users/{uid}/photos/{slug}/entries/{id} {
      allow read: if get(/databases/$(database)/documents/users/$(uid))
                    .data.isPublic == true
                  || request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
    }

    // Follows: usuário logado pode seguir/desseguir
    match /users/{uid}/followers/{followerUid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == followerUid;
    }

    // Likes e comentários: qualquer logado lê, autor escreve
    match /likes/{photoId}/users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
    }

    match /comments/{photoId}/entries/{id} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.uid;
    }
  }
}
```

---

## Fases de desenvolvimento

### Fase 1 — Multi-usuário (base)
> Sem isso, nada do resto funciona.

- [ ] Migrar dados existentes para `users/{uid}/...`
- [ ] Remover `ADMIN_EMAIL` hardcoded — qualquer usuário logado pode criar cidades e fazer upload
- [ ] Implementar Firestore Security Rules
- [ ] Criar página de perfil `/user/{username}` com mapa + timeline
- [ ] Sistema de username único
- [ ] Opção de perfil público / privado

**Resultado:** qualquer pessoa pode criar uma conta e ter seu próprio mapa.

---

### Fase 2 — Descoberta e mapa coletivo
> O diferencial geográfico.

- [ ] Página principal com mapa de todos os usuários públicos
- [ ] `collectionGroup('cities')` para buscar cidades de todos os usuários
- [ ] Ao clicar numa cidade no mapa coletivo: ver quem esteve lá
- [ ] Busca de usuários por nome/username
- [ ] Sistema de seguir / deixar de seguir

**Resultado:** as pessoas se descobrem pelo mapa.

---

### Fase 3 — Feed social
> Conteúdo de quem você segue.

- [ ] Feed pull-based (sem Cloud Functions):
  1. Buscar lista de quem o usuário segue
  2. Queries paralelas nas fotos de cada um
  3. Merge e ordenação por data no cliente
- [ ] Notificações básicas (novo seguidor, like, comentário) via Firestore listener
- [ ] Página de exploração (posts recentes de perfis públicos)

**Resultado:** experiência de rede social completa.

---

### Fase 4 — Vídeos e Stories
> Mais formatos de conteúdo.

- [ ] Upload de vídeos (Firebase Storage suporta nativamente)
- [ ] Player de vídeo inline na timeline
- [ ] Stories: foto/vídeo com expiração de 24h
  - Campo `expiresAt` no Firestore
  - Cliente ignora stories expirados (sem Cloud Function necessária)
  - Limpeza periódica opcional via script

**Resultado:** paridade de formato com redes sociais modernas.

---

### Fase 5 — Mensagens diretas
> Comunicação entre usuários.

- [ ] Chat 1-a-1 via Firestore (real-time listeners)
- [ ] Estrutura: `chats/{chatId}/messages/{id}`
- [ ] Notificação de mensagem nova (Firestore listener ativo)
- [ ] Compartilhar localização / cidade no chat

**Resultado:** comunicação privada dentro do app.

---

### Fase 6 — Integração Instagram
> Conteúdo do Instagram aparece no mapa automaticamente.

**Como funciona:**
1. Usuário conecta conta via Instagram Basic Display API (OAuth)
2. App busca fotos do usuário com localização
3. Fotos aparecem no mapa na cidade correspondente
4. Source da foto marcada como `"instagram"`

**Requisitos:**
- Criar app no Meta Developers (gratuito)
- Revisão da Meta necessária para uso público
- Token de acesso salvo no Firestore (por usuário)

- [ ] Tela de conexão de conta Instagram
- [ ] OAuth flow com Instagram Basic Display API
- [ ] Sincronização de fotos (manual ou periódica)
- [ ] Mapeamento de localização da foto → cidade no app

---

### Fase 7 — Integração Telegram
> A integração mais fácil e poderosa.

**Como funciona (opção A — Bot):**
1. Usuário abre o bot no Telegram
2. Envia uma foto (com legenda opcional e cidade)
3. Bot publica automaticamente no mapa do usuário

**Como funciona (opção B — Login):**
1. Usuário loga com conta Telegram (Telegram Login Widget)
2. Foto de perfil e nome sincronizados

- [ ] Criar bot no Telegram (via @BotFather, gratuito)
- [ ] Servidor do bot (pode usar Cloudflare Workers — gratuito)
- [ ] Comando `/postar [cidade] [legenda]` + foto
- [ ] Vinculação de conta Telegram ↔ conta do app
- [ ] Telegram Login Widget como método de autenticação

---

## Telas necessárias

| Tela | Descrição |
|---|---|
| `/` | Mapa coletivo (página inicial) |
| `/login` | Login (Google, Telegram) |
| `/user/{username}` | Perfil público com mapa individual |
| `/user/{username}/city/{slug}` | Timeline de uma cidade de um usuário |
| `/feed` | Feed de quem você segue |
| `/explore` | Descoberta de usuários e lugares |
| `/messages` | Mensagens diretas |
| `/settings` | Configurações da conta |

---

## Limitações do plano gratuito Firebase

| Recurso | Limite gratuito | Quando escala |
|---|---|---|
| Firestore leituras | 50.000/dia | ~500 usuários ativos |
| Firestore escritas | 20.000/dia | confortável por muito tempo |
| Storage | 5 GB | ~2.000 fotos em alta resolução |
| Hosting bandwidth | 10 GB/mês | confortável no início |
| Auth | ilimitado | sem preocupação |

> Quando o app crescer, o plano Blaze (pay-as-you-go) entra — mas só paga pelo que usa, sem mensalidade fixa.

---

## Ordem de implementação sugerida

```
Fase 1 (multi-usuário)
    ↓
Fase 2 (mapa coletivo)
    ↓
Fase 6 (Instagram) ← paralelo com Fase 3
Fase 7 (Telegram)  ←
    ↓
Fase 3 (feed)
    ↓
Fase 4 (vídeos/stories)
    ↓
Fase 5 (mensagens)
```

As integrações de Instagram e Telegram podem vir cedo porque **trazem conteúdo** para o app — quanto antes, mais útil fica para os primeiros usuários.
