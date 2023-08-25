import { faker } from "@faker-js/faker";

const userData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: "Password1",
};

const anotherUserData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: "Password1",
};

export { userData, anotherUserData };
