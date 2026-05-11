@echo off
cd /d "%~dp0"
title Duelo de Vendedores — Vitrine

echo.
echo  ============================================
echo   DUELO DE VENDEDORES — VITRINE
echo  ============================================
echo.

:: Verifica Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERRO] Node.js nao encontrado.
    echo  Instale em: https://nodejs.org
    pause
    exit /b 1
)

:: Verifica se vendas.xlsx existe, se nao, cria o template
if not exist "vendas.xlsx" (
    echo  Criando planilha de exemplo...
    node gerar-exemplo.mjs
    echo.
)

:: Inicia o motor de dados
echo  [1/3] Iniciando motor de dados...
start "Watchdog Duelo" /min node watchdog.mjs
timeout /t 2 /nobreak > nul

:: Inicia o servidor
echo  [2/3] Iniciando servidor da TV...
start "Servidor Duelo" /min cmd /c "npm run dev & pause"
timeout /t 6 /nobreak > nul

:: Abre o navegador
echo  [3/3] Abrindo tela da TV...
start "" "http://localhost:5173"

echo.
echo  ============================================
echo   Tudo pronto! Pode minimizar esta janela.
echo.
echo   Para encerrar tudo:
echo   Feche "Watchdog Duelo" e "Servidor Duelo"
echo   na barra de tarefas.
echo  ============================================
echo.
pause
