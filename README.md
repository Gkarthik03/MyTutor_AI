# MyTutor AI - QEA Chatbot

Architecture:
Angular frontend -> Spring Boot REST API -> MySQL -> trainer knowledge repository -> AI refinement -> deterministic fallback.

The AI is not the source of truth. The trainer notes are retrieved first; AI only restructures the retrieved content according to the user's requested format. If AI fails because of SSL/certificate/network/provider/model problems, the backend automatically uses RuleBasedRefiner.

Recommended free AI path: Ollama running locally. Optional Gemini support is included.

Database tables match the supplied ERD: user, topic, knowledge_repository, conversation.

Start with:
1. backend/schema.sql
2. backend/application.properties
3. trainer files in backend/knowledge
4. insert their file paths into knowledge_repository
5. run Spring Boot
6. run Angular
