import * as SQLite from "expo-sqlite";

export interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  solicitante: string;
  dataAbertura: string; // ou Date, se você estiver convertendo strings de data para objetos Date
  status: string;
}

export interface IRegisterUserProps {
  email: string;
  password: string;
  name: string;
}


// Função assíncrona para inicializar o banco de dados e criar a tabela `user`
export async function initDBAsync() {
  const db = await SQLite.openDatabaseAsync("db.database");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT,
      solicitante TEXT,
      dataAbertura DATETIME,
      status TEXT
    );
  `);
}

export async function insertUserAsync(name: string, email: string, password: string): Promise<number> {
  const db = await SQLite.openDatabaseAsync("db.database");
  const result = await db.runAsync("INSERT INTO user (name, email, password) VALUES (?, ?, ?)", [
    name,
    email,
    password,
  ]);
  return result.lastInsertRowId;
}

export async function loginUserAsync(email: string, password: string): Promise<boolean> {
  const db = await SQLite.openDatabaseAsync("db.database");
  const rows = await db.getAllAsync("SELECT * FROM user WHERE email = ? AND password = ?", [email, password]);
  return rows.length > 0;
}

export async function insertTicketAsync(titulo: string, descricao: string, solicitante: string, dataAbertura: string, status: string): Promise<number> {
  const db = await SQLite.openDatabaseAsync("db.database");
  const result = await db.runAsync("INSERT INTO tickets (titulo, descricao, solicitante, dataAbertura, status) VALUES (?, ?, ?, ?, ?)", [
    titulo,
    descricao,
    solicitante,
    dataAbertura,
    status,
  ]);
  return result.lastInsertRowId;
}

export async function getTicketsAsync(): Promise<Ticket[]> {
  const db = await SQLite.openDatabaseAsync("db.database");
  const rows: any = await db.getAllAsync("SELECT * FROM tickets");

  const tickets: Ticket[] = rows.map((row: any): Ticket => {

    return {
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      solicitante: row.solicitante,
      dataAbertura: row.dataAbertura,
      status: row.status,
    };
  });

  return tickets;
}

export async function getTicketDetailsAsync(ticketId: number): Promise<Ticket | undefined> {
  const db = await SQLite.openDatabaseAsync("db.database");
  const result: any = await db.getAllAsync("SELECT * FROM tickets WHERE id = ?", [ticketId]);
  if (result.length > 0) {
    const row = result[0];
    return {
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      solicitante: row.solicitante,
      dataAbertura: row.dataAbertura,
      status: row.status,
    };
  } else {
    return undefined;
  }
}

export async function insertFakeTickets() {
  const db = await SQLite.openDatabaseAsync("db.database");
  await db.runAsync("DELETE FROM tickets");
  for (let i = 1; i <= 10; i++) {
    await insertTicketAsync(
      `Titulo ${i}`,
      `Descricao para o ticket ${i}`,
      `Solicitante ${i}`,
      new Date().toISOString(),
      `${i % 2 === 0 ? '1' : '2'}`
    );
  }
  for (let i = 11; i <= 20; i++) {
    await insertTicketAsync(
      `Titulo ${i}`,
      `Descricao para o ticket ${i}`,
      `Solicitante ${i}`,
      new Date().toISOString(),
      `${i % 2 === 0 ? '3' : '4'}`
    );
  }
  console.log('20 tickets fictícios inseridos com sucesso.');
}

export async function deleteTicketAsync(ticketId: number): Promise<void> {
  const db = await SQLite.openDatabaseAsync("db.database");
  await db.runAsync("DELETE FROM tickets WHERE id = ?", [ticketId]);
}

export const RegisterUserAsync = async ({ email, password, name }: IRegisterUserProps): Promise<boolean> => {
  const db = await SQLite.openDatabaseAsync("db.database");

  if (!email.trim() || !password.trim() || !name.trim()) {
    console.error('Todos os campos devem ser preenchidos.');
    return false;
  }

  try {
    const query = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;
    const args = [name, email, password];
    let operationSuccess = false;

    const result = await db.runAsync(query, args);

    if (result.changes > 0) {
      operationSuccess = true;
    }


    return operationSuccess;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return false;
  }
};

export async function emailExistsAsync(email: string): Promise<boolean> {
  const db = await SQLite.openDatabaseAsync("db.database");
  const result = await db.getAllAsync("SELECT email FROM user WHERE email = ?", [email]);
  return result.length > 0;
}