document.addEventListener("DOMContentLoaded", () => {
    // all html element
    const inputField = document.getElementById("todo-input")
    const addButton = document.getElementById("add-todo")
    const todoListBox = document.getElementById("todo-list")

    // todo array
    let todoListArray = JSON.parse(localStorage.getItem("task")) || [];
    // Function to refresh the task display
    function refreshDisplay() {
        todoListBox.innerHTML = ""; // Clear the current list
        todoListArray.forEach(task => {
            displayTask(task);
        });
    }

    // Load tasks on page load
    refreshDisplay();

    addButton.addEventListener('click', function () {
        const todoText = inputField.value.trim();
        if (todoText === "") return;
        const newTask = {
            id: Date.now(),
            text: todoText,
            completed: false
        }
        todoListArray.push(newTask)
        saveTask();
        refreshDisplay();
        todoInput.value = ""
    }
    )

    function saveTask() {
        localStorage.setItem("task", JSON.stringify(todoListArray))
    }

    function displayTask(task) {
        // Create a new list item    
        const li = document.createElement('li');
        li.setAttribute("id", task.id)

        // create a div element to hold the todo text
        const todoTextNode = document.createElement('div');
        todoTextNode.textContent = task.text.replace(/\b\w/g, char => char.toUpperCase());
        todoTextNode.style.fontWeight = 'bold';
        todoTextNode.style.fontSize = '20px';

        // Create a checkbox element
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        checkbox.style.width = '20px';
        checkbox.style.height = '20px';
        checkbox.style.borderRadius = '5px';
        li.appendChild(checkbox);
        li.appendChild(todoTextNode);

        // Create a div element to hold the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';

        // Create a delete button
        const deleteText = document.createElement('span');
        deleteText.textContent = 'Delete';
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash-alt';
        deleteText.appendChild(deleteIcon);

        deleteText.addEventListener("click", function () {
            if (deleteText.textContent === "Cancel") {
                // If the button says "Cancel", restore the original text
                li.replaceChild(todoTextNode, inputField);
                editText.textContent = "Edit";
                editIcon.className = "fas fa-edit";
                editText.appendChild(editIcon);
                editText.id = "edit";
                deleteText.textContent = "Delete";
                deleteIcon.className = "fas fa-trash-alt";
                deleteText.appendChild(deleteIcon);
                refreshDisplay();
            } else {
                // If the button says "Delete", proceed with deleting the task
                todoListArray = todoListArray.filter(t => t.id !== task.id);
                saveTask();
                refreshDisplay();
            }
        });

        // Create an edit button
        const editIcon = document.createElement('i');
        const editText = document.createElement('span');
        editText.textContent = 'Edit';
        editIcon.className = 'fas fa-edit'; // Set edit icon class
        editText.appendChild(editIcon); // Append edit icon to edit text
        editText.addEventListener("click", function () {
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = task.text;
            inputField.style.flexGrow = '1';
            inputField.style.padding = '5px';
            inputField.style.marginRight = '10px';
            inputField.style.backgroundColor = 'transparent';
            inputField.style.border = 'none';
            inputField.style.height = '100%';
            inputField.style.fontWeight = 'bold';

            li.replaceChild(inputField, todoTextNode);

            // Change "Edit" to "Save"
            editText.textContent = 'Save';
            editIcon.className = "fa-solid fa-pen-fancy";
            editText.id = 'update';
            editText.appendChild(editIcon);

            // Change "Delete" to "Cancel"
            deleteText.textContent = 'Cancel';
            deleteIcon.className = "fa-regular fa-rectangle-xmark";
            deleteText.appendChild(deleteIcon);

            // New "Cancel" behavior
            deleteText.onclick = function () {
                // Restore the original text
                li.replaceChild(todoTextNode, inputField);
                editText.textContent = 'Edit';
                editIcon.className = "fas fa-edit";
                editText.appendChild(editIcon);
                editText.id = 'edit';

                deleteText.textContent = 'Delete';
                deleteIcon.className = "fas fa-trash-alt";
                deleteText.appendChild(deleteIcon);

                // Reset delete button's original behavior
                deleteText.onclick = function () {
                    todoListArray = todoListArray.filter(t => t.id !== task.id);
                    saveTask();
                    refreshDisplay();
                };
                refreshDisplay();
            };

            // Save the updated task
            editText.onclick = function () {
                const updatedText = inputField.value.trim();
                if (updatedText) {
                    task.text = updatedText;
                    saveTask();

                    todoTextNode.textContent = updatedText.replace(/\b\w/g, char => char.toUpperCase());
                    li.replaceChild(todoTextNode, inputField);

                    // Restore buttons
                    editText.textContent = 'Edit';
                    editIcon.className = 'fas fa-edit';
                    editText.appendChild(editIcon);
                    editText.id = 'edit';

                    deleteText.textContent = 'Delete';
                    deleteIcon.className = 'fas fa-trash-alt';
                    deleteText.appendChild(deleteIcon);

                    // Reset delete button's original behavior
                    deleteText.onclick = function () {
                        todoListArray = todoListArray.filter(t => t.id !== task.id);
                        saveTask();
                        refreshDisplay();
                    };
                }
            };
        });
        buttonContainer.appendChild(editText); // Append edit text to button container
        buttonContainer.appendChild(deleteText); // Append delete text to button container
        li.appendChild(buttonContainer); // Append button container to the list item
        todoListBox.appendChild(li);

        // click on li to toggle completed class
        todoTextNode.addEventListener('click', function () {
            todoTextNode.classList.toggle('completed');
            checkbox.checked = !checkbox.checked;
            task.completed = checkbox.checked; 
            saveTask();

        });

        // Set the checkbox state based on the task's `completed` property
        checkbox.checked = task.completed;
        if (task.completed) {
            todoTextNode.classList.add('completed'); // Apply completed styling
            saveTask()
        }
        checkbox.addEventListener('change', function () {
            task.completed = checkbox.checked; 
            todoTextNode.classList.toggle('completed', checkbox.checked);
            saveTask();

        });

        // Apply completed styling
        const style = document.createElement('style');
        style.textContent = `
                .completed {
                    text-decoration: line-through;
                    color: gray;
                }
            `;
        document.head.appendChild(style);
    }
});

