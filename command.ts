export class Command {
  #raw: string;

  constructor(command: string) {
    this.#raw = command;
  }

  get raw() {
    return this.#raw;
  }

  get parts() {
    return this.#raw.split(" ");
  }
}
