import { EntityId } from "../../common/value-objects/EntityId.js";
import { IsoDate } from "../../common/value-objects/IsoDate.js";
import { UserFullName } from "../value-objects/UserFullName.js";
import { UserEmail } from "../value-objects/UserEmail.js";

export class User {
    private constructor(
        public readonly id: EntityId,
        public readonly fullName: UserFullName,
        public readonly email: UserEmail,
        public readonly createdAt: IsoDate
    ) { }

    static create(params: {
        id: EntityId;
        fullName: UserFullName;
        email: UserEmail;
        createdAt: IsoDate;
    }): User {
        return new User(
            params.id,
            params.fullName,
            params.email,
            params.createdAt
        );
    }

    updateName(newName: UserFullName): User {
        return new User(
            this.id,
            newName,
            this.email,
            this.createdAt
        );
    }

    updateEmail(newEmail: UserEmail): User {
        return new User(
            this.id,
            this.fullName,
            newEmail,
            this.createdAt
        );
    }
}