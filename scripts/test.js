

const subcategories = document.querySelectorAll('.subcategory');
const subcategoryContainers = document.querySelectorAll('.subcategory_container');


var originalOrder = [];
for (let draggable of [...container.querySelectorAll('.draggable')]) {
    originalOrder.push(draggable.id);
}


draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
        draggable.classList.add('dragging');
    });
    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('dragging');
        if (checkDraggablePositions(container)) {
            

            doDatabaseStuff();
        }
    });
});

container.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement === null) {
        container.appendChild(draggable);
        console.log(`draggable = null: ${draggable}`)
    } else {
        container.insertBefore(draggable, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function checkDraggablePositions(container) {
    var somethingHasChanged = false;
    const draggables = [...container.querySelectorAll('.draggable')]
    const newOrder = [];
    for (let draggable of draggables) {
        newOrder.push(draggable.id);
    }
    for (let i = 0; i < draggables.length; i++) {
        if (originalOrder[i] !== newOrder[i]) {
            somethingHasChanged = true;
            break;
        }
    }
    originalOrder = [...newOrder];
    return somethingHasChanged;
}

function doDatabaseStuff() {
    console.log('Database stuff complete')
}