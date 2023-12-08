/*
const categories = document.querySelectorAll('.category');
const categoryContainer = document.querySelector('.category_container');
var originalCategoryOrder = [];
for (let category of categories) {
    originalCategoryOrder.push(category.id);
}
categories.forEach(category => {
    category.addEventListener('dragstart', () => {
        for (let container of [...document.querySelectorAll('.subcategory_container')]) { container.style.visibility = 'collapse'; }
        category.classList.add('category_dragging');
    });
    category.addEventListener('dragend', () => {
        for (let container of [...document.querySelectorAll('.subcategory_container')]) { container.style.visibility = 'visible'; }
        category.classList.remove('category_dragging');
        if (checkCategoryPositions()) {
            // TODO - 
            doDatabaseStuff(true);
        }
    });
});

categoryContainer.addEventListener('dragover', e => {
    for (let categoryID of originalCategoryOrder) {
        if (e.target.id === categoryID) {
            e.preventDefault();
            const afterElement = getCategoryAfterElement(e.clientY);
            const categoryDragging = document.querySelector('.category_dragging');
            if (afterElement === null) {
                categoryContainer.appendChild(categoryDragging);
                console.log(`draggable = null: ${categoryDragging}`)
            } else {
                categoryContainer.insertBefore(categoryDragging, afterElement);
            }
        }
    }
});

function getCategoryAfterElement(y) {
    const categoriesNotDragging = [...categoryContainer.querySelectorAll('.category:not(.category_dragging)')];
    return categoriesNotDragging.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
*/

const subcategories = document.querySelectorAll('.subcategory');
const subcategoryContainers = document.querySelectorAll('.subcategory_container');
const categoryData = [];


function setContainerHeights() {
    const childHeightVH = 5;
    for (let container of [...document.querySelectorAll('.container')]) {
        var totalChildren = (container.childNodes.length - 1) / 2;
        container.style.height = `${childHeightVH * totalChildren}vh`;
    }
}
setContainerHeights();

var originalSubcategoryOrder = [];
for (let subcategory of subcategories) {
    originalSubcategoryOrder.push(subcategory.id);
}
subcategories.forEach(subcategory => {
    subcategory.addEventListener('dragstart', () => {
        subcategory.classList.add('subcategory_dragging');
    });
    subcategory.addEventListener('dragend', () => {
        subcategory.classList.remove('subcategory_dragging');
        if (checkSubcategoryPositions()) {
            // TODO - 
            doDatabaseStuff(false);
        }
    });
});
for (let container of subcategoryContainers) {
    container.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getSubcategoryAfterElement(container, e.clientY);
        const subcategoryDragging = document.querySelector('.subcategory_dragging');
        if (afterElement === null) {
            container.appendChild(subcategoryDragging);
            console.log(`draggable = null: ${subcategoryDragging}`)
        } else {
            container.insertBefore(subcategoryDragging, afterElement);
        }
    });
}
function getSubcategoryAfterElement(container, y) {
    const subcategoriesNotDragging = [...container.querySelectorAll('.subcategory:not(.subcategory_dragging)')];
    return subcategoriesNotDragging.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function checkCategoryPositions() {
    var somethingHasChanged = false;
    const categories = [...document.querySelectorAll('.category')]
    const newOrder = [];
    for (let category of categories) {
        newOrder.push(category.id);
    }
    for (let i = 0; i < categories.length; i++) {
        if (originalCategoryOrder[i] !== newOrder[i]) {
            somethingHasChanged = true;
            break;
        }
    }
    originalCategoryOrder = [...newOrder];
    return somethingHasChanged;
}
function checkSubcategoryPositions() {
    var somethingHasChanged = false;
    const subcategories = [...document.querySelectorAll('.subcategory')]
    const newOrder = [];
    for (let subcategory of subcategories) {
        newOrder.push(subcategory.id);
    }
    for (let i = 0; i < subcategories.length; i++) {
        if (originalSubcategoryOrder[i] !== newOrder[i]) {
            somethingHasChanged = true;
            break;
        }
    }
    originalSubcategoryOrder = [...newOrder];
    return somethingHasChanged;
}

function doDatabaseStuff(bool) {
    if (bool) {
        console.log('CATEGORY database changed')
    } else {
        console.log('SUBCAT database changed')
    }

}



function displaySubcategories(boolean) {
    return new Promise((resolve, reject) => {
        for (let container of subcategoryContainers) {
            if (boolean) {
                container.style.height = 'fit-content';
            } else {
                container.style.height = '0px';
            }
        }
        return resolve();
    })
}



function generateCategoryViews(categories, subcategories) {

}
function generateSubcategoryViews(categoryID, subcategories) {

}