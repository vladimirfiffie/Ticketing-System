const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create ticket
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, createdBy } = req.body;
    if (!title || !description || !createdBy) {
      return res.status(400).json({ error: "title, description, createdBy required" });
    }

    const ticket = await prisma.ticket.create({
      data: { title, description, priority, createdBy },
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
});

// Get all tickets
router.get("/", async (req, res) => {
  const tickets = await prisma.ticket.findMany({ orderBy: { createdAt: "desc" } });
  res.json(tickets);
});

// Get ticket by ID
router.get("/:id", async (req, res) => {
  const ticket = await prisma.ticket.findUnique({ where: { id: req.params.id } });
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
});

// Update ticket
router.patch("/:id", async (req, res) => {
  const { status, priority, assignedTo } = req.body;
  try {
    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: { status, priority, assignedTo },
    });
    res.json(ticket);
  } catch {
    res.status(404).json({ error: "Ticket not found or invalid update" });
  }
});

// Delete ticket
router.delete("/:id", async (req, res) => {
  try {
    await prisma.ticket.delete({ where: { id: req.params.id } });
    res.json({ message: "Ticket deleted" });
  } catch {
    res.status(404).json({ error: "Ticket not found" });
  }
});

module.exports = router;
