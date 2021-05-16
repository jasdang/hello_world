interface Validatable {
  value: string | number
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

function validate(input: Validatable) {
  let isValid = true

  if (input.required) {
    isValid = isValid && input.value.toString().trim().length !== 0
  }

  if (input.minLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length >= input.minLength
  }
  if (input.maxLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length <= input.maxLength
  }
  if (input.min != null && typeof input.value === 'number') {
    isValid = isValid && input.value >= input.min
  }
  if (input.max != null && typeof input.value === 'number') {
    isValid = isValid && input.value <= input.max
  }
  return isValid
}

class ProjectInput {
  templateElement: HTMLTemplateElement
  hostElement: HTMLDivElement
  element: HTMLFormElement
  titleInputElement: HTMLFormElement
  descriptionInputElement: HTMLFormElement
  peopleInputElement: HTMLFormElement

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement
    this.hostElement = document.getElementById('app')! as HTMLDivElement

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    )
    this.element = importedNode.firstElementChild as HTMLFormElement
    this.element.id = 'user-input'

    this.titleInputElement = this.element.querySelector('#title') as HTMLFormElement
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLFormElement
    this.peopleInputElement = this.element.querySelector('#people') as HTMLFormElement
    
    this.configure()
    this.attach()
  }

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value
    const description = this.descriptionInputElement.value
    const people = this.peopleInputElement.value

    const titleValidatable: Validatable = {
      value: title,
      required: true
    }
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 0
    }
    const peopleValidatable: Validatable = {
      value: +people,
      required: true,
      min: 0,
      max: 5
    }
    
    if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
      alert('Invalid input, please try again!')
    } else {
      return [title, description, people]
    }
  }

  private clearInput() {
    this.titleInputElement.value = ''
    this.descriptionInputElement.value = ''
    this.peopleInputElement.value = ''
  }

  private submitHandler(event: Event) {
    event.preventDefault()
    const userInput = this.gatherUserInput()
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput
      console.log(title, desc, people)
    }
    this.clearInput()
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler.bind(this))
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
  }
}

const prjInput = new ProjectInput()