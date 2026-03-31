# src/backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from db import get_connection

app = FastAPI(title="IT Asset Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- USUÁRIOS ---

@app.get("/usuarios")
def listar_usuarios():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, nome, username FROM usuarios")
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

@app.post("/usuarios")
def criar_usuario(user: dict):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        query = "INSERT INTO usuarios (nome, username, senha) VALUES (%s, %s, %s)"
        cursor.execute(query, (user['nome'], user['username'], user['senha']))
        conn.commit()
        return {"status": "usuário criado"}
    finally:
        cursor.close()
        conn.close()

@app.put("/usuarios/{id}")
def editar_usuario(id: int, user: dict):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        query = "UPDATE usuarios SET nome = %s, senha = %s WHERE id = %s"
        cursor.execute(query, (user['nome'], user['senha'], id))
        conn.commit()
        return {"status": "usuário atualizado"}
    finally:
        cursor.close()
        conn.close()

@app.delete("/usuarios/{id}")
def remover_usuario(id: int):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM usuarios WHERE id = %s", (id,))
        conn.commit()
        return {"status": "usuário removido"}
    finally:
        cursor.close()
        conn.close()

@app.post("/login")
def login(credenciais: dict):
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT id, nome, username FROM usuarios WHERE username = %s AND senha = %s"
        cursor.execute(query, (credenciais['username'], credenciais['senha']))
        usuario = cursor.fetchone()
        if usuario:
            return usuario
        raise HTTPException(status_code=401, detail="Incorreto")
    finally:
        cursor.close()
        conn.close()

# --- EQUIPAMENTOS ---

@app.get("/equipamentos")
def listar_equipamentos():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM equipamentos WHERE ativo = TRUE")
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

@app.post("/equipamentos")
def cadastrar_equipamento(equipamento: dict):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        query = "INSERT INTO equipamentos (nome, categoria, quantidade) VALUES (%s, %s, %s)"
        cursor.execute(query, (equipamento['nome'], equipamento['categoria'], equipamento['quantidade']))
        conn.commit()
        return {"status": "sucesso"}
    finally:
        cursor.close()
        conn.close()

@app.put("/equipamentos/{id}")
def atualizar_quantidade(id: int, dados: dict):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        query = "UPDATE equipamentos SET quantidade = %s WHERE id = %s"
        cursor.execute(query, (dados['quantidade'], id))
        conn.commit()
        return {"status": "ok"}
    finally:
        cursor.close()
        conn.close()

@app.delete("/equipamentos/{id}")
def excluir_equipamento(id: int):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        query = "UPDATE equipamentos SET ativo = FALSE WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        return {"status": "ok"}
    finally:
        cursor.close()
        conn.close()

# --- LOGS ---

@app.get("/logs")
def listar_logs():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM movimentacoes ORDER BY data_movimentacao DESC")
        return cursor.fetchall()
    finally:
        cursor.close()
        conn.close()

@app.post("/logs")
def adicionar_log(log: dict):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        query = """INSERT INTO movimentacoes 
                   (item_nome_snapshot, usuario_nome_snapshot, responsavel_ti_snapshot, tipo_acao) 
                   VALUES (%s, %s, %s, %s)"""
        cursor.execute(query, (log['itemNome'], log['usuario'], log['responsavel'], log['acao']))
        conn.commit()
        return {"status": "ok"}
    finally:
        cursor.close()
        conn.close()