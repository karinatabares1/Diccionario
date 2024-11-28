import { dictionary } from "./dictionary.js";


const word = document.getElementById('search-word')
const buttonWord = document.getElementById('translate-button')
const resultWord = document.getElementById('word')
const resultExample = document.getElementById('example')
const languageOptions = document.querySelectorAll('input[name="language"]')
const dictionarySection = document.getElementById('section-dictionary')


const getWord = () =>{
    // console.log(word.value)
    // console.log(dictionary)

    const searchWord = word.value.toLowerCase()
    let foundWord = null //aqui se almacenará la variable

    // determina el idioma seleccionado
    let selectedLanguage = 'en-es'
    languageOptions.forEach(option => {
        if (option.checked) {
            selectedLanguage = option.value
        }
    })

    // Busca la palabra en todas las categorias del diccioonario
    for (const category in dictionary.categories){ // se utiliza el for...in para obtener sus nombres
        const wordsArray = dictionary.categories[category] // Array de palabras en la categoria actual
        
        // se usa .find para buscar la palabra en el array y asi compararla en ambos lenguajes
        foundWord = wordsArray.find(item =>{
            if (selectedLanguage === 'en-es') {
                return item.english.toLowerCase() === searchWord
            }else if (selectedLanguage === 'es-en') {
                return item.spanish.toLowerCase () === searchWord
            }
        })

        if (foundWord) break
    
    }

    // muestra el resultado de búsqueda
    if (foundWord) {
        resultWord.textContent = ` ${foundWord.english} ➡ ${foundWord.spanish}`
        resultExample.textContent= `Ejemplo:  ${foundWord.example}`
        
    } else {
        resultWord.textContent = 'Palabra no encontrada en el diccionario'
        resultExample.textContent = 'Ejemplo no encontrado'
    }
}

// mostrar el diccionario 
const displayDictionary = (language, sortedWords = null) => {
    // Limpia la sección del diccionario 
    dictionarySection.innerHTML = '';

    // Determina las palabras a mostrar (ordenadas o no)
    let wordsToDisplay;
    if (sortedWords) {
        wordsToDisplay = sortedWords;
    } else {
        wordsToDisplay = Object.values(dictionary.categories).flat();
    }

    // Recorre las palabras a mostrar
    wordsToDisplay.forEach(item => {
        // Crea elementos para mostrar las palabras
        const container = document.createElement('div');
        // agregar una nueva clase en elemento en javaScript
        container.classList.add('card-dictionary');

        const wordOriginal = document.createElement('h3');
        const wordTranslation = document.createElement('h2');
        const example = document.createElement('p');

        // Ajusta el contenido según el idioma seleccionado
        if (language === 'es-en') {
            wordOriginal.textContent = `${item.spanish} `;
            wordTranslation.textContent = `${item.english}`;
            example.textContent = `Ejemplo: ${item.example}`;
        } else if (language === 'en-es') {
            wordOriginal.textContent = `${item.english} `;
            wordTranslation.textContent = `${item.spanish}`;
            example.textContent = `Example: ${item.example}`;
        }

        // Agrega los elementos al contenedor
        container.appendChild(wordOriginal);
        container.appendChild(wordTranslation);
        container.appendChild(example);

        // Añade el contenedor a la sección del diccionario
        dictionarySection.appendChild(container);
    });
};


// Listener para el botón de traducir
buttonWord.addEventListener('click', getWord)

// Listener para cambiar el idioma y actualizar el diccionario
languageOptions.forEach(option => {
    option.addEventListener('change', (event)=>{
        const selectedLanguage = event.target.value
        displayDictionary(selectedLanguage)
    })
})

// Muestra el diccionario al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value
    displayDictionary(selectedLanguage)
})

