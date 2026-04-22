CREATE DATABASE IF NOT EXISTS task_manager;
USE task_manager;

DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('todo', 'doing', 'done') DEFAULT 'todo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (id, title, description, status) VALUES
(UUID(), 'Learn NestJS', 'Build backend', 'todo'),
(UUID(), 'Build API', 'CRUD tasks', 'doing'),
(UUID(), 'Connect React Query', 'Frontend integration', 'done');



