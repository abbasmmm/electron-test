// Define the CSS for the highlight class and popup
const style = document.createElement('style');
style.innerHTML = `
  .highlight-hover {
    outline: 1px solid yellow;
  }
  .context-popup {
    position: absolute;
    background-color: white;
    border: 1px solid black;
    padding: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    display: none; /* Hidden by default */
    z-index: 1000;
  }
  .context-popup li{
      cursor: pointer;
  }
`;
document.head.appendChild(style);

// Create the popup element
const popup = document.createElement('div');
popup.className = 'context-popup';
popup.innerHTML = `<div class='popup-selector'>
    <strong class='popup-selector'>Element Locators:</strong>
    <ul class='popup-selector'>
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(locator => `<li class='popup-selector' style="display:none">${locator}</li>`).join('')}
    </ul>
  </div>`

const selectors = popup.getElementsByTagName('li')
for (let i = 0; i < selectors.length; i++) {
    selectors[i].addEventListener('click', async () => {
        let selector = selectors[i].innerText;

        const elementData = {
            selector: selector
        };

        const response = await window.fetch('http://localhost:12215/element-clicked', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(elementData)
        });

        console.log(response);
    });
}

document.body.appendChild(popup);

// Function to get unique locators for an element
const getUniqueLocators = (element) => {
    const locators = [];

    // Extract id, class, and data attributes as locators
    if (element.id) {
        locators.push(`#${element.id}`);
    }

    if (element.className) {
        locators.push(`.${element.className.split(' ').join('.')}`);
    }

    Array.from(element.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
            locators.push(`[${attr.name}="${attr.value}"]`);
        }
    });

    // Extract XPath
    const xpath = getXPath(element);
    if (xpath) {
        locators.push(`XPath: ${xpath}`);
    }

    return locators;
};

// Function to get XPath of an element
const getXPath = (element) => {
    if (element.id) {
        return `//*[@id="${element.id}"]`;
    }

    let path = '';
    while (element.nodeType === Node.ELEMENT_NODE) {
        let name = element.nodeName.toLowerCase();
        if (element.id) {
            name += `[@id="${element.id}"]`;
            path = `/${name}${path}`;
            break;
        } else {
            let sibling = element;
            let index = 1;
            while (sibling.previousElementSibling) {
                sibling = sibling.previousElementSibling;
                index++;
            }
            path = `/${name}[${index}]${path}`;
            element = element.parentNode;
        }
    }

    return path ? path : null;
};

let currentElement = null;
const showPopup = (element, x, y) => {
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.display = 'block';
    currentElement = element;

    // Extract unique locators for the current element
    const locators = getUniqueLocators(element);
    const selectors = popup.getElementsByTagName('li');

    // Loop through the selectors and update their text
    for (let i = 0; i < selectors.length; i++) {
        if (i < locators.length) {
            selectors[i].textContent = locators[i];
            selectors[i].style.display = 'list-item'; // Make sure the item is visible
        } else {
            selectors[i].style.display = 'none'; // Hide any extra items
        }
    }

    // If there are fewer locators than <li> elements, the extra <li> elements will be hidden.
    // Ensure the popup only displays as many <li> elements as there are locators.
};

const hidePopup = () => {
    popup.style.display = 'none';
    currentElement = null;
};

const addHighlightHandlers = (element) => {
    if (element.classList.contains('popup-selectors')) {
        return; // Skip elements with the 'popup-selectors' class
    }

    element.addEventListener('mouseover', (event) => {
        event.stopPropagation();

        // Remove the highlight class from all other elements
        document.querySelectorAll('.highlight-hover').forEach(el => {
            if (el !== element) {
                el.classList.remove('highlight-hover');
            }
        });

        // Add the highlight class to the currently hovered element
        element.classList.add('highlight-hover');

        // Display the popup near the element
        const rect = element.getBoundingClientRect();
        showPopup(element, rect.left, rect.bottom - 5);
    });

    element.addEventListener('mouseout', (event) => {
        event.stopPropagation();
        if (!popup.contains(event.relatedTarget) && !element.contains(event.relatedTarget)) {
            console.log('removing the popup', event.relatedTarget, popup, element)
            element.classList.remove('highlight-hover');
            hidePopup();
        }
    });
};

// Select all elements on the page
const elements = document.querySelectorAll('*:not(.context-popup):not(.popup-selector)');
elements.forEach(element => {
    addHighlightHandlers(element);
});

// Hide the popup if the mouse leaves the popup itself
popup.addEventListener('mouseleave', () => {
    // Do not hide the popup when the mouse is inside the popup
});

popup.addEventListener('mouseover', (event) => {
    event.stopPropagation();
    // Prevent hiding popup when the mouse is over the popup
    if (currentElement) {
        currentElement.classList.add('highlight-hover');
        showPopup(currentElement, popup.offsetLeft, popup.offsetTop); // Adjust position if needed
    }
});

// Create a MutationObserver to watch for new elements being added
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && !node.matches('.popup-selectors')) {
                addHighlightHandlers(node);
                node.querySelectorAll('*:not(.popup-selectors)').forEach(child => {
                    addHighlightHandlers(child);
                });
            }
        });
    });
});

// Start observing the document for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});