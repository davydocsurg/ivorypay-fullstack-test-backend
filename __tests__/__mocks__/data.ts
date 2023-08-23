import { faker } from "@faker-js/faker";

const generateRandomUserData = () => {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: "Password1",
    };
};

export { generateRandomUserData };
