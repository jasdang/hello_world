"use strict";
function validate(input) {
    let isValid = true;
    if (input.required) {
        isValid = isValid && input.value.toString().trim().length !== 0;
    }
    if (input.minLength != null && typeof input.value === 'string') {
        isValid = isValid && input.value.length >= input.minLength;
    }
    if (input.maxLength != null && typeof input.value === 'string') {
        isValid = isValid && input.value.length <= input.maxLength;
    }
    if (input.min != null && typeof input.value === 'number') {
        isValid = isValid && input.value >= input.min;
    }
    if (input.max != null && typeof input.value === 'number') {
        isValid = isValid && input.value <= input.max;
    }
    return isValid;
}
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
class ProjectState {
    constructor(projects) {
        this.projects = projects;
        this.listeners = [];
    }
    static getInstance() {
        if (ProjectState.instance) {
            return this.instance;
        }
        else {
            this.instance = new ProjectState([]);
            return this.instance;
        }
    }
    addProject(title, description, people) {
        const id = ProjectState.getInstance().projects.length + 1;
        const project = new Project(id.toString(), title, description, people, ProjectStatus.Active);
        this.projects.push(project);
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
}
const projectState = ProjectState.getInstance();
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = 'user-input';
        this.titleInputElement = this.element.querySelector('#title');
        this.descriptionInputElement = this.element.querySelector('#description');
        this.peopleInputElement = this.element.querySelector('#people');
        this.configure();
        this.attach();
    }
    gatherUserInput() {
        const title = this.titleInputElement.value;
        const description = this.descriptionInputElement.value;
        const people = this.peopleInputElement.value;
        const titleValidatable = {
            value: title,
            required: true
        };
        const descriptionValidatable = {
            value: description,
            required: true,
            minLength: 0
        };
        const peopleValidatable = {
            value: +people,
            required: true,
            min: 0,
            max: 5
        };
        if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
            alert('Invalid input, please try again!');
        }
        else {
            return [title, description, people];
        }
    }
    clearInput() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
        }
        this.clearInput();
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this));
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
class ProjectList {
    constructor(input) {
        this.input = input;
        this.assignedProjects = [];
        this.templateElement = document.getElementById('project-list');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${input}-projects`;
        projectState.addListener((projects) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });
        this.renderContents();
        this.attach();
    }
    renderProjects() {
        const listEl = document.getElementById(`${this.input}-projects-list`);
        listEl.innerHTML = '';
        for (const assignedProject of this.assignedProjects) {
            const newEl = document.createElement('li');
            newEl.textContent = assignedProject.title;
            listEl === null || listEl === void 0 ? void 0 : listEl.appendChild(newEl);
            console.log(assignedProject);
        }
    }
    renderContents() {
        const listId = `${this.input}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = `${this.input.toUpperCase()} PROJECTS`;
    }
    attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}
const prjInput = new ProjectInput();
const activeProjects = new ProjectList('active');
const finishedProjects = new ProjectList('finished');
projectState.addProject('one', 'description', 3);
//# sourceMappingURL=app.js.map