@echo off
cd Api
start cmd   /d "F:\Projetos\FAETEC_FINAL\server" /k node index.js & cd F:\Projetos\FAETEC_FINAL\client & npm run dev
