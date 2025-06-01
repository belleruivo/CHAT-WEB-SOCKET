# Chat em Rede Local com Flask e WebSocket  

Este é um projeto desenvolvido como parte da disciplina **Redes de Computadores**, com o objetivo de consolidar conhecimentos sobre o protocolo WebSocket e o framework Flask. A aplicação é um chat funcional que permite comunicação em tempo real entre usuários conectados na mesma rede local.  

## 🚀 Funcionalidades  

- Comunicação em tempo real entre usuários utilizando WebSocket.  
- Interface responsiva, adaptada para dispositivos móveis e desktops.  
- Diferenciação visual das mensagens enviadas (à direita) e recebidas (à esquerda).  
- Suporte a **modo escuro** para uma melhor experiência do usuário.  
- Personalização com **fotos de perfil** ou avatares dos usuários.  

## 🛠️ Tecnologias utilizadas  

- **Python**: Linguagem base do projeto.  
- **Flask**: Framework utilizado para gerenciar o backend.  
- **Flask-SocketIO**: Para implementar comunicação em tempo real com WebSocket.  
- **HTML, CSS e JavaScript**: Para a criação e estilização da interface responsiva.  

## 📡 Como funciona  

1. O servidor Flask utiliza o **Flask-SocketIO** para gerenciar conexões WebSocket.  
2. O cliente acessa a aplicação através do endereço IP local do servidor.  
3. As mensagens são transmitidas em tempo real para todos os usuários conectados na mesma rede local.  

## 🖥️ Estrutura do Projeto  

```plaintext
chat-flask/
│
├── app.py                # Arquivo principal do servidor Flask  
├── templates/            # Arquivos HTML  
│   └── index.html        # Página principal do chat  
├── src/                  # Código-fonte da aplicação (JS, CSS, uploads)
│   ├── css/              # Arquivos CSS  
│   │   └── styles.css    # Estilo da aplicação  
│   ├── js/               # Arquivos JavaScript  
│   │   └── script.js     # Script para interações em tempo real  
│   └── uploads/          # Arquivos enviados (ex: imagens de perfil)  
└── README.md             # Documentação do projeto  
```

## 🛠️ Configuração
Clone este repositório:
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio

## Instale as dependências:
pip install flask flask-socketio eventlet

## Inicie o servidor:
python app.py

## Acesse o chat pelo navegador, utilizando o endereço IP local da máquina onde o servidor está rodando:
http://<seu-ip-local>:8000
