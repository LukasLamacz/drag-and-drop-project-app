// Validation
export interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export function Validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid =
            validatableInput.value.toString().trim().length !== 0
                ? true
                : false;
    }

    if (
        validatableInput.minLength != null &&
        typeof validatableInput.value === "string"
    ) {
        isValid =
            validatableInput.value.length > validatableInput.minLength
                ? true
                : false;
    }

    if (
        validatableInput.maxLength != null &&
        typeof validatableInput.value === "string"
    ) {
        isValid =
            validatableInput.value.length < validatableInput.maxLength
                ? true
                : false;
    }

    if (
        validatableInput.min != null &&
        typeof validatableInput.value === "number"
    ) {
        isValid = validatableInput.value >= validatableInput.min ? true : false;
    }

    if (
        validatableInput.max != null &&
        typeof validatableInput.value === "number"
    ) {
        isValid = validatableInput.value <= validatableInput.max ? true : false;
    }
    return isValid;
}
