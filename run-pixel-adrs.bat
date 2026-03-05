@echo off
cd /d C:\Projetos\PixRecorrente\Frontend
claude -p --model sonnet --dangerously-skip-permissions "Leia TASK-ADRS.md e execute todas as instrucoes. Esse e seu briefing completo." --max-turns 30
