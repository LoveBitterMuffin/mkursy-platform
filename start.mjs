#!/usr/bin/env node
/**
 * mkursy-platform - Zero-Setup Launcher & Server Script
 * Проверяет системное окружение, валидирует зависимости, автоматически
 * устанавливает недостающие пакеты и запускает сервер разработки.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync, execSync } from 'node:child_process';
import { createServer } from 'node:net';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Цветовые коды ANSI для информативного вывода
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  magenta: '\x1b[35m'
};

function log(msg = '') {
  console.log(msg);
}

function info(msg) {
  console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`);
}

function success(msg) {
  console.log(`${colors.green}✔${colors.reset} ${msg}`);
}

function warn(msg) {
  console.log(`${colors.yellow}⚠${colors.reset} ${msg}`);
}

function error(msg) {
  console.error(`${colors.red}✖${colors.reset} ${colors.bold}${msg}${colors.reset}`);
}

function header() {
  log('');
  log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  log(`${colors.bold}${colors.magenta}   МКурсы — Платформа математического образования   ${colors.reset}`);
  log(`${colors.dim}       Автоматический запуск и проверка зависимостей   ${colors.reset}`);
  log(`${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  log('');
}

// 1. Проверка версии Node.js
function checkNodeVersion() {
  const currentVersion = process.versions.node;
  const major = parseInt(currentVersion.split('.')[0], 10);
  const minMajor = 18;

  if (major < minMajor) {
    error(`Требуется Node.js версии >= ${minMajor}.0.0. Текущая версия: v${currentVersion}`);
    log(`Пожалуйста, обновите Node.js: https://nodejs.org/`);
    process.exit(1);
  }
  success(`Node.js: v${currentVersion} (минимальная версия: v${minMajor}.0.0)`);
}

// 2. Проверка пакетного менеджера npm
function checkNpm() {
  try {
    const isWindows = process.platform === 'win32';
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';
    const version = execSync(`${npmCmd} --version`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    success(`npm: v${version}`);
    return npmCmd;
  } catch {
    error('npm не найден в системной переменной PATH.');
    process.exit(1);
  }
}

// 3. Проверка установленных зависимостей
function verifyDependencies(npmCmd) {
  const packageJsonPath = resolve(__dirname, 'package.json');
  const nodeModulesPath = resolve(__dirname, 'node_modules');

  if (!existsSync(packageJsonPath)) {
    error(`package.json не найден в директории: ${__dirname}`);
    process.exit(1);
  }

  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const allDeps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {})
  };

  const missingDeps = [];

  if (!existsSync(nodeModulesPath)) {
    warn('Директория node_modules отсутствует.');
    missingDeps.push(...Object.keys(allDeps));
  } else {
    for (const depName of Object.keys(allDeps)) {
      const depPath = resolve(nodeModulesPath, depName);
      if (!existsSync(depPath)) {
        missingDeps.push(depName);
      }
    }
  }

  if (missingDeps.length > 0) {
    warn(`Обнаружены неустановленные зависимости (${missingDeps.length} шт.):`);
    const preview = missingDeps.slice(0, 5).join(', ') + (missingDeps.length > 5 ? '...' : '');
    log(`  ${colors.dim}${preview}${colors.reset}`);
    log('');
    info('Запускаем установку зависимостей: npm install...');

    const installResult = spawnSync(npmCmd, ['install'], {
      cwd: __dirname,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });

    if (installResult.status !== 0) {
      error(`Ошибка при выполнении npm install (код возврата ${installResult.status})`);
      process.exit(1);
    }
    success('Все зависимости успешно установлены!');
  } else {
    success(`Все зависимости проверены и установлены (${Object.keys(allDeps).length} пакетов).`);
  }
}

// 4. Проверка доступности сетевого порта
function checkPort(port) {
  return new Promise((resolveCheck) => {
    const server = createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolveCheck(false);
      } else {
        resolveCheck(true);
      }
    });
    server.once('listening', () => {
      server.close(() => resolveCheck(true));
    });
    server.listen(port);
  });
}

// 5. Запуск Vite Dev Server
async function startDevServer(npmCmd) {
  const defaultPort = 5173;
  const isPortAvailable = await checkPort(defaultPort);

  if (!isPortAvailable) {
    warn(`Порт ${defaultPort} уже занят другим приложением. Vite автоматически выберет следующий свободный порт.`);
  }

  log('');
  log(`${colors.bold}${colors.green}► Запуск Vite Dev Server...${colors.reset}`);
  log(`${colors.dim}  Для остановки сервера нажмите Ctrl + C${colors.reset}`);
  log('');

  const serverProcess = spawn(npmCmd, ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  serverProcess.on('error', (err) => {
    error(`Не удалось запустить сервер разработки: ${err.message}`);
    process.exit(1);
  });

  serverProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      warn(`Сервер разработки завершил работу с кодом: ${code}`);
    } else {
      info('Сервер разработки остановлен.');
    }
  });

  // Корректная обработка сигналов прерывания
  const handleSignal = () => {
    if (serverProcess) {
      serverProcess.kill();
    }
    process.exit(0);
  };

  process.on('SIGINT', handleSignal);
  process.on('SIGTERM', handleSignal);
}

// Главная точка входа
async function main() {
  const args = process.argv.slice(2);
  const installOnly = args.includes('--install-only') || args.includes('-i');

  header();
  info('Шаг 1/3: Проверка системного окружения...');
  checkNodeVersion();
  const npmCmd = checkNpm();

  log('');
  info('Шаг 2/3: Проверка и валидация зависимостей...');
  verifyDependencies(npmCmd);

  if (installOnly) {
    log('');
    success('Все зависимости установлены и проверены (--install-only).');
    process.exit(0);
  }

  log('');
  info('Шаг 3/3: Инициализация сервера...');
  await startDevServer(npmCmd);
}

main().catch((err) => {
  error(`Непредвиденная ошибка: ${err?.message || err}`);
  process.exit(1);
});
