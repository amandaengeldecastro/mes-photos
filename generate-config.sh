#!/bin/bash
# Gera firebase-config.js a partir de variáveis de ambiente.
# firebase-config.js está no .gitignore — nunca vai para o repositório.
#
# Uso:
#   export FIREBASE_API_KEY="..."
#   export FIREBASE_AUTH_DOMAIN="..."
#   export FIREBASE_PROJECT_ID="..."
#   export FIREBASE_STORAGE_BUCKET="..."
#   export FIREBASE_MESSAGING_SENDER_ID="..."
#   export FIREBASE_APP_ID="..."
#   export EMAILJS_SERVICE_ID="..."
#   export EMAILJS_TEMPLATE_ID="..."
#   export EMAILJS_PUBLIC_KEY="..."
#   ./generate-config.sh

check_var() {
  if [ -z "${!1}" ]; then
    echo "Variável $1 não definida."
    echo "Execute: export $1=\"seu_valor\""
    exit 1
  fi
}

check_var FIREBASE_API_KEY
check_var FIREBASE_AUTH_DOMAIN
check_var FIREBASE_PROJECT_ID
check_var FIREBASE_STORAGE_BUCKET
check_var FIREBASE_MESSAGING_SENDER_ID
check_var FIREBASE_APP_ID
check_var EMAILJS_SERVICE_ID
check_var EMAILJS_TEMPLATE_ID
check_var EMAILJS_PUBLIC_KEY

cat > firebase-config.js << EOF
const firebaseConfig = {
  apiKey: "${FIREBASE_API_KEY}",
  authDomain: "${FIREBASE_AUTH_DOMAIN}",
  projectId: "${FIREBASE_PROJECT_ID}",
  storageBucket: "${FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${FIREBASE_APP_ID}"
};

const EMAILJS_SERVICE_ID = "${EMAILJS_SERVICE_ID}";
const EMAILJS_TEMPLATE_ID = "${EMAILJS_TEMPLATE_ID}";
const EMAILJS_PUBLIC_KEY = "${EMAILJS_PUBLIC_KEY}";

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
emailjs.init(EMAILJS_PUBLIC_KEY);
EOF

echo "firebase-config.js gerado com sucesso!"
