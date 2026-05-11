@echo off
title Duelo de Vendedores — Watchdog Launcher

echo.
echo  ============================================
echo   DUELO DE VENDEDORES — Motor de Dados
echo  ============================================
echo.

:: Verifica se Node.js esta instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  [ERRO] Node.js nao encontrado. Instale em https://nodejs.org
    pause
    exit /b 1
)

:: Verifica se vendas.xlsx existe; cria um aviso se nao existir
if not exist "vendas.xlsx" (
    echo  [AVISO] vendas.xlsx nao encontrado na pasta do projeto.
    echo  O watchdog vai iniciar e aguardar o arquivo ser criado.
    echo.
)

:: Inicia o watchdog em uma janela minimizada separada
start "Watchdog Duelo" /min node watchdog.mjs

echo  [OK] Watchdog iniciado em segundo plano.
echo.
echo  Para encerrar: abra a barra de tarefas, clique com o
echo  botao direito em "Watchdog Duelo" e escolha Fechar.
echo.
timeout /t 4 /nobreak > nul
