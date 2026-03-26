import express from "express";
import { createServer as createViteServer } from "vite";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "sart277353";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin-token-123";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Initialize SQLite Database
  const db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT NOT NULL,
      thumbnail TEXT NOT NULL,
      files TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed data if empty
  const count = await db.get("SELECT COUNT(*) as count FROM projects");
  if (count.count === 0) {
    const seedData = [
      {
        id: '1',
        title: 'Insurance and Sales Data',
        description: 'Project focuses on the use of conditional formatting to organise data through dynamic colour coding and automated highlighting visually. It improves readability and allows key information to stand out instantly for quick analysis.',
        category: 'Excel',
        tags: JSON.stringify(['Data Formatting', 'Conditional Formatting']),
        thumbnail: 'https://i.ibb.co/Wp6pcztc/jk.jpg',
        files: JSON.stringify([
          {
            name: '188 Insurance & Sales Data.xlsx',
            type: 'excel',
            url: "https://1drv.ms/x/c/3b764e46c402ce7d/IQQzPMHgnTnmS6Cw_OGzD5Y6AUN8Bgx9gLrnpXxZYl5J7l0?em=2&AllowTyping=True&ActiveCell='Insurance%20Data'!I5&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
            size: 'Live Embed'
          }
        ])
      },
      {
        id: '2',
        title: 'Investment Data Transformation and Pivot Analysis',
        description: 'This project involves converting a 37-page PDF into a structured Excel dataset and using pivot tables for quick data analysis and summarisation, ensuring accuracy and meaningful insights.',
        category: 'Data Extraction',
        tags: JSON.stringify(['Data Extraction', 'Data Conversion', 'Data Transformation']),
        thumbnail: 'https://i.ibb.co/jPgkMJ02/jk.webp',
        files: JSON.stringify([
          {
            name: 'Original_Statement.pdf',
            type: 'pdf',
            url: 'https://1drv.ms/b/c/3b764e46c402ce7d/IQRsqAqn3oqlT6iunQqAPL5-AXv08aoIPb7aLs_HJdsUVFA?em=2&wdEmbedCode=0&wdPrint=0&wdStartOn=1',
            size: 'Live Embed'
          },
          {
            name: 'Converted_Data.xlsx',
            type: 'excel',
            url: "https://1drv.ms/x/c/3b764e46c402ce7d/IQRK2-9O_IWUR6MoKp8eQaikAS_bOn0ne_4ON9gj2f5Qk-c?em=2&ActiveCell='Table%201'!F1&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
            size: 'Live Embed'
          }
        ])
      },
      {
        id: '3',
        title: 'Sales Data Conversion',
        description: 'This project involves converting PDF data into a clean and structured Excel dataset and creating charts to visually represent the data for clear insights and easy analysis.',
        category: 'Data Extraction',
        tags: JSON.stringify(['Data Extraction', 'Data Conversion', 'PDF to Excel']),
        thumbnail: 'https://i.ibb.co/LXmV11sR/jk.jpg',
        files: JSON.stringify([
          {
            name: 'Original_Statement.pdf',
            type: 'pdf',
            url: 'https://1drv.ms/b/c/3b764e46c402ce7d/IQQNP6nKcTpzR4VPoGvjvU-AASgF1IWmFV3ZV1U14nUYWmw',
            size: 'Live Embed'
          },
          {
            name: 'Converted_Data.xlsx',
            type: 'excel',
            url: "https://1drv.ms/x/c/3b764e46c402ce7d/IQTtcTorGPYPT4w5PdnhPqGcATikRYp4WVVLj837_WSApNI?em=2&wdAllowInteractivity=False&ActiveCell='Table%201'!H5&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
            size: 'Live Embed'
          }
        ])
      },
      {
        id: '4',
        title: 'Customer Invoice Data Processing',
        description: 'This project focuses on data processing, including cleaning, organizing, and transforming raw data into a structured format, ensuring accuracy, consistency, and readiness for analysis.',
        category: 'Data Cleaning',
        tags: JSON.stringify(['Data Processing']),
        thumbnail: 'https://i.ibb.co/x8gbV23W/jk.jpg',
        files: JSON.stringify([
          {
            name: 'Customer Invoicing Data',
            type: 'excel',
            url: "https://1drv.ms/x/c/3b764e46c402ce7d/IQTgfSDSAZKeQZQFZp1P4szsAafqmQKP2yjdv9K_XXRa8-M?em=2&AllowTyping=True&ActiveCell='Customer%20Invoicing%20Data'!M8&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
            size: 'Live Embed'
          }
        ])
      },
      {
        id: '5',
        title: 'Conditional Calculation Dashboard',
        description: 'This project features six independent sheets within a single Excel file, each performing conditional calculations using various formulas and data processing techniques. It highlights the ability to handle diverse datasets and apply logic-driven solutions for accurate and efficient results.',
        category: 'Data Processing',
        tags: JSON.stringify(['Data Processing']),
        thumbnail: 'https://i.ibb.co/tpR4PYS4/j.jpg',
        files: JSON.stringify([
          {
            name: 'Conditional Calculation',
            type: 'excel',
            url: "https://1drv.ms/x/c/3b764e46c402ce7d/IQQJ7KKU7rD0TqhS0XMA0-wNAePKzoVOole_A8BbY108YG4?em=2&wdAllowInteractivity=False&AllowTyping=True&ActiveCell='Sheet%201'!B21&wdInConfigurator=True&wdInConfigurator=True&edaebf=rslc0",
            size: 'Live Embed'
          }
        ])
      }
    ];

    for (const p of seedData) {
      await db.run(
        "INSERT INTO projects (id, title, description, category, tags, thumbnail, files) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [p.id, p.title, p.description, p.category, p.tags, p.thumbnail, p.files]
      );
    }
  }

  // API Routes
  app.post("/api/auth", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      res.json({ success: true, token: ADMIN_TOKEN });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  });

  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization;
    if (token === `Bearer ${ADMIN_TOKEN}`) {
      next();
    } else {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  };

  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await db.all("SELECT * FROM projects");
      const formatted = projects.map(p => ({
        ...p,
        tags: JSON.parse(p.tags),
        files: JSON.parse(p.files)
      }));
      res.json(formatted);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const p = await db.get("SELECT * FROM projects WHERE id = ?", [req.params.id]);
      if (!p) return res.status(404).json({ error: "Project not found" });
      res.json({
        ...p,
        tags: JSON.parse(p.tags),
        files: JSON.parse(p.files)
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const { id, title, description, category, tags, thumbnail, files } = req.body;
      await db.run(
        "INSERT INTO projects (id, title, description, category, tags, thumbnail, files) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [id, title, description, category, JSON.stringify(tags), thumbnail, JSON.stringify(files)]
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const { title, description, category, tags, thumbnail, files } = req.body;
      await db.run(
        "UPDATE projects SET title = ?, description = ?, category = ?, tags = ?, thumbnail = ?, files = ? WHERE id = ?",
        [title, description, category, JSON.stringify(tags), thumbnail, JSON.stringify(files), req.params.id]
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      await db.run("DELETE FROM projects WHERE id = ?", [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  app.get("/api/settings", async (req, res) => {
    try {
      const settingsRows = await db.all("SELECT * FROM settings");
      const settingsObj: Record<string, string> = {};
      settingsRows.forEach(row => {
        settingsObj[row.key] = row.value;
      });
      res.json(settingsObj);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", requireAuth, async (req, res) => {
    try {
      const settings = req.body;
      for (const [key, value] of Object.entries(settings)) {
        await db.run(
          "INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
          [key, String(value)]
        );
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save settings" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Retrying in 1 second...`);
      setTimeout(() => {
        server.close();
        server.listen(PORT, "0.0.0.0");
      }, 1000);
    } else {
      console.error("Server error:", e);
    }
  });

  const shutdown = () => {
    console.log("Shutting down server...");
    server.close(async () => {
      console.log("Server closed.");
      await db.close();
      console.log("Database closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer();
