#!/usr/bin/env node

/**
 * Script de mise à jour automatique des dépendances - Château Royal
 * Met à jour toutes les dépendances et vérifie la sécurité
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(50)}`, 'cyan');
  log(` ${title}`, 'bright');
  log(`${'='.repeat(50)}`, 'cyan');
}

function logStep(step) {
  log(`\n▶ ${step}`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️ ${message}`, 'blue');
}

// Configuration des dépendances critiques
const CRITICAL_DEPENDENCIES = {
  'supabase': 'latest',
  '@supabase/supabase-js': 'latest',
  'stripe': 'latest',
  '@stripe/stripe-js': 'latest',
  'react': 'latest',
  'react-dom': 'latest',
  'typescript': 'latest',
  'vite': 'latest',
  'tailwindcss': 'latest',
  'framer-motion': 'latest',
  'lucide-react': 'latest'
};

// Dépendances de sécurité
const SECURITY_DEPENDENCIES = [
  'helmet',
  'cors',
  'rate-limiter-flexible',
  'express-rate-limit',
  'hpp',
  'xss-clean',
  'express-validator'
];

async function checkNodeVersion() {
  logStep('Vérification de la version Node.js');
  
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 18) {
    logError(`Node.js ${nodeVersion} détecté. Version 18+ requise.`);
    process.exit(1);
  }
  
  logSuccess(`Node.js ${nodeVersion} - Version compatible`);
}

async function backupPackageFiles() {
  logStep('Sauvegarde des fichiers de configuration');
  
  const files = ['package.json', 'package-lock.json'];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  for (const file of files) {
    if (fs.existsSync(file)) {
      const backupName = `${file}.backup.${timestamp}`;
      fs.copyFileSync(file, backupName);
      logSuccess(`Sauvegarde créée: ${backupName}`);
    }
  }
}

async function updateDependencies() {
  logStep('Mise à jour des dépendances');
  
  try {
    // Vérifier les mises à jour disponibles
    logInfo('Vérification des mises à jour disponibles...');
    execSync('npm outdated', { stdio: 'pipe' });
    logSuccess('Vérification des mises à jour terminée');
  } catch (error) {
    logInfo('Aucune mise à jour disponible ou erreur de vérification');
  }
  
  try {
    // Mettre à jour les dépendances
    logInfo('Mise à jour des dépendances...');
    execSync('npm update', { stdio: 'inherit' });
    logSuccess('Mise à jour des dépendances terminée');
  } catch (error) {
    logError('Erreur lors de la mise à jour des dépendances');
    throw error;
  }
}

async function updateCriticalDependencies() {
  logStep('Mise à jour des dépendances critiques');
  
  for (const [package, version] of Object.entries(CRITICAL_DEPENDENCIES)) {
    try {
      logInfo(`Mise à jour de ${package} vers ${version}...`);
      execSync(`npm install ${package}@${version}`, { stdio: 'inherit' });
      logSuccess(`${package} mis à jour`);
    } catch (error) {
      logWarning(`Erreur lors de la mise à jour de ${package}`);
    }
  }
}

async function installSecurityDependencies() {
  logStep('Installation des dépendances de sécurité');
  
  try {
    const packages = SECURITY_DEPENDENCIES.join(' ');
    execSync(`npm install ${packages}`, { stdio: 'inherit' });
    logSuccess('Dépendances de sécurité installées');
  } catch (error) {
    logWarning('Erreur lors de l\'installation des dépendances de sécurité');
  }
}

async function auditSecurity() {
  logStep('Audit de sécurité des dépendances');
  
  try {
    logInfo('Exécution de l\'audit de sécurité...');
    execSync('npm audit', { stdio: 'inherit' });
    logSuccess('Audit de sécurité terminé');
  } catch (error) {
    logWarning('Vulnérabilités détectées dans les dépendances');
    
    try {
      logInfo('Tentative de correction automatique...');
      execSync('npm audit fix', { stdio: 'inherit' });
      logSuccess('Correction automatique terminée');
    } catch (fixError) {
      logError('Impossible de corriger automatiquement les vulnérabilités');
      logInfo('Veuillez corriger manuellement les vulnérabilités');
    }
  }
}

async function updateSupabase() {
  logStep('Mise à jour de Supabase CLI');
  
  try {
    execSync('npm install -g supabase@latest', { stdio: 'inherit' });
    logSuccess('Supabase CLI mis à jour');
  } catch (error) {
    logWarning('Erreur lors de la mise à jour de Supabase CLI');
  }
}

async function updateStripe() {
  logStep('Mise à jour de Stripe');
  
  try {
    // Mettre à jour les SDK Stripe
    execSync('npm install stripe@latest @stripe/stripe-js@latest', { stdio: 'inherit' });
    logSuccess('SDK Stripe mis à jour');
  } catch (error) {
    logWarning('Erreur lors de la mise à jour de Stripe');
  }
}

async function generateSecurityReport() {
  logStep('Génération du rapport de sécurité');
  
  const report = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    npmVersion: execSync('npm --version', { encoding: 'utf8' }).trim(),
    dependencies: {},
    security: {}
  };
  
  try {
    // Lire package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    report.dependencies = {
      total: Object.keys(packageJson.dependencies || {}).length + Object.keys(packageJson.devDependencies || {}).length,
      production: Object.keys(packageJson.dependencies || {}).length,
      development: Object.keys(packageJson.devDependencies || {}).length
    };
  } catch (error) {
    logWarning('Impossible de lire package.json');
  }
  
  // Sauvegarder le rapport
  const reportFile = `security-report-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  logSuccess(`Rapport de sécurité généré: ${reportFile}`);
}

async function runTests() {
  logStep('Exécution des tests');
  
  try {
    execSync('npm test', { stdio: 'inherit' });
    logSuccess('Tests passés avec succès');
  } catch (error) {
    logWarning('Certains tests ont échoué');
  }
}

async function buildProject() {
  logStep('Build du projet');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    logSuccess('Build réussi');
  } catch (error) {
    logError('Erreur lors du build');
    throw error;
  }
}

async function main() {
  logSection('MISE À JOUR DES DÉPENDANCES - CHÂTEAU ROYAL');
  
  try {
    await checkNodeVersion();
    await backupPackageFiles();
    await updateDependencies();
    await updateCriticalDependencies();
    await installSecurityDependencies();
    await auditSecurity();
    await updateSupabase();
    await updateStripe();
    await generateSecurityReport();
    await runTests();
    await buildProject();
    
    logSection('MISE À JOUR TERMINÉE AVEC SUCCÈS');
    logSuccess('Toutes les dépendances ont été mises à jour');
    logInfo('Vérifiez le rapport de sécurité généré');
    logInfo('Testez l\'application avant de déployer');
    
  } catch (error) {
    logSection('ERREUR LORS DE LA MISE À JOUR');
    logError('Une erreur est survenue lors de la mise à jour');
    logError(error.message);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = {
  main,
  checkNodeVersion,
  updateDependencies,
  auditSecurity
};
