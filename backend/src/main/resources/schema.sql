CREATE DATABASE IF NOT EXISTS mytutor;
USE mytutor;

CREATE TABLE IF NOT EXISTS topic(
  topic_id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255),
  topic_name VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS user(
  user_id VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  employee_id VARCHAR(255),
  name VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS knowledge_repository(
  knowledge_id INT AUTO_INCREMENT PRIMARY KEY,
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(255),
  file_path VARCHAR(255) NOT NULL,
  topic_id INT NOT NULL,
  FOREIGN KEY(topic_id) REFERENCES topic(topic_id)
);
CREATE TABLE IF NOT EXISTS conversation(
  conversation_id INT AUTO_INCREMENT PRIMARY KEY,
  created_date DATETIME(6),
  generated_response LONGTEXT,
  prompt_text LONGTEXT,
  topic_id INT,
  user_id VARCHAR(255),
  FOREIGN KEY(topic_id) REFERENCES topic(topic_id),
  FOREIGN KEY(user_id) REFERENCES user(user_id)
);

INSERT IGNORE INTO topic(topic_id,topic_name,description) VALUES
(1,'Selenium','Web UI automation testing'),
(2,'API Testing','API validation and automation'),
(3,'Spring Boot','Spring Boot development and testing'),
(4,'Agile','Agile software delivery practices'),
(5,'Playwright','Modern browser automation');

INSERT IGNORE INTO user(user_id,password,email,employee_id,name)
VALUES('demo','demo123','demo@mytutor.local','EMP001','Demo User');

-- Example trainer note:
-- INSERT INTO knowledge_repository(document_name,document_type,file_path,topic_id)
-- VALUES('selenium-notes.pdf','pdf','selenium-notes.pdf',1);
