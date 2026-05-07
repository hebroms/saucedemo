import { GenericData } from '../interfaces/generic.interface';

class FormDataFactory {
  /**
   * Generates test data for the specific form fields discovered.
   * @returns {GenericData} The generated form data.
   */
  static form(): GenericData {
    return {
      firstName: "João QA Silva",
      lastName: "João QA Silva",
      postalCode: "01310-100",
      continue: "Texto de teste QA",
    };
  }
}

export { FormDataFactory };