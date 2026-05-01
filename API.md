# API do Sistema de Gestão de Saúde Oftalmológica

## Base URL
http://localhost:3000

## Autenticação
Todas as rotas (exceto login) exigem token JWT no header:
Authorization: Bearer <token>

Para obter o token:
POST /auth/login
Body: { "email": "...", "password": "..." }

## Perfis de utilizador
- admin
- medico
- recepcionista
- paciente

## Principais endpoints
(Consulte a documentação Swagger em /api/docs para detalhes completos)

### Users
- GET /users (admin)
- POST /users (admin)
- GET /users/:id (admin)
- PATCH /users/:id (admin)
- DELETE /users/:id (admin)

### Pacientes
- POST /pacientes (admin, recepcionista)
- GET /pacientes (admin, recepcionista, medico)
- GET /pacientes/:id (admin, recepcionista, medico, paciente)
- PATCH /pacientes/:id (admin, recepcionista)
- DELETE /pacientes/:id (admin)

### Médicos
- POST /medicos (admin)
- GET /medicos (admin, recepcionista, medico)
- GET /medicos/:id (admin, recepcionista, medico)
- PATCH /medicos/:id (admin)
- DELETE /medicos/:id (admin)

### Consultas
- POST /consultas (admin, recepcionista, paciente)
- GET /consultas (admin, recepcionista, medico)
- GET /consultas/:id (admin, recepcionista, medico, paciente)
- PATCH /consultas/:id (admin, recepcionista, medico, paciente) – status, dados clínicos

### Prescrições
- POST /prescricoes (admin, medico)
- GET /prescricoes (admin, medico, recepcionista, paciente)
- GET /prescricoes/:id (admin, medico, recepcionista, paciente)
- PATCH /prescricoes/:id (admin, medico)
- DELETE /prescricoes/:id (admin, medico)

### Notificações
- POST /notificacoes (admin, recepcionista)
- POST /notificacoes/lembrete/:consultaId (admin, recepcionista)
- GET /notificacoes (admin, recepcionista, medico)
- GET /notificacoes/minhas (todos)
- GET /notificacoes/:id (admin, recepcionista, medico, paciente)
- PATCH /notificacoes/:id (admin, recepcionista)
- DELETE /notificacoes/:id (admin)

### Internações
- POST /internacoes (admin, medico)
- GET /internacoes (admin, medico, recepcionista)
- GET /internacoes/:nrProcesso (admin, medico, recepcionista)
- PATCH /internacoes/:nrProcesso (admin, medico)
- DELETE /internacoes/:nrProcesso (admin)

### Relatórios (apenas admin)
- GET /relatorios/resumo
- GET /relatorios/consultas-por-medico
- GET /relatorios/diagnosticos-comuns

## Formato de datas
ISO 8601: "2026-05-01T15:00:00.000Z"

## Tratamento de erros
A API retorna status HTTP padrão (400, 401, 403, 404, 500) com corpo no formato:
{
  "statusCode": 400,
  "message": "Descrição do erro",
  "timestamp": "...",
  "path": "/rota"
}