// funcion para ordenar el diccionario
const sortDictionary = (language) => {
    const sortedWords = [];

    // itera por cada categoria en el diccionario
    for (const category in dictionary.categories){
        const wordsArray = dictionary.categories[category];


        // ordena las palabras basandose en el idioma selecccionado
        const sortedCategory = wordsArray.slice().sort((a,b)=>{
            if (language === "en-es") {
                return a.english.localeCompare(b.english);
            } else {
                return a.spanish.localeCompare(b.spanish);
            }
        });

        // agrega las palabras agregadas a la lista final
        sortedWords.push(...sortedCategory);
    }
    return sortedWords;
};

// listener para el boton ordenacion
const sortButton = document.getElementById('sort-button');
sortButton.addEventListener('click',() => {
    const selectedLanguage = document.querySelector('input[name = "language"]:checked').value;

    const sortedWords = sortDictionary(selectedLanguage);
    //actuaiza la vision con las palabras ordenadas
    displayDictionary(selectedLanguage, sortedWords);

});

// Selecciona el elemento del selector de categorías
const categorySelect = document.getElementById('category');

// Escucha el evento 'change' en el selector
categorySelect.addEventListener('change', (event) => {
    const selectedCategory = event.target.value;

    if (selectedCategory === 'all-Categories') {
        // Muestra todas las palabras si se selecciona "Todas las Categorías"
        const allWords = Object.values(dictionary.categories).flat(); //.flat() permite combinar todas las palabras de diferentes categorias en un solo arreglo.  Facilitando el trabajo con ellas
        displayDictionary('es-en', allWords); // Cambia 'es-en' según el idioma actual
    } else {
        // Filtra las palabras según la categoría seleccionada
        const filteredWords = dictionary.categories[selectedCategory];
        displayDictionary('es-en', filteredWords); // Cambia 'es-en' según el idioma actual
    }
});

// Función para generar un ID único para cada nueva palabra
function generateID(category) {
    const categoryArray = dictionary[category]; // Obtiene el arreglo de palabras de la categoría seleccionada.
  
    // Si la categoría tiene palabras, genera un ID basado en el último elemento
    if (categoryArray && categoryArray.length > 0) {
      return categoryArray[categoryArray.length - 1].id + 1;
    } else {
      // Si no hay palabras, el ID inicial es 1
      return 1;
    }
  }
  
  // Función para agregar una nueva palabra al diccionario y mostrarla en la lista
  function addWord() {
    // Obtiene los valores ingresados por el usuario en el formulario
    const wordEnglish = document.getElementById('new-english-word').value; // Palabra en inglés
    const translation = document.getElementById('new-spanish-word').value; // Traducción al español
    const example = document.getElementById('new-example').value; // Ejemplo de uso
    const category = document.getElementById('new-category').value; // Categoría seleccionada
  
    // Validación básica: Asegura que todos los campos tengan valores
    if (wordEnglish === '' || translation === '' || example === '' || category === '') {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    // Crea un objeto con los datos de la nueva palabra
    const newWord = {
      id: generateID(category),
      word: wordEnglish,
      translation: translation,
      example: example,
    };
  
    // Verifica si la categoría seleccionada ya existe en el diccionario
    if (dictionary[category]) {
      dictionary[category].push(newWord); // Añade la palabra si la categoría existe
    } else {
      dictionary[category] = [newWord]; // Crea la categoría si no existe
    }
  
    // Agrega la palabra al elemento <ul>
    const wordList = document.getElementById('word-list');
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <strong>ID:</strong> ${newWord.id} - 
      <strong>Palabra:</strong> ${newWord.word} - 
      <strong>Traducción:</strong> ${newWord.translation} - 
      <strong>Ejemplo:</strong> "${newWord.example}" - 
      <strong>Categoría:</strong> ${category}`;
    wordList.appendChild(listItem);
  
    // Muestra un mensaje de éxito al usuario
    alert('Palabra agregada correctamente.');
  
    // Limpia los campos del formulario
    document.getElementById('new-english-word').value = '';
    document.getElementById('new-spanish-word').value = '';
    document.getElementById('new-example').value = '';
    document.getElementById('new-category').value = '';
  }
  
  // Asigna el evento "click" al botón de agregar palabra
  document.getElementById('add-word-button').addEventListener('click', addWord);