import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

interface IDatabaseContext {
  db: SQLite.SQLiteDatabase | undefined;
  items: Ticket[];
  setItems: (items: Ticket[]) => void;
  insertUserAsync: (name: string, email: string, password: string) => Promise<boolean>;
  loginUserAsync: (email: string, password: string) => Promise<boolean>;
  insertTicketAsync: (
    titulo: string,
    descricao: string,
    solicitante: string,
    dataAbertura: string,
    status: string,
  ) => Promise<boolean>;
  getTicketsAsync: () => Promise<boolean>;
  getTicketDetailsAsync: (ticketId: number) => Promise<Ticket | undefined>;
  insertFakeTickets: () => Promise<void>;
  deleteTicketAsync: (ticketId: number) => Promise<boolean>;
  RegisterUserAsync: (props: IRegisterUserProps) => Promise<boolean>;
  emailExistsAsync: (email: string) => Promise<boolean>;
  closeTicketAsync: (ticketId: number, descricaoEncerramento: string, status: string) => Promise<void>;
}

interface DatabaseProviderProps {
  children: ReactNode;
}

export interface Ticket {
  id: number;
  titulo: string;
  descricao: string;
  descricaoEncerramento: string;
  solicitante: string;
  dataAbertura: string;
  status: string;
}

export interface IRegisterUserProps {
  email: string;
  password: string;
  name: string;
}

const DatabaseContext = createContext<IDatabaseContext | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within an DatabaseProvider");
  }
  return context;
};

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
  const db = SQLite.useSQLiteContext();
  const [items, setItems] = useState<Ticket[]>([]);

  async function insertUserAsync(name: string, email: string, password: string): Promise<boolean> {
    const result = await db?.runAsync("INSERT INTO user (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      password,
    ]);
    return (result && result.changes > 0) || false;
  }

  async function loginUserAsync(email: string, password: string): Promise<boolean> {
    const rows = await db?.getAllAsync("SELECT * FROM user WHERE email = ? AND password = ?", [email, password]);
    return rows ? rows?.length > 0 : false;
  }

  async function insertTicketAsync(
    titulo: string,
    descricao: string,
    solicitante: string,
    dataAbertura: string,
    status: string,
  ): Promise<boolean> {
    const result = await db?.runAsync(
      "INSERT INTO tickets (titulo, descricao, solicitante, dataAbertura, status) VALUES (?, ?, ?, ?, ?)",
      [titulo, descricao, solicitante, dataAbertura, status],
    );

    if (result && result.changes > 0) {
      const rows = await db?.getAllAsync<{id: number}>("SELECT last_insert_rowid() as id");
      const newTicketId = rows[0].id;

      const newTicket: Ticket = {
        id: newTicketId,
        titulo,
        descricao,
        descricaoEncerramento: "",
        solicitante,
        dataAbertura,
        status,
      };
      setItems((prevItems) => [newTicket,...prevItems]);
      return true;
    }

    return false;
  }

  async function getTicketsAsync(): Promise<boolean> {
    const rows: any = await db?.getAllAsync("SELECT * FROM tickets order by dataAbertura DESC");

    const tickets: Ticket[] = rows.map((row: any): Ticket => {
      return {
        id: row.id,
        titulo: row.titulo,
        descricao: row.descricao,
        descricaoEncerramento: row.descricaoEncerramento || "",
        solicitante: row.solicitante,
        dataAbertura: row.dataAbertura,
        status: row.status,
      };
    });

    setItems(tickets);

    return true;
  }

  async function getTicketDetailsAsync(ticketId: number): Promise<Ticket | undefined> {
    const result: any = await db?.getAllAsync("SELECT * FROM tickets WHERE id = ?", [ticketId]);
    if (result.length > 0) {
      const row = result[0];
      return {
        id: row.id,
        titulo: row.titulo,
        descricao: row.descricao,
        descricaoEncerramento: row.descricaoEncerramento,
        solicitante: row.solicitante,
        dataAbertura: row.dataAbertura,
        status: row.status,
      };
    } else {
      return undefined;
    }
  }

  async function insertFakeTickets() {
    const result: any = await db?.getAllAsync("SELECT COUNT(*) AS CONTAR FROM tickets");
    let contador = result[0]?.CONTAR;

    if (contador < 3) {
      for (let i = 1; i <= 5; i++) {
        await insertTicketAsync(
          `Titulo ${i}`,
          `Descricao para o ticket ${i}`,
          `Solicitante ${i}`,
          new Date().toISOString(),
          `${i % 2 === 0 ? "1" : "2"}`,
        );
      }
      console.log("20 tickets fictícios inseridos com sucesso.");
    }
  }

  async function deleteTicketAsync(ticketId: number): Promise<boolean> {
    await db?.runAsync("DELETE FROM tickets WHERE id = ?", [ticketId]);

    setItems((prevItems) => prevItems.filter((item) => item.id !== ticketId));

    return true;
  }

  const RegisterUserAsync = async ({ email, password, name }: IRegisterUserProps): Promise<boolean> => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      console.error("Todos os campos devem ser preenchidos.");
      return false;
    }

    try {
      const query = `INSERT INTO user (name, email, password) VALUES (?, ?, ?)`;
      const args = [name, email, password];
      let operationSuccess = false;

      const result = await db?.runAsync(query, args);

      if (result && result.changes > 0) {
        operationSuccess = true;
      }

      return operationSuccess;
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      return false;
    }
  };

  async function emailExistsAsync(email: string): Promise<boolean> {
    const result = await db?.getAllAsync("SELECT email FROM user WHERE email = ?", [email]);
    return (result && result.length > 0) || false;
  }
  async function closeTicketAsync(ticketId: number, descricaoEncerramento: string, status: string): Promise<void> {
    await db?.runAsync("UPDATE tickets SET status = ?, descricaoEncerramento = ? WHERE id = ?", [
      status,
      descricaoEncerramento,
      ticketId,
    ]);
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === ticketId ? { ...item, status, descricaoEncerramento } : item
      )
    );
  }

  return (
    <DatabaseContext.Provider
      value={{
        db,
        items,
        setItems,
        insertUserAsync,
        loginUserAsync,
        insertTicketAsync,
        getTicketsAsync,
        getTicketDetailsAsync,
        insertFakeTickets,
        deleteTicketAsync,
        RegisterUserAsync,
        emailExistsAsync,
        closeTicketAsync,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
