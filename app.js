// Configure o Firebase com suas credenciais
const firebaseConfig = {
    apiKey: "AIzaSyC4oJOImT6hnVGLq-DK1JIr_wdwV2d2EQ0",
    authDomain: "bolodavovofran.firebaseapp.com",
    databaseURL: "https://bolodavovofran-default-rtdb.firebaseio.com/",
    projectId: "bolodavovofran",
    storageBucket: "gs://bolodavovofran.appspot.com",
    messagingSenderId: "593490759991",
    appId: "1:593490759991:web:0d7543dccc5b9e77a4cab2"
  };


   firebase.initializeApp(firebaseConfig); // Inicialize o Firebase
   const database = firebase.database(); // Inicialize o banco de dados
   const storage = firebase.storage(); // Inicialize o storag

   /////////////////////////////////////////////////////////////////////

// Função para enviar dados para o Firebase
function enviarDadosParaFirebase() {
    const nomeAluno = document.getElementById('nome').value;
    const turma = document.getElementById('turma').value;
    const curso = document.getElementById('curso').value;
    const imagem = document.getElementById('imagem').files[0]; // Obtém o arquivo de imagem

    if (imagem) {
        const storageRef = storage.ref('imagens/' + imagem.name);
        storageRef.put(imagem).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                const dados = {
                    nomeAluno: nomeAluno,
                    turma: turma,
                    curso: curso,
                    imagemURL: downloadURL // Salva a URL da imagem
                };

                database.ref('alunos').push(dados)
                    .then(() => {
                        alert('Dados enviados com sucesso!');
                        document.getElementById('nome').value = '';
                        document.getElementById('turma').value = '';
                        document.getElementById('curso').value = '';
                        document.getElementById('imagem').value = '';
                    })
                    .catch(error => {
                        console.error('Erro ao enviar os dados: ', error);
                    });
            });
        }).catch(error => {
            console.error('Erro ao fazer upload da imagem: ', error);
        });
    } else {
        alert('Por favor, selecione uma imagem.');
    }
}

// Função para consultar dados dos alunos
function consultarAlunoPorNome() {
    const nomeBusca = document.getElementById('nomeConsulta').value.trim().toLowerCase(); // Convertendo para minúsculas para busca case insensitive
    const alunosRef = database.ref('alunos');
    alunosRef.once('value', snapshot => {
        const lista = document.getElementById('listaAlunos');
        lista.innerHTML = ''; // Limpar lista anterior
        let encontrado = false;

        snapshot.forEach(childSnapshot => {
            const aluno = childSnapshot.val();
            // Verifica se o nome do aluno inclui o texto buscado
            if (aluno.nomeAluno.toLowerCase().includes(nomeBusca)) {
                encontrado = true;
                const item = document.createElement('li');
                item.innerHTML = `Nome: ${aluno.nomeAluno}, Turma: ${aluno.turma}, Curso: ${aluno.curso}, Imagem: <img src="${aluno.imagemURL}" alt="Imagem do Aluno" style="width:100px; height:auto;">`;
                lista.appendChild(item);
            }
        });

        if (!encontrado) {
            lista.innerHTML = '<li>Nenhum aluno encontrado com esse nome.</li>';
        }
    }).catch(error => {
        console.error('Erro ao buscar alunos: ', error);
    });
}
