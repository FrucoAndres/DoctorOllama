// Función para enviar el post al modelo de Ollama usando AJAX
function sendMessage() {
    // Capturar el valor del input
    var userInput = document.getElementById("user-input").value;

    // Verificar si el usuario ha ingresado algún texto
    if (userInput.trim() === "") {
        alert("Por favor, ingresa un mensaje antes de enviar.");
        return;
    }

    // Agregar el mensaje del usuario al chat
    var chatMessages = document.getElementById('chat-messages');

    // Agregar el mensaje del usuario al div de mensajes
    var userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.textContent = userInput;
    chatMessages.appendChild(userMessage);
    // Desplazar la barra de desplazamiento hacia abajo
    scrollChatToBottom();

    // Limpiar el campo de entrada
    document.getElementById('user-input').value = '';

    // Llamar a la función para enviar el mensaje usando AJAX
    enviarPost(userInput);
}

function enviarPost(inputText) {
    // Construir el objeto de datos para el post
    const postData = {
        model: "TheBloke/CodeLlama-7B-Instruct-GGUF/codellama-7b-instruct.Q4_K_S.gguf",
        messages: [
            { role: "system", content: "Eres el doctor Ollama, un especialista en todos los campos de la medicina, tu deber es remplazar a un médico resetando medicamentos, dando posibles diagnosticos y respondiendo preguntas. Responde siempre en español" },
            { role: "user", content: inputText }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false
    };

    // Convertir el objeto de datos a formato JSON
    const jsonData = JSON.stringify(postData);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:1234/v1/chat/completions', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
        if (xhr.status === 200) {
            // Manejar la respuesta del servidor
            const response = JSON.parse(xhr.responseText);

            // Verificar si response.choices[0] y response.choices[0].message existen
            if (response.choices && response.choices[0] && response.choices[0].message) {
                const respuesta = response.choices[0].message.content.trim();
                console.log("Respuesta del servidor:", respuesta);


                // Agregar el mensaje del doctor al chat
                var chatMessages = document.getElementById('chat-messages');

                // Agregar el mensaje del doctor al div de mensajes
                var doctorMessage = document.createElement('div');
                doctorMessage.className = 'message doctor-message';
                doctorMessage.textContent = respuesta;
                chatMessages.appendChild(doctorMessage);
                // Desplazar la barra de desplazamiento hacia abajo
                scrollChatToBottom();
            } else {
                console.error("No se encontró texto en la respuesta.");
            }
        } else {
            console.error("Error al enviar el post:", xhr.statusText);
        }
    };




    // Enviar los datos JSON
    xhr.send(jsonData);
}

function scrollChatToBottom() {
    var chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
